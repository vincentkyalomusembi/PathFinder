import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

export default function JobDemandChart({ data = [] }) {
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
      aria-label="Job demand trends over time"
    >
      <h3 className="text-xl font-bold mb-4">Job Demand Trends</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={safeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--surface/20)" />
          <XAxis dataKey="month" tick={{ fill: "rgb(var(--text-primary))" }} />
          <YAxis tick={{ fill: "rgb(var(--text-primary))" }} />
          <Tooltip formatter={(value) => [`${value} jobs`, "Demand"]} />
          <Legend />
          <Line
            type="monotone"
            dataKey="jobs"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ fill: "var(--primary)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
