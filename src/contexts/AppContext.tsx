import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type DocumentStatus = "draft" | "review" | "approved" | "rejected";

export interface Stakeholder {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  status: "pending" | "approved" | "rejected";
  reason?: string;
}

export interface HistoryRecord {
  version: string;
  date: string;
  action: string;
  user: string;
}

export interface Document {
  id: string;
  title: string;
  titleEn: string;
  type: string;
  typeEn: string;
  version: string;
  status: DocumentStatus;
  progress: number;
  stakeholders: Stakeholder[];
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  history: HistoryRecord[];
}

export interface User {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  email: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  titleEn: string;
  message: string;
  messageEn: string;
  documentId?: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

interface AppContextType {
  documents: Document[];
  currentUser: User;
  notifications: Notification[];
  users: User[];
  addDocument: (doc: Omit<Document, "id" | "createdAt" | "updatedAt" | "history">) => string;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  sendForApproval: (docId: string, stakeholderIds: string[]) => void;
  approveDocument: (docId: string, userId: string) => void;
  rejectDocument: (docId: string, userId: string, reason: string) => void;
  switchUser: (userId: string) => void;
  markNotificationRead: (id: string) => void;
}

const mockUsers: User[] = [
  { id: "u1", name: "أحمد محمد", nameEn: "Ahmed Mohammed", role: "مدير الجودة", roleEn: "Quality Manager", email: "ahmed@company.sa" },
  { id: "u2", name: "سارة علي", nameEn: "Sara Ali", role: "مشرف الإنتاج", roleEn: "Production Supervisor", email: "sara@company.sa" },
  { id: "u3", name: "خالد سعيد", nameEn: "Khaled Saeed", role: "المدير العام", roleEn: "General Manager", email: "khaled@company.sa" },
  { id: "u4", name: "ليلى أحمد", nameEn: "Layla Ahmed", role: "مسؤولة المختبر", roleEn: "Lab In-charge", email: "layla@company.sa" },
  { id: "u5", name: "محمد حسن", nameEn: "Mohammed Hassan", role: "مدير الصيانة", roleEn: "Maintenance Manager", email: "mohammed@company.sa" },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addDocument = useCallback((doc: Omit<Document, "id" | "createdAt" | "updatedAt" | "history">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newDoc: Document = {
      ...doc,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [{
        version: doc.version,
        date: new Date().toISOString(),
        action: "إنشاء",
        user: currentUser.name
      }]
    };
    setDocuments(prev => [newDoc, ...prev]);
    return id;
  }, [currentUser]);

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        const newHistory = [...doc.history];
        if (updates.content !== undefined) {
          newHistory.unshift({
            version: doc.version,
            date: new Date().toISOString(),
            action: "تعديل",
            user: currentUser.name
          });
        }
        return { ...doc, ...updates, history: newHistory, updatedAt: new Date().toISOString() };
      }
      return doc;
    }));
  }, [currentUser]);

  const sendForApproval = useCallback((docId: string, stakeholderIds: string[]) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    const newStakeholders: Stakeholder[] = stakeholderIds.map(id => {
      const user = mockUsers.find(u => u.id === id)!;
      return {
        id: user.id,
        name: user.name,
        nameEn: user.nameEn,
        role: user.role,
        roleEn: user.roleEn,
        status: "pending"
      };
    });

    const newHistory = [{
      version: doc.version,
      date: new Date().toISOString(),
      action: "إرسال للمراجعة",
      user: currentUser.name
    }, ...doc.history];

    updateDocument(docId, {
      status: "review",
      stakeholders: [...doc.stakeholders, ...newStakeholders],
      history: newHistory
    });

    // Add notifications for stakeholders
    const newNotifications: Notification[] = stakeholderIds.map(id => ({
      id: Math.random().toString(36).substr(2, 9),
      userId: id,
      title: "طلب مراجعة مستند",
      titleEn: "Document Review Request",
      message: `يرجى مراجعة المستند: ${doc.title}`,
      messageEn: `Please review document: ${doc.titleEn}`,
      documentId: docId,
      type: "info",
      read: false,
      createdAt: new Date().toISOString(),
    }));

    setNotifications(prev => [...newNotifications, ...prev]);
  }, [documents, updateDocument]);

  const approveDocument = useCallback((docId: string, userId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const updatedStakeholders = doc.stakeholders.map(s => 
          s.id === userId ? { ...s, status: "approved" as const } : s
        );
        const approvedCount = updatedStakeholders.filter(s => s.status === "approved").length;
        const progress = Math.floor((approvedCount / updatedStakeholders.length) * 100);
        const status = progress === 100 ? "approved" as const : "review" as const;

        const newHistory = [{
          version: doc.version,
          date: new Date().toISOString(),
          action: "موافقة",
          user: currentUser.name
        }, ...doc.history];

        // Notify author if approved
        if (status === "approved") {
          const authorNotification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            userId: doc.authorId,
            title: "تم اعتماد المستند",
            titleEn: "Document Approved",
            message: `تم اعتماد المستند نهائياً: ${doc.title}`,
            messageEn: `Document fully approved: ${doc.titleEn}`,
            documentId: docId,
            type: "success",
            read: false,
            createdAt: new Date().toISOString(),
          };
          setNotifications(prev => [authorNotification, ...prev]);
        }

        return { ...doc, stakeholders: updatedStakeholders, progress, status, history: newHistory, updatedAt: new Date().toISOString() };
      }
      return doc;
    }));
  }, [currentUser]);

  const rejectDocument = useCallback((docId: string, userId: string, reason: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const updatedStakeholders = doc.stakeholders.map(s => 
          s.id === userId ? { ...s, status: "rejected" as const, reason } : s
        );

        const newHistory = [{
          version: doc.version,
          date: new Date().toISOString(),
          action: "رفض",
          user: currentUser.name
        }, ...doc.history];

        // Notify author about rejection
        const authorNotification: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          userId: doc.authorId,
          title: "تم رفض المستند",
          titleEn: "Document Rejected",
          message: `تم رفض المستند: ${doc.title}. السبب: ${reason}`,
          messageEn: `Document rejected: ${doc.titleEn}. Reason: ${reason}`,
          documentId: docId,
          type: "error",
          read: false,
          createdAt: new Date().toISOString(),
        };
        setNotifications(prev => [authorNotification, ...prev]);

        return { ...doc, stakeholders: updatedStakeholders, status: "rejected" as const, history: newHistory, updatedAt: new Date().toISOString() };
      }
      return doc;
    }));
  }, [currentUser]);

  const switchUser = useCallback((userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  return (
    <AppContext.Provider value={{
      documents,
      currentUser,
      notifications,
      users: mockUsers,
      addDocument,
      updateDocument,
      sendForApproval,
      approveDocument,
      rejectDocument,
      switchUser,
      markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
