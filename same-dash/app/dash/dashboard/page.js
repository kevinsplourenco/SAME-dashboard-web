"use client";
import { useEffect, useMemo, useState } from "react";
import { onSnapshot, orderBy, query, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(() => import("recharts").then(m=>m.ResponsiveContainer), { ssr:false });
const AreaChart            = dynamic(() => import("recharts").then(m=>m.AreaChart),            { ssr:false });
const Area                 = dynamic(() => import("recharts").then(m=>m.Area),                 { ssr:false });
const XAxis                = dynamic(() => import("recharts").then(m=>m.XAxis),                { ssr:false });
const YAxis                = dynamic(() => import("recharts").then(m=>m.YAxis),                { ssr:false });
const CartesianGrid        = dynamic(() => import("recharts").then(m=>m.CartesianGrid),        { ssr:false });
const Tooltip              = dynamic(() => import("recharts").then(m=>m.Tooltip),              { ssr:false });

const money = (v=0)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);

export default function Dashboard(){
  const [flows,setFlows]=useState([]);

  useEffect(()=>{
    const uid = auth.currentUser?.uid;
    if(!uid) return;
    const q = query(collection(db,"tenants",uid,"cashflows"), orderBy("when","desc"));
    const unsub = onSnapshot(q, snap=> setFlows(snap.docs.map(d=>({id:d.id,...d.data()}))));
    return ()=>unsub();
  },[]);

  const {entrada,saida,saldo,chart}=useMemo(()=>{
    const entrada = flows.filter(i=>i.kind==="entrada").reduce((s,x)=>s+(x.amount||0),0);
    const saida   = flows.filter(i=>i.kind==="saida").reduce((s,x)=>s+(x.amount||0),0);
    const saldo   = entrada - saida;
    const byMonth = {};
    flows.forEach(i=>{
      const d = i.when?.toDate ? i.when.toDate() : new Date(i.when);
      const k = `${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
      byMonth[k] = (byMonth[k]||0) + (i.kind==="entrada" ? i.amount : -i.amount);
    });
    const chart = Object.entries(byMonth).map(([label,valor])=>({label,valor})).slice(-6);
    return {entrada,saida,saldo,chart};
  },[flows]);

  return (
    <div className="grid gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Kpi label="Entradas (mês)" value={money(entrada)} />
        <Kpi label="Saídas (mês)"   value={money(saida)} />
        <Kpi label="Saldo"          value={money(saldo)} />
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-2xl shadow-sm p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6E56CF" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6E56CF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="label"/><YAxis/><Tooltip/>
            <Area type="monotone" dataKey="valor" stroke="#6E56CF" fillOpacity={1} fill="url(#cf)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Kpi({label,value}){
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
