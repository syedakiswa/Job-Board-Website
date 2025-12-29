'use client'
import React from 'react'
import { motion } from 'framer-motion'
import {
  Sprout,
  Cog,
  ShoppingBag,
  HardHat,
  Hotel,
  GraduationCap,
  Wallet,
  Bus
} from 'lucide-react'

export const Categorie = () => {
  return (
    <section className="bg-[#eef7f6] py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-black"
        >
          Browse by Category
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 mt-4 max-w-2xl mx-auto"
        >
          At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
          Blandit a massa elementum id scelerisque.
        </motion.p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl p-10 text-center shadow-sm"
          >
            <Sprout className="mx-auto text-teal-600 w-10 h-10" />
            <h3 className="mt-6 font-semibold text-lg">Agriculture</h3>
            <span className="inline-block mt-3 text-sm bg-teal-50 text-teal-600 px-3 py-1 rounded-full">
              1254 jobs
            </span>
          </motion.div>

          {/* Card 2 */}
          <motion.div whileHover={{ y: -8 }} className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <Cog className="mx-auto text-teal-600 w-10 h-10" />
            <h3 className="mt-6 font-semibold text-lg">Metal Production</h3>
            <span className="inline-block mt-3 text-sm bg-teal-50 text-teal-600 px-3 py-1 rounded-full">
              816 jobs
            </span>
          </motion.div>

          {/* Card 3 */}
          <motion.div whileHover={{ y: -8 }} className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <ShoppingBag className="mx-auto text-teal-600 w-10 h-10" />
            <h3 className="mt-6 font-semibold text-lg">Commerce</h3>
            <span className="inline-block mt-3 text-sm bg-teal-50 text-teal-600 px-3 py-1 rounded-full">
              2082 jobs
            </span>
          </motion.div>

          {/* Card 4 */}
          <motion.div whileHover={{ y: -8 }} className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <HardHat className="mx-auto text-teal-600 w-10 h-10" />
            <h3 className="mt-6 font-semibold text-lg">Construction</h3>
            <span className="inline-block mt-3 text-sm bg-teal-50 text-teal-600 px-3 py-1 rounded-full">
              1520 jobs
            </span>
          </motion.div>

          {/* Card 5 */}
          <motion.div whileHover={{ y: -8 }} className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <Hotel className="mx-auto text-teal-600 w-10 h-10" />
            <h3 className="mt-6 font-semibold text-lg">Hotels & Tourism</h3>
            <span className="inline-block mt-3 text-sm bg-teal-50 text-teal-600 px-3 py-1 rounded-full">
              1022 jobs
            </span>
          </motion.div>

          {/* Card 6 */}
          <motion.div whileHover={{ y: -8 }} className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <GraduationCap className="mx-auto text-teal-600 w-10 h-10" />
            <h3 className="mt-6 font-semibold text-lg">Education</h3>
            <span className="inline-block mt-3 text-sm bg-teal-50 text-teal-600 px-3 py-1 rounded-full">
              1496 jobs
            </span>
          </motion.div>

          {/* Card 7 */}
          <motion.div whileHover={{ y: -8 }} className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <Wallet className="mx-auto text-teal-600 w-10 h-10" />
            <h3 className="mt-6 font-semibold text-lg">Financial Services</h3>
            <span className="inline-block mt-3 text-sm bg-teal-50 text-teal-600 px-3 py-1 rounded-full">
              1529 jobs
            </span>
          </motion.div>

          {/* Card 8 */}
          <motion.div whileHover={{ y: -8 }} className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <Bus className="mx-auto text-teal-600 w-10 h-10" />
            <h3 className="mt-6 font-semibold text-lg">Transport</h3>
            <span className="inline-block mt-3 text-sm bg-teal-50 text-teal-600 px-3 py-1 rounded-full">
              1244 jobs
            </span>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
