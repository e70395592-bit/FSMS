import { useState, ReactNode } from "react";
import { TopNavBar } from "./TopNavBar";
import { Sidebar } from "./Sidebar";
import { useLanguage } from "@/contexts/LanguageContext";

interface MainLayoutProps {
  children: ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function MainLayout({
  children,
  activeSection = "dashboard",
  onSectionChange,
}: MainLayoutProps) {
  const [currentSection, setCurrentSection] = useState(activeSection);
  const { isRtl } = useLanguage();

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    onSectionChange?.(section);
  };

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <TopNavBar />
      <Sidebar activeItem={currentSection} onItemClick={handleSectionChange} />
      <main className={`pt-16 min-h-screen transition-all duration-300 ${isRtl ? "pr-64" : "pl-64"}`}>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
