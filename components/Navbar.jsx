"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) {
          setRole(snap.data().role);
        }
      } else {
        setRole(null);
      }
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="absolute top-0 left-0 w-full px-20 py-6 z-50 bg-transparent flex justify-between items-center">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.webp" alt="Logo" width={40} height={40} />
        <span className="text-white font-bold text-2xl">Job Board</span>
      </Link>

      {/* Links */}
      <ul className="flex gap-14 py-3">
        <li><Link href="/" className="text-white hover:text-[#309689]">HOME</Link></li>
        <li><Link href="/aboutus" className="text-white hover:text-[#309689]">ABOUT</Link></li>
        <li><Link href="/jobs" className="text-white hover:text-[#309689]">JOBS</Link></li>
      </ul>

      {/* 🔥 Right Side */}
      {!user ? (
        /* ===== Logged OUT ===== */
        <div className="flex gap-3">
          <Link href="/login" className="text-white text-lg px-3">
            Login
          </Link>
          <Link
            href="/signup"
            className="px-5 py-1 rounded-2xl text-lg text-white bg-[#309689]"
          >
            Sign Up
          </Link>
        </div>
      ) : (
        /* ===== Logged IN ===== */
        <div className="flex items-center gap-4">

          {/* Avatar / Profile */}
          <button
            onClick={() =>
              router.push(
                role === "employer"
                  ? "/employer/dashboard"
                  : "/profile"
              )
            }
          >
            <Image
              src="/avator.png"   
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border border-[#309689]"
            />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-[#309689] text-white rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
