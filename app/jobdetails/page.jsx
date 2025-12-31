'use client'
import React, { useState, useEffect } from 'react'
import { MapPin, Briefcase, Clock, DollarSign, Users, Heart, Share2, Facebook, Twitter, Linkedin, Building2, Code, Palette } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'

export default function JobDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('id')
  
  const [isSaved, setIsSaved] = useState(false)
  const [jobData, setJobData] = useState(null)
  const [relatedJobs, setRelatedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch job details from Firebase
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        router.push('/jobs')
        return
      }

      try {
        setLoading(true)
        
        // Fetch main job
        const jobDoc = await getDoc(doc(db, 'jobs', jobId))
        
        if (jobDoc.exists()) {
          const job = { id: jobDoc.id, ...jobDoc.data() }
          setJobData(job)

          // Fetch related jobs (same location or tags)
          const relatedQuery = query(
            collection(db, 'jobs'),
            where('location', '==', job.location),
            limit(4)
          )
          const relatedSnap = await getDocs(relatedQuery)
          const related = relatedSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(j => j.id !== jobId) // Exclude current job
            .slice(0, 3) // Limit to 3
          
          setRelatedJobs(related)
        } else {
          alert('Job not found!')
          router.push('/jobs')
        }
      } catch (error) {
        console.error('Error fetching job:', error)
        alert('Error loading job details')
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId, router])

  const handleApply = () => {
    router.push(`/apply?jobId=${jobId}`)
  }

  // Calculate time ago
  const getTimeAgo = (postedAt) => {
    if (!postedAt) return 'Recently'
    const now = new Date()
    const posted = new Date(postedAt)
    const diffMs = now - posted
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Job not found</p>
          <Link href="/jobs">
            <button className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg">
              Back to Jobs
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black text-white py-8 border-b-4 border-teal-600 text-center"
      >
        <div className="max-w-6xl mx-auto px-6 py-40">
          <h1 className="text-7xl font-black">Job Details</h1>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Job Header */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  {/* Company Logo */}
                  <div className="bg-teal-100 p-4 rounded-lg h-fit">
                    {jobData.companyLogo ? (
                      <img 
                        src={jobData.companyLogo} 
                        alt={jobData.companyName}
                        className="w-16 h-16 rounded object-cover"
                      />
                    ) : (
                      <Building2 className="w-16 h-16 text-teal-600" strokeWidth={2} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{jobData.title}</h2>
                    <p className="text-gray-600 mb-4">{jobData.companyName || 'Company'}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {jobData.jobType && (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          {jobData.jobType}
                        </span>
                      )}
                      {jobData.location && (
                        <span className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-4 h-4 text-teal-600" />
                          {jobData.location}
                        </span>
                      )}
                      <span className="text-gray-500 text-xs">
                        Posted {getTimeAgo(jobData.postedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-3 rounded-lg transition-colors ${
                    isSaved
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                  }`}
                >
                  <Heart className="w-6 h-6" fill={isSaved ? 'currentColor' : 'none'} />
                </motion.button>
              </div>
            </motion.div>

            {/* Overview */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {jobData.salary && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-600">{jobData.salary}</p>
                    <p className="text-sm text-gray-600 mt-1">Salary</p>
                  </div>
                )}
                {jobData.jobType && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-600">{jobData.jobType}</p>
                    <p className="text-sm text-gray-600 mt-1">Job Type</p>
                  </div>
                )}
                {jobData.location && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-600">{jobData.location}</p>
                    <p className="text-sm text-gray-600 mt-1">Location</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Job Description */}
            {jobData.description && (
              <motion.div variants={itemVariants} className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{jobData.description}</p>
              </motion.div>
            )}

            {/* Tags */}
            {jobData.tags && jobData.tags.length > 0 && (
              <motion.div variants={itemVariants} className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Skills & Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {jobData.tags.map((tag, idx) => (
                    <span key={idx} className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Share */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share Job</h3>
              <div className="flex gap-3">
                <button 
                  onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                  className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${jobData.title}`, '_blank')}
                  className="p-3 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}
                  className="p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <motion.div variants={itemVariants} className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Jobs</h3>
                <p className="text-gray-600 text-sm mb-6">Jobs in the same location or similar categories</p>
                <div className="space-y-4">
                  {relatedJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-teal-600 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3 flex-1">
                          {job.companyLogo ? (
                            <img 
                              src={job.companyLogo} 
                              alt={job.companyName}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <Building2 className="w-12 h-12 text-teal-600 bg-teal-50 p-2 rounded" />
                          )}
                          <div>
                            <h4 className="font-bold text-gray-900">{job.title}</h4>
                            <p className="text-sm text-gray-600">{job.companyName || 'Company'}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {job.jobType && (
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {job.jobType}
                                </span>
                              )}
                              {job.location && (
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {job.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Link href={`/jobdetails?id=${job.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg text-sm whitespace-nowrap"
                          >
                            View Job
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Apply Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-20 space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApply}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Apply Now
              </motion.button>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold text-gray-900 mb-4">Job Overview</h4>
                <div className="space-y-4">
                  {jobData.salary && (
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Salary</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{jobData.salary}</p>
                    </div>
                  )}
                  {jobData.jobType && (
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Job Type</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{jobData.jobType}</p>
                    </div>
                  )}
                  {jobData.postedAt && (
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Posted</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{getTimeAgo(jobData.postedAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Info */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {jobData.companyLogo ? (
                    <img 
                      src={jobData.companyLogo} 
                      alt={jobData.companyName}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="bg-teal-100 p-2 rounded">
                      <Building2 className="w-8 h-8 text-teal-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{jobData.companyName || 'Company'}</p>
                    <p className="text-xs text-gray-600">Employer</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              {jobData.location && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-bold text-gray-900 mb-4">Location</h4>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-teal-600" />
                    <span className="text-sm">{jobData.location}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}