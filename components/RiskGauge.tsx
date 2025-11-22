
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskGaugeProps {
  score: number;
  label?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, label = 'AI Score' }) => {
  // Score 0-100. 100 is best.
  
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  let color = '#ef4444'; // Red
  if (score >= 40) color = '#f97316'; // Orange
  if (score >= 60) color = '#eab308'; // Yellow
  if (score >= 80) color = '#10b981'; // Emerald

  const COLORS = [color, '#1e293b'];

  return (
    <div className="relative h-40 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="75%"
            startAngle={180}
            endAngle={0}
            innerRadius={65}
            outerRadius={85}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
            cornerRadius={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-2 text-center">
        <div className="text-5xl font-bold text-slate-100 tracking-tighter">{score}</div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">{label}</div>
      </div>
    </div>
  );
};
