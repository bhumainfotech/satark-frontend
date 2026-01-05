"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { COLORS, GRADIENTS, SHADOWS } from '@/lib/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, MapPin, AlertTriangle, X, Search, Grid, List, Award, ShieldAlert } from 'lucide-react';
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
    featured?: boolean;
}

const MOST_WANTED_DATA: WantedPerson[] = [
    {
        id: 1,
        name: "Vikram 'Shaka' Singh",
        alias: "The Ghost",
        location: "Last seen South Delhi",
        priority: "CRITICAL",
        reward: "₹5,00,000 CASH BOUNTY",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=crop",
        description: "Wanted for multiple high-profile burglaries and organized crime. Highly dangerous. Deep scar on right forearm.",
        risk: 'EXTREME',
        featured: true
    },
    {
        id: 2,
        name: "Sandeep Malhotra",
        alias: "Fin-Wizard",
        location: "NCR Region",
        priority: "HIGH",
        reward: "₹3,00,000",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop",
        description: "Economic offender involved in ₹200Cr financial fraud. Speaks 4 languages fluently.",
        risk: 'HIGH'
    },
    {
        id: 3,
        name: "Rocky 'Binder'",
        alias: "The Bull",
        location: "GT Road Area",
        priority: "CRITICAL",
        reward: "₹2,00,000 CASH REWARD",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&h=400&fit=crop",
        description: "Known for extortion and assault. Last seen traveling in a black modified SUV.",
        risk: 'EXTREME',
        featured: true
    },
    {
        id: 4,
        name: "Anonymous Cyber Hive",
        alias: "Operator-0",
        location: "Digital / Unknown",
        priority: "HIGH",
        reward: "₹1,50,000",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&h=400&fit=crop",
        description: "Targeting governmental portals for data exfiltration. Information leading to physical location needed.",
        risk: 'HIGH'
    },
];

export default function MostWantedPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedPerson, setSelectedPerson] = useState<WantedPerson | null>(null);

    return (
        <main className="min-vh-100" style={{ background: GRADIENTS.bg }}>
            <Header />

            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <div>
                        <h1 className="display-4 fw-bold mb-0" style={{ color: COLORS.navyBlue }}>Most Wanted</h1>
                        <p className="text-muted lead mb-0">Confidentiality guaranteed. All info rewarded.</p>
                    </div>

                    <div className="d-flex gap-2 bg-white p-1 rounded-3 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-dark' : 'btn-light'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`btn btn-sm ${viewMode === 'list' ? 'btn-dark' : 'btn-light'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                <div className={viewMode === 'grid' ? 'row g-2 g-md-3' : 'd-flex flex-column gap-2'}>
                    {MOST_WANTED_DATA.map((person) => (
                        <div key={person.id} className={viewMode === 'grid' ? 'col-6 col-md-3 col-lg-2' : 'w-100'}>
                            <motion.div
                                whileHover={{ scale: 1.02, y: -5 }}
                                onClick={() => setSelectedPerson(person)}
                                className="card border-0 overflow-hidden cursor-pointer"
                                style={{
                                    borderRadius: '8px',
                                    background: '#fdf6e3',
                                    border: '6px solid #3d2b1f',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }}
                            >
                                <div className="bg-dark text-white text-center py-1 fw-bold small letter-spacing-2" style={{ fontSize: '10px' }}>WANTED</div>

                                <div className={viewMode === 'grid' ? 'p-2' : 'd-flex p-2 gap-3'}>
                                    <div className="mx-auto border border-dark border-1 shadow-sm" style={{ width: viewMode === 'grid' ? '110px' : '80px', height: viewMode === 'grid' ? '130px' : '100px', overflow: 'hidden' }}>
                                        <img
                                            src={person.image}
                                            className="w-100 h-100 object-fit-cover"
                                            style={{ filter: 'grayscale(0.1) contrast(1.1) sepia(0.1)' }}
                                        />
                                    </div>
                                    <div className="mt-2 text-center" style={{ flexGrow: 1, textAlign: viewMode === 'grid' ? 'center' : 'left' }}>
                                        <div className="d-flex justify-content-center gap-1 mb-1 flex-wrap">
                                            <span className={`badge px-2 py-1 ${person.risk === 'EXTREME' ? 'bg-danger' : 'bg-warning text-dark'}`} style={{ fontSize: '8px' }}>{person.risk} RISK</span>
                                        </div>
                                        <h6 className="fw-bold mb-0 text-dark" style={{ fontFamily: 'serif', fontSize: '11px', lineHeight: '1.2' }}>{person.name.toUpperCase()}</h6>
                                        <p className="text-muted mb-1 fw-bold" style={{ fontSize: '8px' }}>{person.alias}</p>
                                        <div className="badge bg-danger rounded-0 mb-1 py-1 px-2" style={{ fontSize: '8px', letterSpacing: '0.5px' }}>{person.reward}</div>
                                        <p className="text-secondary mb-0 d-flex align-items-center justify-content-center gap-1" style={{ fontSize: '9px' }}>
                                            <MapPin size={10} /> {person.location}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>

            <WantedDossier person={selectedPerson} onClose={() => setSelectedPerson(null)} />
        </main>
    );
}
