'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export const Testimonials = () => {
  return (
    <section className="bg-[#eef7f6] py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          Testimonials from Our Customers
        </h2>

        <p className="text-center text-gray-600 mt-4 max-w-2xl mx-auto">
          At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
        </p>

        {/* SLIDER WRAPPER */}
        <div className="relative mt-16 overflow-hidden">

          {/* MOVING TRACK */}
          <motion.div
            className="flex gap-8 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 30,
              ease: 'linear',
              repeat: Infinity
            }}
          >

            {/* ==== CARDS SET 1 ==== */}
            <TestimonialCard
              title="Amazing services"
              name="Marco Hicks"
              img="1"
            />
            <TestimonialCard
              title="Everything simple"
              name="Kristin Watson"
              img="2"
            />
            <TestimonialCard
              title="Awesome, thank you!"
              name="Zion Giacomo"
              img="3"
            />

            {/* ==== SAME CARDS DUPLICATED ==== */}
            <TestimonialCard
              title="Amazing services"
              name="Marco Hicks"
              img="1"
            />
            <TestimonialCard
              title="Everything simple"
              name="Kristin Watson"
              img="2"
            />
            <TestimonialCard
              title="Awesome, thank you!"
              name="Zion Giacomo"
              img="3"
            />

          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* CARD COMPONENT */
const TestimonialCard = ({ title, name, img }) => (
  <div className="min-w-[360px] bg-white rounded-2xl p-8 shadow-sm">
    <div className="flex gap-1 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} fill="currentColor" />
      ))}
    </div>

    <h3 className="mt-4 font-semibold">{title}</h3>

    <p className="text-gray-600 text-sm mt-3">
      Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
    </p>

    <div className="flex items-center justify-between mt-6">
      <div className="flex items-center gap-3">
        <img
          src={`https://i.pravatar.cc/40?img=${img}`}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs text-gray-500">Happy Client</p>
        </div>
      </div>
      <Quote className="text-teal-500" />
    </div>
  </div>
)
