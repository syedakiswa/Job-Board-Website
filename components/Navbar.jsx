"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

 useEffect(() => {
  
  if (typeof window === "undefined") return;

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
    setOpen(false);
  };

  return (
    <nav className="absolute top-0 left-0 w-full px-6 md:px-20 py-6 z-50 bg-transparent">
      <div className="flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.webp" alt="Logo" width={40} height={40} />
          <span className="text-white font-bold text-2xl">Job Board</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-14 py-3">
          <li><Link href="/" className="text-white hover:text-[#309689]">HOME</Link></li>
          <li><Link href="/aboutus" className="text-white hover:text-[#309689]">ABOUT</Link></li>
          <li><Link href="/jobs" className="text-white hover:text-[#309689]">JOBS</Link></li>
        </ul>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login" className="text-white text-lg">Login</Link>
              <Link href="/signup" className="px-5 py-1 rounded-2xl text-lg text-white bg-[#309689]">
                Sign Up
              </Link>
            </>
          ) : (
            <>
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

              <button
                onClick={handleLogout}
                className="px-4 py-1 bg-[#309689] text-white rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-6 bg-black/80 backdrop-blur-lg rounded-xl p-6 space-y-5">

          <Link onClick={() => setOpen(false)} href="/" className="block text-white">HOME</Link>
          <Link onClick={() => setOpen(false)} href="/aboutus" className="block text-white">ABOUT</Link>
          <Link onClick={() => setOpen(false)} href="/jobs" className="block text-white">JOBS</Link>

          {!user ? (
            <div className="flex flex-col gap-3 pt-4">
              <Link onClick={() => setOpen(false)} href="/login" className="text-white">
                Login
              </Link>
              <Link
                onClick={() => setOpen(false)}
                href="/signup"
                className="px-5 py-2 rounded-xl text-white bg-[#309689] text-center"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-4">
              <button
                onClick={() => {
                  router.push(
                    role === "employer"
                      ? "/employer/dashboard"
                      : "/profile"
                  );
                  setOpen(false);
                }}
                className="flex items-center gap-3 text-white"
              >
                <Image
                  src="/avator.png"
                  alt="Profile"
                  width={35}
                  height={35}
                  className="rounded-full border border-[#309689]"
                />
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#309689] text-white rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
