"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Briefcase } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <Card className="w-full max-w-sm relative z-10 shadow-sm border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-10 w-10 rounded-lg bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-zinc-50 dark:text-zinc-900" />
            </div>
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-zinc-500">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@recruiter.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline underline-offset-4">
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
            
            <div className="text-center text-sm text-zinc-500">
              Demo credentials: <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">admin@recruiter.com</span> / <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">password123</span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
