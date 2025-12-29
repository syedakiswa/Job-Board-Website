import React, { useState } from 'react'
import { MapPin, Briefcase, Clock, Heart, Share2, Zap, Users, TrendingUp, Code, Palette, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export const Recentjobs = () => {
  const [savedJobs, setSavedJobs] = useState([])

  const jobs = [
    {
      id: 1,
      title: 'Forward Security Director',
      company: 'Matri, TechBuild and Michael Co',
      icon: Briefcase,
      tags: ['Hotels & Tourism', 'Full-time'],
      salary: '145000-160000',
      location: 'New York, USA',
      postedTime: '15 min ago'
    },
    {
      id: 2,
      title: 'Regional Creative Facilitator',
      company: 'Matton - Motion Co',
      icon: Palette,
      tags: ['Media', 'Part-time'],
      salary: '250000-145000',
      location: 'Los Angeles, USA',
      postedTime: '19 min ago'
    },
    {
      id: 3,
      title: 'Internal Integration Planner',
      company: 'Pine, Cruize and Hahn Co',
      icon: Code,
      tags: ['Construction', 'Full-time'],
      salary: '145000-160000',
      location: 'Texas, USA',
      postedTime: '32 min ago'
    },
    {
      id: 4,
      title: 'District Intranet Director',
      company: 'Jeff Easton - Milton Co',
      icon: Users,
      tags: ['Construction', 'Full-time'],
      salary: '145000-160000',
      location: 'Houston, USA',
      postedTime: '45 min ago'
    },
    {
      id: 5,
      title: 'Corporate Tactics Facilitator',
      company: 'Smith, Jimenez and Caldwell Co',
      icon: TrendingUp,
      tags: ['Construction', 'Full-time'],
      salary: '128000-160000',
      location: 'Austin, USA',
      postedTime: '1 hour ago'
    },
    {
      id: 6,
      title: 'Senior UX/UI Designer',
      company: 'Digital Solutions Inc',
      icon: Palette,
      tags: ['Design', 'Full-time'],
      salary: '120000-150000',
      location: 'San Francisco, USA',
      postedTime: '2 hours ago'
    },
    {
      id: 7,
      title: 'Backend Developer',
      company: 'CloudTech Systems',
      icon: Code,
      tags: ['Technology', 'Full-time'],
      salary: '130000-170000',
      location: 'Seattle, USA',
      postedTime: '2 hours ago'
    },
    {
      id: 8,
      title: 'Marketing Manager',
      company: 'Growth Marketing Co',
      icon: BarChart3,
      tags: ['Marketing', 'Full-time'],
      salary: '90000-120000',
      location: 'Chicago, USA',
      postedTime: '3 hours ago'
    },
    {
      id: 9,
      title: 'Data Scientist',
      company: 'Analytics Pro',
      icon: Zap,
      tags: ['Technology', 'Full-time'],
      salary: '140000-180000',
      location: 'Boston, USA',
      postedTime: '3 hours ago'
    },
    {
      id: 10,
      title: 'Product Manager',
      company: 'Innovation Labs',
      icon: TrendingUp,
      tags: ['Product', 'Full-time'],
      salary: '125000-165000',
      location: 'New York, USA',
      postedTime: '4 hours ago'
    },
    {
      id: 11,
      title: 'DevOps Engineer',
      company: 'Cloud Infrastructure Co',
      icon: Code,
      tags: ['Technology', 'Full-time'],
      salary: '135000-175000',
      location: 'Denver, USA',
      postedTime: '4 hours ago'
    },
    {
      id: 12,
      title: 'HR Specialist',
      company: 'Human Resources Plus',
      icon: Users,
      tags: ['HR', 'Full-time'],
      salary: '75000-95000',
      location: 'Miami, USA',
      postedTime: '5 hours ago'
    },
    {
      id: 13,
      title: 'Frontend Engineer',
      company: 'WebDev Studio',
      icon: Code,
      tags: ['Technology', 'Remote'],
      salary: '110000-140000',
      location: 'San Diego, USA',
      postedTime: '5 hours ago'
    },
    {
      id: 14,
      title: 'Graphic Designer',
      company: 'Creative Agency',
      icon: Palette,
      tags: ['Design', 'Part-time'],
      salary: '60000-80000',
      location: 'Portland, USA',
      postedTime: '6 hours ago'
    },
    {
      id: 15,
      title: 'Business Analyst',
      company: 'Corporate Solutions',
      icon: BarChart3,
      tags: ['Business', 'Full-time'],
      salary: '95000-130000',
      location: 'Atlanta, USA',
      postedTime: '6 hours ago'
    }
  ]

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
        staggerChildren: 0.06,
        delayChildren: 0.2,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-14 pb-6 border-b-2 border-dotted border-slate-300">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              Recent Jobs Available
            </h2>
            <p className="text-gray-600 text-sm mt-2">Explore latest job opportunities</p>
          </motion.div>
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            href="/jobs"
            className="text-teal-600 font-bold hover:text-teal-700 transition-colors text-sm"
          >
            View all →
          </motion.a>
        </div>

        {/* Jobs Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {jobs.map((job) => {
            const IconComponent = job.icon
            return (
              <motion.div
                key={job.id}
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)' }}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-xl transition-all h-full flex flex-col"
              >
                {/* Icon & Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-2.5 rounded-lg flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-teal-600" strokeWidth={2.5} />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleSaveJob(job.id)}
                    className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                      savedJobs.includes(job.id)
                        ? 'bg-red-100 text-red-600 scale-110'
                        : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'} />
                  </motion.button>
                </div>

                {/* Title */}
                <Link href={`/jobdetails?id=${job.id}`}>
                  <h3 className="text-sm font-bold text-gray-900 hover:text-teal-600 cursor-pointer transition-colors line-clamp-2 mb-1 h-10">
                    {job.title}
                  </h3>
                </Link>

                {/* Company */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-1">{job.company}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {job.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-0.5 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
                    >
                      {idx === 0 ? <Briefcase className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-3"></div>

                {/* Salary & Location */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="font-bold text-gray-900 text-sm">${job.salary}</div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                    <span className="text-xs line-clamp-1">{job.location}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">{job.postedTime}</span>
                  <Link href={`/jobdetails?id=${job.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors"
                    >
                      Details
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}