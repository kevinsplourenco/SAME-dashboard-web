"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr]   = useState("");
  const r = useRouter();

  async function onLogin(e) {
    e.preventDefault();
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      r.push("/dash/dashboard");
    } catch (e) {
      setErr(e.code || e.message);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-neutral-50 via-white to-violet-50">
      <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-center">Entrar</h1>
        <p className="text-sm text-neutral-500 text-center mb-4">Use seu e-mail e senha</p>
        <form onSubmit={onLogin} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm">E-mail</label>
            <input
              className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-600"
              type="email" value={email} onChange={e=>setEmail(e.target.value)} required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Senha</label>
            <input
              className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-600"
              type="password" value={pass} onChange={e=>setPass(e.target.value)} required
            />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button
            type="submit"
            className="w-full rounded-xl py-2 bg-neutral-900 text-white hover:bg-black transition"
          >
            Entrar
          </button>
          <p className="text-sm text-center">
            Não tem conta?{" "}
            <Link className="text-violet-700 hover:underline" href="/auth/register">
              Criar conta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
