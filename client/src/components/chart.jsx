import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const valuePrecision = 4;

export const Chart = ({ title, data }) => {
  const dataForView = data.map((item) => ({
    ...item,
    value: +item.value.toFixed(valuePrecision),
  }));
  return (
    <div>
      <h3>{title}</h3>
      <PieChart width={400} height={400}>
        <Pie
          data={dataForView}
          cx={200}
          cy={200}
          label
          labelLine={false}
          outerRadius={80}
          fill='#8884d8'
          dataKey='value'
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};
