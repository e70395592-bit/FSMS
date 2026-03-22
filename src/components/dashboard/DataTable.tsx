import { motion } from "framer-motion";
import { ArrowUpDown, MoreHorizontal, AlertTriangle, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLanguage, useTranslations } from "@/contexts/LanguageContext";

type StatusType = "normal" | "warning" | "critical" | "resolved";

interface CCPRecord {
  id: string;
  ccpName: string;
  ccpNameEn: string;
  parameter: string;
  parameterEn: string;
  limit: string;
  actual: string;
  status: StatusType;
  timestamp: string;
  operator: string;
  operatorEn: string;
}

const mockCCPData: CCPRecord[] = [
  { id: "1", ccpName: "CCP-01 البسترة", ccpNameEn: "CCP-01 Pasteurization", parameter: "درجة الحرارة", parameterEn: "Temperature", limit: "72°C - 75°C", actual: "73.5°C", status: "normal", timestamp: "14:30", operator: "محمد أحمد", operatorEn: "Mohammed Ahmed" },
  { id: "2", ccpName: "CCP-02 التبريد", ccpNameEn: "CCP-02 Cooling", parameter: "درجة الحرارة", parameterEn: "Temperature", limit: "≤ 4°C", actual: "5.2°C", status: "warning", timestamp: "14:25", operator: "سارة علي", operatorEn: "Sara Ali" },
  { id: "3", ccpName: "CCP-03 الكشف المعدني", ccpNameEn: "CCP-03 Metal Detection", parameter: "الحساسية", parameterEn: "Sensitivity", limit: "Fe: 2mm, Non-Fe: 3mm", actual: "Fe: 1.8mm", status: "normal", timestamp: "14:20", operator: "خالد سعيد", operatorEn: "Khaled Saeed" },
  { id: "4", ccpName: "CCP-04 التعبئة", ccpNameEn: "CCP-04 Packaging", parameter: "ضغط الإغلاق", parameterEn: "Seal Pressure", limit: "4.5 - 5.5 بار", actual: "6.1 بار", status: "critical", timestamp: "14:15", operator: "فاطمة حسن", operatorEn: "Fatima Hassan" },
  { id: "5", ccpName: "CCP-01 البسترة", ccpNameEn: "CCP-01 Pasteurization", parameter: "وقت التعريض", parameterEn: "Exposure Time", limit: "15-20 ثانية", actual: "16 ثانية", status: "normal", timestamp: "14:10", operator: "محمد أحمد", operatorEn: "Mohammed Ahmed" },
];

interface DataTableProps {
  title: string;
  subtitle?: string;
  delay?: number;
}

export function DataTable({ title, subtitle, delay = 0 }: DataTableProps) {
  const { lang } = useLanguage();
  const t = useTranslations();
  const isAr = lang === "ar";

  const statusConfig: Record<StatusType, { label: string; icon: React.ElementType; className: string }> = {
    normal: { label: t.normal, icon: CheckCircle, className: "bg-success-light text-success border-success/30" },
    warning: { label: t.warning, icon: AlertTriangle, className: "bg-warning-light text-warning border-warning/30" },
    critical: { label: t.critical, icon: XCircle, className: "bg-destructive-light text-destructive border-destructive/30" },
    resolved: { label: t.resolvedStatus, icon: AlertCircle, className: "bg-info-light text-info border-info/30" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card-enterprise"
    >
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <Button variant="outline" size="sm">{t.viewAll}</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-enterprise">
          <thead>
            <tr>
              <th className={isAr ? "text-right" : "text-left"}>
                <Button variant="ghost" size="sm" className="gap-1 h-auto p-0 font-medium">
                  {t.controlPoint}
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              </th>
              <th className={isAr ? "text-right" : "text-left"}>{t.parameter}</th>
              <th className={isAr ? "text-right" : "text-left"}>{t.limit}</th>
              <th className={isAr ? "text-right" : "text-left"}>{t.actual}</th>
              <th className={isAr ? "text-right" : "text-left"}>{t.status}</th>
              <th className={isAr ? "text-right" : "text-left"}>{t.time}</th>
              <th className={isAr ? "text-right" : "text-left"}>{t.operator}</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {mockCCPData.map((record, index) => {
              const status = statusConfig[record.status];
              const StatusIcon = status.icon;
              return (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: delay + index * 0.05 }}
                  className="group"
                >
                  <td className="font-medium text-foreground">{isAr ? record.ccpName : record.ccpNameEn}</td>
                  <td className="text-muted-foreground">{isAr ? record.parameter : record.parameterEn}</td>
                  <td className="text-muted-foreground font-mono text-sm">{record.limit}</td>
                  <td className={cn("font-mono text-sm font-medium", record.status === "critical" && "text-destructive", record.status === "warning" && "text-warning", record.status === "normal" && "text-success")}>
                    {record.actual}
                  </td>
                  <td>
                    <Badge variant="outline" className={cn("gap-1", status.className)}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                  </td>
                  <td className="text-muted-foreground text-sm">{record.timestamp}</td>
                  <td className="text-muted-foreground">{isAr ? record.operator : record.operatorEn}</td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem>{t.viewDetails}</DropdownMenuItem>
                        <DropdownMenuItem>{t.addNote}</DropdownMenuItem>
                        {record.status !== "normal" && <DropdownMenuItem>{t.openCorrectiveAction}</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
