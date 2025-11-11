import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { EducationSection } from "@/components/sections/education-section";
import { CertificationsSection } from "@/components/sections/certifications-section";
import { ContactSection } from "@/components/sections/contact-section";
import { personalInfo } from "@/data/portfolio";

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personalInfo.name,
    jobTitle: personalInfo.title,
    email: personalInfo.email,
    telephone: personalInfo.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jakarta",
      addressCountry: "ID",
    },
    url: "https://nuralim.dev",
    sameAs: [
      personalInfo.social.linkedin,
      personalInfo.social.github,
      personalInfo.social.instagram,
    ],
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Universitas MH Thamrin Jakarta",
      },
      {
        "@type": "EducationalOrganization",
        name: "Politeknik LP3I Jakarta",
      },
    ],
    knowsAbout: [
      "Software Engineering",
      "Product Development",
      "Backend Development",
      ".NET Development",
      "Microservices Architecture",
      "Team Leadership",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
          <ProjectsSection />
          <EducationSection />
          <CertificationsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
