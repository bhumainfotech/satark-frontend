"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Search, CheckCircle, Clock, AlertCircle, Award } from "lucide-react";
import { motion } from "framer-motion";

import { COLORS } from '@/lib/theme';

export default function TrackPage() {
    const [token, setToken] = useState("");
    const [status, setStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (token) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/track/${token}`);
                if (!res.ok) throw new Error("Invalid Token");
                const data = await res.json();
                setStatus(data);
            } catch (e) {
                // Mock fallback if DB is offline (consistent with requested "fix logic")
                if (token.startsWith('DEMO') || token.startsWith('OFFLINE')) {
                    setStatus({
                        status: 'SUBMITTED',
                        reward_status: 'PENDING',
                        timeline: [
                            { stage: "Submitted", date: new Date().toISOString(), completed: true },
                            { stage: "Reviewed", date: "-", completed: false },
                            { stage: "Actioned", date: "-", completed: false }
                        ]
                    });
                } else {
                    alert("Token not found. Try a DEMO token if testing.");
                    setStatus(null);
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <main className="min-vh-100" style={{ background: `linear-gradient(180deg, ${COLORS.lightBg} 0%, #E8EEF5 100%)` }}>
            <Header />
            <div className="container py-5 d-flex flex-column align-items-center px-4">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-5"
                >
                    <h2 className="fw-bold mb-2" style={{ color: COLORS.navyBlue }}>Track Intelligence Status</h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>Enter your secure reference token to check real-time progress of your report.</p>
                </motion.div>

                <div className="card shadow-lg border-0 rounded-4 overflow-hidden w-100" style={{ maxWidth: '600px', background: COLORS.surface }}>
                    <div
                        className="p-1"
                        style={{ background: `linear-gradient(90deg, ${COLORS.navyBlue}, ${COLORS.golden}, ${COLORS.wineRed})` }}
                    />
                    <div className="card-body p-4 p-md-5">
                        <form onSubmit={handleTrack} className="mb-4">
                            <label className="form-label small fw-bold text-uppercase text-muted mb-3">Secure Reference Token</label>
                            <div className="input-group input-group-lg border rounded-4 overflow-hidden shadow-sm" style={{ borderColor: COLORS.navyBlue }}>
                                <span className="input-group-text border-0 ps-4 bg-white"><Search className="text-muted" size={20} /></span>
                                <input
                                    type="text"
                                    className="form-control border-0 ch-wide fw-bold"
                                    placeholder="Enter Token (e.g. 8A2B9C)"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value.toUpperCase())}
                                    style={{ letterSpacing: '2px', fontSize: '18px' }}
                                />
                                <button
                                    type="submit"
                                    className="btn px-4 fw-bold text-white border-0"
                                    style={{ background: COLORS.navyBlue }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Checking...' : 'Track'}
                                </button>
                            </div>
                        </form>

                        {status && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="status-result"
                            >
                                <div
                                    className="p-4 rounded-4 mb-4 border-0 d-flex justify-content-between align-items-center"
                                    style={{ background: COLORS.lightBg }}
                                >
                                    <div>
                                        <p className="small text-muted text-uppercase mb-1 fw-bold" style={{ fontSize: '10px' }}>Current Status</p>
                                        <div className="d-flex align-items-center gap-2">
                                            <div
                                                className="rounded-circle"
                                                style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    background: status.status === 'REJECTED' ? COLORS.wineRed : '#198754',
                                                    boxShadow: `0 0 8px ${status.status === 'REJECTED' ? COLORS.wineRed : '#198754'}`
                                                }}
                                            />
                                            <h3 className={`fw-bold mb-0`} style={{ color: status.status === 'REJECTED' ? COLORS.wineRed : COLORS.navyBlue }}>
                                                {status.status}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <p className="small text-muted text-uppercase mb-1 fw-bold" style={{ fontSize: '10px' }}>Date Reported</p>
                                        <p className="fw-bold mb-0 text-dark">
                                            {status.created_at ? new Date(status.created_at).toLocaleDateString() : 'Just now'}
                                        </p>
                                    </div>
                                </div>

                                {status.reward_status === 'APPROVED' && (
                                    <div
                                        className="p-4 text-center border-0 rounded-4 mb-4"
                                        style={{ background: COLORS.lightGold, border: `1px solid ${COLORS.golden}` }}
                                    >
                                        <div className="mb-2">
                                            <Award size={40} style={{ color: COLORS.orange }} />
                                        </div>
                                        <h5 className="fw-bold mb-2" style={{ color: COLORS.navyBlue }}>🏆 Reward Approved!</h5>
                                        <p className="small mb-3 text-dark">Your intelligence led to a successful operation. You are eligible for a reward.</p>
                                        <button
                                            className="btn btn-lg fw-bold rounded-pill px-5 shadow-sm"
                                            style={{ background: `linear-gradient(135deg, ${COLORS.golden}, ${COLORS.orange})`, border: 'none', color: COLORS.navyBlue }}
                                        >
                                            Claim Reward
                                        </button>
                                    </div>
                                )}

                                <div
                                    className="p-4 border-0 rounded-4"
                                    style={{ background: '#F0F9FF', borderLeft: `4px solid ${COLORS.navyBlue}` }}
                                >
                                    <h6 className="fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: '#0369A1' }}>
                                        <AlertCircle size={18} /> Report Information
                                    </h6>
                                    <p className="small mb-0 text-muted" style={{ lineHeight: '1.6' }}>
                                        Your intelligence has been successfully transmitted and is currently being processed by the <strong>Strategic Intelligence Division</strong>.
                                        Keep this token confidential.
                                    </p>
                                </div>

                                <div className="text-center mt-5 pt-4 border-top">
                                    <p className="small text-muted mb-2">
                                        Detailed investigation progress is <strong>strictly confidential</strong> and restricted to authorized officials.
                                    </p>
                                    <p className="small fw-bold mb-0" style={{ color: COLORS.wineRed }}>
                                        Emergency Helpline: 112 / 100
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {!status && !isLoading && !token && (
                            <div className="text-center py-5 opacity-50">
                                <Search size={64} className="text-muted mb-3" />
                                <p className="text-muted">Waiting for token input...</p>
                            </div>
                        )}

                        {!status && !isLoading && token && (
                            <div className="text-center text-muted mt-4 p-3 bg-light rounded-3">
                                <p className="small mb-0">No active reports found for this token. Please verify and try again.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
