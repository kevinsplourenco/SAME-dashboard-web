'use client';

export default function PayablesTable({ items=[], onToggle }){
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <table className="w-full text-sm">
        <thead className="text-left text-neutral-500">
          <tr>
            <th className="py-2">Vencimento</th>
            <th>Fornecedor</th>
            <th>Descrição</th>
            <th className="text-right">Valor</th>
            <th className="text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i)=>{
            const d = i.due?.toDate ? i.due.toDate() : new Date(i.due);
            return (
              <tr key={i.id} className="border-t">
                <td className="py-2">{d.toLocaleDateString('pt-BR')}</td>
                <td>{i.vendor}</td>
                <td>{i.label}</td>
                <td className="text-right">{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(i.amount||0)}</td>
                <td className="text-right">
                  <button onClick={()=>onToggle?.(i)} className={`px-2 py-1 rounded-lg text-xs ${i.paid? 'bg-emerald-100 text-emerald-700':'bg-yellow-100 text-yellow-700'}`}>
                    {i.paid ? 'Pago' : 'Pendente'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}