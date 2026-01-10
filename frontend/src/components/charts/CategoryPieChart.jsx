import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--error)'];

export default function CategoryPieChart({ data = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="bg-surface p-6 rounded-lg shadow-md h-[400px]"
      role="img"
      aria-label="Job category distribution"
    >
      <h3 className="text-xl font-bold mb-4">Category Distribution</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="jobs"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} jobs`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}