import { createContext, useContext, useState, ReactNode } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  setLang: () => {},
  isRtl: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("ar");

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRtl: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

// Translation dictionary
export const translations = {
  ar: {
    // TopNavBar
    systemName: "نظام إدارة الجودة وسلامة الغذاء",
    fsms: "FSMS",
    relatedLinks: "روابط ذات صلة",
    searchPlaceholder: "البحث في المستندات والسجلات...",
    plan: "الخطة:",
    users: "المستخدمين:",
    haccpPlans: "خطط HACCP:",
    renewal: "التجديد:",
    manageAccount: "إدارة الحساب",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",

    // Sidebar
    dashboard: "لوحة التحكم",
    meetings: "إدارة الاجتماعات",
    quality: "إدارة الجودة",
    ccp: "نقاط التحكم الحرجة",
    nonconformance: "إدارة حالات عدم المطابقة",
    customers: "إدارة العملاء",
    suppliers: "إدارة الموردين",
    audits: "إدارة التدقيق",
    maintenance: "إدارة الصيانة والمعايرة",
    inventory: "تتبع المنتجات",
    documents: "إدارة المستندات",
    library: "مكتبة المستندات",
    complaints: "الشكاوى والملاحظات",
    usersNav: "المستخدمين",
    version: "الإصدار 2.1.0",

    // Index page
    mainDashboard: "لوحة التحكم الرئيسية",
    welcomeMessage: "مرحباً بك في نظام إدارة الجودة وسلامة الغذاء",
    approvedDocs: "المستندات المعتمدة",
    ccpPoints: "نقاط التحكم الحرجة",
    nonConformities: "حالات عدم المطابقة",
    productTracking: "تتبع المنتجات",
    openComplaints: "الشكاوى المفتوحة",
    thisMonth: "هذا الشهر",
    monitoring: "مراقبة",
    decrease: "انخفاض",
    stable: "مستقر",
    resolved: "تم حلها",
    workspace: "منطقة العمل",
    documentsTab: "المستندات",

    // WorkspacePanel
    workspaceTitle: "منطقة العمل والتحرير",
    workspaceSubtitle: "إنشاء وتحرير واعتماد المستندات",
    newDocument: "مستند جديد",
    procedure: "إجراء",
    policy: "سياسة",
    workInstruction: "تعليمات عمل",
    form: "نموذج",
    table: "جدول",
    checklist: "قائمة تحقق",
    openTemplate: "قالب مفتوح",
    editing: "التحرير",
    approval: "الاعتماد",
    history: "السجل",
    save: "حفظ",
    sendForReview: "إرسال للمراجعة",
    versionLabel: "الإصدار",
    lastSaved: "آخر حفظ: قبل 5 دقائق",
    protected: "محمي",
    previousVersions: "3 إصدارات سابقة",
    approvalProgress: "تقدم الاعتماد",
    approvers: "المعتمدين",
    afterApprovalNote: "بعد اكتمال جميع الموافقات، سيتم تحويل المستند تلقائياً إلى PDF مؤمّن مع ختم زمني وسجل الموافقات.",
    draft: "مسودة",
    underReview: "قيد المراجعة",
    approved: "معتمد",
    pending: "في الانتظار",
    approvedStatus: "وافق",
    rejected: "رفض",
    edit: "تعديل",
    approvalAction: "اعتماد",
    review: "مراجعة",
    create: "إنشاء",

    // DocumentsLibrary
    approvedDocsLibrary: "مكتبة المستندات المعتمدة",
    approvedDocCount: (n: number) => `${n} مستند معتمد`,
    searchDocs: "البحث في المستندات...",
    type: "النوع",
    department: "القسم",
    all: "الكل",
    view: "عرض",
    download: "تحميل",
    archive: "أرشفة",

    // DataTable
    viewAll: "عرض الكل",
    controlPoint: "نقطة التحكم",
    parameter: "المعيار",
    limit: "الحد",
    actual: "الفعلي",
    status: "الحالة",
    time: "الوقت",
    operator: "المشغل",
    normal: "طبيعي",
    warning: "تحذير",
    critical: "حرج",
    resolvedStatus: "معالَج",
    viewDetails: "عرض التفاصيل",
    addNote: "إضافة ملاحظة",
    openCorrectiveAction: "فتح إجراء تصحيحي",

    // DocumentStatusCard
    lastModified: "آخر تعديل:",
    approversLabel: "المعتمدين",

    // Document types/departments
    procedureType: "إجراء",
    policyType: "سياسة",
    workInstructionType: "تعليمات عمل",
    formType: "نموذج",
    recordType: "سجل",
    guideType: "دليل",
    qualityDept: "الجودة",
    seniorMgmt: "الإدارة العليا",
    productionDept: "الإنتاج",
    warehouseDept: "المستودعات",

    // Editor content
    objective: "1. الهدف",
    objectiveText: "يهدف هذا الإجراء إلى تحديد الخطوات اللازمة لمعالجة حالات عدم المطابقة المكتشفة أثناء عمليات التدقيق الداخلي والخارجي، وضمان اتخاذ الإجراءات التصحيحية المناسبة.",
    scope: "2. نطاق التطبيق",
    scopeText: "ينطبق هذا الإجراء على جميع أقسام المنشأة وعملياتها التي تخضع لنظام إدارة الجودة وسلامة الغذاء.",
    responsibilities: "3. المسؤوليات",
    responsibility1: "مدير الجودة: مسؤول عن متابعة تنفيذ الإجراءات التصحيحية",
    responsibility2: "مشرفو الأقسام: مسؤولون عن تطبيق الإجراءات في أقسامهم",
    responsibility3: "فريق التدقيق: مسؤول عن التحقق من فعالية الإجراءات",
  },
  en: {
    // TopNavBar
    systemName: "Food Safety Management System",
    fsms: "FSMS",
    relatedLinks: "Related Links",
    searchPlaceholder: "Search documents & records...",
    plan: "Plan:",
    users: "Users:",
    haccpPlans: "HACCP Plans:",
    renewal: "Renewal:",
    manageAccount: "Manage Account",
    profile: "Profile",
    logout: "Sign Out",

    // Sidebar
    dashboard: "Dashboard",
    meetings: "Meetings Management",
    quality: "Quality Management",
    ccp: "Critical Control Points",
    nonconformance: "Non-Conformance Management",
    customers: "Customer Management",
    suppliers: "Supplier Management",
    audits: "Audit Management",
    maintenance: "Maintenance & Calibration",
    inventory: "Product Tracking",
    documents: "Document Management",
    library: "Document Library",
    complaints: "Complaints & Feedback",
    usersNav: "Users",
    version: "Version 2.1.0",

    // Index page
    mainDashboard: "Main Dashboard",
    welcomeMessage: "Welcome to the Food Safety Management System",
    approvedDocs: "Approved Documents",
    ccpPoints: "Critical Control Points",
    nonConformities: "Non-Conformities",
    productTracking: "Product Tracking",
    openComplaints: "Open Complaints",
    thisMonth: "This Month",
    monitoring: "Monitoring",
    decrease: "Decreased",
    stable: "Stable",
    resolved: "Resolved",
    workspace: "Workspace",
    documentsTab: "Documents",

    // WorkspacePanel
    workspaceTitle: "Workspace & Editing",
    workspaceSubtitle: "Create, edit, and approve documents",
    newDocument: "New Document",
    procedure: "Procedure",
    policy: "Policy",
    workInstruction: "Work Instruction",
    form: "Form",
    table: "Table",
    checklist: "Checklist",
    openTemplate: "Open Template",
    editing: "Editor",
    approval: "Approval",
    history: "History",
    save: "Save",
    sendForReview: "Send for Review",
    versionLabel: "Version",
    lastSaved: "Last saved: 5 minutes ago",
    protected: "Protected",
    previousVersions: "3 previous versions",
    approvalProgress: "Approval Progress",
    approvers: "Approvers",
    afterApprovalNote: "After all approvals are completed, the document will be automatically converted to a secured PDF with a timestamp and approval trail.",
    draft: "Draft",
    underReview: "Under Review",
    approved: "Approved",
    pending: "Pending",
    approvedStatus: "Approved",
    rejected: "Rejected",
    edit: "Edit",
    approvalAction: "Approval",
    review: "Review",
    create: "Create",

    // DocumentsLibrary
    approvedDocsLibrary: "Approved Documents Library",
    approvedDocCount: (n: number) => `${n} approved documents`,
    searchDocs: "Search documents...",
    type: "Type",
    department: "Department",
    all: "All",
    view: "View",
    download: "Download",
    archive: "Archive",

    // DataTable
    viewAll: "View All",
    controlPoint: "Control Point",
    parameter: "Parameter",
    limit: "Limit",
    actual: "Actual",
    status: "Status",
    time: "Time",
    operator: "Operator",
    normal: "Normal",
    warning: "Warning",
    critical: "Critical",
    resolvedStatus: "Resolved",
    viewDetails: "View Details",
    addNote: "Add Note",
    openCorrectiveAction: "Open Corrective Action",

    // DocumentStatusCard
    lastModified: "Last modified:",
    approversLabel: "Approvers",

    // Document types/departments
    procedureType: "Procedure",
    policyType: "Policy",
    workInstructionType: "Work Instruction",
    formType: "Form",
    recordType: "Record",
    guideType: "Guide",
    qualityDept: "Quality",
    seniorMgmt: "Senior Management",
    productionDept: "Production",
    warehouseDept: "Warehouse",

    // Editor content
    objective: "1. Objective",
    objectiveText: "This procedure aims to define the steps necessary to handle non-conformance cases discovered during internal and external audits, and to ensure appropriate corrective actions are taken.",
    scope: "2. Scope",
    scopeText: "This procedure applies to all departments and operations of the facility that are subject to the food safety and quality management system.",
    responsibilities: "3. Responsibilities",
    responsibility1: "Quality Manager: Responsible for monitoring the implementation of corrective actions",
    responsibility2: "Department Supervisors: Responsible for applying procedures in their departments",
    responsibility3: "Audit Team: Responsible for verifying the effectiveness of procedures",
  },
} as const;

export type Translations = typeof translations.ar;

export function useTranslations() {
  const { lang } = useLanguage();
  return translations[lang];
}
