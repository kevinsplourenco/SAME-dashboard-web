'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AreaCashflow({ data }){
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6E56CF" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6E56CF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label"/>
          <YAxis/>
          <Tooltip/>
          <Area type="monotone" dataKey="valor" stroke="#6E56CF" fillOpacity={1} fill="url(#cf)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}