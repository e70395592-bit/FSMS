import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
  addDocument: (doc: Omit<Document, "id" | "createdAt" | "updatedAt" | "history">) => Promise<string>;
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
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch documents
      const { data: docs, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (docsError) throw docsError;
      if (docs) setDocuments(docs.map(data => ({
        id: data.id,
        title: data.title,
        titleEn: data.title_en,
        type: data.type,
        typeEn: data.type_en,
        version: data.version,
        status: data.status,
        progress: data.progress,
        stakeholders: data.stakeholders,
        content: data.content,
        authorId: data.author_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        history: data.history
      })));

      // Fetch profiles (users)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;
      if (profiles && profiles.length > 0) {
        const mappedUsers = profiles.map(p => ({
          id: p.id,
          name: p.name,
          nameEn: p.name_en,
          role: p.role,
          roleEn: p.role_en,
          email: p.email,
          avatar: p.avatar_url
        }));
        setUsers(mappedUsers);
        // Set current user if not already set or if it's the first fetch
        if (!currentUser || currentUser.id.startsWith('u')) {
          setCurrentUser(mappedUsers[0]);
        }
      }

      // Fetch notifications
      const { data: notes, error: notesError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (notesError) throw notesError;
      if (notes) setNotifications(notes.map(n => ({
        id: n.id,
        userId: n.user_id,
        title: n.title,
        titleEn: n.title_en,
        message: n.message,
        messageEn: n.message_en,
        documentId: n.document_id,
        type: n.type,
        read: n.read,
        createdAt: n.created_at
      })));

    } catch (error: any) {
      console.error('Error fetching data:', error.message);
      // Fallback to empty/mock if DB not setup yet
    } finally {
      setLoading(false);
    }
  }, [currentUser.id]);

  useEffect(() => {
    fetchData();
    
    // Subscribe to changes
    const docsSubscription = supabase
      .channel('public:documents')
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'documents' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(docsSubscription);
    };
  }, [fetchData]);

  const addDocument = useCallback(async (doc: Omit<Document, "id" | "createdAt" | "updatedAt" | "history">) => {
    try {
      const newDoc = {
        title: doc.title,
        title_en: doc.titleEn,
        type: doc.type,
        type_en: doc.typeEn,
        version: doc.version,
        status: doc.status,
        progress: doc.progress,
        stakeholders: doc.stakeholders,
        content: doc.content,
        author_id: currentUser.id,
        history: [{
          version: doc.version,
          date: new Date().toISOString(),
          action: "إنشاء",
          user: currentUser.name
        }]
      };

      const { data, error } = await supabase
        .from('documents')
        .insert([newDoc])
        .select()
        .single();

      if (error) throw error;
      
      // Map Supabase snake_case to CamelCase
      const mappedDoc: Document = {
        id: data.id,
        title: data.title,
        titleEn: data.title_en,
        type: data.type,
        typeEn: data.type_en,
        version: data.version,
        status: data.status,
        progress: data.progress,
        stakeholders: data.stakeholders,
        content: data.content,
        authorId: data.author_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        history: data.history
      };

      setDocuments(prev => [mappedDoc, ...prev]);
      return mappedDoc.id;
    } catch (error: any) {
      console.error('Error adding document:', error.message);
      toast.error("Failed to add document");
      return "";
    }
  }, [currentUser]);

  const updateDocument = useCallback(async (id: string, updates: Partial<Document>) => {
    try {
      const doc = documents.find(d => d.id === id);
      if (!doc) return;

      const newHistory = [...doc.history];
      if (updates.content !== undefined) {
        newHistory.unshift({
          version: doc.version,
          date: new Date().toISOString(),
          action: "تعديل",
          user: currentUser.name
        });
      }

      // Map CamelCase to snake_case for DB
      const dbUpdates: any = {
        ...updates,
        updated_at: new Date().toISOString(),
        history: newHistory
      };
      
      if (updates.titleEn) dbUpdates.title_en = updates.titleEn;
      if (updates.typeEn) dbUpdates.type_en = updates.typeEn;
      if (updates.authorId) dbUpdates.author_id = updates.authorId;
      
      // Remove CamelCase keys
      delete dbUpdates.titleEn;
      delete dbUpdates.typeEn;
      delete dbUpdates.authorId;
      delete dbUpdates.createdAt;
      delete dbUpdates.updatedAt;

      const { error } = await supabase
        .from('documents')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      
      setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates, history: newHistory } : d));
    } catch (error: any) {
      console.error('Error updating document:', error.message);
      toast.error("Failed to update document");
    }
  }, [currentUser, documents]);

  const sendForApproval = useCallback(async (docId: string, stakeholderIds: string[]) => {
    try {
      const doc = documents.find(d => d.id === docId);
      if (!doc) return;

      const newStakeholders: Stakeholder[] = stakeholderIds.map(id => {
        const user = users.find(u => u.id === id)!;
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

      const { error } = await supabase
        .from('documents')
        .update({
          status: "review",
          stakeholders: [...doc.stakeholders, ...newStakeholders],
          history: newHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', docId);

      if (error) throw error;

      // Add notifications for stakeholders
      const newNotifications = stakeholderIds.map(id => ({
        user_id: id,
        title: "طلب مراجعة مستند",
        title_en: "Document Review Request",
        message: `يرجى مراجعة المستند: ${doc.title}`,
        message_en: `Please review document: ${doc.titleEn}`,
        document_id: docId,
        type: "info",
        read: false
      }));

      await supabase.from('notifications').insert(newNotifications);
      
      await fetchData();
    } catch (error: any) {
      console.error('Error sending for approval:', error.message);
      toast.error("Failed to send for approval");
    }
  }, [documents, currentUser, users, fetchData]);

  const approveDocument = useCallback(async (docId: string, userId: string) => {
    try {
      const doc = documents.find(d => d.id === docId);
      if (!doc) return;

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

      const { error } = await supabase
        .from('documents')
        .update({
          stakeholders: updatedStakeholders,
          progress,
          status,
          history: newHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', docId);

      if (error) throw error;

      // Notify author if approved
      if (status === "approved") {
        await supabase.from('notifications').insert([{
          user_id: doc.authorId,
          title: "تم اعتماد المستند",
          title_en: "Document Approved",
          message: `تم اعتماد المستند نهائياً: ${doc.title}`,
          message_en: `Document fully approved: ${doc.titleEn}`,
          document_id: docId,
          type: "success",
          read: false
        }]);
      }
      
      await fetchData();
    } catch (error: any) {
      console.error('Error approving document:', error.message);
      toast.error("Failed to approve document");
    }
  }, [currentUser, documents, fetchData]);

  const rejectDocument = useCallback(async (docId: string, userId: string, reason: string) => {
    try {
      const doc = documents.find(d => d.id === docId);
      if (!doc) return;

      const updatedStakeholders = doc.stakeholders.map(s => 
        s.id === userId ? { ...s, status: "rejected" as const, reason } : s
      );

      const newHistory = [{
        version: doc.version,
        date: new Date().toISOString(),
        action: "رفض",
        user: currentUser.name
      }, ...doc.history];

      const { error } = await supabase
        .from('documents')
        .update({
          stakeholders: updatedStakeholders,
          status: "rejected" as const,
          history: newHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', docId);

      if (error) throw error;

      // Notify author about rejection
      await supabase.from('notifications').insert([{
        user_id: doc.authorId,
        title: "تم رفض المستند",
        title_en: "Document Rejected",
        message: `تم رفض المستند: ${doc.title}. السبب: ${reason}`,
        message_en: `Document rejected: ${doc.titleEn}. Reason: ${reason}`,
        document_id: docId,
        type: "error",
        read: false
      }]);
      
      await fetchData();
    } catch (error: any) {
      console.error('Error rejecting document:', error.message);
      toast.error("Failed to reject document");
    }
  }, [currentUser, documents, fetchData]);

  const switchUser = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  }, [users]);

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error: any) {
      console.error('Error marking notification as read:', error.message);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      documents,
      currentUser,
      notifications,
      users,
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
