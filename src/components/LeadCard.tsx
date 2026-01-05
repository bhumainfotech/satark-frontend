import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Share2, BadgeAlert, ArrowUpCircle, Award, AlertTriangle, EyeOff } from 'lucide-react';

import { COLORS } from '@/lib/theme';

interface Lead {
    id: number;
    title: string;
    location: string;
    time: string;
    type: string;
    description: string;
    status: 'WANTED' | 'MISSING' | 'ALERT';
    priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    reward?: string | null;
    image_url?: string;
    votes?: number;
    responseCount?: number;
    isPinned?: boolean;
}

interface LeadCardProps {
    lead: Lead;
    onClick: (lead: Lead) => void;
    onReportAnonymously?: (lead: Lead) => void;
    onProvideNamedTip?: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick, onReportAnonymously, onProvideNamedTip }) => {
    const [votes, setVotes] = React.useState(lead.votes || 0);
    const [hasVoted, setHasVoted] = React.useState(false);
    const [isCopied, setIsCopied] = React.useState(false);

    const refId = lead.id.toString();

    const handleVote = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (hasVoted) return; // For now, only allow one-way upvote for simplicity

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/public-leads/${lead.id}/vote`, {
                method: 'POST'
            });
            if (res.ok) {
                const data = await res.json();
                setVotes(data.upvotes);
                setHasVoted(true);
            }
        } catch (err) {
            console.error("Vote failed:", err);
            // Fallback for demo
            setVotes(v => v + 1);
            setHasVoted(true);
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            navigator.clipboard.writeText(`${window.location.origin}/track?token=SAMPLE-${refId}`);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.warn("Clipboard access denied", err);
        }
    };

    const handleAnonymousReport = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onReportAnonymously) onReportAnonymously(lead);
    };

    const handleNamedTip = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onProvideNamedTip) onProvideNamedTip(lead);
    };

    const renderDescription = (text: string) => {
        return text.split(/(\s+)/).map((part, i) =>
            part.startsWith('#') ? (
                <span key={i} className="fw-bold" style={{ color: COLORS.navyBlue }}>{part}</span>
            ) : part
        );
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'CRITICAL': return COLORS.wineRed;
            case 'HIGH': return '#FF6B00';
            case 'MEDIUM': return '#FFA500';
            default: return '#6C757D';
        }
    };

    return (
        <motion.div
            className="card mb-3 border-0 overflow-hidden cursor-pointer"
            whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)' }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => onClick(lead)}
            style={{
                cursor: 'pointer',
                borderRadius: '16px',
                background: lead.isPinned ? COLORS.navyBlue : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: lead.isPinned ? '0 15px 35px rgba(0, 0, 80, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: lead.isPinned ? `2px solid ${COLORS.golden}` : '1px solid rgba(255, 255, 255, 0.3)',
                borderLeft: lead.isPinned ? `6px solid ${COLORS.golden}` : (lead.priority === 'CRITICAL' ? `4px solid ${COLORS.wineRed}` : '1px solid rgba(0, 0, 0, 0.05)')
            }}
        >
            <div className="row g-0">
                {/* Vote Column */}
                <div
                    className="col-1 d-flex flex-column align-items-center py-3"
                    style={{
                        background: lead.isPinned ? 'rgba(255,255,255,0.05)' : '#F8F9FA',
                        borderRight: lead.isPinned ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E9ECEF'
                    }}
                >
                    <button
                        onClick={handleVote}
                        className="btn btn-link p-0"
                        style={{
                            transition: 'all 0.2s',
                            color: hasVoted ? COLORS.wineRed : '#6C757D'
                        }}
                    >
                        <ArrowUpCircle size={28} fill={hasVoted ? COLORS.wineRed : "none"} />
                    </button>
                    <span
                        className="fw-bold my-1"
                        style={{
                            color: lead.isPinned ? 'white' : (hasVoted ? COLORS.wineRed : '#212529'),
                            fontSize: '16px'
                        }}
                    >
                        {votes}
                    </span>
                </div>

                {/* Content Column */}
                <div className="col-11">
                    <div className="card-body p-4">
                        {/* Header Metadata with Priority and Reward */}
                        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-2 small flex-wrap">
                                {/* Priority Badge */}
                                {lead.priority && (
                                    <span
                                        className="badge rounded-pill px-3 py-1 d-flex align-items-center gap-1"
                                        style={{
                                            background: getPriorityColor(lead.priority),
                                            color: 'white',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {lead.priority === 'CRITICAL' && <AlertTriangle size={12} />}
                                        {lead.priority}
                                    </span>
                                )}

                                {/* Status Badge */}
                                <span
                                    className="badge rounded-pill px-3 py-1"
                                    style={{
                                        background: lead.status === 'WANTED'
                                            ? COLORS.wineRed
                                            : lead.status === 'MISSING'
                                                ? COLORS.golden
                                                : COLORS.navyBlue,
                                        color: lead.status === 'MISSING' ? COLORS.navyBlue : 'white',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    {lead.status}
                                </span>

                                {lead.title.startsWith('Appeal:') && (
                                    <span
                                        className="badge rounded-pill px-3 py-1"
                                        style={{
                                            background: '#0D6EFD',
                                            color: 'white',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <BadgeAlert size={12} /> Police Appeal
                                    </span>
                                )}

                                <span className="text-muted">•</span>
                                <span className="d-flex align-items-center gap-1" style={{ color: lead.isPinned ? 'rgba(255,255,255,0.6)' : COLORS.textSecondary }}>
                                    <MapPin size={14} /> {lead.location}
                                </span>
                                <span className="text-muted">•</span>
                                <span className="d-flex align-items-center gap-1" style={{ color: lead.isPinned ? 'rgba(255,255,255,0.6)' : COLORS.textSecondary }}>
                                    <Clock size={14} /> {lead.time || 'recent'}
                                </span>
                            </div>

                            {/* Reward Badge */}
                            {lead.reward && (
                                <div
                                    className="badge px-3 py-2 d-flex align-items-center gap-2"
                                    style={{
                                        background: `linear-gradient(135deg, ${COLORS.golden} 0%, #FFA500 100%)`,
                                        color: COLORS.navyBlue,
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
                                    }}
                                >
                                    <Award size={16} />
                                    CASH BOUNTY: {lead.reward}
                                </div>
                            )}
                        </div>

                        {/* Title & Preview */}
                        <div className="d-flex justify-content-between gap-3">
                            <div className="flex-grow-1">
                                <h5
                                    className="card-title fw-bold mb-3"
                                    style={{
                                        color: lead.isPinned ? 'white' : COLORS.navyBlue,
                                        fontSize: '20px',
                                        lineHeight: '1.4'
                                    }}
                                >
                                    {lead.isPinned && <span className="text-warning me-2">★ PINNED dossier:</span>}
                                    {lead.title}
                                </h5>
                                <p
                                    className="card-text text-muted mb-0"
                                    style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        fontSize: '15px',
                                        lineHeight: '1.6',
                                        color: lead.isPinned ? 'rgba(255,255,255,0.8)' : COLORS.textSecondary
                                    }}
                                >
                                    {lead.description.split(/(\s+)/).map((part, i) =>
                                        part.startsWith('#') ? (
                                            <span key={`hash-${i}`} className="fw-bold" style={{ color: lead.isPinned ? COLORS.golden : COLORS.navyBlue }}>{part}</span>
                                        ) : (
                                            <React.Fragment key={`text-${i}`}>{part}</React.Fragment>
                                        )
                                    )}
                                </p>
                            </div>
                            {/* Thumbnail */}
                            {lead.image_url && (
                                <div
                                    className="rounded overflow-hidden flex-shrink-0"
                                    style={{
                                        width: '120px',
                                        height: '90px',
                                        border: `2px solid ${COLORS.golden}`,
                                        boxShadow: '0 2px 8px rgba(255, 215, 0, 0.2)'
                                    }}
                                >
                                    <img
                                        src={lead.image_url}
                                        alt="Thumbnail"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="d-flex align-items-center gap-2 mt-4 pt-3 border-top flex-wrap" style={{ borderTop: lead.isPinned ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E9ECEF' }}>
                            <button
                                onClick={handleShare}
                                className="btn btn-sm d-flex align-items-center gap-2 rounded-pill px-3"
                                style={{
                                    background: isCopied ? COLORS.golden : (lead.isPinned ? 'rgba(255,255,255,0.1)' : '#F8F9FA'),
                                    color: isCopied ? COLORS.navyBlue : (lead.isPinned ? 'white' : '#6C757D'),
                                    border: lead.isPinned ? '1px solid rgba(255,255,255,0.2)' : '1px solid #E9ECEF',
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    height: '34px'
                                }}
                            >
                                <Share2 size={14} /> {isCopied ? 'Link Copied!' : 'Share'}
                            </button>

                            <button
                                onClick={handleAnonymousReport}
                                className="btn btn-sm d-flex align-items-center gap-2 px-3 rounded"
                                style={{
                                    background: lead.isPinned ? COLORS.golden : COLORS.navyBlue,
                                    color: lead.isPinned ? COLORS.navyBlue : 'white',
                                    border: 'none',
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    height: '34px'
                                }}
                            >
                                <EyeOff size={14} /> Report Anonymously
                            </button>

                            <button
                                onClick={handleNamedTip}
                                className="btn btn-sm d-flex align-items-center gap-2 px-3 rounded"
                                style={{
                                    background: 'white',
                                    color: COLORS.navyBlue,
                                    border: `1px solid ${COLORS.navyBlue}`,
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    height: '34px'
                                }}
                            >
                                <Award size={14} /> Provide Named Tip (Reward Eligible)
                            </button>

                            <span
                                className="d-flex align-items-center gap-2 text-muted ms-auto"
                                style={{ fontSize: '13px', color: lead.isPinned ? 'white' : COLORS.textSecondary }}
                            >
                                <BadgeAlert size={14} /> {lead.responseCount || 0} People Responded • {lead.id * 12 + votes} Views
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
