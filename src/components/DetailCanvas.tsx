import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, MapPin, Calendar, AlertTriangle, Shield, EyeOff,
    Award, Clock, ImageIcon, Video,
    Info, AlertCircle, FileText, PlayCircle, Music, Download
} from 'lucide-react';
import Link from 'next/link';

import { COLORS, GRADIENTS } from '@/lib/theme';

interface DetailCanvasProps {
    leadId: string | number | null;
    onClose: () => void;
}

export const DetailCanvas: React.FC<DetailCanvasProps> = ({ leadId, onClose }) => {
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeMedia, setActiveMedia] = useState<any>(null);

    useEffect(() => {
        if (!leadId) {
            setLead(null);
            setActiveMedia(null);
            return;
        }

        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/public-leads/${leadId}`);
                if (!res.ok) throw new Error('Intelligence file restricted or not found.');
                const data = await res.json();
                setLead(data);
                // Set initial active media if available
                if (data.media && data.media.length > 0) {
                    setActiveMedia(data.media[0]);
                } else if (data.image_url) {
                    setActiveMedia({ file_path: data.image_url, file_type: 'IMAGE' });
                }
            } catch (err: any) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [leadId]);

    const renderDescription = (text: string) => {
        return text.split(/(\s+)/).map((part: string, i: number) =>
            part.startsWith('#') ? (
                <span key={`hash-${i}`} className="fw-bold text-primary">{part}</span>
            ) : (
                <React.Fragment key={`text-${i}`}>{part}</React.Fragment>
            )
        );
    };

    const getMediaIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Video size={18} />;
            case 'AUDIO': return <Clock size={18} />;
            case 'DOCUMENT': return <FileText size={18} />;
            default: return <ImageIcon size={18} />;
        }
    };

    return (
        <AnimatePresence>
            {leadId && (
                <div key="canvas-root">
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40"
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,80,0.3)', backdropFilter: 'blur(12px)', zIndex: 1040 }}
                    />

                    {/* Canvas Drawer */}
                    <motion.div
                        key="drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        className="fixed right-0 top-0 h-100 bg-white shadow-2xl border-start overflow-hidden flex flex-column"
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            height: '100vh',
                            width: '38vw',
                            minWidth: '420px',
                            maxWidth: '650px',
                            zIndex: 1050,
                            backgroundColor: '#fff',
                            borderTopLeftRadius: '24px',
                            borderBottomLeftRadius: '24px',
                            boxShadow: '-15px 0 40px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {loading ? (
                            <div className="d-flex flex-column align-items-center justify-content-center h-100 p-5 text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                >
                                    <Shield size={48} className="text-primary opacity-20" />
                                </motion.div>
                                <p className="mt-4 text-muted fw-bold">Retrieving Intelligence File...</p>
                            </div>
                        ) : error ? (
                            <div className="p-5 text-center h-100 d-flex flex-column align-items-center justify-content-center">
                                <AlertCircle size={64} className="text-danger mb-4 opacity-50" />
                                <h4 className="fw-bold">Restriction Alert</h4>
                                <p className="text-muted mb-4">{error}</p>
                                <button onClick={onClose} className="btn btn-dark rounded-pill px-5">Close File</button>
                            </div>
                        ) : lead ? (
                            <div className="d-flex flex-column h-100">
                                {/* Compact Premium Header */}
                                <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-dark text-white">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 rounded bg-danger text-white"><Shield size={20} /></div>
                                        <div>
                                            <h5 className="fw-bold mb-0 text-truncate" style={{ maxWidth: '300px' }}>{lead.title}</h5>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="opacity-60" style={{ fontSize: '10px' }}>ID: {lead.token}</span>
                                                <span className="badge bg-secondary-subtle text-light border border-light border-opacity-25" style={{ fontSize: '8px' }}>SECRET // NOFORN</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="btn btn-sm btn-outline-light rounded-circle p-2 border-0 hover-rotate"><X size={20} /></button>
                                </div>

                                <div className="p-0 overflow-auto flex-grow-1 canvas-content" style={{ background: '#f8f9fa' }}>

                                    {/* Advanced Media Viewer Section */}
                                    <div className="bg-black position-relative overflow-hidden" style={{ height: '280px' }}>
                                        {activeMedia ? (
                                            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                                {activeMedia.file_type === 'IMAGE' ? (
                                                    <img src={activeMedia.file_path} className="w-100 h-100 object-fit-contain" alt="Intelligence Asset" />
                                                ) : activeMedia.file_type === 'VIDEO' ? (
                                                    <div className="w-100 h-100 position-relative">
                                                        <video src={activeMedia.file_path} className="w-100 h-100" controls />
                                                        <div className="position-absolute top-2 right-2 badge bg-danger">LIVE ASSET</div>
                                                    </div>
                                                ) : activeMedia.file_type === 'AUDIO' ? (
                                                    <div className="text-center text-white p-4">
                                                        <Music size={64} className="mb-3 text-primary" />
                                                        <h6>Audio Intercept Active</h6>
                                                        <audio src={activeMedia.file_path} controls className="mt-2 w-100" />
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-white p-4">
                                                        <FileText size={64} className="mb-3 text-warning" />
                                                        <h6>Digital Document Asset</h6>
                                                        <a href={activeMedia.file_path} target="_blank" className="btn btn-outline-light btn-sm mt-2 rounded-pill d-inline-flex align-items-center gap-2">
                                                            <Download size={14} /> View Full PDF
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted opacity-20">
                                                <ImageIcon size={64} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Media Asset Strip - Mini Thumbnails */}
                                    {lead.media && lead.media.length > 0 && (
                                        <div className="bg-dark p-2 d-flex gap-2 overflow-auto" style={{ borderBottom: '1px solid #333' }}>
                                            {lead.media.map((m: any, idx: number) => (
                                                <motion.button
                                                    key={idx}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setActiveMedia(m)}
                                                    className={`border-0 rounded overflow-hidden flex-shrink-0 position-relative ${activeMedia === m ? 'ring-2 ring-primary' : ''}`}
                                                    style={{
                                                        width: '70px',
                                                        height: '50px',
                                                        background: '#222',
                                                        border: activeMedia === m ? '2px solid #0d6efd' : '1px solid #444'
                                                    }}
                                                >
                                                    {m.file_type === 'IMAGE' ? (
                                                        <img src={m.file_path} className="w-100 h-100 object-fit-cover opacity-60" />
                                                    ) : (
                                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center text-light opacity-50">
                                                            {getMediaIcon(m.file_type)}
                                                        </div>
                                                    )}
                                                    <div className="position-absolute bottom-0 start-0 w-100 bg-black bg-opacity-50" style={{ fontSize: '7px', color: 'white' }}>
                                                        {m.file_type}
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="p-4">
                                        {/* Status & Priority Row */}
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <div className="d-flex gap-2">
                                                <span className={`badge rounded-pill px-3 py-2 border ${lead.priority === 'CRITICAL' ? 'bg-danger text-white border-danger' : 'bg-warning-subtle text-warning border-warning'}`} style={{ fontSize: '10px', fontWeight: 'bold' }}>
                                                    {lead.priority} PRIORITY
                                                </span>
                                                <span className="badge rounded-pill px-3 py-2 bg-primary-subtle text-primary border border-primary" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                                                    {lead.status}
                                                </span>
                                            </div>
                                            {lead.reward_amount && (
                                                <div className="badge bg-success-subtle text-success border border-success p-2 d-flex align-items-center gap-2">
                                                    <Award size={14} /> {lead.reward_amount} REWARD
                                                </div>
                                            )}
                                        </div>

                                        {/* Core Intelligence Section */}
                                        <div className="bg-white rounded-4 shadow-sm border p-4 mb-4">
                                            <h6 className="fw-bold text-uppercase text-muted mb-3 d-flex align-items-center gap-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                                <div style={{ width: '4px', height: '12px', background: COLORS.navyBlue }}></div>
                                                Intelligence Profile
                                            </h6>
                                            <p className="mb-0 text-dark" style={{ lineHeight: '1.7', fontSize: '14px', letterSpacing: '0.2px' }}>
                                                {renderDescription(lead.description)}
                                            </p>
                                        </div>

                                        {/* Meta Data Grid */}
                                        <div className="row g-3 mb-4">
                                            <div className="col-6">
                                                <div className="bg-white p-3 rounded-4 border d-flex align-items-center gap-3">
                                                    <div className="p-2 rounded-circle bg-danger-subtle text-danger">
                                                        <MapPin size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="small text-muted mb-0" style={{ fontSize: '10px' }}>Primary Location</p>
                                                        <p className="fw-bold mb-0 small">{lead.location || 'Reported Region'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="bg-white p-3 rounded-4 border d-flex align-items-center gap-3">
                                                    <div className="p-2 rounded-circle bg-primary-subtle text-primary">
                                                        <Calendar size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="small text-muted mb-0" style={{ fontSize: '10px' }}>File Timestamp</p>
                                                        <p className="fw-bold mb-0 small">{new Date(lead.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Advisory Alert */}
                                        <div className="alert border-0 bg-info bg-opacity-10 d-flex gap-3 p-3 rounded-4 mb-0">
                                            <Info size={20} className="text-info mt-1" />
                                            <div>
                                                <h6 className="fw-bold text-info-emphasis mb-1 small text-uppercase">Advisory for Citizens</h6>
                                                <p className="mb-0 text-info-emphasis opacity-75" style={{ fontSize: '12px' }}>
                                                    This intelligence file is currently active. Any information shared is cross-correlated with existing database entries.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Premium Footer Action Bar */}
                                <div className="p-4 bg-white border-top shadow-sm">
                                    <h6 className="fw-bold mb-3 small text-muted text-uppercase" style={{ fontSize: '10px' }}>Submit Evidence / Tips</h6>
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <Link
                                                href={`/report?ref=${lead.id}&mode=anonymous&title=${encodeURIComponent(lead.title)}`}
                                                className="btn btn-dark w-100 fw-bold py-3 d-flex flex-column align-items-center gap-1 rounded-4 shadow-sm hover-up"
                                            >
                                                <EyeOff size={20} />
                                                <span style={{ fontSize: '11px' }}>Anonymous Tip</span>
                                            </Link>
                                        </div>
                                        <div className="col-6">
                                            <Link
                                                href={`/report?ref=${lead.id}&mode=named&title=${encodeURIComponent(lead.title)}`}
                                                className="btn btn-outline-dark w-100 fw-bold py-3 d-flex flex-column align-items-center gap-1 rounded-4 shadow-sm hover-up"
                                            >
                                                <Award size={20} className="text-primary" />
                                                <span style={{ fontSize: '11px' }}>Named Tip (Reward)</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </motion.div>
                </div>
            )}
            <style jsx global>{`
                .canvas-content::-webkit-scrollbar {
                    width: 6px;
                }
                .canvas-content::-webkit-scrollbar-track {
                    background: transparent;
                }
                .canvas-content::-webkit-scrollbar-thumb {
                    background: #CBD5E1;
                    border-radius: 10px;
                }
                .canvas-content::-webkit-scrollbar-thumb:hover {
                    background: #94A3B8;
                }
                .ring-2 {
                    box-shadow: 0 0 0 2px #0d6efd;
                }
                .hover-rotate:hover {
                    transform: rotate(90deg);
                    transition: all 0.3s;
                }
                .hover-up:hover {
                    transform: translateY(-2px);
                    transition: all 0.2s;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
            `}</style>
        </AnimatePresence>
    );
};
