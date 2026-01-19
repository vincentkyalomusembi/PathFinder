import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

export default function SalaryTrendChart({ data = [] }) {
  // Ensure array
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="card h-[400px] flex items-center justify-center"
      >
        <p className="text-text-secondary">No data available for chart.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="card h-[400px]"
      role="img"
      aria-label="Salary distribution trends"
    >
      <h3 className="text-xl font-bold mb-4">Salary Trends</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={safeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--surface/20)" />
          <XAxis
            dataKey="category"
            tick={{ fill: "rgb(var(--text-primary))" }}
          />
          <YAxis tick={{ fill: "rgb(var(--text-primary))" }} />
          <Tooltip
            formatter={(value) => [
              `$${value.toLocaleString()}`,
              "Average Salary",
            ]}
          />
          <Bar dataKey="salary" fill="var(--success)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
