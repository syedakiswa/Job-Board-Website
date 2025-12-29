"use client";
import React, { useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 🔥 user role fetch
      const userDoc = await getDoc(
        doc(db, "users", userCredential.user.uid)
      );

      if (!userDoc.exists()) {
        toast.error("User data not found");
        return;
      }

      const { role } = userDoc.data();

      toast.success("Login successful!");

      // 🔁 Redirect based on role
      if (role === "employer") {
        router.push("/employer/profile");
      } else {
        router.push("/profile");
      }

    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-gray-800 p-6 rounded"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <label>Email</label>
        <input
          type="email"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full py-2 rounded"
          style={{ backgroundColor: "#309689" }}
        >
          {loading ? "Processing..." : "Login"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}
