'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

const Item = ({ href, label, icon }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-neutral-100 ${active ? 'bg-neutral-100 font-medium' : ''}`}>
      <span className="material-icons-outlined text-base">{icon}</span>
      {label}
    </Link>
  );
};

export default function Sidebar(){
  return (
    <aside className="w-64 p-3 hidden md:block">
      <div className="rounded-2xl bg-white shadow-sm p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center text-brand font-bold">S</div>
          <div className="text-sm font-semibold">SAME Dash</div>
        </div>
        <Separator className="my-3" />
        <nav className="flex flex-col gap-1">
          <Item href="/dashboard" label="Dashboard" icon="insights" />
          <Item href="/cashflow" label="Fluxo de Caixa" icon="account_balance_wallet" />
          <Item href="/payables" label="Contas a Pagar" icon="event" />
          <Item href="/suppliers" label="Fornecedores" icon="business" />
          <Item href="/reports" label="Relatórios" icon="dashboard_customize" />
        </nav>
      </div>
    </aside>
  );
}