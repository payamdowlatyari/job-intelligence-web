"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { loginUser, registerUser } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorMessage } from "@/components/ErrorMessage";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

/**
 * SignInPage
 *
 * This page allows users to sign in to their account or register a new account.
 * It uses react-hook-form and tanstack/react-query to handle form submissions and API calls.
 * It also uses the useAuth hook to save the user's login information to local storage.
 */
export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [tab, setTab] = useState("login");

  // Login form
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data, variables) => {
      login(data.access_token, {
        email: variables.email,
        name: variables.email,
      });
      router.push(callbackUrl);
    },
  });

  // Register form
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data, variables) => {
      login(data.access_token, {
        email: variables.email,
        name: variables.name,
      });
      router.push(callbackUrl);
    },
  });

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Job Intelligence</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in or create an account to continue
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {loginMutation.isError && (
                <ErrorMessage
                  message={
                    (loginMutation.error as Error)?.message ?? "Login failed."
                  }
                />
              )}
              <form
                onSubmit={loginForm.handleSubmit(data =>
                  loginMutation.mutate(data),
                )}
                className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    {...loginForm.register("password")}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-destructive">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              {registerMutation.isError && (
                <ErrorMessage
                  message={
                    (registerMutation.error as Error)?.message ??
                    "Registration failed."
                  }
                />
              )}
              <form
                onSubmit={registerForm.handleSubmit(data =>
                  registerMutation.mutate(data),
                )}
                className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="register-name">Name</Label>
                  <Input
                    id="register-name"
                    placeholder="Your name"
                    {...registerForm.register("name")}
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-xs text-destructive">
                      {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    {...registerForm.register("email")}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="At least 6 characters"
                    {...registerForm.register("password")}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-xs text-destructive">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}>
                  {registerMutation.isPending
                    ? "Creating account…"
                    : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
