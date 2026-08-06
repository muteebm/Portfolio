import React from 'react';
import CustomCursor from '../components/portfolio/effects/CustomCursor.jsx';
import GrainOverlay from '../components/portfolio/effects/GrainOverlay';
import AudioSystem from '../components/portfolio/effects/AudioSystem.jsx';
import HiddenTerminal from '../components/portfolio/effects/HiddenTerminal';
import ThreeScene from '../components/portfolio/effects/ThreeScene.jsx';
import Preloader from '../components/portfolio/Preloader';
import Navbar from '../components/portfolio/Navbar';
import HeroSection from '../components/portfolio/HeroSection';
import AboutSection from '../components/portfolio/AboutSection';
import ExperienceSection from '../components/portfolio/ExperienceSection';
import ProjectsSection from '../components/portfolio/ProjectsSection';
import SkillsSection from '../components/portfolio/SkillsSection';
import ContactSection from '../components/portfolio/ContactSection';
import { useEasterEggs } from '@/hooks/use-easter-eggs';
import { useScrollOrchestrator } from '@/hooks/use-scroll-orchestrator';

export default function Portfolio() {
    useEasterEggs();
    useScrollOrchestrator();

    return (
        <div className="bg-[#030712] min-h-screen relative" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
            {/* Fixed full-viewport 3D backdrop — persists across all sections */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ThreeScene />
            </div>
            {/* Depth vignette so content stays readable */}
            <div className="fixed inset-0 z-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(3,7,18,0.3), transparent 60%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(3,7,18,0.5), transparent 70%)' }}
            />

            <CustomCursor />
            <GrainOverlay />
            <AudioSystem />
            <HiddenTerminal />
            <Preloader />
            <Navbar />

            <main className="relative z-[2]">
                <HeroSection />
                <AboutSection />
                <ExperienceSection />
                <ProjectsSection />
                <SkillsSection />
                <ContactSection />
            </main>
        </div>
    );
}