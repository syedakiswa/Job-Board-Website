// 'use client'
// import React, { useState, useEffect } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { Upload, FileText, User, Mail, Phone, MapPin, Briefcase, X, Check } from 'lucide-react'
// import { doc, getDoc, addDoc, collection } from 'firebase/firestore'
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
// import { onAuthStateChanged } from 'firebase/auth'
// import { auth, db, storage } from '@/firebase/firebaseConfig'

// export default function ApplyJobPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const jobId = searchParams.get('jobId')

//   const [user, setUser] = useState(null)
//   const [jobData, setJobData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)

//   // Form states
//   const [fullName, setFullName] = useState('')
//   const [email, setEmail] = useState('')
//   const [phone, setPhone] = useState('')
//   const [location, setLocation] = useState('')
//   const [experience, setExperience] = useState('')
//   const [coverLetter, setCoverLetter] = useState('')
//   const [cvFile, setCvFile] = useState(null)
//   const [cvFileName, setCvFileName] = useState('')
//   const [uploadingCV, setUploadingCV] = useState(false)
//   const [cvUrl, setCvUrl] = useState('')

//   // Check authentication
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (currentUser) => {
//       if (!currentUser) {
//         alert('Please login to apply for jobs')
//         router.push('/login')
//       } else {
//         setUser(currentUser)
//         setEmail(currentUser.email || '')
//         setFullName(currentUser.displayName || '')
//       }
//     })
//     return () => unsub()
//   }, [router])

//   // Fetch job details
//   useEffect(() => {
//     const fetchJob = async () => {
//       if (!jobId) {
//         alert('Job ID not found')
//         router.push('/jobs')
//         return
//       }

//       try {
//         const jobDoc = await getDoc(doc(db, 'jobs', jobId))
//         if (jobDoc.exists()) {
//           setJobData({ id: jobDoc.id, ...jobDoc.data() })
//         } else {
//           alert('Job not found')
//           router.push('/jobs')
//         }
//       } catch (error) {
//         console.error('Error fetching job:', error)
//         alert('Error loading job details')
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (user) {
//       fetchJob()
//     }
//   }, [jobId, user, router])

//   // Handle CV upload
//   const handleCVUpload = async (e) => {
//     const file = e.target.files[0]
//     if (!file) return

//     // Check file type (PDF, DOC, DOCX)
//     const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
//     if (!allowedTypes.includes(file.type)) {
//       alert('Only PDF, DOC, and DOCX files are allowed!')
//       return
//     }

//     // Check file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       alert('File size should be less than 5MB!')
//       return
//     }

//     setUploadingCV(true)
//     try {
//       const timestamp = Date.now()
//       const storageRef = ref(storage, `cvs/${user.uid}/${timestamp}_${file.name}`)
//       const snapshot = await uploadBytes(storageRef, file)
//       const url = await getDownloadURL(snapshot.ref)
      
//       setCvFile(file)
//       setCvFileName(file.name)
//       setCvUrl(url)
//       alert('CV uploaded successfully!')
//     } catch (error) {
//       console.error('Upload error:', error)
//       alert('Error uploading CV: ' + error.message)
//     } finally {
//       setUploadingCV(false)
//     }
//   }

//   // Remove CV
//   const removeCV = () => {
//     setCvFile(null)
//     setCvFileName('')
//     setCvUrl('')
//   }

//   // Submit application
//   const handleSubmit = async () => {
//     if (!fullName || !email || !phone || !location || !experience) {
//       alert('Please fill all required fields!')
//       return
//     }

//     if (!cvUrl) {
//       alert('Please upload your CV!')
//       return
//     }

//     setSubmitting(true)
//     try {
//       // Save application to Firestore
//       await addDoc(collection(db, 'applications'), {
//         jobId: jobId,
//         jobTitle: jobData.title,
//         companyName: jobData.companyName,
//         employerUID: jobData.employerUID,
//         applicantUID: user.uid,
//         applicantName: fullName,
//         email: email,
//         phone: phone,
//         location: location,
//         experience: experience,
//         coverLetter: coverLetter,
//         cvUrl: cvUrl,
//         cvFileName: cvFileName,
//         appliedAt: new Date().toISOString(),
//         status: 'pending'
//       })

//       alert('Application submitted successfully!')
//       router.push('/jobs')
//     } catch (error) {
//       console.error('Error submitting application:', error)
//       alert('Error submitting application: ' + error.message)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-black text-white py-8 border-b-4 border-teal-600"
//       >
//         <div className="max-w-4xl mx-auto px-6 py-20 text-center">
//           <h1 className="text-6xl font-black mb-4">Apply for Job</h1>
//           {jobData && (
//             <p className="text-xl text-gray-300">{jobData.title} at {jobData.companyName}</p>
//           )}
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="max-w-4xl mx-auto px-6 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-sm p-8"
//         >
//           <div className="space-y-6">
            
//             {/* Personal Information Section */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <User className="text-teal-600" size={28} />
//                 Personal Information
//               </h2>
              
//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
//                     placeholder="John Doe"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
//                     placeholder="john@example.com"
//                   />
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
//                     placeholder="+92 300 1234567"
//                   />
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Location *
//                   </label>
//                   <input
//                     type="text"
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
//                     placeholder="Lahore, Pakistan"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Professional Information */}
//             <div className="border-t border-gray-200 pt-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <Briefcase className="text-teal-600" size={28} />
//                 Professional Details
//               </h2>

//               {/* Experience */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Years of Experience *
//                 </label>
//                 <select
//                   value={experience}
//                   onChange={(e) => setExperience(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
//                 >
//                   <option value="">Select experience</option>
//                   <option value="0-1">0-1 years</option>
//                   <option value="1-3">1-3 years</option>
//                   <option value="3-5">3-5 years</option>
//                   <option value="5-10">5-10 years</option>
//                   <option value="10+">10+ years</option>
//                 </select>
//               </div>

//               {/* Cover Letter */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Cover Letter (Optional)
//                 </label>
//                 <textarea
//                   value={coverLetter}
//                   onChange={(e) => setCoverLetter(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 h-32 text-gray-900"
//                   placeholder="Tell us why you're a great fit for this role..."
//                 />
//               </div>
//             </div>

//             {/* CV Upload Section */}
//             <div className="border-t border-gray-200 pt-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <FileText className="text-teal-600" size={28} />
//                 Upload Your CV *
//               </h2>

//               {!cvFile ? (
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-600 transition-colors">
//                   <label className="cursor-pointer block">
//                     <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                     <p className="text-gray-700 font-medium mb-2">
//                       {uploadingCV ? 'Uploading...' : 'Click to upload your CV'}
//                     </p>
//                     <p className="text-sm text-gray-500 mb-4">
//                       PDF, DOC, or DOCX (Max 5MB)
//                     </p>
//                     <span className="inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
//                       Choose File
//                     </span>
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       onChange={handleCVUpload}
//                       className="hidden"
//                       disabled={uploadingCV}
//                     />
//                   </label>
//                 </div>
//               ) : (
//                 <div className="border border-gray-300 rounded-lg p-6 flex items-center justify-between bg-teal-50">
//                   <div className="flex items-center gap-3">
//                     <div className="bg-teal-600 p-3 rounded-lg">
//                       <FileText className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">{cvFileName}</p>
//                       <p className="text-sm text-gray-600">
//                         {(cvFile.size / 1024 / 1024).toFixed(2)} MB
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={removeCV}
//                     className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               )}

//               <p className="text-xs text-gray-500 mt-3">
//                 * Accepted formats: PDF, DOC, DOCX. Maximum file size: 5MB
//               </p>
//             </div>

//             {/* Submit Button */}
//             <div className="border-t border-gray-200 pt-6">
//               <div className="flex gap-4">
//                 <button
//                   type="button"
//                   onClick={() => router.back()}
//                   className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={submitting || uploadingCV}
//                   className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {submitting ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                       Submitting...
//                     </>
//                   ) : (
//                     <>
//                       <Check size={20} />
//                       Submit Application
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Tips Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="mt-8 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl p-8"
//         >
//           <h3 className="text-2xl font-bold mb-4">Application Tips</h3>
//           <ul className="space-y-2">
//             <li className="flex items-start gap-2">
//               <Check className="w-5 h-5 mt-1 flex-shrink-0" />
//               <span>Make sure your CV is up-to-date and relevant to the position</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <Check className="w-5 h-5 mt-1 flex-shrink-0" />
//               <span>Write a compelling cover letter that highlights your skills</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <Check className="w-5 h-5 mt-1 flex-shrink-0" />
//               <span>Double-check all your contact information</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <Check className="w-5 h-5 mt-1 flex-shrink-0" />
//               <span>Tailor your application to match the job requirements</span>
//             </li>
//           </ul>
//         </motion.div>
//       </div>
//     </div>
//   )
// }


// 'use client'
// import React, { useState, useEffect } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { Upload, FileText, User, Mail, Phone, MapPin, Briefcase, X, Check } from 'lucide-react'
// import { doc, getDoc, addDoc, collection } from 'firebase/firestore'
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
// import { onAuthStateChanged } from 'firebase/auth'
// import { auth, db, storage } from '@/firebase/firebaseConfig'

// export default function ApplyJobPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const jobId = searchParams.get('jobId')

//   const [user, setUser] = useState(null)
//   const [jobData, setJobData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)

//   // Form states
//   const [fullName, setFullName] = useState('')
//   const [email, setEmail] = useState('')
//   const [phone, setPhone] = useState('')
//   const [location, setLocation] = useState('')
//   const [experience, setExperience] = useState('')
//   const [coverLetter, setCoverLetter] = useState('')
//   const [cvFile, setCvFile] = useState(null)
//   const [cvFileName, setCvFileName] = useState('')
//   const [uploadingCV, setUploadingCV] = useState(false)
//   const [cvUrl, setCvUrl] = useState('')

//   // Check authentication
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (currentUser) => {
//       if (!currentUser) {
//         alert('Please login to apply for jobs')
//         router.push('/login')
//       } else {
//         setUser(currentUser)
//         setEmail(currentUser.email || '')
//         setFullName(currentUser.displayName || '')
//       }
//     })
//     return () => unsub()
//   }, [router])

//   // Fetch job details
//   useEffect(() => {
//     const fetchJob = async () => {
//       if (!jobId) {
//         alert('Job ID not found')
//         router.push('/jobs')
//         return
//       }

//       try {
//         const jobDoc = await getDoc(doc(db, 'jobs', jobId))
//         if (jobDoc.exists()) {
//           setJobData({ id: jobDoc.id, ...jobDoc.data() })
//         } else {
//           alert('Job not found')
//           router.push('/jobs')
//         }
//       } catch (error) {
//         console.error('Error fetching job:', error)
//         alert('Error loading job details')
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (user) {
//       fetchJob()
//     }
//   }, [jobId, user, router])

//   // Handle CV upload
//   const handleCVUpload = async (e) => {
//     const file = e.target.files[0]
//     if (!file) return

//     // Check file type (PDF, DOC, DOCX)
//     const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
//     if (!allowedTypes.includes(file.type)) {
//       alert('Only PDF, DOC, and DOCX files are allowed!')
//       return
//     }

//     // Check file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       alert('File size should be less than 5MB!')
//       return
//     }

//     // Immediately show file (optimistic UI)
//     setCvFile(file)
//     setCvFileName(file.name)
//     setUploadingCV(true)

//     try {
//       const timestamp = Date.now()
//       const storageRef = ref(storage, `cvs/${user.uid}/${timestamp}_${file.name}`)
//       const snapshot = await uploadBytes(storageRef, file)
//       const url = await getDownloadURL(snapshot.ref)
      
//       setCvUrl(url)
//       // Don't show alert, just update quietly
//     } catch (error) {
//       console.error('Upload error:', error)
//       alert('Error uploading CV: ' + error.message)
//       // Reset on error
//       setCvFile(null)
//       setCvFileName('')
//       setCvUrl('')
//     } finally {
//       setUploadingCV(false)
//     }
//   }

//   // Remove CV
//   const removeCV = () => {
//     setCvFile(null)
//     setCvFileName('')
//     setCvUrl('')
//   }

//   // Submit application
//   const handleSubmit = async () => {
//     if (!fullName || !email || !phone || !location || !experience) {
//       alert('Please fill all required fields!')
//       return
//     }

//     if (!cvUrl) {
//       alert('Please upload your CV!')
//       return
//     }

//     setSubmitting(true)
//     try {
//       // Save application to Firestore
//       await addDoc(collection(db, 'applications'), {
//         jobId: jobId,
//         jobTitle: jobData.title,
//         companyName: jobData.companyName,
//         employerUID: jobData.employerUID,
//         applicantUID: user.uid,
//         applicantName: fullName,
//         email: email,
//         phone: phone,
//         location: location,
//         experience: experience,
//         coverLetter: coverLetter,
//         cvUrl: cvUrl,
//         cvFileName: cvFileName,
//         appliedAt: new Date().toISOString(),
//         status: 'pending'
//       })

//       alert('Application submitted successfully!')
//       router.push('/jobs')
//     } catch (error) {
//       console.error('Error submitting application:', error)
//       alert('Error submitting application: ' + error.message)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-black text-white py-8 border-b-4 border-teal-600"
//       >
//         <div className="max-w-4xl mx-auto px-6 py-20 text-center">
//           <h1 className="text-6xl font-black mb-4">Apply for Job</h1>
//           {jobData && (
//             <p className="text-xl text-gray-300">{jobData.title} at {jobData.companyName}</p>
//           )}
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="max-w-4xl mx-auto px-6 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-sm p-8"
//         >
//           <div className="space-y-6">
            
//             {/* Personal Information Section */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <User className="text-teal-600" size={28} />
//                 Personal Information
//               </h2>
              
//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
//                     placeholder="John Doe"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
//                     placeholder="john@example.com"
//                   />
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
//                     placeholder="+92 300 1234567"
//                   />
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Location *
//                   </label>
//                   <input
//                     type="text"
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
//                     placeholder="Lahore, Pakistan"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Professional Information */}
//             <div className="border-t border-gray-200 pt-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <Briefcase className="text-teal-600" size={28} />
//                 Professional Details
//               </h2>

//               {/* Experience */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Years of Experience *
//                 </label>
//                 <select
//                   value={experience}
//                   onChange={(e) => setExperience(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
//                 >
//                   <option value="">Select experience</option>
//                   <option value="0-1">0-1 years</option>
//                   <option value="1-3">1-3 years</option>
//                   <option value="3-5">3-5 years</option>
//                   <option value="5-10">5-10 years</option>
//                   <option value="10+">10+ years</option>
//                 </select>
//               </div>

//               {/* Cover Letter */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Cover Letter (Optional)
//                 </label>
//                 <textarea
//                   value={coverLetter}
//                   onChange={(e) => setCoverLetter(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 h-32 text-gray-900"
//                   placeholder="Tell us why you're a great fit for this role..."
//                 />
//               </div>
//             </div>

//             {/* CV Upload Section */}
//             <div className="border-t border-gray-200 pt-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <FileText className="text-teal-600" size={28} />
//                 Upload Your CV *
//               </h2>

//               {!cvFile ? (
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-600 transition-colors">
//                   <label className="cursor-pointer block">
//                     <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                     <p className="text-gray-700 font-medium mb-2">
//                       Click to upload your CV
//                     </p>
//                     <p className="text-sm text-gray-500 mb-4">
//                       PDF, DOC, or DOCX (Max 5MB)
//                     </p>
//                     <span className="inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
//                       Choose File
//                     </span>
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       onChange={handleCVUpload}
//                       className="hidden"
//                     />
//                   </label>
//                 </div>
//               ) : (
//                 <div className="border border-gray-300 rounded-lg p-6 flex items-center justify-between bg-teal-50 relative">
//                   {uploadingCV && (
//                     <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
//                       <div className="text-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
//                         <p className="text-sm text-gray-600">Uploading to cloud...</p>
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex items-center gap-3">
//                     <div className="bg-teal-600 p-3 rounded-lg">
//                       <FileText className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">{cvFileName}</p>
//                       <p className="text-sm text-gray-600">
//                         {(cvFile.size / 1024 / 1024).toFixed(2)} MB
//                         {uploadingCV && <span className="text-teal-600 ml-2">• Uploading...</span>}
//                         {!uploadingCV && cvUrl && <span className="text-green-600 ml-2">• Uploaded ✓</span>}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={removeCV}
//                     disabled={uploadingCV}
//                     className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               )}

//               <p className="text-xs text-gray-500 mt-3">
//                 * Accepted formats: PDF, DOC, DOCX. Maximum file size: 5MB
//               </p>
//             </div>

//             {/* Submit Button */}
//             <div className="border-t border-gray-200 pt-6">
//               <div className="flex gap-4">
//                 <button
//                   type="button"
//                   onClick={() => router.back()}
//                   className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={submitting || uploadingCV}
//                   className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {submitting ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                       Submitting...
//                     </>
//                   ) : (
//                     <>
//                       <Check size={20} />
//                       Submit Application
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Tips Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="mt-8 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl p-8"
//         >
//           <h3 className="text-2xl font-bold mb-4">Application Tips</h3>
//           <ul className="space-y-2">
//             <li className="flex items-start gap-2">
//               <Check className="w-5 h-5 mt-1 flex-shrink-0" />
//               <span>Make sure your CV is up-to-date and relevant to the position</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <Check className="w-5 h-5 mt-1 flex-shrink-0" />
//               <span>Write a compelling cover letter that highlights your skills</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <Check className="w-5 h-5 mt-1 flex-shrink-0" />
//               <span>Double-check all your contact information</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <Check className="w-5 h-5 mt-1 flex-shrink-0" />
//               <span>Tailor your application to match the job requirements</span>
//             </li>
//           </ul>
//         </motion.div>
//       </div>
//     </div>
//   )
// }




'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, FileText, User, Mail, Phone, MapPin, Briefcase, X, Check } from 'lucide-react'
import { doc, getDoc, addDoc, collection, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/firebase/firebaseConfig'

export default function ApplyJobPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')

  const [user, setUser] = useState(null)
  const [jobData, setJobData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [experience, setExperience] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [cvFile, setCvFile] = useState(null)
  const [cvFileName, setCvFileName] = useState('')
  const [uploadingCV, setUploadingCV] = useState(false)
  const [cvUrl, setCvUrl] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        alert('Please login to apply for jobs')
        router.push('/login')
      } else {
        setUser(currentUser)
        setEmail(currentUser.email || '')
        setFullName(currentUser.displayName || '')
      }
    })
    return () => unsub()
  }, [router])

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        alert('Job ID not found')
        router.push('/jobs')
        return
      }

      try {
        const jobDoc = await getDoc(doc(db, 'jobs', jobId))
        if (jobDoc.exists()) {
          setJobData({ id: jobDoc.id, ...jobDoc.data() })
        } else {
          alert('Job not found')
          router.push('/jobs')
        }
      } catch (error) {
        console.error('Error fetching job:', error)
        alert('Error loading job details')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchJob()
    }
  }, [jobId, user, router])

  const handleCVUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    console.log('File selected:', file.name, file.type, file.size)

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, DOC, and DOCX files are allowed!')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size should be less than 2MB!')
      return
    }

    setCvFile(file)
    setCvFileName(file.name)
    setUploadingCV(true)

    try {
      console.log('Converting to base64...')
      
      const reader = new FileReader()
      
      reader.onload = async (event) => {
        try {
          const base64Data = event.target.result
          
          const cvDocRef = doc(db, 'cvs', user.uid + '_' + Date.now())
          await setDoc(cvDocRef, {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            base64Data: base64Data,
            uploadedBy: user.uid,
            uploadedAt: new Date().toISOString()
          })
          
          setCvUrl(cvDocRef.id)
          setUploadingCV(false)
          alert('CV uploaded successfully!')
        } catch (error) {
          console.error('Error saving CV:', error)
          alert('Error uploading CV: ' + error.message)
          setCvFile(null)
          setCvFileName('')
          setCvUrl('')
          setUploadingCV(false)
        }
      }
      
      reader.onerror = () => {
        console.error('Error reading file')
        alert('Error reading file!')
        setCvFile(null)
        setCvFileName('')
        setCvUrl('')
        setUploadingCV(false)
      }
      
      reader.readAsDataURL(file)
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading CV: ' + error.message)
      setCvFile(null)
      setCvFileName('')
      setCvUrl('')
      setUploadingCV(false)
    }
  }

  const removeCV = () => {
    setCvFile(null)
    setCvFileName('')
    setCvUrl('')
  }

  const handleSubmit = async () => {
    if (!fullName || !email || !phone || !location || !experience) {
      alert('Please fill all required fields!')
      return
    }

    if (!cvFile) {
      alert('Please upload your CV!')
      return
    }

    if (uploadingCV) {
      alert('Please wait for CV upload to complete!')
      return
    }

    if (!cvUrl) {
      alert('CV upload failed. Please try again!')
      return
    }

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'applications'), {
        jobId: jobId,
        jobTitle: jobData.title,
        companyName: jobData.companyName,
        employerUID: jobData.employerUID,
        applicantUID: user.uid,
        applicantName: fullName,
        email: email,
        phone: phone,
        location: location,
        experience: experience,
        coverLetter: coverLetter,
        cvUrl: cvUrl,
        cvFileName: cvFileName,
        appliedAt: new Date().toISOString(),
        status: 'pending'
      })

      alert('Application submitted successfully!')
      router.push('/jobs')
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Error submitting application: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black text-white py-8 border-b-4 border-teal-600"
      >
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-6xl font-black mb-4">Apply for Job</h1>
          {jobData && (
            <p className="text-xl text-gray-300">{jobData.title} at {jobData.companyName}</p>
          )}
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          <div className="space-y-6">
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="text-teal-600" size={28} />
                Personal Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
                    placeholder="Lahore, Pakistan"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="text-teal-600" size={28} />
                Professional Details
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-900"
                >
                  <option value="">Select experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 h-32 text-gray-900"
                  placeholder="Tell us why you're a great fit for this role..."
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="text-teal-600" size={28} />
                Upload Your CV *
              </h2>

              {!cvFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-600 transition-colors">
                  <label className="cursor-pointer block">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium mb-2">
                      Click to upload your CV
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      PDF, DOC, or DOCX (Max 2MB)
                    </p>
                    <span className="inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                      Choose File
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-6 flex items-center justify-between bg-teal-50 relative">
                  {uploadingCV && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Uploading to cloud...</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-600 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{cvFileName}</p>
                      <p className="text-sm text-gray-600">
                        {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                        {uploadingCV && <span className="text-teal-600 ml-2">• Uploading...</span>}
                        {!uploadingCV && cvUrl && <span className="text-green-600 ml-2">• Uploaded ✓</span>}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCV}
                    disabled={uploadingCV}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3">
                * Accepted formats: PDF, DOC, DOCX. Maximum file size: 2MB
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || uploadingCV}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold mb-4">Application Tips</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 mt-1 flex-shrink-0" />
              <span>Make sure your CV is up-to-date and relevant to the position</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 mt-1 flex-shrink-0" />
              <span>Write a compelling cover letter that highlights your skills</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 mt-1 flex-shrink-0" />
              <span>Double-check all your contact information</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 mt-1 flex-shrink-0" />
              <span>Tailor your application to match the job requirements</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}