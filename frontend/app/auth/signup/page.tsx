"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  // local form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  function handleSignup() {
    console.log("User submitted:", form);
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md border p-6 rounded-xl shadow-sm">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create an Account
        </h1>

        {/* First Name */}
        <Input
          placeholder="First Name"
          className="mb-3"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />

        {/* Last Name */}
        <Input
          placeholder="Last Name"
          className="mb-3"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />

        {/* Email */}
        <Input
          placeholder="Email Address"
          className="mb-3"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password */}
        <Input
          placeholder="Password"
          className="mb-4"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Submit Button */}
        <Button className="w-full mb-4" onClick={handleSignup}>
          Sign Up
        </Button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Social Login Buttons */}
        <Button variant="outline" className="w-full mb-3">
          {/* simple emoji icon substitute for now */}
          <span className="mr-2">🔵</span> Sign up with Google
        </Button>

        <Button variant="outline" className="w-full mb-6">
          <span className="mr-2">🐱</span> Sign up with GitHub
        </Button>

        {/* Already have an account */}
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
