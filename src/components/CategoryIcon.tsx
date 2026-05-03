import iconDriving from "@/assets/icon-driving.png";
import iconCitizenship from "@/assets/icon-citizenship.png";
import iconEnglish from "@/assets/icon-english.png";
import iconEducation from "@/assets/icon-education.png";
import iconCareer from "@/assets/icon-career.png";
import iconProfessional from "@/assets/icon-professional.png";
import iconNhs from "@/assets/icon-nhs.png";
import iconFun from "@/assets/icon-fun.png";
import iconSecurity from "@/assets/icon-security.png";
import iconHospitality from "@/assets/icon-hospitality.png";
import iconConstruction from "@/assets/icon-construction.png";
import iconFinance from "@/assets/icon-finance.png";
import iconItTech from "@/assets/icon-it-tech.png";
import iconHealthcareEntry from "@/assets/icon-healthcare-entry.png";
import iconTeaching from "@/assets/icon-teaching.png";
import iconLegal from "@/assets/icon-legal.png";
import iconMilitary from "@/assets/icon-military.png";
import iconMaritimeAviation from "@/assets/icon-maritime-aviation.png";
import iconGovernment from "@/assets/icon-government.png";
import iconTaxi from "@/assets/icon-taxi.png";

// `name` is the lucide icon key kept in src/data/categories.ts so we don't have
// to migrate the data layer — we just map it to a premium illustrated PNG.
const iconMap: Record<string, string> = {
  Car: iconDriving,
  Crown: iconCitizenship,
  Languages: iconEnglish,
  GraduationCap: iconEducation,
  Briefcase: iconCareer,
  ShieldCheck: iconProfessional,
  HeartPulse: iconNhs,
  Sparkles: iconFun,
  Shield: iconSecurity,
  ChefHat: iconHospitality,
  HardHat: iconConstruction,
  Calculator: iconFinance,
  Cpu: iconItTech,
  Stethoscope: iconHealthcareEntry,
  BookOpen: iconTeaching,
  Scale: iconLegal,
  Siren: iconMilitary,
  Plane: iconMaritimeAviation,
  Landmark: iconGovernment,
  Taxi: iconTaxi,
};

export function CategoryIcon({
  name,
  className,
  alt = "",
}: {
  name: string;
  className?: string;
  alt?: string;
}) {
  const src = iconMap[name] ?? iconFun;
  return (
    <img
      src={src}
      alt={alt}
      width={512}
      height={512}
      loading="lazy"
      className={className}
      draggable={false}
    />
  );
}

// Soft tinted background plates used behind the icon on each card. Designed to
// echo the dominant colour of the illustrated icon for a cohesive premium feel.
// Icons are now flat coloured silhouettes — no background plate needed.
// Kept for backwards-compat with other places that still reference these keys.
export const accentClasses: Record<string, string> = {
  coral: "",
  gold: "",
  navy: "",
  success: "",
};
