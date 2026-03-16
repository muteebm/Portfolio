import React from 'react';
import GlowCursor from '../components/portfolio/effects/GlowCursor';
import Navbar from '../components/portfolio/Navbar';
import HeroSection from '../components/portfolio/HeroSection';
import AboutSection from '../components/portfolio/AboutSection';
import ExperienceSection from '../components/portfolio/ExperienceSection';
import ProjectsSection from '../components/portfolio/ProjectsSection';
import SkillsSection from '../components/portfolio/SkillsSection';
import ContactSection from '../components/portfolio/ContactSection';

export default function Portfolio() {
    return (
        <div className="bg-[#030712] min-h-screen" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
            <GlowCursor />
            <Navbar />
            <HeroSection />
            <AboutSection />
            <ExperienceSection />
            <ProjectsSection />
            <SkillsSection />
            <ContactSection />
        </div>
    );
}