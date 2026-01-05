"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { ShieldCheck, Lock, Mail, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { COLORS } from '@/lib/theme';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/dashboard';
            } else {
                setError(data.error || "Authentication failed. Please check credentials.");
            }
        } catch (e) {
            setError("Network Error: Could not connect to the authentication server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-vh-100" style={{ background: `linear-gradient(180deg, ${COLORS.lightBg} 0%, #E8EEF5 100%)` }}>
            <Header />
            <div className="container py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-100"
                    style={{ maxWidth: '450px' }}
                >
                    <div className="text-center mb-4">
                        <div
                            className="bg-white rounded-circle shadow-sm p-3 d-inline-block mb-3"
                            style={{ border: `2px solid ${COLORS.navyBlue}` }}
                        >
                            <ShieldCheck size={48} style={{ color: COLORS.navyBlue }} />
                        </div>
                        <h2 className="fw-bold mb-1" style={{ color: COLORS.navyBlue }}>Authority Login</h2>
                        <p className="text-muted small">Strategic Intelligence Command & Control Center</p>
                    </div>

                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ background: COLORS.surface }}>
                        <div
                            className="p-1"
                            style={{ background: `linear-gradient(90deg, ${COLORS.navyBlue}, ${COLORS.golden}, ${COLORS.wineRed})` }}
                        />
                        <div className="card-body p-4 p-md-5">
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center gap-2 border-0 shadow-sm mb-4" style={{ background: '#FEF2F2', color: '#991B1B' }}>
                                    <AlertCircle size={18} />
                                    <small className="fw-bold">{error}</small>
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-uppercase text-muted">Email ID</label>
                                    <div className="input-group border rounded-3 overflow-hidden shadow-sm" style={{ borderColor: '#E2E8F0' }}>
                                        <span className="input-group-text border-0 bg-light"><Mail size={18} className="text-muted" /></span>
                                        <input
                                            className="form-control border-0 bg-white"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="officer@delhipolice.gov.in"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-uppercase text-muted">Password</label>
                                    <div className="input-group border rounded-3 overflow-hidden shadow-sm" style={{ borderColor: '#E2E8F0' }}>
                                        <span className="input-group-text border-0 bg-light"><Lock size={18} className="text-muted" /></span>
                                        <input
                                            type="password"
                                            className="form-control border-0 bg-white"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-lg w-100 fw-bold text-white shadow-sm rounded-3 transition-all"
                                    style={{
                                        background: `linear-gradient(135deg, ${COLORS.navyBlue}, ${COLORS.darkNavy})`,
                                        border: 'none'
                                    }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Verifying...' : 'Access Command Center'}
                                </button>
                            </form>

                            <div className="mt-4 pt-3 border-top text-center">
                                <div className="p-2 border rounded-4 bg-light d-inline-flex align-items-center gap-2 mb-3">
                                    <Lock size={14} className="text-success" />
                                    <small className="text-muted fw-bold" style={{ fontSize: '10px' }}>AES-256 END-TO-END ENCRYPTED</small>
                                </div>
                                <p className="text-muted mb-0" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                                    Warning: This system is for authorized Delhi Police personnel only.
                                    All access and activities are strictly monitored and logged.
                                    Evidence of unauthorized access will be used for criminal prosecution.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
