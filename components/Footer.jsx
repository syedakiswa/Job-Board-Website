'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Check } from 'lucide-react'

export const Footer = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setIsSubscribed(true)
      setShowThankYou(true)
      setEmail('')
      
      // Auto hide thank you message after 3 seconds
      setTimeout(() => {
        setShowThankYou(false)
        setIsSubscribed(false)
      }, 3000)
    }
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

  const jobCategories = [
    'Telecommunications',
    'Hotels & Tourism',
    'Construction',
    'Education',
    'Financial Services',
    'Healthcare'
  ]

  const companyLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/aboutus' },
    { label: 'Jobs', href: '/jobs' },
    { label: 'Applied', href: '/applied' },
    { label: 'Profile', href: '/profile' }
  ]

  return (
    <>
      <footer className="relative z-50 bg-black text-white pt-20 pb-8">
        <motion.div 
          className="max-w-7xl mx-auto px-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1 - Logo & Description */}
            <motion.div variants={itemVariants}>
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="bg-teal-600 p-2 rounded-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-bold text-2xl">Job</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Quis enim pellentesque viverra tellus eget malesuada facilisis. Congue nibh vivamus aliquet nunc mauris d...
              </p>
            </motion.div>

            {/* Column 2 - Company Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white font-bold text-lg mb-6">Company</h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-teal-500 transition-colors duration-300 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 3 - Job Categories */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white font-bold text-lg mb-6">Job Categories</h3>
              <ul className="space-y-3">
                {jobCategories.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/jobs?category=${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-gray-400 text-sm hover:text-teal-500 transition-colors duration-300 hover:underline"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 4 - Newsletter */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white font-bold text-lg mb-6">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-6">
                Eu nunc pretium vitae platea. Non netus elementum vulputate
              </p>
              
              {!showThankYou ? (
                <motion.form 
                  onSubmit={handleSubscribe}
                  className="space-y-3"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors"
                    />
                    <Mail className="absolute right-3 top-3.5 w-4 h-4 text-gray-600" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubscribed}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 disabled:opacity-50"
                  >
                    {isSubscribed ? 'Subscribing...' : 'Subscribe now'}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-teal-600/20 border border-teal-600/50 rounded-lg p-4 text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-center mb-2"
                  >
                    <Check className="w-6 h-6 text-teal-500" />
                  </motion.div>
                  <p className="text-teal-400 font-semibold text-sm">
                    Thank you for subscribing!
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div 
            className="border-t border-gray-800 my-8"
            variants={itemVariants}
          ></motion.div>

          {/* Bottom Footer */}
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between"
            variants={itemVariants}
          >
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © Copyright All rights reserved 2025. Designed by Syeda Kiswa
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-gray-400 text-sm hover:text-teal-500 transition-colors duration-300 underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 text-sm hover:text-teal-500 transition-colors duration-300 underline"
              >
                Terms & Conditions
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </footer>
    </>
  )
}


import { Briefcase } from 'lucide-react'