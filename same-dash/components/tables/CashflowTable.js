'use client';
import { money } from '@/lib/format';

export default function CashflowTable({ items=[] }){
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <table className="w-full text-sm">
        <thead className="text-left text-neutral-500">
          <tr>
            <th className="py-2">Data</th>
            <th>Descrição</th>
            <th>Tipo</th>
            <th className="text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i)=>{
            const d = i.when?.toDate ? i.when.toDate() : new Date(i.when);
            return (
              <tr key={i.id} className="border-t">
                <td className="py-2">{d.toLocaleDateString('pt-BR')}</td>
                <td>{i.label}</td>
                <td>{i.kind === 'entrada' ? 'Entrada' : 'Saída'}</td>
                <td className={`text-right ${i.kind==='saida'?'text-red-600':'text-emerald-600'}`}>{money(i.amount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}