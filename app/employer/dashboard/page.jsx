// "use client";

// import React, { useEffect, useState } from "react";
// import { signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
// import { auth, db, storage } from "@/firebase/firebaseConfig";
// import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { useRouter } from "next/navigation";
// import { Building2, MapPin, DollarSign, Tag, Briefcase, Mail, User, Upload, X } from "lucide-react";

// export default function EmployerDashboard() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [jobs, setJobs] = useState([]);
//   const [activeTab, setActiveTab] = useState("jobs");
//   const [companyInfo, setCompanyInfo] = useState({
//     name: "",
//     logo: "",
//     description: "",
//     location: ""
//   });

//   // Profile states
//   const [profileName, setProfileName] = useState("");
//   const [profileEmail, setProfileEmail] = useState("");
//   const [profileImage, setProfileImage] = useState("");
//   const [uploadingProfile, setUploadingProfile] = useState(false);

//   // Job posting states
//   const [showJobForm, setShowJobForm] = useState(false);
//   const [jobTitle, setJobTitle] = useState("");
//   const [jobDescription, setJobDescription] = useState("");
//   const [jobLocation, setJobLocation] = useState("");
//   const [jobSalary, setJobSalary] = useState("");
//   const [jobTags, setJobTags] = useState("");
//   const [jobType, setJobType] = useState("Full-time");

//   // Company form states
//   const [editingCompany, setEditingCompany] = useState(false);
//   const [uploadingLogo, setUploadingLogo] = useState(false);

//   /* ---------------- AUTH ---------------- */
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (currentUser) => {
//       if (!currentUser) {
//         router.push("/login");
//       } else {
//         setUser(currentUser);
//         setProfileName(currentUser.displayName || "");
//         setProfileEmail(currentUser.email || "");
//         setProfileImage(currentUser.photoURL || "");
//         fetchJobs(currentUser.uid);
//         fetchCompanyInfo(currentUser.uid);
//       }
//     });
//     return () => unsub();
//   }, []);

//   /* ---------------- FETCH COMPANY INFO ---------------- */
//   const fetchCompanyInfo = async (uid) => {
//     try {
//       const docRef = doc(db, "companies", uid);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setCompanyInfo(docSnap.data());
//       }
//     } catch (error) {
//       console.error("Error fetching company info:", error);
//     }
//   };

//   /* ---------------- FETCH JOBS ---------------- */
//   const fetchJobs = async (uid) => {
//     try {
//       const q = query(
//         collection(db, "jobs"),
//         where("employerUID", "==", uid)
//       );
//       const snap = await getDocs(q);
//       const list = snap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setJobs(list);
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     }
//   };

//   /* ---------------- UPDATE PROFILE ---------------- */
//   const handleUpdateProfile = async () => {
//     try {
//       await updateProfile(auth.currentUser, {
//         displayName: profileName,
//         photoURL: profileImage
//       });
//       alert("Profile updated successfully!");
//     } catch (error) {
//       alert("Error updating profile: " + error.message);
//     }
//   };

//   /* ---------------- UPLOAD PROFILE IMAGE ---------------- */
//   const handleProfileImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Check file type
//     const fileType = file.type.toLowerCase();
//     if (fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
//       alert("Only PNG and JPG images are allowed!");
//       return;
//     }

//     setUploadingProfile(true);
//     try {
//       const timestamp = Date.now();
//       const storageRef = ref(storage, `profiles/${user.uid}/${timestamp}_${file.name}`);
//       const snapshot = await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(snapshot.ref);
//       setProfileImage(url);
//       alert("Profile image uploaded successfully!");
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Error uploading image: " + error.message);
//     } finally {
//       setUploadingProfile(false);
//     }
//   };

//   /* ---------------- UPLOAD COMPANY LOGO ---------------- */
//   const handleLogoUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const fileType = file.type.toLowerCase();
//     if (fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
//       alert("Only PNG and JPG images are allowed!");
//       return;
//     }

//     setUploadingLogo(true);
//     try {
//       const timestamp = Date.now();
//       const storageRef = ref(storage, `logos/${user.uid}/${timestamp}_${file.name}`);
//       const snapshot = await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(snapshot.ref);
//       setCompanyInfo({ ...companyInfo, logo: url });
//       alert("Logo uploaded successfully!");
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Error uploading logo: " + error.message);
//     } finally {
//       setUploadingLogo(false);
//     }
//   };

//   /* ---------------- SAVE COMPANY INFO ---------------- */
//   const handleSaveCompanyInfo = async () => {
//     if (!companyInfo.name) {
//       alert("Company name is required!");
//       return;
//     }

//     try {
//       const docRef = doc(db, "companies", user.uid);
//       await setDoc(docRef, companyInfo);
//       setEditingCompany(false);
//       alert("Company information saved!");
//     } catch (error) {
//       alert("Error saving company info: " + error.message);
//     }
//   };

//   /* ---------------- POST JOB ---------------- */
//   const handlePostJob = async () => {
//     if (!jobTitle || !jobDescription || !jobLocation || !jobSalary) {
//       alert("Please fill all required fields!");
//       return;
//     }

//     if (!companyInfo.name) {
//       alert("Please set up your company information first!");
//       setActiveTab("company");
//       return;
//     }

//     try {
//       await addDoc(collection(db, "jobs"), {
//         title: jobTitle,
//         description: jobDescription,
//         location: jobLocation,
//         salary: jobSalary,
//         tags: jobTags.split(",").map(t => t.trim()).filter(t => t),
//         jobType: jobType,
//         employerUID: user.uid,
//         companyName: companyInfo.name,
//         companyLogo: companyInfo.logo,
//         postedAt: new Date().toISOString()
//       });

//       // Reset form
//       setJobTitle("");
//       setJobDescription("");
//       setJobLocation("");
//       setJobSalary("");
//       setJobTags("");
//       setJobType("Full-time");
//       setShowJobForm(false);

//       // Refresh jobs
//       await fetchJobs(user.uid);
//       alert("Job posted successfully!");
//     } catch (error) {
//       alert("Error posting job: " + error.message);
//     }
//   };

//   /* ---------------- LOGOUT ---------------- */
//   const handleLogout = async () => {
//     await signOut(auth);
//     router.push("/login");
//   };

//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      
//       {/* =============== SIDEBAR =============== */}
//       <aside className="w-72 border-r border-gray-700/50 bg-black/20 backdrop-blur-sm p-6 flex flex-col h-screen sticky top-0">
//         <div>
//           <div className="flex items-center gap-3 mb-8">
//             <Building2 className="text-[#309689]" size={32} />
//             <h2 className="text-2xl font-bold text-[#309689]">
//               Employer Panel
//             </h2>
//           </div>

//           <nav className="space-y-2">
//             <button
//               onClick={() => setActiveTab("profile")}
//               className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all
//               ${activeTab === "profile"
//                 ? "bg-[#309689] text-white shadow-lg"
//                 : "hover:bg-white/5"}`}
//             >
//               <User size={20} />
//               Profile
//             </button>

//             <button
//               onClick={() => setActiveTab("company")}
//               className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all
//               ${activeTab === "company"
//                 ? "bg-[#309689] text-white shadow-lg"
//                 : "hover:bg-white/5"}`}
//             >
//               <Building2 size={20} />
//               Company Info
//             </button>

//             <button
//               onClick={() => setActiveTab("jobs")}
//               className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all
//               ${activeTab === "jobs"
//                 ? "bg-[#309689] text-white shadow-lg"
//                 : "hover:bg-white/5"}`}
//             >
//               <Briefcase size={20} />
//               Job Posts
//             </button>
//           </nav>
//         </div>

//         <button
//           onClick={handleLogout}
//           className="w-full mt-auto px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
//         >
//           Logout
//         </button>
//       </aside>

//       {/* =============== MAIN CONTENT =============== */}
//       <main className="flex-1 overflow-y-auto">
//         <div className="p-8 max-w-7xl mx-auto">

//           {/* =============== PROFILE TAB =============== */}
//           {activeTab === "profile" && (
//             <div>
//               <h1 className="text-4xl font-bold text-[#309689] mb-8">
//                 Profile Settings
//               </h1>

//               <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl max-w-2xl">
//                 {/* Profile Image */}
//                 <div className="flex flex-col items-center mb-8">
//                   <div className="relative">
//                     {profileImage ? (
//                       <img 
//                         src={profileImage} 
//                         alt="Profile" 
//                         className="w-32 h-32 rounded-full object-cover border-4 border-[#309689]"
//                       />
//                     ) : (
//                       <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-[#309689]">
//                         <User size={48} className="text-gray-400" />
//                       </div>
//                     )}
//                     <label className="absolute bottom-0 right-0 bg-[#309689] p-2 rounded-full cursor-pointer hover:bg-[#267d72] transition-colors">
//                       <Upload size={16} />
//                       <input 
//                         type="file" 
//                         accept="image/png,image/jpeg,image/jpg"
//                         className="hidden" 
//                         onChange={handleProfileImageUpload}
//                         disabled={uploadingProfile}
//                       />
//                     </label>
//                   </div>
//                   {uploadingProfile && <p className="mt-2 text-sm text-yellow-400">Uploading...</p>}
//                   <p className="mt-2 text-xs text-gray-400">Click the icon to upload (PNG/JPG only)</p>
//                 </div>

//                 {/* Name Field */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium mb-2 flex items-center gap-2">
//                     <User size={18} />
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     value={profileName}
//                     onChange={(e) => setProfileName(e.target.value)}
//                     className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none"
//                     placeholder="Enter your name"
//                   />
//                 </div>

//                 {/* Email Field */}
//                 <div className="mb-8">
//                   <label className="block text-sm font-medium mb-2 flex items-center gap-2">
//                     <Mail size={18} />
//                     Email (Read-only)
//                   </label>
//                   <input
//                     type="email"
//                     value={profileEmail}
//                     disabled
//                     className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg opacity-60"
//                   />
//                 </div>

//                 <button
//                   onClick={handleUpdateProfile}
//                   className="w-full px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg font-medium transition-colors"
//                 >
//                   Update Profile
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* =============== COMPANY INFO TAB =============== */}
//           {activeTab === "company" && (
//             <div>
//               <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-4xl font-bold text-[#309689]">
//                   Company Information
//                 </h1>
//                 {!editingCompany && companyInfo.name && (
//                   <button
//                     onClick={() => setEditingCompany(true)}
//                     className="px-6 py-2 bg-[#309689] hover:bg-[#267d72] rounded-lg transition-colors"
//                   >
//                     Edit Company Info
//                   </button>
//                 )}
//               </div>

//               <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl max-w-3xl">
//                 {editingCompany || !companyInfo.name ? (
//                   <div>
//                     {/* Company Logo */}
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium mb-3">Company Logo (PNG/JPG only)</label>
//                       <div className="flex items-center gap-4">
//                         {companyInfo.logo && (
//                           <img 
//                             src={companyInfo.logo} 
//                             alt="Logo" 
//                             className="w-20 h-20 rounded-lg object-cover border-2 border-[#309689]"
//                           />
//                         )}
//                         <label className="px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg cursor-pointer transition-colors inline-block">
//                           {uploadingLogo ? "Uploading..." : companyInfo.logo ? "Change Logo" : "Upload Logo"}
//                           <input 
//                             type="file" 
//                             accept="image/png,image/jpeg,image/jpg"
//                             className="hidden" 
//                             onChange={handleLogoUpload}
//                             disabled={uploadingLogo}
//                           />
//                         </label>
//                       </div>
//                     </div>

//                     {/* Company Name */}
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium mb-2">Company Name *</label>
//                       <input
//                         type="text"
//                         value={companyInfo.name}
//                         onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
//                         className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none"
//                         placeholder="Enter company name"
//                       />
//                     </div>

//                     {/* Location */}
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium mb-2">Location</label>
//                       <input
//                         type="text"
//                         value={companyInfo.location}
//                         onChange={(e) => setCompanyInfo({...companyInfo, location: e.target.value})}
//                         className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none"
//                         placeholder="City, Country"
//                       />
//                     </div>

//                     {/* Description */}
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium mb-2">Description</label>
//                       <textarea
//                         value={companyInfo.description}
//                         onChange={(e) => setCompanyInfo({...companyInfo, description: e.target.value})}
//                         className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none h-32"
//                         placeholder="Tell us about your company..."
//                       />
//                     </div>

//                     <div className="flex gap-3">
//                       <button
//                         onClick={handleSaveCompanyInfo}
//                         className="flex-1 px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg transition-colors"
//                       >
//                         Save Changes
//                       </button>
//                       {companyInfo.name && (
//                         <button
//                           onClick={() => setEditingCompany(false)}
//                           className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
//                         >
//                           Cancel
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div>
//                     {companyInfo.logo && (
//                       <img 
//                         src={companyInfo.logo} 
//                         alt="Logo" 
//                         className="w-24 h-24 rounded-lg object-cover mb-6 border-2 border-[#309689]"
//                       />
//                     )}
//                     <h2 className="text-2xl font-bold mb-2">{companyInfo.name}</h2>
//                     {companyInfo.location && (
//                       <p className="text-gray-400 mb-4 flex items-center gap-2">
//                         <MapPin size={16} />
//                         {companyInfo.location}
//                       </p>
//                     )}
//                     {companyInfo.description && (
//                       <p className="text-gray-300">{companyInfo.description}</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* =============== JOB POSTS TAB =============== */}
//           {activeTab === "jobs" && (
//             <div>
//               <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-4xl font-bold text-[#309689]">
//                   Job Posts
//                 </h1>

//                 <button
//                   onClick={() => setShowJobForm(!showJobForm)}
//                   className="px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg font-medium transition-colors flex items-center gap-2"
//                 >
//                   {showJobForm ? <><X size={20} /> Cancel</> : <><Upload size={20} /> Post New Job</>}
//                 </button>
//               </div>

//               {/* Job Posting Form */}
//               {showJobForm && (
//                 <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl mb-8">
//                   <h2 className="text-2xl font-bold mb-6">Create New Job Post</h2>
                  
//                   <div className="grid md:grid-cols-2 gap-6 mb-6">
//                     {/* Job Title */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Job Title *</label>
//                       <input
//                         type="text"
//                         value={jobTitle}
//                         onChange={(e) => setJobTitle(e.target.value)}
//                         className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none"
//                         placeholder="e.g. Senior Developer"
//                       />
//                     </div>

//                     {/* Job Type */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Job Type</label>
//                       <select
//                         value={jobType}
//                         onChange={(e) => setJobType(e.target.value)}
//                         className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none"
//                       >
//                         <option value="Full-time">Full-time</option>
//                         <option value="Part-time">Part-time</option>
//                         <option value="Contract">Contract</option>
//                         <option value="Internship">Internship</option>
//                         <option value="Remote">Remote</option>
//                       </select>
//                     </div>

//                     {/* Location */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Location *</label>
//                       <input
//                         type="text"
//                         value={jobLocation}
//                         onChange={(e) => setJobLocation(e.target.value)}
//                         className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none"
//                         placeholder="City, Country"
//                       />
//                     </div>

//                     {/* Salary */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Salary Range *</label>
//                       <input
//                         type="text"
//                         value={jobSalary}
//                         onChange={(e) => setJobSalary(e.target.value)}
//                         className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none"
//                         placeholder="e.g. $50,000 - $70,000"
//                       />
//                     </div>
//                   </div>

//                   {/* Tags */}
//                   <div className="mb-6">
//                     <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
//                     <input
//                       type="text"
//                       value={jobTags}
//                       onChange={(e) => setJobTags(e.target.value)}
//                       className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none"
//                       placeholder="React, JavaScript, Remote"
//                     />
//                   </div>

//                   {/* Description */}
//                   <div className="mb-6">
//                     <label className="block text-sm font-medium mb-2">Job Description *</label>
//                     <textarea
//                       value={jobDescription}
//                       onChange={(e) => setJobDescription(e.target.value)}
//                       className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none h-40"
//                       placeholder="Describe the role, responsibilities, requirements..."
//                     />
//                   </div>

//                   <button
//                     onClick={handlePostJob}
//                     className="w-full px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg font-medium transition-colors"
//                   >
//                     Post Job
//                   </button>
//                 </div>
//               )}

//               {/* Jobs List */}
//               {jobs.length === 0 ? (
//                 <div className="text-center py-16 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
//                   <Briefcase size={48} className="mx-auto mb-4 text-gray-500" />
//                   <p className="text-gray-300 text-lg">
//                     No jobs posted yet. Create your first job post!
//                   </p>
//                 </div>
//               ) : (
//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {jobs.map((job) => (
//                     <div
//                       key={job.id}
//                       className="bg-white/5 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl hover:border-[#309689] transition-all"
//                     >
//                       {/* Company Logo & Name */}
//                       <div className="flex items-center gap-3 mb-4">
//                         {job.companyLogo ? (
//                           <img 
//                             src={job.companyLogo} 
//                             alt={job.companyName}
//                             className="w-12 h-12 rounded-lg object-cover"
//                           />
//                         ) : (
//                           <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
//                             <Building2 size={24} className="text-gray-400" />
//                           </div>
//                         )}
//                         <div>
//                           <h3 className="text-xl font-bold">{job.title}</h3>
//                           <p className="text-sm text-gray-400">{job.companyName || "No Company"}</p>
//                         </div>
//                       </div>

//                       <div className="space-y-2 mb-4">
//                         <p className="text-gray-400 text-sm flex items-center gap-2">
//                           <MapPin size={14} />
//                           {job.location}
//                         </p>
//                         <p className="text-gray-400 text-sm flex items-center gap-2">
//                           <DollarSign size={14} />
//                           {job.salary}
//                         </p>
//                         <p className="text-gray-400 text-sm flex items-center gap-2">
//                           <Briefcase size={14} />
//                           {job.jobType}
//                         </p>
//                       </div>

//                       {/* Tags */}
//                       {job.tags && job.tags.length > 0 && (
//                         <div className="flex flex-wrap gap-2 mb-4">
//                           {job.tags.map((tag, idx) => (
//                             <span 
//                               key={idx}
//                               className="px-3 py-1 bg-[#309689]/20 text-[#309689] text-xs rounded-full border border-[#309689]/30"
//                             >
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                       )}

//                       <div className="flex gap-2 mt-4">
//                         <button
//                           onClick={() => router.push(`/employer/edit-job/${job.id}`)}
//                           className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-medium transition-colors"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => router.push(`/employer/applicants/${job.id}`)}
//                           className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
//                         >
//                           Applicants
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// }



// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   signOut,
//   onAuthStateChanged,
//   updateProfile,
// } from "firebase/auth";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
//   doc,
//   getDoc,
//   setDoc,
// } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { auth, db, storage } from "@/firebase/firebaseConfig";
// import { useRouter } from "next/navigation";
// import {
//   User,
//   Briefcase,
//   Building2,
//   Upload,
//   MapPin,
//   DollarSign,
//   X,
//   Tag,
// } from "lucide-react";

// export default function EmployerDashboard() {
//   const router = useRouter();

//   /* ================= AUTH ================= */
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       if (!u) router.push("/login");
//       else {
//         setUser(u);
//         setName(u.displayName || "");
//         setPhoto(u.photoURL || "");
//       }
//     });
//     return () => unsub();
//   }, []);

//   /* ================= SIDEBAR ================= */
//   const [activeTab, setActiveTab] = useState("jobs");

//   /* ================= PROFILE ================= */
//   const [name, setName] = useState("");
//   const [photo, setPhoto] = useState("");
//   const [uploadingPhoto, setUploadingPhoto] = useState(false);

//   /* ================= COMPANY ================= */
//   const [company, setCompany] = useState({
//     companyName: "",
//     companyDescription: "",
//     companyLogoUrl: "",
//     location: "",
//   });
//   const [uploadingLogo, setUploadingLogo] = useState(false);

//   /* ================= JOB ================= */
//   const [showForm, setShowForm] = useState(false);
//   const [jobs, setJobs] = useState([]);

//   const [job, setJob] = useState({
//     title: "",
//     description: "",
//     location: "",
//     salary: "",
//     jobType: "Full-time",
//     tags: "",
//   });

//   /* ================= LOAD DATA ================= */
//   useEffect(() => {
//     if (!user) return;
//     fetchCompany();
//     fetchJobs();
//   }, [user]);

//   const fetchCompany = async () => {
//     try {
//       const snap = await getDoc(doc(db, "employers", user.uid));
//       if (snap.exists()) {
//         setCompany(snap.data());
//       }
//     } catch (error) {
//       console.error("Error fetching company:", error);
//     }
//   };

//   const fetchJobs = async () => {
//     try {
//       const q = query(
//         collection(db, "jobs"),
//         where("employerUID", "==", user.uid)
//       );
//       const snap = await getDocs(q);
//       setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     }
//   };

//   /* ================= UPLOAD PHOTO ================= */
//   const uploadPhoto = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const fileType = file.type.toLowerCase();
//     if (
//       fileType !== "image/png" &&
//       fileType !== "image/jpeg" &&
//       fileType !== "image/jpg"
//     ) {
//       alert("Only PNG and JPG images are allowed!");
//       return;
//     }

//     setUploadingPhoto(true);
//     try {
//       const timestamp = Date.now();
//       const storageRef = ref(
//         storage,
//         `profiles/${user.uid}/${timestamp}_${file.name}`
//       );
//       const snapshot = await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(snapshot.ref);
//       setPhoto(url);
//       alert("Photo uploaded!");
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Error uploading: " + error.message);
//     } finally {
//       setUploadingPhoto(false);
//     }
//   };

//   /* ================= UPLOAD LOGO ================= */
//   const uploadLogo = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const fileType = file.type.toLowerCase();
//     if (
//       fileType !== "image/png" &&
//       fileType !== "image/jpeg" &&
//       fileType !== "image/jpg"
//     ) {
//       alert("Only PNG and JPG images are allowed!");
//       return;
//     }

//     setUploadingLogo(true);
//     try {
//       const timestamp = Date.now();
//       const storageRef = ref(
//         storage,
//         `logos/${user.uid}/${timestamp}_${file.name}`
//       );
//       const snapshot = await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(snapshot.ref);
//       setCompany((prev) => ({ ...prev, companyLogoUrl: url }));
//       alert("Logo uploaded!");
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Error uploading: " + error.message);
//     } finally {
//       setUploadingLogo(false);
//     }
//   };

//   /* ================= PROFILE UPDATE ================= */
//   const saveProfile = async () => {
//     try {
//       await updateProfile(auth.currentUser, {
//         displayName: name,
//         photoURL: photo,
//       });
//       alert("Profile updated!");
//     } catch (error) {
//       alert("Error: " + error.message);
//     }
//   };

//   /* ================= COMPANY SAVE ================= */
//   const saveCompany = async () => {
//     if (!company.companyName.trim()) {
//       alert("Company name is required!");
//       return;
//     }

//     try {
//       await setDoc(doc(db, "employers", user.uid), {
//         ...company,
//         email: user.email,
//         employerUID: user.uid,
//       });
//       alert("Company saved!");
//     } catch (error) {
//       alert("Error: " + error.message);
//     }
//   };

//   /* ================= JOB POST ================= */
//   const postJob = async () => {
//     if (!job.title.trim() || !job.description.trim() || !job.location.trim() || !job.salary.trim()) {
//       alert("Please fill all required fields!");
//       return;
//     }

//     if (!company.companyName) {
//       alert("Please set up company info first!");
//       setActiveTab("company");
//       return;
//     }

//     try {
//       await addDoc(collection(db, "jobs"), {
//         title: job.title,
//         description: job.description,
//         location: job.location,
//         salary: job.salary,
//         jobType: job.jobType,
//         tags: job.tags
//           .split(",")
//           .map((t) => t.trim())
//           .filter((t) => t),
//         employerUID: user.uid,
//         companyName: company.companyName,
//         companyLogo: company.companyLogoUrl,
//         postedAt: new Date().toISOString(),
//       });

//       setJob({
//         title: "",
//         description: "",
//         location: "",
//         salary: "",
//         jobType: "Full-time",
//         tags: "",
//       });
//       setShowForm(false);
//       await fetchJobs();
//       alert("Job posted successfully!");
//     } catch (error) {
//       alert("Error: " + error.message);
//     }
//   };

//   /* ================= LOGOUT ================= */
//   const logout = async () => {
//     await signOut(auth);
//     router.push("/login");
//   };

//   if (!user) return null;

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20">
//       {/* ================= SIDEBAR ================= */}
//       <aside className="w-72 bg-black/20 backdrop-blur-sm border-r border-gray-700/50 p-6 flex flex-col fixed left-0 top-20 bottom-0 overflow-y-auto">
//         <div className="flex items-center gap-3 mb-8">
//           <Building2 className="text-[#309689]" size={32} />
//           <h2 className="text-2xl font-bold text-[#309689]">Employer Panel</h2>
//         </div>

//         <nav className="space-y-2 flex-1">
//           <button
//             onClick={() => setActiveTab("profile")}
//             className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
//               activeTab === "profile"
//                 ? "bg-[#309689] text-white shadow-lg"
//                 : "hover:bg-white/5"
//             }`}
//           >
//             <User size={20} /> Profile
//           </button>

//           <button
//             onClick={() => setActiveTab("company")}
//             className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
//               activeTab === "company"
//                 ? "bg-[#309689] text-white shadow-lg"
//                 : "hover:bg-white/5"
//             }`}
//           >
//             <Building2 size={20} /> Company Info
//           </button>

//           <button
//             onClick={() => setActiveTab("jobs")}
//             className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
//               activeTab === "jobs"
//                 ? "bg-[#309689] text-white shadow-lg"
//                 : "hover:bg-white/5"
//             }`}
//           >
//             <Briefcase size={20} /> Job Posts
//           </button>
//         </nav>

//         <button
//           onClick={logout}
//           className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors mt-4"
//         >
//           Logout
//         </button>
//       </aside>

//       {/* ================= MAIN ================= */}
//       <main className="flex-1 ml-72 overflow-y-auto">
//         <div className="p-8 max-w-7xl mx-auto">
//           {/* ============ PROFILE ============ */}
//           {activeTab === "profile" && (
//             <div>
//               <h1 className="text-4xl font-bold text-[#309689] mb-8">
//                 Profile Settings
//               </h1>

//               <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl max-w-2xl">
//                 {/* Profile Photo */}
//                 <div className="flex flex-col items-center mb-8">
//                   <div className="relative">
//                     {photo ? (
//                       <img
//                         src={photo}
//                         alt="Profile"
//                         className="w-32 h-32 rounded-full object-cover border-4 border-[#309689]"
//                       />
//                     ) : (
//                       <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-[#309689]">
//                         <User size={48} className="text-gray-400" />
//                       </div>
//                     )}
//                     <label className="absolute bottom-0 right-0 bg-[#309689] p-2 rounded-full cursor-pointer hover:bg-[#267d72] transition-colors">
//                       <Upload size={16} />
//                       <input
//                         type="file"
//                         accept="image/png,image/jpeg,image/jpg"
//                         className="hidden"
//                         onChange={uploadPhoto}
//                         disabled={uploadingPhoto}
//                       />
//                     </label>
//                   </div>
//                   {uploadingPhoto && (
//                     <p className="mt-2 text-sm text-yellow-400">Uploading...</p>
//                   )}
//                   <p className="mt-2 text-xs text-gray-400">
//                     Click icon to upload (PNG/JPG only)
//                   </p>
//                 </div>

//                 {/* Name */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium mb-2">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="Enter your name"
//                     className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div className="mb-8">
//                   <label className="block text-sm font-medium mb-2">
//                     Email (Read-only)
//                   </label>
//                   <input
//                     type="email"
//                     value={user?.email || ""}
//                     disabled
//                     className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg opacity-60 text-white"
//                   />
//                 </div>

//                 <button
//                   onClick={saveProfile}
//                   className="w-full px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg font-medium transition-colors"
//                 >
//                   Update Profile
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* ============ COMPANY ============ */}
//           {activeTab === "company" && (
//             <div>
//               <h1 className="text-4xl font-bold text-[#309689] mb-8">
//                 Company Information
//               </h1>

//               <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl max-w-3xl">
//                 {/* Company Logo */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium mb-3">
//                     Company Logo (PNG/JPG only)
//                   </label>
//                   <div className="flex items-center gap-4">
//                     {company.companyLogoUrl && (
//                       <img
//                         src={company.companyLogoUrl}
//                         alt="Logo"
//                         className="w-20 h-20 rounded-lg object-cover border-2 border-[#309689]"
//                       />
//                     )}
//                     <label className="px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg cursor-pointer transition-colors inline-block">
//                       {uploadingLogo
//                         ? "Uploading..."
//                         : company.companyLogoUrl
//                         ? "Change Logo"
//                         : "Upload Logo"}
//                       <input
//                         type="file"
//                         accept="image/png,image/jpeg,image/jpg"
//                         className="hidden"
//                         onChange={uploadLogo}
//                         disabled={uploadingLogo}
//                       />
//                     </label>
//                   </div>
//                 </div>

//                 {/* Company Name */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium mb-2">
//                     Company Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={company.companyName}
//                     onChange={(e) =>
//                       setCompany((prev) => ({ ...prev, companyName: e.target.value }))
//                     }
//                     placeholder="Enter company name"
//                     className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
//                   />
//                 </div>

//                 {/* Location */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium mb-2">
//                     Location
//                   </label>
//                   <input
//                     type="text"
//                     value={company.location}
//                     onChange={(e) =>
//                       setCompany((prev) => ({ ...prev, location: e.target.value }))
//                     }
//                     placeholder="City, Country"
//                     className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
//                   />
//                 </div>

//                 {/* Description */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     value={company.companyDescription}
//                     onChange={(e) =>
//                       setCompany((prev) => ({
//                         ...prev,
//                         companyDescription: e.target.value,
//                       }))
//                     }
//                     placeholder="Tell us about your company..."
//                     className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none h-32 text-white"
//                   />
//                 </div>

//                 <button
//                   onClick={saveCompany}
//                   className="w-full px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg transition-colors"
//                 >
//                   Save Company
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* ============ JOBS ============ */}
//           {activeTab === "jobs" && (
//             <div>
//               <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-4xl font-bold text-[#309689]">
//                   Job Posts
//                 </h1>

//                 <button
//                   onClick={() => setShowForm(!showForm)}
//                   className="px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg font-medium transition-colors flex items-center gap-2"
//                 >
//                   {showForm ? (
//                     <>
//                       <X size={20} /> Cancel
//                     </>
//                   ) : (
//                     <>
//                       <Upload size={20} /> Post New Job
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* JOB FORM */}
//               {showForm && (
//                 <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl mb-8">
//                   <h2 className="text-2xl font-bold mb-6">
//                     Create New Job Post
//                   </h2>

//                   <div className="grid md:grid-cols-2 gap-6 mb-6">
//                     {/* Job Title */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Job Title *
//                       </label>
//                       <input
//                         type="text"
//                         value={job.title}
//                         onChange={(e) =>
//                           setJob((prev) => ({ ...prev, title: e.target.value }))
//                         }
//                         placeholder="e.g. Senior Developer"
//                         className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
//                       />
//                     </div>

//                     {/* Job Type */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Job Type
//                       </label>
//                       <select
//                         value={job.jobType}
//                         onChange={(e) =>
//                           setJob((prev) => ({ ...prev, jobType: e.target.value }))
//                         }
//                         className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
//                       >
//                         <option value="Full-time">Full-time</option>
//                         <option value="Part-time">Part-time</option>
//                         <option value="Contract">Contract</option>
//                         <option value="Internship">Internship</option>
//                         <option value="Remote">Remote</option>
//                       </select>
//                     </div>

//                     {/* Location */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Location *
//                       </label>
//                       <input
//                         type="text"
//                         value={job.location}
//                         onChange={(e) =>
//                           setJob((prev) => ({ ...prev, location: e.target.value }))
//                         }
//                         placeholder="City, Country"
//                         className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
//                       />
//                     </div>

//                     {/* Salary */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Salary Range *
//                       </label>
//                       <input
//                         type="text"
//                         value={job.salary}
//                         onChange={(e) =>
//                           setJob((prev) => ({ ...prev, salary: e.target.value }))
//                         }
//                         placeholder="e.g. $50,000 - $70,000"
//                         className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
//                       />
//                     </div>
//                   </div>

//                   {/* Tags */}
//                   <div className="mb-6">
//                     <label className="block text-sm font-medium mb-2">
//                       Tags (comma separated)
//                     </label>
//                     <input
//                       type="text"
//                       value={job.tags}
//                       onChange={(e) =>
//                         setJob((prev) => ({ ...prev, tags: e.target.value }))
//                       }
//                       placeholder="React, JavaScript, Remote"
//                       className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
//                     />
//                   </div>

//                   {/* Description */}
//                   <div className="mb-6">
//                     <label className="block text-sm font-medium mb-2">
//                       Job Description *
//                     </label>
//                     <textarea
//                       value={job.description}
//                       onChange={(e) =>
//                         setJob((prev) => ({ ...prev, description: e.target.value }))
//                       }
//                       placeholder="Describe the role, responsibilities, requirements..."
//                       className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none h-40 text-white"
//                     />
//                   </div>

//                   <button
//                     onClick={postJob}
//                     className="w-full px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg font-medium transition-colors"
//                   >
//                     Post Job
//                   </button>
//                 </div>
//               )}

//               {/* JOB LIST */}
//               {jobs.length === 0 ? (
//                 <div className="text-center py-16 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
//                   <Briefcase size={48} className="mx-auto mb-4 text-gray-500" />
//                   <p className="text-gray-300 text-lg">
//                     No jobs posted yet. Create your first job post!
//                   </p>
//                 </div>
//               ) : (
//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {jobs.map((j) => (
//                     <div
//                       key={j.id}
//                       className="bg-white/5 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl hover:border-[#309689] transition-all"
//                     >
//                       {/* Company Logo & Name */}
//                       <div className="flex items-center gap-3 mb-4">
//                         {j.companyLogo ? (
//                           <img
//                             src={j.companyLogo}
//                             alt={j.companyName}
//                             className="w-12 h-12 rounded-lg object-cover"
//                           />
//                         ) : (
//                           <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
//                             <Building2 size={24} className="text-gray-400" />
//                           </div>
//                         )}
//                         <div>
//                           <h3 className="text-xl font-bold">{j.title}</h3>
//                           <p className="text-sm text-gray-400">
//                             {j.companyName || "No Company"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="space-y-2 mb-4">
//                         {j.location && (
//                           <p className="text-gray-400 text-sm flex items-center gap-2">
//                             <MapPin size={14} />
//                             {j.location}
//                           </p>
//                         )}
//                         {j.salary && (
//                           <p className="text-gray-400 text-sm flex items-center gap-2">
//                             <DollarSign size={14} />
//                             {j.salary}
//                           </p>
//                         )}
//                         {j.jobType && (
//                           <p className="text-gray-400 text-sm flex items-center gap-2">
//                             <Briefcase size={14} />
//                             {j.jobType}
//                           </p>
//                         )}
//                       </div>

//                       {/* Tags */}
//                       {j.tags && j.tags.length > 0 && (
//                         <div className="flex flex-wrap gap-2 mb-4">
//                           {j.tags.map((tag, idx) => (
//                             <span
//                               key={idx}
//                               className="px-3 py-1 bg-[#309689]/20 text-[#309689] text-xs rounded-full border border-[#309689]/30"
//                             >
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                       )}

//                       <div className="flex gap-2 mt-4">
//                         <button
//                           onClick={() =>
//                             router.push(`/employer/edit-job/${j.id}`)
//                           }
//                           className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-medium transition-colors"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() =>
//                             router.push(`/employer/applicants/${j.id}`)
//                           }
//                           className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
//                         >
//                           Applicants
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }



"use client";

import React, { useEffect, useState } from "react";
import {
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  Building2,
  Upload,
  MapPin,
  DollarSign,
  X,
  Tag,
  Edit,
  Trash2,
  Users,
  FileText,
  Mail,
  Phone,
} from "lucide-react";

export default function EmployerDashboard() {
  const router = useRouter();

  /* ================= AUTH ================= */
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
      else {
        setUser(u);
        setName(u.displayName || "");
        setPhoto(u.photoURL || "");
      }
    });
    return () => unsub();
  }, []);

  /* ================= SIDEBAR ================= */
  const [activeTab, setActiveTab] = useState("jobs");

  /* ================= PROFILE ================= */
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  /* ================= COMPANY ================= */
  const [company, setCompany] = useState({
    companyName: "",
    companyDescription: "",
    companyLogoUrl: "",
    location: "",
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);

  /* ================= JOB ================= */
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);

  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    jobType: "Full-time",
    tags: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!user) return;
    fetchCompany();
    fetchJobs();
  }, [user]);

  const fetchCompany = async () => {
    try {
      const snap = await getDoc(doc(db, "employers", user.uid));
      if (snap.exists()) setCompany(snap.data());
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      const q = query(
        collection(db, "jobs"),
        where("employerUID", "==", user.uid)
      );
      const snap = await getDocs(q);
      setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  /* ================= UPLOAD PHOTO ================= */
  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.toLowerCase();
    if (
      fileType !== "image/png" &&
      fileType !== "image/jpeg" &&
      fileType !== "image/jpg"
    ) {
      alert("Only PNG and JPG images are allowed!");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      alert("Image size should be less than 1MB!");
      return;
    }

    setUploadingPhoto(true);
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const base64Data = event.target.result;
          setPhoto(base64Data);
          setUploadingPhoto(false);
          alert("Photo uploaded!");
        } catch (error) {
          console.error("Error saving photo:", error);
          alert("Error uploading: " + error.message);
          setUploadingPhoto(false);
        }
      };
      
      reader.onerror = () => {
        alert("Error reading file!");
        setUploadingPhoto(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading: " + error.message);
      setUploadingPhoto(false);
    }
  };

  /* ================= UPLOAD LOGO ================= */
  const uploadLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.toLowerCase();
    if (
      fileType !== "image/png" &&
      fileType !== "image/jpeg" &&
      fileType !== "image/jpg"
    ) {
      alert("Only PNG and JPG images are allowed!");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      alert("Logo size should be less than 1MB!");
      return;
    }

    setUploadingLogo(true);
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const base64Data = event.target.result;
          setCompany((prev) => ({ ...prev, companyLogoUrl: base64Data }));
          setUploadingLogo(false);
          alert("Logo uploaded!");
        } catch (error) {
          console.error("Error saving logo:", error);
          alert("Error uploading: " + error.message);
          setUploadingLogo(false);
        }
      };
      
      reader.onerror = () => {
        alert("Error reading file!");
        setUploadingLogo(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading: " + error.message);
      setUploadingLogo(false);
    }
  };

  /* ================= PROFILE UPDATE ================= */
  const saveProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      alert("Profile updated!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  /* ================= COMPANY SAVE ================= */
  const saveCompany = async () => {
    if (!company.companyName.trim()) {
      alert("Company name is required!");
      return;
    }

    try {
      await setDoc(doc(db, "employers", user.uid), {
        ...company,
        email: user.email,
        employerUID: user.uid,
      });
      alert("Company saved!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  /* ================= EDIT JOB ================= */
  const handleEditJob = (jobToEdit) => {
    setEditingJobId(jobToEdit.id);
    setJob({
      title: jobToEdit.title,
      description: jobToEdit.description,
      location: jobToEdit.location,
      salary: jobToEdit.salary,
      jobType: jobToEdit.jobType,
      tags: jobToEdit.tags ? jobToEdit.tags.join(", ") : "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE JOB ================= */
  const handleDeleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await deleteDoc(doc(db, "jobs", jobId));
      alert("Job deleted successfully!");
      await fetchJobs();
    } catch (error) {
      alert("Error deleting job: " + error.message);
    }
  };

  /* ================= POST/UPDATE JOB ================= */
  const handleSubmitJob = async () => {
    if (!job.title.trim() || !job.description.trim() || !job.location.trim() || !job.salary.trim()) {
      alert("Please fill all required fields!");
      return;
    }

    if (!company.companyName) {
      alert("Please set up company info first!");
      setActiveTab("company");
      return;
    }

    try {
      const jobData = {
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary,
        jobType: job.jobType,
        tags: job.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        employerUID: user.uid,
        companyName: company.companyName,
        companyLogo: company.companyLogoUrl,
      };

      if (editingJobId) {
        // Update existing job
        await updateDoc(doc(db, "jobs", editingJobId), {
          ...jobData,
          updatedAt: new Date().toISOString(),
        });
        alert("Job updated successfully!");
        setEditingJobId(null);
      } else {
        // Create new job
        await addDoc(collection(db, "jobs"), {
          ...jobData,
          postedAt: new Date().toISOString(),
        });
        alert("Job posted successfully!");
      }

      // Reset form
      setJob({
        title: "",
        description: "",
        location: "",
        salary: "",
        jobType: "Full-time",
        tags: "",
      });
      setShowForm(false);
      await fetchJobs();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  /* ================= CANCEL EDIT ================= */
  const handleCancelEdit = () => {
    setEditingJobId(null);
    setJob({
      title: "",
      description: "",
      location: "",
      salary: "",
      jobType: "Full-time",
      tags: "",
    });
    setShowForm(false);
  };

  /* ================= VIEW APPLICANTS ================= */
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const handleViewApplicants = async (job) => {
    setSelectedJobForApplicants(job);
    setLoadingApplicants(true);
    
    try {
      const q = query(
        collection(db, "applications"),
        where("jobId", "==", job.id)
      );
      const snap = await getDocs(q);
      const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setApplicants(apps);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      alert("Error loading applicants");
    } finally {
      setLoadingApplicants(false);
    }
  };

  const closeApplicantsView = () => {
    setSelectedJobForApplicants(null);
    setApplicants([]);
  };;

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-black/20 backdrop-blur-sm border-r border-gray-700/50 p-6 flex flex-col fixed left-0 top-20 bottom-0 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="text-[#309689]" size={32} />
          <h2 className="text-2xl font-bold text-[#309689]">Employer Panel</h2>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeTab === "profile"
                ? "bg-[#309689] text-white shadow-lg"
                : "hover:bg-white/5"
            }`}
          >
            <User size={20} /> Profile
          </button>

          <button
            onClick={() => setActiveTab("company")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeTab === "company"
                ? "bg-[#309689] text-white shadow-lg"
                : "hover:bg-white/5"
            }`}
          >
            <Building2 size={20} /> Company Info
          </button>

          <button
            onClick={() => setActiveTab("jobs")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeTab === "jobs"
                ? "bg-[#309689] text-white shadow-lg"
                : "hover:bg-white/5"
            }`}
          >
            <Briefcase size={20} /> Job Posts
          </button>
        </nav>

        <button
          onClick={logout}
          className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors mt-4"
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 ml-72 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* ============ PROFILE ============ */}
          {activeTab === "profile" && (
            <div>
              <h1 className="text-4xl font-bold text-[#309689] mb-8">
                Profile Settings
              </h1>

              <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl max-w-2xl">
                {/* Profile Photo */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    {photo ? (
                      <img
                        src={photo}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-[#309689]"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-[#309689]">
                        <User size={48} className="text-gray-400" />
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-[#309689] p-2 rounded-full cursor-pointer hover:bg-[#267d72] transition-colors">
                      <Upload size={16} />
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        className="hidden"
                        onChange={uploadPhoto}
                        disabled={uploadingPhoto}
                      />
                    </label>
                  </div>
                  {uploadingPhoto && (
                    <p className="mt-2 text-sm text-yellow-400">Uploading...</p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    Click icon to upload (PNG/JPG only)
                  </p>
                </div>

                {/* Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
                  />
                </div>

                {/* Email */}
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2">
                    Email (Read-only)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg opacity-60 text-white"
                  />
                </div>

                <button
                  onClick={saveProfile}
                  className="w-full px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg font-medium transition-colors"
                >
                  Update Profile
                </button>
              </div>
            </div>
          )}

          {/* ============ COMPANY ============ */}
          {activeTab === "company" && (
            <div>
              <h1 className="text-4xl font-bold text-[#309689] mb-8">
                Company Information
              </h1>

              <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl max-w-3xl">
                {/* Company Logo */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">
                    Company Logo (PNG/JPG only)
                  </label>
                  <div className="flex items-center gap-4">
                    {company.companyLogoUrl && (
                      <img
                        src={company.companyLogoUrl}
                        alt="Logo"
                        className="w-20 h-20 rounded-lg object-cover border-2 border-[#309689]"
                      />
                    )}
                    <label className="px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg cursor-pointer transition-colors inline-block">
                      {uploadingLogo
                        ? "Uploading..."
                        : company.companyLogoUrl
                        ? "Change Logo"
                        : "Upload Logo"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        className="hidden"
                        onChange={uploadLogo}
                        disabled={uploadingLogo}
                      />
                    </label>
                  </div>
                </div>

                {/* Company Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={company.companyName}
                    onChange={(e) =>
                      setCompany((prev) => ({ ...prev, companyName: e.target.value }))
                    }
                    placeholder="Enter company name"
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
                  />
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={company.location}
                    onChange={(e) =>
                      setCompany((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="City, Country"
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={company.companyDescription}
                    onChange={(e) =>
                      setCompany((prev) => ({
                        ...prev,
                        companyDescription: e.target.value,
                      }))
                    }
                    placeholder="Tell us about your company..."
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none h-32 text-white"
                  />
                </div>

                <button
                  onClick={saveCompany}
                  className="w-full px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg transition-colors"
                >
                  Save Company
                </button>
              </div>
            </div>
          )}

          {/* ============ JOBS ============ */}
          {activeTab === "jobs" && (
            <div>
              {/* Applicants View */}
              {selectedJobForApplicants ? (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h1 className="text-4xl font-bold text-[#309689]">
                        Applicants
                      </h1>
                      <p className="text-gray-400 mt-2">
                        {selectedJobForApplicants.title} - {applicants.length} applicant(s)
                      </p>
                    </div>

                    <button
                      onClick={closeApplicantsView}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <X size={20} /> Back to Jobs
                    </button>
                  </div>

                  {loadingApplicants ? (
                    <div className="text-center py-16">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#309689] mx-auto mb-4"></div>
                      <p className="text-gray-300">Loading applicants...</p>
                    </div>
                  ) : applicants.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
                      <Users size={48} className="mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-300 text-lg">
                        No applications yet for this job.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applicants.map((applicant) => (
                        <div
                          key={applicant.id}
                          className="bg-white/5 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl hover:border-[#309689] transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2">
                                {applicant.applicantName}
                              </h3>
                              
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Mail size={16} className="text-[#309689]" />
                                  {applicant.email}
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Phone size={16} className="text-[#309689]" />
                                  {applicant.phone}
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                  <MapPin size={16} className="text-[#309689]" />
                                  {applicant.location}
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Briefcase size={16} className="text-[#309689]" />
                                  {applicant.experience} experience
                                </div>
                              </div>

                              {applicant.coverLetter && (
                                <div className="mb-4 p-4 bg-white/5 rounded-lg">
                                  <p className="text-sm font-medium text-gray-400 mb-2">Cover Letter:</p>
                                  <p className="text-gray-300 text-sm">{applicant.coverLetter}</p>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                Applied: {new Date(applicant.appliedAt).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="ml-4">
                              <a
                                href={`#cv-${applicant.id}`}
                                onClick={async (e) => {
                                  e.preventDefault();
                                  if (applicant.cvUrl) {
                                    try {
                                      // Fetch CV from Firestore
                                      const cvDoc = await getDoc(doc(db, 'cvs', applicant.cvUrl));
                                      if (cvDoc.exists()) {
                                        const cvData = cvDoc.data();
                                        // Open in new tab
                                        const win = window.open('', '_blank');
                                        win.document.write(`
                                          <html>
                                            <head><title>${cvData.fileName}</title></head>
                                            <body style="margin:0">
                                              <embed src="${cvData.base64Data}" width="100%" height="100%" type="${cvData.fileType}" />
                                            </body>
                                          </html>
                                        `);
                                      } else {
                                        alert('CV not found');
                                      }
                                    } catch (error) {
                                      console.error('Error loading CV:', error);
                                      alert('Error loading CV');
                                    }
                                  }
                                }}
                                className="px-4 py-2 bg-[#309689] hover:bg-[#267d72] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                              >
                                <FileText size={16} />
                                View CV
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Jobs List View */
                <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-[#309689]">
                  Job Posts
                </h1>

                <button
                  onClick={() => {
                    if (showForm && !editingJobId) {
                      setShowForm(false);
                    } else if (editingJobId) {
                      handleCancelEdit();
                    } else {
                      setShowForm(true);
                    }
                  }}
                  className="px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {showForm ? (
                    <>
                      <X size={20} /> Cancel
                    </>
                  ) : (
                    <>
                      <Upload size={20} /> Post New Job
                    </>
                  )}
                </button>
              </div>

              {/* JOB FORM */}
              {showForm && (
                <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl mb-8">
                  <h2 className="text-2xl font-bold mb-6">
                    {editingJobId ? "Edit Job Post" : "Create New Job Post"}
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Job Title */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={job.title}
                        onChange={(e) =>
                          setJob((prev) => ({ ...prev, title: e.target.value }))
                        }
                        placeholder="e.g. Senior Developer"
                        className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
                      />
                    </div>

                    {/* Job Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Job Type
                      </label>
                      <select
                        value={job.jobType}
                        onChange={(e) =>
                          setJob((prev) => ({ ...prev, jobType: e.target.value }))
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={job.location}
                        onChange={(e) =>
                          setJob((prev) => ({ ...prev, location: e.target.value }))
                        }
                        placeholder="City, Country"
                        className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
                      />
                    </div>

                    {/* Salary */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Salary Range *
                      </label>
                      <input
                        type="text"
                        value={job.salary}
                        onChange={(e) =>
                          setJob((prev) => ({ ...prev, salary: e.target.value }))
                        }
                        placeholder="e.g. $50,000 - $70,000"
                        className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={job.tags}
                      onChange={(e) =>
                        setJob((prev) => ({ ...prev, tags: e.target.value }))
                      }
                      placeholder="React, JavaScript, Remote"
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Job Description *
                    </label>
                    <textarea
                      value={job.description}
                      onChange={(e) =>
                        setJob((prev) => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="Describe the role, responsibilities, requirements..."
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none h-40 text-white"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitJob}
                      className="flex-1 px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg font-medium transition-colors"
                    >
                      {editingJobId ? "Update Job" : "Post Job"}
                    </button>
                  </div>
                </div>
              )}

              {/* JOB LIST */}
              {jobs.length === 0 ? (
                <div className="text-center py-16 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
                  <Briefcase size={48} className="mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-300 text-lg">
                    No jobs posted yet. Create your first job post!
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((j) => (
                    <div
                      key={j.id}
                      className="bg-white/5 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl hover:border-[#309689] transition-all"
                    >
                      {/* Company Logo & Name */}
                      <div className="flex items-center gap-3 mb-4">
                        {j.companyLogo ? (
                          <img
                            src={j.companyLogo}
                            alt={j.companyName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
                            <Building2 size={24} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold">{j.title}</h3>
                          <p className="text-sm text-gray-400">
                            {j.companyName || "No Company"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {j.location && (
                          <p className="text-gray-400 text-sm flex items-center gap-2">
                            <MapPin size={14} />
                            {j.location}
                          </p>
                        )}
                        {j.salary && (
                          <p className="text-gray-400 text-sm flex items-center gap-2">
                            <DollarSign size={14} />
                            {j.salary}
                          </p>
                        )}
                        {j.jobType && (
                          <p className="text-gray-400 text-sm flex items-center gap-2">
                            <Briefcase size={14} />
                            {j.jobType}
                          </p>
                        )}
                      </div>

                      {/* Tags */}
                      {j.tags && j.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {j.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-[#309689]/20 text-[#309689] text-xs rounded-full border border-[#309689]/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <button
                          onClick={() => handleEditJob(j)}
                          className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-medium transition-colors flex items-center justify-center gap-1 text-sm"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteJob(j.id)}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1 text-sm"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                        <button
                          onClick={() => handleViewApplicants(j)}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 text-sm"
                        >
                          <Users size={14} />
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}