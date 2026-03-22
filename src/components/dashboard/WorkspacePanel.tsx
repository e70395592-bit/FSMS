import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FileText,
  FileCheck,
  ClipboardList,
  Table2,
  CheckSquare,
  FolderOpen,
  Send,
  Save,
  History,
  Users,
  Lock,
  ChevronDown,
  PenLine,
  UserPlus,
  Check,
  X,
  MessageSquare,
  List as ListIcon,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useLanguage, useTranslations } from "@/contexts/LanguageContext";
import { useAppContext, DocumentStatus } from "@/contexts/AppContext";
import { RichTextEditor } from "./RichTextEditor";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export function WorkspacePanel() {
  const { lang, isRtl } = useLanguage();
  const t = useTranslations();
  const isAr = lang === "ar";
  
  const { 
    documents, 
    currentUser, 
    users, 
    addDocument, 
    updateDocument, 
    sendForApproval, 
    approveDocument, 
    rejectDocument 
  } = useAppContext();

  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showDocList, setShowDocList] = useState(true);

  const activeDoc = documents.find(d => d.id === activeDocId);

  // Initialize with a mock document if none exists
  useEffect(() => {
    if (documents.length === 0) {
      const initialContent = `
        <h2>${t.objective}</h2>
        <p>${t.objectiveText}</p>
        <h2>${t.scope}</h2>
        <p>${t.scopeText}</p>
        <h2>${t.responsibilities}</h2>
        <ul>
          <li>${t.responsibility1}</li>
          <li>${t.responsibility2}</li>
          <li>${t.responsibility3}</li>
        </ul>
      `;
      addDocument({
        title: "إجراء معالجة عدم المطابقة",
        titleEn: "Non-Conformance Handling Procedure",
        type: "procedure",
        typeEn: "Procedure",
        version: "2.1",
        status: "review",
        progress: 67,
        stakeholders: [
          { id: "u1", name: "أحمد محمد", nameEn: "Ahmed Mohammed", role: "مدير الجودة", roleEn: "Quality Manager", status: "approved" },
          { id: "u2", name: "سارة علي", nameEn: "Sara Ali", role: "مشرف الإنتاج", roleEn: "Production Supervisor", status: "approved" },
          { id: "u3", name: "خالد سعيد", nameEn: "Khaled Saeed", role: "المدير العام", roleEn: "General Manager", status: "pending" },
        ],
        content: initialContent,
        authorId: "u1",
      });
    }
  }, [documents.length, addDocument, t]);

  // Set active doc when list updates
  useEffect(() => {
    if (documents.length > 0 && !activeDocId) {
      setActiveDocId(documents[0].id);
      setEditorContent(documents[0].content);
    }
  }, [documents, activeDocId]);

  // Update editor content when active doc changes
  useEffect(() => {
    if (activeDoc) {
      setEditorContent(activeDoc.content);
    }
  }, [activeDocId]);

  const handleSave = useCallback(() => {
    if (activeDocId && activeDoc) {
      if (editorContent === activeDoc.content) {
        toast.info(isAr ? "لا توجد تغييرات لحفظها" : "No changes to save");
        return;
      }
      updateDocument(activeDocId, { content: editorContent });
      toast.success(isAr ? "تم حفظ المستند بنجاح" : "Document saved successfully");
    }
  }, [activeDocId, activeDoc, editorContent, updateDocument, isAr]);

  const handleSendForReview = useCallback(() => {
    if (activeDocId && selectedUsers.length > 0) {
      sendForApproval(activeDocId, selectedUsers);
      setIsSendDialogOpen(false);
      setSelectedUsers([]);
      toast.success(isAr ? "تم إرسال المستند للمراجعة" : "Document sent for review");
    }
  }, [activeDocId, selectedUsers, sendForApproval, isAr]);

  const handleApprove = useCallback(() => {
    if (activeDocId) {
      approveDocument(activeDocId, currentUser.id);
      toast.success(isAr ? "تمت الموافقة على المستند" : "Document approved");
    }
  }, [activeDocId, currentUser.id, approveDocument, isAr]);

  const handleReject = useCallback(() => {
    if (activeDocId && rejectReason.trim()) {
      rejectDocument(activeDocId, currentUser.id, rejectReason);
      setIsRejectDialogOpen(false);
      setRejectReason("");
      toast.info(isAr ? "تم رفض المستند" : "Document rejected");
    }
  }, [activeDocId, currentUser.id, rejectReason, rejectDocument, isAr]);

  const handleNewDocument = useCallback((typeId: string) => {
    const docType = documentTypes.find(t => t.id === typeId);
    const newDoc = {
      title: isAr ? "مستند جديد" : "New Document",
      titleEn: "New Document",
      type: typeId,
      typeEn: docType?.labelEn || typeId,
      version: "1.0",
      status: "draft" as DocumentStatus,
      progress: 0,
      stakeholders: [],
      content: "",
      authorId: currentUser.id,
    };
    const id = addDocument(newDoc);
    setActiveDocId(id);
    setEditorContent("");
    toast.info(isAr ? "تم إنشاء مستند جديد" : "New document created");
  }, [isAr, currentUser.id, addDocument]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const documentTypes = [
    { id: "procedure", label: t.procedure, labelEn: "Procedure", icon: FileText },
    { id: "policy", label: t.policy, labelEn: "Policy", icon: FileCheck },
    { id: "instruction", label: t.workInstruction, labelEn: "Instruction", icon: ClipboardList },
    { id: "form", label: t.form, labelEn: "Form", icon: FileText },
    { id: "table", label: t.table, labelEn: "Table", icon: Table2 },
    { id: "checklist", label: t.checklist, labelEn: "Checklist", icon: CheckSquare },
    { id: "template", label: t.openTemplate, labelEn: "Template", icon: FolderOpen },
  ];

  const statusStyles = {
    draft: { label: t.draft, className: "bg-warning-light text-warning" },
    review: { label: t.underReview, className: "bg-info-light text-info" },
    approved: { label: t.approved, className: "bg-success-light text-success" },
    rejected: { label: isAr ? "مرفوض" : "Rejected", className: "bg-destructive-light text-destructive" },
  };

  const stakeholderStatusStyles = {
    pending: { label: t.pending, className: "bg-muted text-muted-foreground" },
    approved: { label: t.approvedStatus, className: "bg-success-light text-success" },
    rejected: { label: t.rejected, className: "bg-destructive-light text-destructive" },
  };

  const isReviewer = activeDoc?.stakeholders.some(s => s.id === currentUser.id && s.status === "pending");

  return (
    <div className="flex gap-4 h-[calc(100vh-180px)]">
      {/* Sidebar Document List */}
      <AnimatePresence>
        {showDocList && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="card-enterprise p-0 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-secondary/10">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <ListIcon className="w-4 h-4" />
                {isAr ? "قائمة المستندات" : "Document List"}
              </h3>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowDocList(false)}>
                {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
            <ScrollArea className="flex-grow">
              <div className="p-2 space-y-1">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDocId(doc.id)}
                    className={cn(
                      "w-full text-right p-3 rounded-lg transition-all flex flex-col gap-1 border border-transparent",
                      activeDocId === doc.id 
                        ? "bg-primary/5 border-primary/20 shadow-sm" 
                        : "hover:bg-secondary/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-xs font-medium px-1.5 py-0.5 rounded",
                        statusStyles[doc.status].className
                      )}>
                        {statusStyles[doc.status].label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">v{doc.version}</span>
                    </div>
                    <span className={cn(
                      "text-sm font-medium truncate",
                      isAr ? "text-right" : "text-left"
                    )}>
                      {isAr ? doc.title : doc.titleEn}
                    </span>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{isAr ? doc.typeEn : doc.typeEn}</span>
                      <span>{new Date(doc.updatedAt).toLocaleDateString(isAr ? "ar-SA" : "en-US")}</span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="flex-grow card-enterprise overflow-hidden flex flex-col"
      >
        {!showDocList && (
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-4 left-4 z-10 h-8 w-8 rounded-full shadow-md"
            onClick={() => setShowDocList(true)}
          >
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        )}

        <div className="p-5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{t.workspaceTitle}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{t.workspaceSubtitle}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  {t.newDocument}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {documentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <DropdownMenuItem 
                      key={type.id} 
                      className="gap-2 cursor-pointer"
                      onClick={() => handleNewDocument(type.id)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{type.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ScrollArea className="flex-grow">
          <div className="p-5">
            {activeDoc ? (
              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="editor" className="gap-2">
                    <PenLine className="w-4 h-4" />
                    {t.editing}
                  </TabsTrigger>
                  <TabsTrigger value="approval" className="gap-2">
                    <Users className="w-4 h-4" />
                    {t.approval}
                  </TabsTrigger>
                  <TabsTrigger value="history" className="gap-2">
                    <History className="w-4 h-4" />
                    {t.history}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/40">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          {isAr ? activeDoc.title : activeDoc.titleEn}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{isAr ? activeDoc.typeEn : activeDoc.typeEn}</span>
                          <span>•</span>
                          <span>{t.versionLabel} {activeDoc.version}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={statusStyles[activeDoc.status].className}>
                        {statusStyles[activeDoc.status].label}
                      </Badge>
                      
                      <div className="flex items-center gap-2">
                        {isReviewer ? (
                          <div className="flex items-center gap-2 p-1 bg-primary/5 rounded-lg border border-primary/20">
                            <Button size="sm" variant="default" className="bg-success hover:bg-success/90 h-8 gap-1" onClick={handleApprove}>
                              <Check className="w-3 h-3" />
                              {isAr ? "موافقة" : "Approve"}
                            </Button>
                            <Button size="sm" variant="destructive" className="h-8 gap-1" onClick={() => setIsRejectDialogOpen(true)}>
                              <X className="w-3 h-3" />
                              {isAr ? "رفض" : "Reject"}
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="gap-2 h-8" onClick={handleSave}>
                              <Save className="w-4 h-4" />
                              {t.save}
                            </Button>
                            <Button size="sm" className="gap-2 h-8" onClick={() => setIsSendDialogOpen(true)}>
                              <Send className="w-4 h-4" />
                              {t.sendForReview}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {activeDoc.status === "rejected" && (
                    <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-destructive">{isAr ? "تم رفض هذا المستند" : "This document was rejected"}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isAr ? "سبب الرفض:" : "Reason:"} {activeDoc.stakeholders.find(s => s.status === "rejected")?.reason}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="min-h-[400px]">
                    <RichTextEditor 
                      content={editorContent} 
                      onChange={setEditorContent} 
                      isAr={isAr}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="approval" className="space-y-4">
                  <div className="p-4 bg-secondary/30 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground">{t.approvalProgress}</span>
                      <span className="text-sm text-muted-foreground">{activeDoc.progress}%</span>
                    </div>
                    <Progress value={activeDoc.progress} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">{t.approvers}</h4>
                    {activeDoc.stakeholders.map((stakeholder, index) => (
                      <motion.div
                        key={stakeholder.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col p-4 bg-card border border-border/50 rounded-xl"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {(isAr ? stakeholder.name : stakeholder.nameEn).charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{isAr ? stakeholder.name : stakeholder.nameEn}</p>
                              <p className="text-sm text-muted-foreground">{isAr ? stakeholder.role : stakeholder.roleEn}</p>
                            </div>
                          </div>
                          <Badge className={stakeholderStatusStyles[stakeholder.status].className}>
                            {stakeholderStatusStyles[stakeholder.status].label}
                          </Badge>
                        </div>
                        {stakeholder.reason && (
                          <div className="mt-3 p-3 bg-muted/30 rounded-lg text-xs flex gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <p className="text-muted-foreground italic">{stakeholder.reason}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <div className="space-y-3">
                    {activeDoc.history.map((record, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">v{record.version}</Badge>
                          <span className="font-medium text-foreground">{record.action}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{record.user}</span>
                          <span>{new Date(record.date).toLocaleDateString(isAr ? "ar-SA" : "en-US")}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground gap-4">
                <FileText className="w-12 h-12 opacity-20" />
                <p>{isAr ? "لم يتم العثور على مستندات" : "No documents found"}</p>
                <Button onClick={() => handleNewDocument("procedure")}>
                  <Plus className="w-4 h-4 gap-2" />
                  {isAr ? "إنشاء مستند أول" : "Create first document"}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </motion.div>

      {/* Send for Review Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isAr ? "إرسال للمراجعة" : "Send for Review"}</DialogTitle>
            <DialogDescription>
              {isAr ? "اختر المستخدمين الذين ترغب في إرسال المستند إليهم للمراجعة والاعتماد." : "Select the users you want to send the document to for review and approval."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[300px] overflow-y-auto">
            {users.filter(u => u.id !== currentUser.id).map((user) => (
              <div key={user.id} className="flex items-center space-x-3 space-x-reverse">
                <Checkbox 
                  id={user.id} 
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => toggleUserSelection(user.id)}
                />
                <label 
                  htmlFor={user.id}
                  className="flex flex-col flex-grow cursor-pointer"
                >
                  <span className="text-sm font-medium text-foreground">{isAr ? user.name : user.nameEn}</span>
                  <span className="text-xs text-muted-foreground">{isAr ? user.role : user.roleEn}</span>
                </label>
              </div>
            ))}
          </div>
          <DialogFooter className="flex-row-reverse sm:justify-between gap-2">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsSendDialogOpen(false)}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button 
              type="button" 
              className="gap-2"
              onClick={handleSendForReview}
              disabled={selectedUsers.length === 0}
            >
              <Send className="w-4 h-4" />
              {isAr ? "إرسال الآن" : "Send Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">{isAr ? "رفض المستند" : "Reject Document"}</DialogTitle>
            <DialogDescription>
              {isAr ? "يرجى ذكر سبب الرفض لمساعدة الكاتب على تصحيح المستند." : "Please provide a reason for rejection to help the author correct the document."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder={isAr ? "اكتب سبب الرفض هنا..." : "Type rejection reason here..."}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter className="flex-row-reverse sm:justify-between gap-2">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsRejectDialogOpen(false)}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              className="gap-2"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              <X className="w-4 h-4" />
              {isAr ? "تأكيد الرفض" : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
