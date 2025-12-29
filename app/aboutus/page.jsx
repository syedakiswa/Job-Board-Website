"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Zap,
  Target,
  Award,
  ChevronDown,
  Briefcase,
} from "lucide-react";

export default function AboutUsPage() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const howItWorks = [
    {
      icon: Briefcase,
      title: "Explore Jobs",
      description:
        "Browse verified job opportunities based on your skills, experience, and preferred location.",
    },
    {
      icon: Users,
      title: "Connect with Employers",
      description:
        "Apply directly and get noticed by companies actively hiring talented professionals.",
    },
    {
      icon: Target,
      title: "Apply with Confidence",
      description:
        "Submit your profile and resume easily through our simple application process.",
    },
    {
      icon: Award,
      title: "Grow Your Career",
      description:
        "Get hired and take the next step in your professional journey with confidence.",
    },
  ];

  const faqs = [
    {
      question: "How do I apply for a job?",
      answer:
        "Visit the jobs page, select a job you like, and click the apply button. Fill in the required details and submit your application.",
    },
    {
      question: "Is this platform free for job seekers?",
      answer:
        "Yes, our platform is completely free for applicants. There are no charges for applying to jobs.",
    },
    {
      question: "How will employers contact me?",
      answer:
        "Employers can contact you through the information provided in your profile or via email notifications.",
    },
    {
      question: "Do I need a complete profile?",
      answer:
        "A complete profile increases your chances of getting shortlisted, but you can still apply with a basic profile.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-40 text-center border-b-4 border-[#309689]">
        <h1 className="text-5xl font-black">About Us</h1>
      </div>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-black text-gray-900 mb-6"
            >
              Connecting Talent With Opportunity
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 leading-relaxed text-lg"
            >
              Our Job Board platform is designed to bridge the gap between
              talented individuals and companies looking for skilled
              professionals. We focus on simplicity, transparency, and real
              opportunities to help you build a successful career.
            </motion.p>
          </motion.div>

          {/* Image */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative w-full h-[300px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg"
          >
            <Image
              src="/about.webp"
              alt="About Job Board"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white border rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-[#309689]/10 p-4 rounded-lg">
                      <Icon className="w-8 h-8 text-[#309689]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#309689] to-teal-600 text-center text-white">
        <h2 className="text-4xl font-black mb-6">
          Start Your Career Journey Today
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-white/90">
          Thousands of job seekers trust our platform to find real opportunities
          from trusted employers.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/jobs"
            className="bg-white text-[#309689] font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
          >
            Start Now
          </Link>

          <button className="border-2 border-white py-3 px-8 rounded-lg hover:bg-white/10 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12">
            Frequently Asked Questions
          </h2>

          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white border rounded-lg mb-4 shadow-sm"
            >
              <button
                onClick={() =>
                  setExpandedFAQ(expandedFAQ === i ? null : i)
                }
                className="w-full flex justify-between items-center p-6"
              >
                <span className="font-bold text-left">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`transition ${
                    expandedFAQ === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedFAQ === i && (
                <div className="px-6 pb-6 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
