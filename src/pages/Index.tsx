import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { DocumentsLibrary } from "@/components/dashboard/DocumentsLibrary";
import { WorkspacePanel } from "@/components/dashboard/WorkspacePanel";
import {
  FileText,
  AlertTriangle,
  Package,
  MessageSquare,
  Target,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "@/contexts/LanguageContext";

export default function Index() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const t = useTranslations();

  const kpiData = [
    {
      title: t.approvedDocs,
      value: 247,
      icon: <FileText className="w-4 h-4" />,
      trend: { value: 12, direction: "up" as const, label: t.thisMonth },
      variant: "default" as const,
    },
    {
      title: t.ccpPoints,
      value: 12,
      icon: <Target className="w-4 h-4" />,
      trend: { value: 0, direction: "neutral" as const, label: t.monitoring },
      variant: "success" as const,
    },
    {
      title: t.nonConformities,
      value: 8,
      icon: <AlertTriangle className="w-4 h-4" />,
      trend: { value: 15, direction: "down" as const, label: t.decrease },
      variant: "warning" as const,
    },
    {
      title: t.productTracking,
      value: "1,247",
      icon: <Package className="w-4 h-4" />,
      trend: { value: 0, direction: "neutral" as const, label: t.stable },
      variant: "accent" as const,
    },
    {
      title: t.openComplaints,
      value: 3,
      icon: <MessageSquare className="w-4 h-4" />,
      trend: { value: 25, direction: "down" as const, label: t.resolved },
      variant: "destructive" as const,
    },
  ];

  return (
    <MainLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t.mainDashboard}</h1>
        <p className="text-muted-foreground mt-1">{t.welcomeMessage}</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            trend={kpi.trend}
            variant={kpi.variant}
            delay={index * 0.05}
          />
        ))}
      </section>

      <Tabs defaultValue="workspace" className="space-y-6">
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="workspace">{t.workspace}</TabsTrigger>
          <TabsTrigger value="library">{t.documentsTab}</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace">
          <WorkspacePanel />
        </TabsContent>

        <TabsContent value="library">
          <DocumentsLibrary />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
