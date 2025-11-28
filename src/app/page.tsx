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
    givenName: "Nuralim",
    jobTitle: personalInfo.title,
    email: personalInfo.email,
    telephone: personalInfo.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jakarta",
      addressCountry: "ID",
      streetAddress: "Segara City Cluster Baltic, SC 2.9 No.8",
    },
    url: "https://nuralim.dev",
    sameAs: [
      personalInfo.social.linkedin,
      personalInfo.social.tiktok,
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
      "C# Programming",
      "Microservices Architecture",
      "Team Leadership",
      "Technical Management",
      "Engineering Management",
      "Agile Methodology",
      "Architecture Design",
    ],
    workLocation: {
      "@type": "City",
      name: "Jakarta",
      address: {
        "@type": "Country",
        name: "Indonesia",
      },
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nuralim Portfolio",
    url: "https://nuralim.dev",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Contact",
      email: personalInfo.email,
      telephone: personalInfo.phone,
    },
    sameAs: [
      personalInfo.social.linkedin,
      personalInfo.social.tiktok,
      personalInfo.social.instagram,
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
