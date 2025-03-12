"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type AuthFormProps = {

    type: 'signup' | 'signin';
  
    onSubmit: (data: { name: string; email: string; password: string }) => Promise<void>;
  
  };
  

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string | undefined;

    try {
      if (type === "signin") {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          setError("Invalid email or password.");
          return;
        }

        router.push("/dashboard"); // Redirect to a protected page
      } else {
        // Sign-up via API
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          throw new Error("Sign-up failed. Try again.");
        }

        router.push("/signin"); // Redirect to sign-in after successful sign-up
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === "signup" && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2 bg-subContainer border border-gray-600 rounded-lg focus:outline-none focus:border-altAccent text-textPrimary"
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-2 bg-subContainer border border-gray-600 rounded-lg focus:outline-none focus:border-altAccent text-textPrimary"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="w-full px-4 py-2 bg-subContainer border border-gray-600 rounded-lg focus:outline-none focus:border-altAccent text-textPrimary"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        className="w-full py-2 px-4 bg-accent text-black rounded-lg font-medium hover:bg-altAccent transition-colors"
      >
        {type === "signup" ? "Sign Up" : "Sign In"}
      </button>
    </form>
  );
}

