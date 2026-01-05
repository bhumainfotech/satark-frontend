"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, AlertTriangle, Phone, ChevronUp, ChevronDown, Award, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, GRADIENTS, SHADOWS } from '@/lib/theme';
import { WantedDossier } from '@/components/WantedDossier';

interface WantedPerson {
    id: number;
    name: string;
    alias: string;
    location: string;
    priority: string;
    reward: string;
    image: string;
    description: string;
    risk: 'EXTREME' | 'HIGH' | 'MODERATE';
}

const MOST_WANTED: WantedPerson[] = [
    {
        id: 1,
        name: "Vikram 'Shaka' Singh",
        alias: "The Ghost",
        location: "Last seen South Delhi",
        priority: "CRITICAL",
        reward: "₹5,00,000 CASH BOUNTY",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop",
        description: "Wanted for multiple high-profile burglaries and organized crime. Highly dangerous. Deep scar on right forearm.",
        risk: 'EXTREME'
    },
    {
        id: 2,
        name: "Sandeep Malhotra",
        alias: "Fin-Wizard",
        location: "NCR Region",
        priority: "HIGH",
        reward: "₹3,00,000",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop",
        description: "Economic offender involved in ₹200Cr financial fraud. Speaks 4 languages fluently.",
        risk: 'HIGH'
    },
    {
        id: 3,
        name: "Rocky 'Binder' ",
        alias: "The Bull",
        location: "GT Road Area",
        priority: "CRITICAL",
        reward: "₹2,00,000 CASH REWARD",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&h=200&fit=crop",
        description: "Known for extortion and assault. Last seen traveling in a black modified SUV.",
        risk: 'EXTREME'
    },
    {
        id: 4,
        name: "Anonymous Cyber Hive",
        alias: "Operator-0",
        location: "Digital / Unknown",
        priority: "HIGH",
        reward: "₹1,50,000",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=200&h=200&fit=crop",
        description: "Targeting governmental portals for data exfiltration. Information leading to physical location needed.",
        risk: 'HIGH'
    },
];

export default function RightSidebar() {
    const [selectedPerson, setSelectedPerson] = useState<WantedPerson | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pauseTimer = useRef<NodeJS.Timeout | null>(null);

    // Infinite Autoscroll Logic
    useEffect(() => {
        if (isPaused) return;

        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scrollInterval = setInterval(() => {
            if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 2) {
                scrollContainer.scrollTop = 0;
            } else {
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollTop + 1,
                    behavior: 'auto'
                });
            }
        }, 30);

        return () => clearInterval(scrollInterval);
    }, [isPaused]);

    const handleHoverStart = () => {
        setIsPaused(true);
        if (pauseTimer.current) clearTimeout(pauseTimer.current);
    };

    const handleHoverEnd = () => {
        pauseTimer.current = setTimeout(() => {
            setIsPaused(false);
        }, 3000); // Resume after 3 seconds of leaving hover
    };

    const scrollUp = () => {
        if (scrollRef.current) scrollRef.current.scrollTop -= 100;
    };

    const scrollDown = () => {
        if (scrollRef.current) scrollRef.current.scrollTop += 100;
    };

    return (
        <div className="d-none d-xl-block h-100">
            <div className="sticky-top" style={{ top: '100px', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>

                {/* Most Wanted Film Strip */}
                <div className="card border-0 shadow-sm mb-3 overflow-hidden flex-grow-1" style={{ borderRadius: '16px', background: COLORS.surface }}>
                    <div className="card-header bg-transparent border-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold small text-uppercase mb-0" style={{ color: COLORS.textSecondary }}>Most Wanted</h6>
                        <div className="d-flex gap-1">
                            <button onClick={scrollUp} className="btn btn-sm btn-light rounded-circle p-1"><ChevronUp size={14} /></button>
                            <button onClick={scrollDown} className="btn btn-sm btn-light rounded-circle p-1"><ChevronDown size={14} /></button>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="card-body p-2 overflow-hidden"
                        style={{ height: '0', flexGrow: 1, cursor: 'pointer' }}
                        onMouseEnter={handleHoverStart}
                        onMouseLeave={handleHoverEnd}
                    >
                        <div className="d-flex flex-column gap-3 py-2">
                            {/* Double items for infinite look */}
                            {[...MOST_WANTED, ...MOST_WANTED].map((person, idx) => (
                                <motion.div
                                    key={`${person.id}-${idx}`}
                                    whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 1 : -1 }}
                                    onClick={() => setSelectedPerson(person)}
                                    className="p-0 overflow-hidden transition-all shadow-sm position-relative"
                                    style={{
                                        background: '#fdf6e3', // Parchment color
                                        border: '8px solid #3d2b1f', // Heavy wooden/old frame
                                        borderRadius: '4px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                        minHeight: '120px'
                                    }}
                                >
                                    {/* Rugged Texture Overlay */}
                                    <div className="position-absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'url(https://www.transparenttextures.com/patterns/pinstriped-suit.png)' }}></div>

                                    <div className="text-center bg-dark py-1">
                                        <span className="fw-bold text-white letter-spacing-2" style={{ fontSize: '9px' }}>WANTED</span>
                                    </div>

                                    <div className="p-2 d-flex flex-column align-items-center">
                                        <div className="border border-2 border-dark mb-1" style={{ padding: '2px' }}>
                                            <img src={person.image} style={{ width: '80px', height: '80px', objectFit: 'cover', filter: 'sepia(0.3) contrast(1.1)' }} />
                                        </div>
                                        <h6 className="fw-bold mb-0 text-center" style={{ fontSize: '11px', color: '#3d2b1f', fontFamily: 'serif' }}>{person.name.toUpperCase()}</h6>
                                        <p className="small mb-0 fw-bold text-danger" style={{ fontSize: '12px' }}>{person.reward}</p>
                                    </div>

                                    <div className="text-center pb-1">
                                        <span className="badge rounded-0 bg-transparent text-dark border border-dark border-opacity-25" style={{ fontSize: '7px' }}>JURISDICTION: {person.location}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div className="text-center p-2 border-top bg-light" style={{ fontSize: '10px' }}>
                        <span className="text-muted fw-bold pulsing-dot">LIVE UPDATES</span>
                    </div>
                </div>

                {/* Emergency Contacts */}
                <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: '12px', background: '#FFF5F5' }}>
                    <div className="card-body p-3 d-flex align-items-center justify-content-between">
                        <div>
                            <h6 className="fw-bold text-danger mb-1">Emergency?</h6>
                            <p className="small text-muted mb-0">Call 112 / 100</p>
                        </div>
                        <button className="btn btn-danger btn-sm rounded-circle p-2 shadow-sm pulsing-btn">
                            <Phone size={20} fill="white" />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-2 mt-auto">
                    <p className="small text-muted mb-1" style={{ fontSize: '10px' }}>
                        © 2026 Delhi Police Satark Portal
                    </p>
                </div>
            </div>

            <WantedDossier person={selectedPerson as any} onClose={() => setSelectedPerson(null)} />
        </div>
    );
}
