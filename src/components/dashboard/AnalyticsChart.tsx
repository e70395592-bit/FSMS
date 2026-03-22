import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface AnalyticsChartProps {
  title: string;
  subtitle?: string;
  type: "area" | "bar" | "pie";
  data: ChartData[];
  dataKey?: string;
  colors?: string[];
  height?: number;
  delay?: number;
}

const defaultColors = [
  "hsl(213, 55%, 35%)",
  "hsl(175, 50%, 40%)",
  "hsl(145, 45%, 45%)",
  "hsl(38, 85%, 55%)",
  "hsl(0, 60%, 55%)",
];

export function AnalyticsChart({
  title,
  subtitle,
  type,
  data,
  dataKey = "value",
  colors = defaultColors,
  height = 280,
  delay = 0,
}: AnalyticsChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card-enterprise p-5"
    >
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      <div style={{ height }} dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          {type === "area" ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 88%)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "hsl(220, 15%, 45%)" }}
                axisLine={{ stroke: "hsl(220, 20%, 88%)" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(220, 15%, 45%)" }}
                axisLine={{ stroke: "hsl(220, 20%, 88%)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 20%, 88%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={colors[0]}
                strokeWidth={2}
                fill="url(#areaGradient)"
              />
            </AreaChart>
          ) : type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 88%)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "hsl(220, 15%, 45%)" }}
                axisLine={{ stroke: "hsl(220, 20%, 88%)" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(220, 15%, 45%)" }}
                axisLine={{ stroke: "hsl(220, 20%, 88%)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 20%, 88%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={2}
                dataKey={dataKey}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 20%, 88%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {type === "pie" && (
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
