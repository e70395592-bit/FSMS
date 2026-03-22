import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Grid,
  List,
  FileText,
  Download,
  Eye,
  Archive,
  MoreVertical,
  Calendar,
  Building2,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLanguage, useTranslations } from "@/contexts/LanguageContext";
import { useAppContext } from "@/contexts/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle2, 
  XCircle, 
  Clock,
  MessageSquare as MessageIcon,
  Users as UsersIcon
} from "lucide-react";

export function DocumentsLibrary() {
  const { documents } = useAppContext();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  
  const { lang, isRtl } = useLanguage();
  const t = useTranslations();
  const isAr = lang === "ar";

  const selectedDoc = documents.find(d => d.id === selectedDocId);

  const documentTypes = [
    { value: "all", label: t.all },
    { value: "procedure", labelAr: "إجراء", labelEn: "Procedure" },
    { value: "policy", labelAr: "سياسة", labelEn: "Policy" },
    { value: "instruction", labelAr: "تعليمات عمل", labelEn: "Work Instruction" },
    { value: "form", labelAr: "نموذج", labelEn: "Form" },
    { value: "record", labelAr: "سجل", labelEn: "Record" },
    { value: "guide", labelAr: "دليل", labelEn: "Guide" },
  ];

  const departments = [
    { value: "all", label: t.all },
    { value: "quality", labelAr: "الجودة", labelEn: "Quality" },
    { value: "senior", labelAr: "الإدارة العليا", labelEn: "Senior Management" },
    { value: "production", labelAr: "الإنتاج", labelEn: "Production" },
    { value: "warehouse", labelAr: "المستودعات", labelEn: "Warehouse" },
  ];

  const getTypeLabel = (item: typeof documentTypes[number]) => item.label || (isAr ? item.labelAr : item.labelEn);
  const getDeptLabel = (item: typeof departments[number]) => item.label || (isAr ? item.labelAr : item.labelEn);

  const filteredDocuments = documents.filter((doc) => {
    const title = isAr ? doc.title : doc.titleEn;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || doc.type === selectedType;
    // Assuming departments logic will be added to AppContext later if needed, 
    // for now we filter based on what's available
    return matchesSearch && matchesType;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-enterprise"
    >
      <div className="p-5 border-b border-border/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t.approvedDocsLibrary}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{t.approvedDocCount(filteredDocuments.length)}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Input
                placeholder={t.searchDocs}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={isRtl ? "pr-9" : "pl-9"}
              />
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRtl ? "right-3" : "left-3"}`} />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-36">
                <Tag className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`} />
                <SelectValue placeholder={t.type} />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {getTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-40">
                <Building2 className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`} />
                <SelectValue placeholder={t.department} />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {getDeptLabel(dept)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center border border-border rounded-lg p-1">
              <Button variant="ghost" size="icon" className={cn("h-8 w-8", viewMode === "grid" && "bg-secondary")} onClick={() => setViewMode("grid")}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className={cn("h-8 w-8", viewMode === "list" && "bg-secondary")} onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group p-4 bg-secondary/30 hover:bg-secondary/50 rounded-xl border border-border/50 transition-all hover:shadow-md"
              >
                <div className="aspect-[3/4] bg-gradient-surface rounded-lg mb-4 flex items-center justify-center border border-border/30">
                  <FileText className="w-16 h-16 text-primary/30" />
                </div>
                <h4 className="font-medium text-foreground line-clamp-2 mb-2">{isAr ? doc.title : doc.titleEn}</h4>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">{isAr ? doc.type : doc.typeEn}</Badge>
                  <span className="text-xs text-muted-foreground">v{doc.version}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{isAr ? doc.typeEn : doc.typeEn}</span>
                  <span>{new Date(doc.updatedAt).toLocaleDateString(isAr ? "ar-SA" : "en-US")}</span>
                </div>
                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1 gap-1"
                    onClick={() => setSelectedDocId(doc.id)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {t.view}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Download className="w-3.5 h-3.5" />
                    {t.download}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group flex items-center gap-4 p-4 bg-secondary/20 hover:bg-secondary/40 rounded-xl transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{isAr ? doc.title : doc.titleEn}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{isAr ? doc.typeEn : doc.typeEn}</span>
                    <span>•</span>
                    <span>v{doc.version}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(doc.updatedAt).toLocaleDateString(isAr ? "ar-SA" : "en-US")}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setSelectedDocId(doc.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="w-4 h-4" /></Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem className="gap-2">
                        <Archive className="w-4 h-4" />
                        <span>{t.archive}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDocId(null)}>
        <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 sm:p-6 border-b border-border/50 bg-secondary/10 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold">
                  {isAr ? selectedDoc?.title : selectedDoc?.titleEn}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-[10px] sm:text-xs">{isAr ? selectedDoc?.type : selectedDoc?.typeEn}</Badge>
                  <span className="hidden sm:inline">•</span>
                  <span>v{selectedDoc?.version}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{new Date(selectedDoc?.updatedAt || "").toLocaleDateString(isAr ? "ar-SA" : "en-US")}</span>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="flex-grow overflow-y-auto">
            <div className="p-5 sm:p-8">
              <div 
                className={cn(
                  "prose prose-sm sm:prose-base max-w-none dark:prose-invert",
                  isAr ? "text-right" : "text-left"
                )}
                dangerouslySetInnerHTML={{ __html: selectedDoc?.content || "" }}
              />

              {selectedDoc?.stakeholders && selectedDoc.stakeholders.length > 0 && (
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50">
                  <h4 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                    <UsersIcon className="size-4 sm:size-5 text-primary" />
                    {isAr ? "سجل المراجعة والاعتماد" : "Review & Approval Trail"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {selectedDoc.stakeholders.map((s) => (
                      <div 
                        key={s.id}
                        className={cn(
                          "p-3 sm:p-4 rounded-xl border flex flex-col gap-2 sm:gap-3",
                          s.status === "approved" ? "bg-success/5 border-success/20" : 
                          s.status === "rejected" ? "bg-destructive/5 border-destructive/20" : 
                          "bg-muted/30 border-border/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="size-7 sm:size-8 rounded-full bg-background flex items-center justify-center text-[10px] sm:text-xs font-bold border border-border/50">
                              {(isAr ? s.name : s.nameEn).charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium">{isAr ? s.name : s.nameEn}</p>
                              <p className="text-[9px] sm:text-[10px] text-muted-foreground">{isAr ? s.role : s.roleEn}</p>
                            </div>
                          </div>
                          {s.status === "approved" ? (
                            <Badge className="bg-success text-success-foreground gap-1 h-5 sm:h-6 text-[10px] sm:text-xs">
                              <CheckCircle2 className="size-2.5 sm:size-3" />
                              {isAr ? "وافق" : "Approved"}
                            </Badge>
                          ) : s.status === "rejected" ? (
                            <Badge variant="destructive" className="gap-1 h-5 sm:h-6 text-[10px] sm:text-xs">
                              <XCircle className="size-2.5 sm:size-3" />
                              {isAr ? "رفض" : "Rejected"}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1 h-5 sm:h-6 text-[10px] sm:text-xs">
                              <Clock className="size-2.5 sm:size-3" />
                              {isAr ? "قيد الانتظار" : "Pending"}
                            </Badge>
                          )}
                        </div>
                        {s.reason && (
                          <div className="p-2 bg-background/50 rounded-lg text-[10px] sm:text-xs flex gap-2 items-start border border-border/20">
                            <MessageIcon className="size-2.5 sm:size-3 mt-0.5 text-muted-foreground shrink-0" />
                            <p className="text-muted-foreground italic leading-relaxed">
                              {s.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-3 sm:p-4 border-t border-border/50 bg-secondary/5 shrink-0 flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setSelectedDocId(null)}>
              {isAr ? "إغلاق" : "Close"}
            </Button>
            <Button size="sm" className="w-full sm:w-auto gap-2">
              <Download className="w-4 h-4" />
              {isAr ? "تحميل PDF" : "Download PDF"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
