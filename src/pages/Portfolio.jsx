import React from 'react';
import CustomCursor from '../components/portfolio/effects/CustomCursor.jsx';
import GrainOverlay from '../components/portfolio/effects/GrainOverlay';
import AudioSystem from '../components/portfolio/effects/AudioSystem.jsx';
import HiddenTerminal from '../components/portfolio/effects/HiddenTerminal';
import ThreeScene from '../components/portfolio/effects/ThreeScene.jsx';
import Preloader from '../components/portfolio/Preloader';
import Navbar from '../components/portfolio/Navbar';
import CommandPalette from '../components/portfolio/CommandPalette';
import HeroSection from '../components/portfolio/HeroSection';
import AboutSection from '../components/portfolio/AboutSection';
import FeaturedWork from '../components/portfolio/FeaturedWork';
import ProjectsSection from '../components/portfolio/ProjectsSection';
import ExperienceSection from '../components/portfolio/ExperienceSection';
import SkillsSection from '../components/portfolio/SkillsSection';
import ContactSection from '../components/portfolio/ContactSection';
import { useEasterEggs } from '@/hooks/use-easter-eggs';
import { useScrollOrchestrator } from '@/hooks/use-scroll-orchestrator';

export default function Portfolio() {
    useEasterEggs();
    useScrollOrchestrator();

    return (
        <div className="bg-[#030712] min-h-screen relative">
            {/* Fixed full-viewport 3D backdrop — persists across all sections */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ThreeScene />
            </div>
            {/* Readability scrim so content stays legible over the scene */}
            <div className="fixed inset-0 z-0 pointer-events-none content-scrim" />

            <CustomCursor />
            <GrainOverlay />
            <AudioSystem />
            <HiddenTerminal />
            <CommandPalette />
            <Preloader />
            <Navbar />

            <main className="relative z-[2]">
                <HeroSection />
                <AboutSection />
                <FeaturedWork />
                <ProjectsSection />
                <ExperienceSection />
                <SkillsSection />
                <ContactSection />
            </main>
        </div>
    );
}
