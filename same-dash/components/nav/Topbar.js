'use client';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function Topbar(){
  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container h-14 flex items-center justify-between">
        <div className="md:hidden font-semibold">SAME Dash</div>
        <div className="text-sm text-neutral-500 hidden md:block">Gestão simples para MEI</div>
        <button onClick={()=>signOut(auth)} className="text-sm px-3 py-1.5 rounded-lg bg-neutral-900 text-white">Sair</button>
      </div>
    </header>
  );
}