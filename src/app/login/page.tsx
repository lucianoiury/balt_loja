"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setSuccess("Verifique seu e-mail para confirmar o cadastro.");
    setLoading(false);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else setSuccess("Login realizado com sucesso!");
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 to-purple-900 relative overflow-hidden">
      <div className="absolute left-1/3 top-1/4 w-80 h-80 bg-purple-400 blur-3xl opacity-20 rounded-full animate-pulse -z-10" />
      <div className="absolute right-1/4 bottom-1/4 w-72 h-72 bg-indigo-500 blur-2xl opacity-10 rounded-full animate-pulse -z-10" />
      <div className="bg-gradient-to-br from-black/80 via-indigo-900/80 to-purple-900/80 rounded-3xl shadow-2xl p-8 w-full max-w-sm mt-8 border-2 border-purple-400/30">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-purple-200 drop-shadow glow tracking-widest font-caveat">🔮 Clã Michetti</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="E-mail"
            className="rounded px-3 py-2 border border-purple-400 bg-black/30 text-indigo-100 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-indigo-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Senha"
            className="rounded px-3 py-2 border border-purple-400 bg-black/30 text-indigo-100 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-indigo-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-700 via-indigo-700 to-emerald-700 hover:from-purple-500 hover:to-emerald-500 text-white font-bold py-2 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:ring-offset-2 focus:ring-offset-black/30 disabled:opacity-60"
            disabled={loading}
          >
            Entrar
          </button>
        </form>
        <form className="flex flex-col gap-2 mt-4" onSubmit={handleSignUp}>
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-2 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:ring-offset-2 focus:ring-offset-black/30 disabled:opacity-60"
            disabled={loading}
          >
            Criar conta
          </button>
        </form>
        {error && <p className="text-red-400 mt-4 text-center font-bold drop-shadow">{error}</p>}
        {success && <p className="text-green-400 mt-4 text-center font-bold drop-shadow">{success}</p>}
      </div>
    </div>
  );
}
