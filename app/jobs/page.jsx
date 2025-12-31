'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { MapPin, Briefcase, Clock, Heart, Bookmark, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'

export default function JobsListing() {
  const [savedJobs, setSavedJobs] = useState([])
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch jobs from Firebase
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const querySnapshot = await getDocs(collection(db, "jobs"))
        // const jobsList = querySnapshot.docs.map(doc => ({
        //   id: doc.id,
        //   ...doc.data()
        // }))
        const jobsList = querySnapshot.docs
  .map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
  .filter(job => job.title && job.title.trim() !== "")

setAllJobs(jobsList)

        setAllJobs(jobsList)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Extract unique values for filters
  const locations = useMemo(() => {
    const locs = [...new Set(allJobs.map(job => job.location).filter(Boolean))]
    return locs
  }, [allJobs])

  const categories = useMemo(() => {
    const cats = [...new Set(allJobs.flatMap(job => job.tags || []))]
    return cats
  }, [allJobs])

  const types = useMemo(() => {
    const jobTypes = [...new Set(allJobs.map(job => job.jobType).filter(Boolean))]
    return jobTypes
  }, [allJobs])

  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLocation = !selectedLocation || job.location === selectedLocation
      const matchesCategory = !selectedCategory || (job.tags && job.tags.includes(selectedCategory))
      const matchesType = !selectedType || job.jobType === selectedType
      
      return matchesSearch && matchesLocation && matchesCategory && matchesType
    })
  }, [searchTerm, selectedLocation, selectedCategory, selectedType, allJobs])

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black text-white py-40 text-center border-b-4 border-teal-600"
      >
        <h1 className="text-7xl font-black">Jobs</h1>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Filters */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg p-6 sticky top-20 shadow-sm">
              
              {/* Search */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Search Job Title</h3>
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                />
              </div>

              {/* Location Filter */}
              {locations.length > 0 && (
                <div className="mb-8 pb-6 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    Location
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="location"
                        value=""
                        checked={selectedLocation === ''}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-4 h-4 text-teal-600"
                      />
                      <span className="text-sm text-gray-700">All Locations</span>
                    </label>
                    {locations.map(loc => (
                      <label key={loc} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="location"
                          value={loc}
                          checked={selectedLocation === loc}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="w-4 h-4 text-teal-600"
                        />
                        <span className="text-sm text-gray-700">{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="mb-8 pb-6 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-teal-600" />
                    Tags
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={selectedCategory === ''}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-teal-600"
                      />
                      <span className="text-sm text-gray-700">All Tags</span>
                    </label>
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={selectedCategory === cat}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 text-teal-600"
                        />
                        <span className="text-sm text-gray-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Type Filter */}
              {types.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    Job Type
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value=""
                        checked={selectedType === ''}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-4 h-4 text-teal-600"
                      />
                      <span className="text-sm text-gray-700">All Types</span>
                    </label>
                    {types.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={selectedType === type}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-4 h-4 text-teal-600"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* WE ARE HIRING Banner */}
              <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg p-6 text-white text-center">
                <h4 className="font-bold text-lg mb-2">WE ARE HIRING</h4>
                <p className="text-sm text-gray-100 mb-4">Join our team and grow with us</p>
                <button className="bg-white text-teal-600 font-bold py-2 px-4 rounded w-full hover:bg-gray-100 transition-colors">
                  Join Now
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content - Jobs List */}
          <motion.div 
            className="lg:col-span-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 text-sm">
                Showing {filteredJobs.length} of {allJobs.length} results
              </p>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option>Sort by: Most Recent</option>
                <option>Sort by: Salary (High to Low)</option>
                <option>Sort by: Salary (Low to High)</option>
              </select>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-600">Loading jobs...</p>
              </div>
            ) : (
              /* Jobs List */
              <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
                      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 flex-1">
                          {/* Company Logo */}
                          <div className="bg-teal-100 p-3 rounded-lg h-fit">
                            {job.companyLogo ? (
                              <img 
                                src={job.companyLogo} 
                                alt={job.companyName}
                                className="w-12 h-12 rounded object-cover"
                              />
                            ) : (
                              <Building2 className="w-12 h-12 text-teal-600" strokeWidth={2} />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{job.companyName || 'Company Name'}</p>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.tags && job.tags.map((tag, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-200">
                                  {tag}
                                </span>
                              ))}
                              {job.jobType && (
                                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                  <Clock className="w-3 h-3" />
                                  {job.jobType}
                                </span>
                              )}
                            </div>

                            {/* Salary & Location */}
                            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                              {job.salary && (
                                <span className="font-semibold text-gray-900">{job.salary}</span>
                              )}
                              {job.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4 text-teal-600" />
                                  {job.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-start gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleSaveJob(job.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              savedJobs.includes(job.id)
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                            }`}
                          >
                            <Heart className="w-5 h-5" fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            <Bookmark className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500">{getTimeAgo(job.postedAt)}</span>
                        <Link href={`/jobdetails?id=${job.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                          >
                            Job Details
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <p className="text-gray-600">No jobs found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {filteredJobs.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">←</button>
                <button className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm">1</button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">2</button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">→</button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}