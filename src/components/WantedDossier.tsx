import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, MapPin, Award, ShieldAlert, EyeOff, ShieldCheck,
    ChevronRight, Camera, Video, Music, Info, User
} from 'lucide-react';
import { COLORS } from '@/lib/theme';

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

interface WantedDossierProps {
    person: WantedPerson | null;
    onClose: () => void;
}

export const WantedDossier: React.FC<WantedDossierProps> = ({ person, onClose }) => {
    const [activeView, setActiveView] = useState<'info' | 'photo' | 'video'>('info');

    // Mock additional media
    const media = {
        photos: [person?.image, "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&h=400&fit=crop"],
        videos: ["https://www.w3schools.com/html/mov_bbb.mp4"],
    };

    return (
        <AnimatePresence>
            {person && (
                <div key="dossier-root">
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40"
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', zIndex: 1060 }}
                    />

                    {/* Side Dossier Drawer */}
                    <motion.div
                        key="dossier-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        className="fixed right-0 top-0 h-100 bg-white shadow-2xl overflow-hidden flex flex-column"
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            height: '100vh',
                            width: '38vw',
                            minWidth: '420px',
                            maxWidth: '650px',
                            zIndex: 1070,
                            background: '#fdf6e3', // Classic file folder/parchment background
                            borderLeft: '12px solid #3d2b1f', // Wooden edge
                            boxShadow: '-20px 0 50px rgba(0,0,0,0.3)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Dossier Tabs/Header */}
                        <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <div className="p-1 rounded bg-danger"><ShieldAlert size={18} /></div>
                                <h6 className="fw-bold mb-0 letter-spacing-2" style={{ fontSize: '13px' }}>DOSSIER: #{person.id.toString().padStart(5, '0')}</h6>
                            </div>
                            <button onClick={onClose} className="btn btn-sm btn-outline-light border-0"><X size={20} /></button>
                        </div>

                        {/* Top Profile Section (Compact) */}
                        <div className="p-4 border-bottom border-dark border-opacity-10 d-flex gap-3 align-items-center bg-white bg-opacity-50">
                            <div className="flex-shrink-0 position-relative">
                                <div className="border border-3 border-dark overflow-hidden shadow-sm" style={{ width: '90px', height: '110px' }}>
                                    <img src={person.image} className="w-100 h-100 object-fit-cover" style={{ filter: 'sepia(0.2) contrast(1.1)' }} />
                                </div>
                                <div className="position-absolute bottom-0 end-0 bg-danger text-white px-2 py-0 fw-bold" style={{ fontSize: '8px' }}>
                                    {person.risk}
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h2 className="fw-bold mb-0 text-dark" style={{ fontFamily: 'serif', fontSize: '28px' }}>{person.name.toUpperCase()}</h2>
                                <p className="mb-2 text-muted fw-bold">Alias: <span className="text-danger">"{person.alias}"</span></p>
                                <div className="d-flex gap-2">
                                    <span className="badge bg-dark rounded-0 px-3 py-2">{person.reward} BOUNTY</span>
                                    <span className="badge bg-outline-dark border border-dark text-dark rounded-0 px-3 py-2">REWARD ELIGIBLE</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="d-flex bg-white bg-opacity-30 border-bottom border-dark border-opacity-10">
                            <button
                                onClick={() => setActiveView('info')}
                                className={`flex-grow-1 py-3 px-2 border-0 fw-bold small text-uppercase letter-spacing-1 transition-all ${activeView === 'info' ? 'bg-dark text-white' : 'text-muted hover-bg-dark'}`}
                            >
                                Intelligence
                            </button>
                            <button
                                onClick={() => setActiveView('photo')}
                                className={`flex-grow-1 py-3 px-2 border-0 fw-bold small text-uppercase letter-spacing-1 transition-all ${activeView === 'photo' ? 'bg-dark text-white' : 'text-muted hover-bg-dark'}`}
                            >
                                Mugshots
                            </button>
                            <button
                                onClick={() => setActiveView('video')}
                                className={`flex-grow-1 py-3 px-2 border-0 fw-bold small text-uppercase letter-spacing-1 transition-all ${activeView === 'video' ? 'bg-dark text-white' : 'text-muted hover-bg-dark'}`}
                            >
                                CCTV Footages
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-4 overflow-auto flex-grow-1 dossier-scroll">
                            {activeView === 'info' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    {/* Intelligence Profile Card */}
                                    <div className="p-4 bg-white border border-dark border-opacity-20 shadow-sm rounded-1 mb-4" style={{ position: 'relative' }}>
                                        <div className="position-absolute top-0 end-0 p-2 opacity-10"><Info size={40} /></div>
                                        <h6 className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: '10px', letterSpacing: '1px' }}>Case Summary & MO</h6>
                                        <p className="mb-0 text-dark lead" style={{ fontSize: '15px', lineHeight: '1.7', fontFamily: 'serif' }}>{person.description}</p>
                                    </div>

                                    {/* Data Grid */}
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <div className="bg-white p-3 border border-dark border-opacity-10 rounded-1 d-flex gap-3 align-items-center shadow-sm">
                                                <div className="text-danger"><MapPin size={24} /></div>
                                                <div>
                                                    <p className="small text-muted mb-0 fw-bold" style={{ fontSize: '9px' }}>LAST KNOWN AREA</p>
                                                    <p className="mb-0 fw-bold text-dark small">{person.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="bg-white p-3 border border-dark border-opacity-10 rounded-1 d-flex gap-3 align-items-center shadow-sm">
                                                <div className="text-dark"><User size={24} /></div>
                                                <div>
                                                    <p className="small text-muted mb-0 fw-bold" style={{ fontSize: '9px' }}>CITIZEN RISK</p>
                                                    <p className="mb-0 fw-bold text-danger small">{person.risk} LEVEL</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Advisory Label */}
                                    <div className="mt-4 p-3 border-2 border-dashed border-danger bg-danger bg-opacity-5 d-flex gap-3 align-items-center">
                                        <ShieldAlert className="text-danger" size={32} />
                                        <p className="mb-0 text-danger-emphasis fw-bold small">
                                            CLASSIFIED: Do not approach. Informant identities are obfuscated.
                                            Contact specialized unit or use the buttons below.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {activeView === 'photo' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="row g-2">
                                    {media.photos.map((src, i) => (
                                        <div key={i} className="col-6">
                                            <div className="bg-white p-1 border border-dark border-opacity-20 shadow-sm">
                                                <img src={src} className="w-100 object-fit-cover" style={{ height: '160px', filter: 'grayscale(0.3)' }} />
                                                <div className="py-1 text-center small fw-bold text-muted" style={{ fontSize: '8px' }}>ASSET_MUG_{i + 1}</div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeView === 'video' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="bg-black p-1 border border-dark mb-3">
                                        <video src={media.videos[0]} className="w-100" controls />
                                    </div>
                                    <div className="alert alert-dark p-2 border-0 rounded-0 d-flex gap-2 align-items-center">
                                        <Video size={16} />
                                        <span className="small fw-bold">Live intelligence exfiltration from Area: {person.location}</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer Action Bar */}
                        <div className="p-4 bg-white border-top border-dark border-opacity-10 shadow-lg">
                            <div className="row g-2">
                                <div className="col-7">
                                    <button className="btn btn-dark w-100 fw-bold py-3 d-flex align-items-center justify-content-center gap-2 rounded-0 hover-scale">
                                        <ShieldCheck size={20} /> SUBMIT SIGHTING
                                    </button>
                                </div>
                                <div className="col-5">
                                    <button className="btn btn-outline-dark w-100 fw-bold py-3 rounded-0 hover-scale">
                                        <Award size={20} className="text-danger" /> REWARD TIP
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            <style jsx global>{`
                .letter-spacing-1 { letter-spacing: 1px; }
                .letter-spacing-2 { letter-spacing: 2px; }
                .dossier-scroll::-webkit-scrollbar { width: 4px; }
                .dossier-scroll::-webkit-scrollbar-track { background: transparent; }
                .dossier-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); }
                .hover-bg-dark:hover { background: rgba(0,0,0,0.05); }
                .hover-scale:hover { transform: scale(1.02); transition: 0.2s; }
            `}</style>
        </AnimatePresence>
    );
};
