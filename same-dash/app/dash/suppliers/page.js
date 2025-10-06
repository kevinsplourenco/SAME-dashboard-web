"use client";
import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function Suppliers(){
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [phone,setPhone]=useState("");
  const [items,setItems]=useState([]);

  useEffect(()=>{
    const uid = auth.currentUser?.uid; if(!uid) return;
    const q = query(collection(db,"tenants",uid,"suppliers"), orderBy("name","asc"));
    const unsub = onSnapshot(q, snap=> setItems(snap.docs.map(d=>({id:d.id,...d.data()}))));
    return ()=>unsub();
  },[]);

  async function onAdd(e){
    e.preventDefault();
    const uid = auth.currentUser?.uid; if(!uid) return;
    await addDoc(collection(db,"tenants",uid,"suppliers"),{ name,email,phone,createdAt:serverTimestamp() });
    setName(""); setEmail(""); setPhone("");
  }

  return (
    <div className="grid gap-4">
      <form onSubmit={onAdd} className="bg-white rounded-2xl shadow-sm p-4 grid md:grid-cols-4 gap-3">
        <input className="border rounded-xl px-3 py-2" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border rounded-xl px-3 py-2" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border rounded-xl px-3 py-2" placeholder="Telefone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <button className="rounded-xl py-2 bg-neutral-900 text-white hover:bg-black transition">Adicionar</button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-500">
            <tr><th className="py-2">Nome</th><th>E-mail</th><th>Telefone</th></tr>
          </thead>
          <tbody>
            {items.map(i=>(
              <tr key={i.id} className="border-t">
                <td className="py-2">{i.name}</td><td>{i.email}</td><td>{i.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
