"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { User, Briefcase, FileText, Mail, MapPin, Building2, Calendar, Clock, DollarSign, Upload, CheckCircle, XCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";

export default function ApplicantProfile() {
  const [userData, setUserData] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("applications");
  const router = useRouter();

  // Profile edit states
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        router.push("/login");
        return;
      }

      const data = docSnap.data();

      if (data.role !== "applicant") {
        router.push("/employer/dashboard");
        return;
      }

      setUserData(data);
      setProfileName(user.displayName || "");
      setProfilePhoto(user.photoURL || "");

      // Fetch applied jobs
      await fetchAppliedJobs(user.uid);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchAppliedJobs = async (uid) => {
    try {
      const q = query(
        collection(db, "applications"),
        where("applicantUID", "==", uid)
      );
      const snap = await getDocs(q);
      const applications = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppliedJobs(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handlePhotoUpload = async (e) => {
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
          setProfilePhoto(base64Data);
          setUploadingPhoto(false);
          alert("Photo uploaded!");
        } catch (error) {
          console.error("Error:", error);
          alert("Error uploading photo");
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
      alert("Error uploading photo");
      setUploadingPhoto(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: profileName,
        photoURL: profilePhoto,
      });
      setEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      default:
        return <Loader size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-black text-[#309689] mb-2">
            Applicant Dashboard
          </h1>
          <p className="text-gray-400">Manage your profile and track your applications</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === "applications"
                ? "bg-[#309689] text-white shadow-lg"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Briefcase size={20} />
            My Applications
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === "profile"
                ? "bg-[#309689] text-white shadow-lg"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <User size={20} />
            Profile
          </button>
        </div>

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="text-[#309689]" size={28} />
                Applied Jobs ({appliedJobs.length})
              </h2>

              {appliedJobs.length === 0 ? (
                <div className="text-center py-16">
                  <Briefcase size={64} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400 text-lg mb-4">No applications yet</p>
                  <button
                    onClick={() => router.push("/jobs")}
                    className="px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg font-medium transition-colors"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appliedJobs.map((application) => (
                    <motion.div
                      key={application.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white/5 border border-gray-700/50 p-6 rounded-xl hover:border-[#309689] transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-[#309689]/20 p-2 rounded-lg">
                              <Building2 className="text-[#309689]" size={24} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{application.jobTitle}</h3>
                              <p className="text-gray-400 text-sm">{application.companyName}</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <MapPin size={14} className="text-[#309689]" />
                              {application.location}
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <Briefcase size={14} className="text-[#309689]" />
                              {application.experience} experience
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <Calendar size={14} className="text-[#309689]" />
                              Applied {new Date(application.appliedAt).toLocaleDateString()}
                            </div>
                          </div>

                          {application.coverLetter && (
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                              {application.coverLetter}
                            </p>
                          )}

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {getStatusIcon(application.status)}
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => router.push(`/jobdetails?id=${application.jobId}`)}
                          className="ml-4 px-4 py-2 bg-[#309689] hover:bg-[#267d72] rounded-lg text-sm font-medium transition-colors"
                        >
                          View Job
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <User className="text-[#309689]" size={28} />
                  Profile Information
                </h2>
                {!editingProfile && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="px-4 py-2 bg-[#309689] hover:bg-[#267d72] rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {editingProfile ? (
                <div>
                  {/* Profile Photo */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
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
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                        />
                      </label>
                    </div>
                    {uploadingPhoto && (
                      <p className="mt-2 text-sm text-yellow-400">Uploading...</p>
                    )}
                    <p className="mt-2 text-xs text-gray-400">
                      Click icon to upload (PNG/JPG, Max 1MB)
                    </p>
                  </div>

                  {/* Name */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-[#309689] focus:outline-none text-white"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={userData?.email}
                      disabled
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg opacity-60 text-white"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateProfile}
                      className="flex-1 px-6 py-3 bg-[#309689] hover:bg-[#267d72] rounded-lg font-medium transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* View Mode */}
                  <div className="flex flex-col items-center mb-8">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-[#309689] mb-4"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-[#309689] mb-4">
                        <User size={48} className="text-gray-400" />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold">{profileName || "No name set"}</h3>
                    <p className="text-gray-400">{userData?.email}</p>
                  </div>

                  <div className="space-y-4 bg-white/5 p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="text-[#309689]" size={20} />
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-white">{userData?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="text-[#309689]" size={20} />
                      <div>
                        <p className="text-xs text-gray-400">Role</p>
                        <p className="text-white capitalize">{userData?.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="text-[#309689]" size={20} />
                      <div>
                        <p className="text-xs text-gray-400">Total Applications</p>
                        <p className="text-white">{appliedJobs.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}