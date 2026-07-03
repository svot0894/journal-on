import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleAlert, Lock, PawPrint } from "lucide-react";

import { useAuth } from "../states/AuthState";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormError("");
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      navigate("/workspace");
    } catch {
      setFormError("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 font-['Inter']">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <Link to="/" className="mb-10">
          <div className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-emerald-600" />
            <span className="text-base font-semibold text-slate-900">
              Pingo Notes
            </span>
          </div>
        </Link>

        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <Lock className="mb-3 h-5 w-5 text-emerald-600" />

            <h1 className="mb-1 text-2xl font-semibold text-slate-900">
              Pingo sign in
            </h1>

            <p className="mb-6 text-sm text-slate-600">
              Access your private writing workspace.
            </p>

            {formError ? (
              <div className="mb-4 flex items-start gap-2 rounded-md border border-red-100 bg-red-50 px-3 py-2">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <p className="text-sm text-red-700">{formError}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-md bg-emerald-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-100 pt-5 text-center">
              <p className="text-xs text-slate-500">
                Demo credentials:{" "}
                <span className="font-medium text-slate-700">admin</span>
                {" / "}
                <span className="font-medium text-slate-700">demo123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}