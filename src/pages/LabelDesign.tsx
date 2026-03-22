import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Globe } from "lucide-react";
import zordProducts from "@/assets/zord-products.jpeg";

const labels = [
  {
    name: "ZORD",
    nameAr: "زؤرد",
    variant: "Blossom",
    subtitle: "LIQUID HAND SOAP",
    scent: "FRESH SCENT",
    gradient: "from-pink-400 via-rose-500 to-pink-600",
    bg: "bg-gradient-to-br from-pink-50 to-rose-100",
    accent: "#e91e63",
    badgeGradient: "from-rose-500 to-pink-600",
  },
  {
    name: "ZORD",
    nameAr: "زؤرد",
    variant: "Aqua",
    subtitle: "LIQUID HAND SOAP",
    scent: "FRESH SCENT",
    gradient: "from-blue-400 via-cyan-500 to-blue-600",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-100",
    accent: "#0288d1",
    badgeGradient: "from-blue-500 to-cyan-600",
  },
  {
    name: "ZORD",
    nameAr: "زؤرد",
    variant: "Green",
    subtitle: "LIQUID HAND SOAP",
    scent: "FRESH SCENT",
    gradient: "from-green-400 via-emerald-500 to-green-600",
    bg: "bg-gradient-to-br from-green-50 to-emerald-100",
    accent: "#2e7d32",
    badgeGradient: "from-green-500 to-emerald-600",
  },
];

const t = {
  ar: {
    pageTitle: "تصميم ملصقات ZORD - جاهز للطباعة",
    print: "طباعة",
    refImage: "صورة المنتج المرجعية",
    frontLabels: "الملصقات المنفصلة للطباعة",
    backLabels: "الملصقات الخلفية",
    backTitle: (v: string) => `صابون سائل لليدين - ${v}`,
    description: "صابون سائل معطر لليدين بتركيبة لطيفة تنظف وترطب البشرة. غني بالمكونات الطبيعية التي تحافظ على نعومة يديك.",
    ingredientsTitle: "المكونات:",
    ingredients: "ماء، صوديوم لوريث سلفات، كوكاميدوبروبيل بيتين، كلوريد الصوديوم، عطر، حمض الستريك، DMDM هيدانتوين، ميثيل كلورو أيزوثيازولينون",
    usageTitle: "طريقة الاستخدام:",
    usage: "ضع كمية مناسبة على اليدين المبللتين، افرك جيداً ثم اشطف بالماء.",
    warningsTitle: "تحذيرات:",
    warnings: "للاستخدام الخارجي فقط. تجنب ملامسة العينين. يحفظ بعيداً عن متناول الأطفال.",
    dir: "rtl" as const,
    textAlign: "text-right" as const,
  },
  en: {
    pageTitle: "ZORD Label Design - Print Ready",
    print: "Print",
    refImage: "Product Reference Image",
    frontLabels: "Individual Labels for Print",
    backLabels: "Back Labels",
    backTitle: (v: string) => `Liquid Hand Soap - ${v}`,
    description: "A gently fragranced liquid hand soap with a mild formula that cleanses and moisturizes the skin. Enriched with natural ingredients to keep your hands soft.",
    ingredientsTitle: "Ingredients:",
    ingredients: "Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Sodium Chloride, Fragrance, Citric Acid, DMDM Hydantoin, Methylchloroisothiazolinone",
    usageTitle: "Directions:",
    usage: "Apply an adequate amount to wet hands, lather well, then rinse with water.",
    warningsTitle: "Warnings:",
    warnings: "For external use only. Avoid contact with eyes. Keep out of reach of children.",
    dir: "ltr" as const,
    textAlign: "text-left" as const,
  },
};

const LabelDesign = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const tr = t[lang];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Controls */}
      <div className="print:hidden sticky top-0 z-50 bg-white/90 backdrop-blur border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {tr.pageTitle}
        </h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="gap-2"
          >
            <Globe className="w-4 h-4" />
            {lang === "ar" ? "English" : "عربي"}
          </Button>
          <Button onClick={handlePrint} className="gap-2 bg-[#004b84] hover:bg-[#003a66]">
            <Printer className="w-4 h-4" />
            {tr.print}
          </Button>
        </div>
      </div>

      {/* Print Area */}
      <div ref={printRef} className="p-8 print:p-0">
        {/* Product Reference Image */}
        <div className="max-w-4xl mx-auto mb-10 print:mb-6 print:break-after-page">
          <h2 className="text-lg font-semibold text-gray-600 mb-4 print:hidden">{tr.refImage}</h2>
          <div className="bg-white rounded-2xl shadow-lg p-6 print:shadow-none print:rounded-none">
            <img
              src={zordProducts}
              alt="ZORD Liquid Hand Soap Products"
              className="w-full object-contain max-h-[500px]"
            />
          </div>
        </div>

        {/* Front Labels */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-600 mb-6 print:hidden">{tr.frontLabels}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:grid-cols-3 print:gap-4">
            {labels.map((label) => (
              <div key={label.variant} className="print:break-inside-avoid">
                <div
                  className={`${label.bg} rounded-2xl print:rounded-lg overflow-hidden shadow-xl print:shadow-none border-2`}
                  style={{ borderColor: label.accent, aspectRatio: '3/5' }}
                >
                  <div className="h-full flex flex-col items-center justify-between p-6 text-center relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-b ${label.gradient} opacity-10`} />
                    
                    <div className="relative z-10 w-full">
                      <p className="text-2xl font-bold mb-1" style={{ color: label.accent, fontFamily: 'Cairo, sans-serif' }}>
                        {label.nameAr}
                      </p>
                      <h2
                        className="text-5xl font-black tracking-tight leading-none"
                        style={{ color: label.accent, textShadow: `2px 2px 4px ${label.accent}33`, fontFamily: 'Arial Black, sans-serif' }}
                      >
                        {label.name}
                      </h2>
                      <div className="mt-2">
                        <p className="text-sm font-bold tracking-widest text-gray-700">{label.subtitle}</p>
                      </div>
                    </div>

                    <div className="relative z-10 my-4">
                      <div
                        className={`w-20 h-20 rounded-xl bg-gradient-to-br ${label.badgeGradient} flex items-center justify-center shadow-lg`}
                        style={{ boxShadow: `0 8px 24px ${label.accent}44` }}
                      >
                        <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative z-10 w-full">
                      <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${label.badgeGradient} shadow-md`}>
                        <p className="text-white font-black text-lg tracking-wide">{label.variant}</p>
                      </div>
                      <p className="mt-2 text-xs font-bold tracking-[0.2em] uppercase" style={{ color: label.accent }}>
                        {label.scent}
                      </p>
                      <div className="mt-3 border-t pt-2" style={{ borderColor: `${label.accent}33` }}>
                        <p className="text-xs text-gray-500 font-medium">500 ml / 16.9 fl oz</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Back Labels */}
          <div className="mt-12 print:mt-8 print:break-before-page">
            <h2 className="text-lg font-semibold text-gray-600 mb-6 print:hidden">{tr.backLabels}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:grid-cols-3 print:gap-4">
              {labels.map((label) => (
                <div key={`back-${label.variant}`} className="print:break-inside-avoid">
                  <div
                    className="bg-white rounded-2xl print:rounded-lg overflow-hidden shadow-xl print:shadow-none border-2 p-5"
                    style={{ borderColor: label.accent, aspectRatio: '3/5' }}
                  >
                    <div className={`h-full flex flex-col justify-between ${tr.textAlign}`} dir={tr.dir}>
                      <div>
                        <h3 className="font-bold text-sm mb-2" style={{ color: label.accent, fontFamily: 'Cairo, sans-serif' }}>
                          {tr.backTitle(label.variant)}
                        </h3>
                        <p className="text-[10px] text-gray-600 leading-relaxed mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {tr.description}
                        </p>
                        
                        <h4 className="font-bold text-[10px] mb-1" style={{ color: label.accent, fontFamily: 'Cairo, sans-serif' }}>
                          {tr.ingredientsTitle}
                        </h4>
                        <p className="text-[8px] text-gray-500 leading-relaxed mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {tr.ingredients}
                        </p>

                        <h4 className="font-bold text-[10px] mb-1" style={{ color: label.accent, fontFamily: 'Cairo, sans-serif' }}>
                          {tr.usageTitle}
                        </h4>
                        <p className="text-[8px] text-gray-500 leading-relaxed mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {tr.usage}
                        </p>

                        <h4 className="font-bold text-[10px] mb-1" style={{ color: label.accent, fontFamily: 'Cairo, sans-serif' }}>
                          {tr.warningsTitle}
                        </h4>
                        <p className="text-[8px] text-gray-500 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {tr.warnings}
                        </p>
                      </div>

                      <div className="border-t pt-2 mt-2" style={{ borderColor: `${label.accent}33` }}>
                        <div className="flex justify-between items-end text-[7px] text-gray-400">
                          <div className="text-left" dir="ltr">
                            <p>Net: 500ml</p>
                            <p>Made in Egypt</p>
                          </div>
                          <div>
                            <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-[6px]">
                              BARCODE
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 10mm; size: A4; }
        }
      `}</style>
    </div>
  );
};

export default LabelDesign;
