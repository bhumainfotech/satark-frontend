"use client";

import { useEffect, useState, use } from "react";
import {
    ArrowLeft,
    Shield,
    Clock,
    AlertTriangle,
    MapPin,
    User,
    Forward,
    Award,
    CheckCircle2,
    XCircle,
    FileText,
    Eye,
    MessageSquare,
    Send,
    Video,
    Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { COLORS } from '@/lib/theme';

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [lead, setLead] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [forwardUnitId, setForwardUnitId] = useState("");
    const [units, setUnits] = useState<any[]>([]);
    const [leadId, setLeadId] = useState<string>("");

    useEffect(() => {
        params.then(p => setLeadId(p.id));
        const u = localStorage.getItem('user');
        if (u) setUser(JSON.parse(u));
    }, [params]);

    useEffect(() => {
        if (!leadId) return;
        const token = localStorage.getItem('token');

        // Fetch Lead
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/${leadId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setLead(data);
                setLoading(false);
            });

        // Fetch Units for forwarding
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/units/hierarchy`)
            .then(res => res.json())
            .then(data => {
                const all = [...data.districts, ...data.subDivisions, ...data.policeStations];
                setUnits(all);
            });

    }, [leadId]);

    const handleAction = async (action: string, payload: any = {}) => {
        const token = localStorage.getItem('token');
        let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/${leadId}/status`;
        let body = {};

        if (action === 'FORWARD') {
            url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/${leadId}/forward`;
            body = { target_unit_id: forwardUnitId, reason: 'Manual Forward' };
        } else if (action === 'APPROVE') {
            body = { reward_action: 'APPROVE', status: 'CLOSED' };
        } else if (action === 'RECOMMEND') {
            body = { reward_action: 'RECOMMEND' };
        }

        await fetch(url, {
            method: action === 'FORWARD' ? 'POST' : 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        alert('Action Completed');
        window.location.reload();
    };

    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Retrieving Secure Intelligence File...</p>
        </div>
    );

    if (!lead) return (
        <div className="text-center py-5">
            <AlertTriangle size={48} className="text-danger mb-3" />
            <h4 className="fw-bold">File Access Denied</h4>
            <p className="text-muted">Intelligence file not found or you lack required clearance.</p>
        </div>
    );

    return (
        <div className="pb-5">
            {/* Header / Breadcrumbs */}
            <div className="d-flex align-items-center gap-3 mb-4">
                <a href="/dashboard" className="btn btn-light rounded-circle p-2 shadow-sm">
                    <ArrowLeft size={20} />
                </a>
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <h2 className="fw-bold mb-0" style={{ color: COLORS.navyBlue }}>Intelligence File #{lead.token}</h2>
                        <span className={`badge rounded-pill px-3 py-2 ${lead.status === 'CLOSED' ? 'bg-secondary' : 'bg-primary'}`}>
                            {lead.status}
                        </span>
                    </div>
                    <p className="text-muted small mb-0 d-flex align-items-center gap-2">
                        <Shield size={14} /> Strategic Intelligence Division • Classified Information
                    </p>
                </div>
            </div>

            <div className="row g-4">
                {/* Main Content Area */}
                <div className="col-lg-8">
                    {/* Core Intelligence Card */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div className="card-header border-0 bg-white p-4">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                <FileText size={20} className="text-primary" /> Incident Summary
                            </h5>
                        </div>
                        <div className="card-body p-4 pt-0">
                            <div className="p-4 rounded-4 bg-light border mb-4">
                                <h4 className="fw-bold mb-3">{lead.title || "Untitled Report"}</h4>
                                <p className="text-muted" style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                                    {lead.description}
                                </p>
                            </div>

                            <div className="row g-4">
                                <div className="col-sm-6 col-md-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <Clock size={16} className="text-muted" />
                                        <div>
                                            <p className="small text-muted mb-0 fw-bold text-uppercase" style={{ fontSize: '10px' }}>Timestamp</p>
                                            <p className="small fw-bold mb-0">{new Date(lead.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <AlertTriangle size={16} className="text-muted" />
                                        <div>
                                            <p className="small text-muted mb-0 fw-bold text-uppercase" style={{ fontSize: '10px' }}>Priority Level</p>
                                            <p className={`small fw-bold mb-0 ${lead.priority === 'CRITICAL' ? 'text-danger' : 'text-primary'}`}>{lead.priority}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <MapPin size={16} className="text-muted" />
                                        <div>
                                            <p className="small text-muted mb-0 fw-bold text-uppercase" style={{ fontSize: '10px' }}>Jurisdiction</p>
                                            <p className="small fw-bold mb-0">{lead.jurisdiction_id || "Strategic Command"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <Award size={16} className="text-muted" />
                                        <div>
                                            <p className="small text-muted mb-0 fw-bold text-uppercase" style={{ fontSize: '10px' }}>Reward Status</p>
                                            <p className="small fw-bold mb-0">{lead.reward_status || "PENDING"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Investigation Timeline */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div className="card-header border-0 bg-white p-4">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                <Clock size={20} className="text-primary" /> Investigation Progress
                            </h5>
                        </div>
                        <div className="card-body p-4 pt-0">
                            <div className="ps-3 border-start border-2 ms-2 py-2">
                                {(lead.timeline || [
                                    { stage: "Submitted", date: lead.created_at, completed: true, icon: Send },
                                    { stage: "Unit Triage", date: "Pending Action", completed: false, icon: Shield },
                                    { stage: "Investigation Rooted", date: "Awaiting Data", completed: false, icon: Eye },
                                    { stage: "Action Taken", date: "Final Phase", completed: false, icon: CheckCircle2 }
                                ]).map((item: any, idx: number) => (
                                    <div key={idx} className="position-relative mb-4">
                                        <div
                                            className="position-absolute start-0 top-0 translate-middle rounded-circle border-2"
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                left: '-11px',
                                                background: item.completed ? COLORS.navyBlue : '#fff',
                                                borderColor: item.completed ? COLORS.navyBlue : '#dee2e6'
                                            }}
                                        >
                                            {item.completed && <CheckCircle2 size={12} className="text-white d-block mx-auto mt-1" />}
                                        </div>
                                        <div className="ms-4">
                                            <p className={`fw-bold mb-0 ${item.completed ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '14px' }}>{item.stage}</p>
                                            <p className="small text-muted mb-0">{item.date ? new Date(item.date).toLocaleString() : 'Pending'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Evidence Gallery */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div className="card-header border-0 bg-white p-4">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                <ImageIcon size={20} className="text-primary" /> Digital Evidence
                            </h5>
                        </div>
                        <div className="card-body p-4 pt-0">
                            <div className="p-5 rounded-4 bg-dark text-white text-center opacity-75 border border-white border-opacity-10 d-flex flex-column align-items-center gap-3">
                                <Video size={48} className="text-muted" />
                                <div>
                                    <p className="fw-bold mb-1">Secure Media Player</p>
                                    <p className="small text-muted mx-auto" style={{ maxWidth: '300px' }}>Audit log is required to view full-resolution evidence. All views are watermarked and logged.</p>
                                </div>
                                <button className="btn btn-sm btn-outline-light rounded-pill px-4 fw-bold">Request Access</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="col-lg-4">
                    {/* Command Actions */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div
                            className="p-3 text-white fw-bold d-flex align-items-center gap-2"
                            style={{ background: `linear-gradient(135deg, ${COLORS.navyBlue}, ${COLORS.darkNavy})` }}
                        >
                            <Shield size={18} /> Authority Actions
                        </div>
                        <div className="card-body p-4">
                            {/* Triage Section */}
                            <div className="mb-4">
                                <p className="small fw-bold text-muted text-uppercase mb-3" style={{ fontSize: '10px' }}>Triage & Lifecycle</p>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-outline-primary d-flex align-items-center gap-2 fw-bold text-start p-3 rounded-4 transition-all">
                                        <User size={18} /> Assign Investigation Officer
                                    </button>
                                    <button className="btn btn-outline-secondary d-flex align-items-center gap-2 fw-bold text-start p-3 rounded-4 transition-all">
                                        <XCircle size={18} /> Discard as Spam
                                    </button>
                                </div>
                            </div>

                            {/* Forwarding Section */}
                            <div className="mb-4 pt-4 border-top">
                                <p className="small fw-bold text-muted text-uppercase mb-3" style={{ fontSize: '10px' }}>Inter-Unit Forwarding</p>
                                <div className="d-flex flex-column gap-3">
                                    <select
                                        className="form-select form-select-lg border rounded-4"
                                        style={{ fontSize: '14px' }}
                                        value={forwardUnitId}
                                        onChange={(e) => setForwardUnitId(e.target.value)}
                                    >
                                        <option value="">Select Command Unit</option>
                                        {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                    <button
                                        className="btn btn-lg text-white fw-bold rounded-4 d-flex align-items-center justify-content-center gap-2"
                                        style={{ background: COLORS.navyBlue }}
                                        onClick={() => handleAction('FORWARD')}
                                        disabled={!forwardUnitId}
                                    >
                                        <Forward size={20} /> Execute Forward
                                    </button>
                                </div>
                            </div>

                            {/* Reward Management */}
                            <div className="pt-4 border-top">
                                <p className="small fw-bold text-muted text-uppercase mb-3" style={{ fontSize: '10px' }}>Reward Management</p>
                                <div className="d-grid gap-2">
                                    {user?.role === 'DCP' ? (
                                        <button
                                            className="btn btn-lg text-white fw-bold rounded-4"
                                            style={{ background: '#059669', border: 'none' }}
                                            onClick={() => handleAction('APPROVE')}
                                        >
                                            Final Approval (Grant Reward)
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-lg fw-bold rounded-4"
                                            style={{ background: COLORS.golden, color: COLORS.navyBlue, border: 'none' }}
                                            onClick={() => handleAction('RECOMMEND')}
                                        >
                                            Recommend for Monetary Reward
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Officer Notes */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header border-0 bg-white p-4">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                <MessageSquare size={20} className="text-primary" /> Internal Notes
                            </h5>
                        </div>
                        <div className="card-body p-4 pt-0">
                            <div className="p-3 rounded-4 bg-light border mb-3 small text-muted italic">
                                "The information provided overlaps with Case ID: ND-2023-X. Monitoring suspect movements in Chanakyapuri."
                                <div className="mt-2 fw-bold text-dark">— DCP South (14:30 Today)</div>
                            </div>
                            <div className="input-group">
                                <textarea className="form-control border-0 bg-light rounded-4 p-3 shadow-none" placeholder="Add confidential note..." rows={3}></textarea>
                            </div>
                            <button className="btn btn-primary btn-sm mt-2 float-end rounded-pill px-4 fw-bold">Post Note</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
