import Link from "next/link";
import "../globals.css";

export default function DashLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Topbar */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 font-bold grid place-items-center">S</div>
            <span className="font-semibold">SAME Dash</span>
          </div>
          <Link
            href="/auth/login"
            className="text-sm px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-black transition"
          >
            Sair
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-5">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <nav className="bg-white rounded-2xl shadow-sm p-2">
            <NavItem href="/dash/dashboard" icon="📊" label="Dashboard" />
            <NavItem href="/dash/cashflow"  icon="💰" label="Fluxo de Caixa" />
            <NavItem href="/dash/payables"  icon="🧾" label="Contas a Pagar" />
            <NavItem href="/dash/suppliers" icon="🏢" label="Fornecedores" />
            <NavItem href="/dash/reports"   icon="📈" label="Relatórios" />
          </nav>
        </aside>

        {/* Conteúdo */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }) {
  const isActive = typeof window !== "undefined" && window.location.pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm mb-1
      hover:bg-neutral-100 transition ${isActive ? "bg-neutral-100 font-medium" : ""}`}
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}
