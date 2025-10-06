"use client";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function Payables(){
  const [vendor,setVendor]=useState("");
  const [label,setLabel]=useState("");
  const [amount,setAmount]=useState("");
  const [due,setDue]=useState(new Date());
  const [items,setItems]=useState([]);

  useEffect(()=>{
    const uid = auth.currentUser?.uid; if(!uid) return;
    const q = query(collection(db,"tenants",uid,"payables"), orderBy("due","asc"));
    const unsub = onSnapshot(q, snap=> setItems(snap.docs.map(d=>({id:d.id,...d.data()}))));
    return ()=>unsub();
  },[]);

  async function onAdd(e){
    e.preventDefault();
    const uid = auth.currentUser?.uid; if(!uid) return;
    await addDoc(collection(db,"tenants",uid,"payables"),{
      vendor,label,amount:Number(amount||0), due:Timestamp.fromDate(due), paid:false, createdAt:serverTimestamp()
    });
    setVendor(""); setLabel(""); setAmount(""); setDue(new Date());
  }

  async function toggle(i){
    const uid = auth.currentUser?.uid; if(!uid) return;
    await updateDoc(doc(db,"tenants",uid,"payables",i.id),{ paid: !i.paid });
  }

  return (
    <div className="grid gap-4">
      <form onSubmit={onAdd} className="bg-white rounded-2xl shadow-sm p-4 grid md:grid-cols-5 gap-3">
        <input className="border rounded-xl px-3 py-2" placeholder="Fornecedor" value={vendor} onChange={e=>setVendor(e.target.value)} />
        <input className="border rounded-xl px-3 py-2" placeholder="Descrição" value={label} onChange={e=>setLabel(e.target.value)} />
        <input className="border rounded-xl px-3 py-2" placeholder="Valor" value={amount} onChange={e=>setAmount(e.target.value)} />
        <input type="date" className="border rounded-xl px-3 py-2" value={due.toISOString().slice(0,10)} onChange={e=>setDue(new Date(e.target.value))} />
        <button className="rounded-xl py-2 bg-neutral-900 text-white hover:bg-black transition">Adicionar</button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-500">
            <tr><th className="py-2">Vencimento</th><th>Fornecedor</th><th>Descrição</th><th className="text-right">Valor</th><th className="text-right">Status</th></tr>
          </thead>
          <tbody>
            {items.map(i=>{
              const d = i.due?.toDate ? i.due.toDate() : new Date(i.due);
              return (
                <tr key={i.id} className="border-t">
                  <td className="py-2">{d.toLocaleDateString("pt-BR")}</td>
                  <td>{i.vendor}</td>
                  <td>{i.label}</td>
                  <td className="text-right">
                    {new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(i.amount||0)}
                  </td>
                  <td className="text-right">
                    <button onClick={()=>toggle(i)} className={`px-2 py-1 rounded-lg text-xs
                      ${i.paid?"bg-emerald-100 text-emerald-700":"bg-yellow-100 text-yellow-700"}`}>
                      {i.paid?"Pago":"Pendente"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
