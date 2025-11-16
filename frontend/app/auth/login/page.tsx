// "use client";
//
// import { useState } from "react";
// import Link from "next/link";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
//
// export default function LoginPage() {
//   // local form state
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });
//
//   // placeholder for backend later
//   function handleLogin() {
//     console.log("User logging in:", form);
//   }
//
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4">
//       <div className="w-full max-w-md border p-6 rounded-xl shadow-sm">
//         {/* Page Title */}
//         <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
//
//         {/* Email */}
//         <Input
//           placeholder="Email Address"
//           className="mb-3"
//           type="email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />
//
//         {/* Password */}
//         <Input
//           placeholder="Password"
//           className="mb-4"
//           type="password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />
//
//         {/* Login button */}
//         <Button className="w-full mb-4" onClick={handleLogin}>
//           Sign In
//         </Button>
//
//         {/* Divider */}
//         <div className="flex items-center my-4">
//           <div className="flex-1 h-px bg-gray-300"></div>
//           <span className="px-3 text-sm text-gray-500">or</span>
//           <div className="flex-1 h-px bg-gray-300"></div>
//         </div>
//
//         {/* Social Login Buttons */}
//         <Button variant="outline" className="w-full mb-3">
//           <span className="mr-2">🔵</span> Sign in with Google
//         </Button>
//
//         <Button variant="outline" className="w-full mb-6">
//           <span className="mr-2">🐱</span> Sign in with GitHub
//         </Button>
//
//         {/* Create account link */}
//         <p className="text-center text-sm">
//           Don’t have an account?{" "}
//           <Link href="/auth/signup" className="text-blue-600 underline">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }


// frontend/app/auth/login/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <SignIn afterSignInUrl="/app/home" />
        </div>
    );
}


