import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle, AlertCircle, Eye, Download, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/contexts/LanguageContext";

export type DocumentStatus = "draft" | "review" | "approved";

interface Document {
  id: string;
  title: string;
  type: string;
  status: DocumentStatus;
  version: string;
  lastModified: string;
  assignees: { name: string; avatar?: string }[];
}

interface DocumentStatusCardProps {
  document: Document;
  delay?: number;
}

export function DocumentStatusCard({ document, delay = 0 }: DocumentStatusCardProps) {
  const t = useTranslations();

  const statusConfig = {
    draft: { label: t.draft, icon: Clock, className: "bg-warning-light text-warning border-warning/30" },
    review: { label: t.underReview, icon: AlertCircle, className: "bg-info-light text-info border-info/30" },
    approved: { label: t.approved, icon: CheckCircle, className: "bg-success-light text-success border-success/30" },
  };

  const status = statusConfig[document.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="card-enterprise p-4 hover:shadow-hover group"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium text-foreground truncate">{document.title}</h4>
              <p className="text-sm text-muted-foreground mt-0.5">
                {document.type} • {t.versionLabel} {document.version}
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem className="gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{t.view}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Download className="h-4 w-4" />
                  <span>{t.download}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <Badge variant="outline" className={cn("gap-1 font-medium", status.className)}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {t.lastModified} {document.lastModified}
            </span>
          </div>

          {document.assignees.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex -space-x-2 space-x-reverse">
                {document.assignees.slice(0, 3).map((assignee, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center border-2 border-card text-xs font-medium text-secondary-foreground"
                  >
                    {assignee.name.charAt(0)}
                  </div>
                ))}
                {document.assignees.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center border-2 border-card text-xs text-muted-foreground">
                    +{document.assignees.length - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{t.approversLabel}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
