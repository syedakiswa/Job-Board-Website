'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export const Goodlife = () => {
  return (
    <>
      {/* Good Life Section */}
      <section className="min-h-[60vh] py-16 px-20 mt-32 bg-white text-black">

        {/* Image + Text */}
        <div className="grid grid-cols-2 gap-20 items-center">

          {/* Image Col */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img
              src="/goodlife.webp"
              alt="Good Life Image"
              className="rounded-2xl w-[40vw]"
            />
          </motion.div>

          {/* Text Col */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="py-8"
          >
            <h2 className="text-5xl font-semibold">
              Good Life Begins With A Good Company
            </h2>

            <p className="py-8 text-gray-600">
              Find opportunities that match your skills, passion, and career goals.
              We connect talented professionals with trusted companies to help you
              build a stable and successful future.
            </p>

            <Link href="/jobs">
              <button className="bg-teal-500 hover:bg-teal-600 transition text-white py-2 px-6 font-semibold rounded-xl">
                Search Jobs
              </button>
            </Link>

            <button className="px-4 py-2">
              <Link href="/aboutus" className="text-lg underline font-semibold">
                Learn more
              </Link>
            </button>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="min-h-[30vh] flex justify-center gap-16 mt-20">

          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="
              px-14
              w-[24vw]
              bg-white
              shadow-lg
              hover:shadow-2xl
              rounded-2xl
              py-10
              transition-all
              duration-300
              cursor-pointer
            "
          >
            <h2 className="text-teal-600 font-bold text-4xl">12K+</h2>
            <h3 className="py-3 font-bold text-xl">Clients Worldwide</h3>
            <p className="text-gray-600">
              Thousands of companies across the globe trust our platform to
              find skilled professionals and grow their teams efficiently.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="
              px-14
              w-[24vw]
              bg-white
              shadow-lg
              hover:shadow-2xl
              rounded-2xl
              py-10
              transition-all
              duration-300
              cursor-pointer
            "
          >
            <h2 className="text-teal-600 font-bold text-4xl">20K+</h2>
            <h3 className="py-3 font-bold text-xl">Active Resume</h3>
            <p className="text-gray-600">
              Job seekers actively update their resumes every day, helping
              employers discover fresh talent and hire faster.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="
              px-14
              w-[24vw]
              bg-white
              shadow-lg
              hover:shadow-2xl
              rounded-2xl
              py-10
              transition-all
              duration-300
              cursor-pointer
            "
          >
            <h2 className="text-teal-600 font-bold text-4xl">8K+</h2>
            <h3 className="py-3 font-bold text-xl">Companies</h3>
            <p className="text-gray-600">
              From startups to established enterprises, companies rely on our
              platform to post jobs and connect with the right candidates.
            </p>
          </motion.div>

        </div>

        {/* Hero Image with Text Overlay */}
        <div className="mt-20 min-h-[60vh] relative rounded-3xl overflow-hidden">

          <img
            src="/team1.webp"
            alt="Team Image"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/60"></div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="
              relative z-10
              h-full
              flex flex-col
              items-center
              justify-center
              text-center
              text-white
              px-6
              py-20
            "
          >
            <h1 className="text-6xl font-bold leading-tight">
              Create A Better <br /> Future For Yourself
            </h1>

            <p className="py-6 text-gray-200 max-w-[600px]">
              Take the next step in your career journey. Explore jobs, apply
              with confidence, and connect with companies that value your
              skills and ambition.
            </p>

            <Link href="/jobs">
              <button className="bg-teal-500 hover:bg-teal-600 transition text-white py-3 px-8 rounded-xl font-semibold">
                Search Job
              </button>
            </Link>
          </motion.div>
        </div>

      </section>
    </>
  )
}
