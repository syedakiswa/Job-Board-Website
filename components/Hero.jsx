'use client'
import React, { useState } from 'react'
import { Search, Briefcase, Users, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const router = useRouter()
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState([])
  const [companySuggestions, setCompanySuggestions] = useState([])
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [categorySuggestions, setCategorySuggestions] = useState([])
  const [showJobTitleDropdown, setShowJobTitleDropdown] = useState(false)
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
// ================= JOB TITLES =================
const allJobs = [
  // Development
  'Software Engineer', 'Associate Software Engineer',
  'Web Developer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'React Developer', 'Next.js Developer',
  'Angular Developer', 'Vue.js Developer',
  'Mobile App Developer', 'Android Developer', 'iOS Developer',
  'Flutter Developer', 'React Native Developer',

  // Design
  'UI Designer', 'UX Designer', 'UI/UX Designer',
  'Product Designer', 'Graphic Designer',

  // Data & AI
  'Data Scientist', 'Data Analyst', 'Business Intelligence Analyst',
  'Machine Learning Engineer', 'AI Engineer',

  // DevOps & Cloud
  'DevOps Engineer', 'Cloud Engineer',
  'AWS Engineer', 'Azure Engineer', 'Site Reliability Engineer',

  // QA & Testing
  'QA Engineer', 'SQA Engineer',
  'Manual Tester', 'Automation Tester',

  // Management
  'Project Manager', 'Product Manager',
  'Technical Project Manager', 'Scrum Master',

  // Security & Systems
  'Cyber Security Engineer', 'Information Security Analyst',
  'System Administrator', 'Network Engineer',

  // Others
  'Game Developer', 'Blockchain Developer',
  'WordPress Developer', 'Shopify Developer',
  'SEO Specialist', 'Digital Marketing Manager',
  'IT Support Engineer', 'Help Desk Officer',
  'Intern Software Engineer'
]

// ================= COMPANIES / SOFTWARE HOUSES =================
const allCompanies = [
  // International Tech
  'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta',
  'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Spotify',
  'LinkedIn', 'IBM', 'Oracle', 'Adobe', 'Intel',
  'NVIDIA', 'Salesforce', 'SAP', 'Cisco', 'PayPal',

  // Pakistani Software Houses
  'Systems Limited', 'NetSol Technologies', '10Pearls',
  'Arbisoft', 'Careem', 'Afiniti', 'Folio3',
  'Tkxel', 'Contour Software', 'Mentor Graphics',
  'VentureDive', 'Techlogix', 'i2c', 'Confiz',
  'Xavor', 'Ovex Technologies', 'TRG Pakistan',
  'Avanza Solutions', 'Emumba', 'DatumSquare',

  // Startups & Others
  'Bykea', 'Airlift', 'Sadapay', 'Easypaisa',
  'Jazz', 'Zong', 'Telenor', 'Ufone',
  'Upwork', 'Fiverr', 'Remote OK',
  'Freelance', 'Startup', 'Software House'
]

// ================= LOCATIONS =================
const allLocations = [
  // Pakistan
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi',
  'Faisalabad', 'Multan', 'Peshawar', 'Quetta',
  'Hyderabad', 'Sukkur', 'Sialkot', 'Gujranwala',
  'Abbottabad', 'Bahawalpur', 'Rahim Yar Khan',

  // Remote
  'Remote', 'Work From Home', 'Hybrid',

  // International
  'Dubai', 'Abu Dhabi', 'Doha', 'Riyadh',
  'London', 'Berlin', 'Amsterdam',
  'New York', 'San Francisco', 'Los Angeles',
  'Toronto', 'Vancouver',
  'Sydney', 'Melbourne',
  'Singapore', 'Kuala Lumpur'
]


  const allCategories = [
    'Full Time', 'Part Time', 'Internship', 'Contract', 'Freelance',
    'Temporary', 'Permanent', 'Remote', 'Hybrid', 'On-site'
  ]

  const handleJobTitleChange = (e) => {
    const value = e.target.value
    setJobTitle(value)
    setShowJobTitleDropdown(true)
    
    if (value.length > 0) {
      const filtered = allJobs.filter(job =>
        job.toLowerCase().includes(value.toLowerCase())
      )
      setJobTitleSuggestions(filtered)
    } else {
      setJobTitleSuggestions(allJobs)
    }
  }

  const handleCompanyChange = (e) => {
    const value = e.target.value
    setCompany(value)
    setShowCompanyDropdown(true)
    
    if (value.length > 0) {
      const filtered = allCompanies.filter(comp =>
        comp.toLowerCase().includes(value.toLowerCase())
      )
      setCompanySuggestions(filtered)
    } else {
      setCompanySuggestions(allCompanies)
    }
  }

  const handleLocationChange = (e) => {
    const value = e.target.value
    setLocation(value)
    setShowLocationDropdown(true)
    
    if (value.length > 0) {
      const filtered = allLocations.filter(loc =>
        loc.toLowerCase().includes(value.toLowerCase())
      )
      setLocationSuggestions(filtered)
    } else {
      setLocationSuggestions(allLocations)
    }
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value
    setCategory(value)
    setShowCategoryDropdown(true)
    
    if (value.length > 0) {
      const filtered = allCategories.filter(cat =>
        cat.toLowerCase().includes(value.toLowerCase())
      )
      setCategorySuggestions(filtered)
    } else {
      setCategorySuggestions(allCategories)
    }
  }

  const selectJobTitle = (job) => {
    setJobTitle(job)
    setShowJobTitleDropdown(false)
  }

  const selectCompany = (comp) => {
    setCompany(comp)
    setShowCompanyDropdown(false)
  }

  const selectLocation = (loc) => {
    setLocation(loc)
    setShowLocationDropdown(false)
  }

  const selectCategory = (cat) => {
    setCategory(cat)
    setShowCategoryDropdown(false)
  }

  const handleSearch = () => {
    // Create query string
    const queryParams = new URLSearchParams({
      jobTitle: jobTitle || 'all',
      company: company || 'all',
      location: location || 'all',
      category: category || 'all'
    })

    // Redirect to jobs page with query parameters
    router.push(`/jobs?${queryParams.toString()}`)
  }

  const stats = [
    { icon: Briefcase, number: '25,850', label: 'Jobs' },
    { icon: Users, number: '10,250', label: 'Candidates' },
    { icon: Building2, number: '18,400', label: 'Companies' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  return (
    <>
      <section className="relative z-20 min-h-[600px] flex items-center justify-center py-40">

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 w-full">
          
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight"
            >
              Find Your Dream Job Today!
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-300 text-lg md:text-xl"
            >
              Connecting Talent with Opportunity: Your Gateway to Career Success
            </motion.p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-5xl mx-auto mb-16"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-visible">
              <div className="flex flex-col lg:flex-row gap-0">
                
                {/* Job Title Input */}
                <div className="relative flex-1 border-b lg:border-b-0 lg:border-r border-gray-200">
                  <input
                    type="text"
                    placeholder="Job Title or Company"
                    value={jobTitle}
                    onChange={handleJobTitleChange}
                    onFocus={() => setShowJobTitleDropdown(true)}
                    onBlur={() => setTimeout(() => setShowJobTitleDropdown(false), 200)}
                    className="w-full px-6 py-4 outline-none text-gray-800 placeholder-gray-500 bg-white"
                  />
                  
                  {showJobTitleDropdown && jobTitleSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 max-h-60 overflow-y-auto z-50 shadow-lg"
                    >
                      {jobTitleSuggestions.map((job) => (
                        <button
                          key={job}
                          type="button"
                          onClick={() => selectJobTitle(job)}
                          className="w-full px-6 py-2.5 text-left text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors text-sm"
                        >
                          {job}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Company Input */}
                <div className="relative flex-1 border-b lg:border-b-0 lg:border-r border-gray-200">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={company}
                    onChange={handleCompanyChange}
                    onFocus={() => setShowCompanyDropdown(true)}
                    className="w-full px-6 py-4 outline-none text-gray-800 placeholder-gray-500 bg-white"
                  />
                  
                  {showCompanyDropdown && companySuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 max-h-60 overflow-y-auto z-50 shadow-lg"
                    >
                      {companySuggestions.map((comp) => (
                        <button
                          key={comp}
                          type="button"
                          onClick={() => selectCompany(comp)}
                          className="w-full px-6 py-2.5 text-left text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors text-sm"
                        >
                          {comp}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Location Input */}
                <div className="relative flex-1 border-b lg:border-b-0 lg:border-r border-gray-200">
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={handleLocationChange}
                    onFocus={() => setShowLocationDropdown(true)}
                    className="w-full px-6 py-4 outline-none text-gray-800 placeholder-gray-500 bg-white"
                  />
                  
                  {showLocationDropdown && locationSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 max-h-60 overflow-y-auto z-50 shadow-lg"
                    >
                      {locationSuggestions.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => selectLocation(loc)}
                          className="w-full px-6 py-2.5 text-left text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors text-sm"
                        >
                          {loc}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Category Input */}
                <div className="relative flex-1 border-b lg:border-b-0 lg:border-r border-gray-200">
                  <input
                    type="text"
                    placeholder="Job Type"
                    value={category}
                    onChange={handleCategoryChange}
                    onFocus={() => setShowCategoryDropdown(true)}
                    className="w-full px-6 py-4 outline-none text-gray-800 placeholder-gray-500 bg-white"
                  />
                  
                  {showCategoryDropdown && categorySuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 max-h-60 overflow-y-auto z-50 shadow-lg"
                    >
                      {categorySuggestions.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => selectCategory(cat)}
                          className="w-full px-6 py-2.5 text-left text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors text-sm"
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Search Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Search</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-4"
              >
                <div className="bg-teal-600 p-4 rounded-lg">
                  <stat.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-white text-2xl font-black">{stat.number}</p>
                  <p className="text-gray-400 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
    </>
  )
}