import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { SkillsSection } from "../components/SkillsSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { PartnersSection } from "../components/PartnersSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";

export const Home = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-marsupial-purple">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <PartnersSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
