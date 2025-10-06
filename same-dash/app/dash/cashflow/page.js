"use client";
import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const money = (v=0)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);

export default function Cashflow(){
  const [kind,setKind]=useState("entrada");
  const [label,setLabel]=useState("");
  const [amount,setAmount]=useState("");
  const [when,setWhen]=useState(new Date());
  const [items,setItems]=useState([]);

  useEffect(()=>{
    const uid = auth.currentUser?.uid; if(!uid) return;
    const q = query(collection(db,"tenants",uid,"cashflows"), orderBy("when","desc"));
    const unsub = onSnapshot(q, snap=> setItems(snap.docs.map(d=>({id:d.id,...d.data()}))));
    return ()=>unsub();
  },[]);

  async function onAdd(e){
    e.preventDefault();
    const uid = auth.currentUser?.uid; if(!uid) return;
    await addDoc(collection(db,"tenants",uid,"cashflows"),{
      kind, label, amount:Number(amount||0), when:Timestamp.fromDate(when), createdAt:serverTimestamp()
    });
    setLabel(""); setAmount(""); setWhen(new Date());
  }

  return (
    <div className="grid gap-4">
      {/* Form */}
      <form onSubmit={onAdd} className="bg-white rounded-2xl shadow-sm p-4 grid md:grid-cols-4 gap-3">
        <select className="border rounded-xl px-3 py-2" value={kind} onChange={e=>setKind(e.target.value)}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <input className="border rounded-xl px-3 py-2" placeholder="Descrição" value={label} onChange={e=>setLabel(e.target.value)} />
        <input className="border rounded-xl px-3 py-2" placeholder="Valor" value={amount} onChange={e=>setAmount(e.target.value)} />
        <input type="date" className="border rounded-xl px-3 py-2" value={when.toISOString().slice(0,10)} onChange={(e)=>setWhen(new Date(e.target.value))}/>
        <button className="md:col-span-4 rounded-xl py-2 bg-neutral-900 text-white hover:bg-black transition">Adicionar</button>
      </form>

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-sm p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-500">
            <tr><th className="py-2">Data</th><th>Descrição</th><th>Tipo</th><th className="text-right">Valor</th></tr>
          </thead>
          <tbody>
            {items.map(i=>{
              const d = i.when?.toDate ? i.when.toDate() : new Date(i.when);
              return (
                <tr key={i.id} className="border-t">
                  <td className="py-2">{d.toLocaleDateString("pt-BR")}</td>
                  <td>{i.label}</td>
                  <td>{i.kind==="entrada"?"Entrada":"Saída"}</td>
                  <td className={`text-right ${i.kind==="saida"?"text-red-600":"text-emerald-600"}`}>{money(i.amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
