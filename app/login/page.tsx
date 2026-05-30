"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === "admin@recruiter.com" && password === "password123") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Try admin@recruiter.com / password123");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-slate-200/50 dark:bg-slate-800/50 blur-[120px]" />
        <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-slate-200/50 dark:bg-slate-800/50 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-xl bg-slate-900 dark:bg-slate-50 flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-slate-50 dark:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-slate-500">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@recruiter.com"
                required
                className="bg-slate-50 dark:bg-slate-900/50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-slate-900 dark:text-slate-50 hover:underline underline-offset-4">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-slate-50 dark:bg-slate-900/50"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-950/50 p-3 text-sm text-red-500 dark:text-red-400 font-medium border border-red-200 dark:border-red-900">
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            
            <div className="text-center text-sm text-slate-500">
              Demo credentials: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">admin@recruiter.com</span> / <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">password123</span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
