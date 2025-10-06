"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, serverTimestamp, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function Register() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const r=useRouter();

  async function onSubmit(e){
    e.preventDefault(); setErr("");
    try{
      const cred = await createUserWithEmailAndPassword(auth,email.trim(),pass);
      if(name) await updateProfile(cred.user,{ displayName:name });
      await setDoc(doc(db,"tenants",cred.user.uid,"meta","settings"),{
        fantasyName:name || "", modules:{sales:true,cashflow:true,notifications:true}, createdAt:serverTimestamp()
      },{merge:true});
      r.push("/dash/dashboard");
    }catch(e){ setErr(e.code || e.message); }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-neutral-50 via-white to-violet-50">
      <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-center">Criar conta</h1>
        <form onSubmit={onSubmit} className="space-y-3 mt-2">
          <div className="space-y-1">
            <label className="text-sm">Nome</label>
            <input className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-violet-600" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm">E-mail</label>
            <input className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-violet-600" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Senha</label>
            <input className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-violet-600" type="password" value={pass} onChange={e=>setPass(e.target.value)} required />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="w-full rounded-xl py-2 bg-neutral-900 text-white hover:bg-black transition">Criar</button>
        </form>
      </div>
    </div>
  );
}
