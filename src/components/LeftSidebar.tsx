"use client";

import React from 'react';
import { Home, Zap, Shield, Hash, MapPin, Users, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS } from '@/lib/theme';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    activeCategory: string | null;
    onCategoryChange: (catId: string | null) => void;
    activeJurisdiction: string | null;
    onJurisdictionChange: (juris: string | null) => void;
}

export default function LeftSidebar({ activeTab, onTabChange, activeCategory, onCategoryChange, activeJurisdiction, onJurisdictionChange }: SidebarProps) {
    const menuItems = [
        { icon: Home, label: "Home", id: "all" },
        { icon: Zap, label: "Popular", id: "popular" },
        { icon: TrendingUp, label: "Trending", id: "trending" },
    ];

    const categories = [
        { icon: Shield, label: "Terrorism / Threats", color: COLORS.wineRed, id: "1" },
        { icon: Zap, label: "Drug Rackets", color: '#8800ff', id: "2" },
        { icon: Hash, label: "Money Laundering", color: '#28a745', id: "3" },
        { icon: Shield, label: "Corruption", color: '#fd7e14', id: "4" },
        { icon: Users, label: "Human Trafficking", color: '#dc3545', id: "5" },
        { icon: Hash, label: "Cyber Crime", color: '#007bff', id: "6" },
        { icon: Shield, label: "Organized Crime", color: '#6c757d', id: "7" },
        { icon: Users, label: "Missing Persons", color: '#6610f2', id: "8" },
        { icon: Award, label: "Reward Eligible", color: COLORS.golden, id: "9" },
        { icon: MapPin, label: "Hotspots", color: '#e83e8c', id: "10" },
    ];

    const jurisdictions = [
        { label: "New Delhi" },
        { label: "South Delhi" },
        { label: "Central Delhi" },
    ];

    return (
        <div className="d-none d-lg-block h-100">
            <div className="sticky-top" style={{ top: '100px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>

                {/* Navigation */}
                <div className="mb-4">
                    <p className="small fw-bold text-uppercase mb-2 px-3" style={{ fontSize: '11px', letterSpacing: '0.5px', color: COLORS.textSecondary }}>Feeds</p>
                    <ul className="list-unstyled">
                        {menuItems.map((item, idx) => (
                            <li key={idx}>
                                <button
                                    onClick={() => onTabChange(item.id)}
                                    className="d-flex align-items-center gap-3 py-2 px-3 text-decoration-none rounded-3 transition-all border-0 w-100 text-start"
                                    style={{
                                        color: activeTab === item.id ? COLORS.navyBlue : COLORS.textPrimary,
                                        background: activeTab === item.id ? 'rgba(0, 0, 128, 0.05)' : 'transparent',
                                        fontWeight: activeTab === item.id ? '600' : '500'
                                    }}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Communities / Categories */}
                <div className="mb-4">
                    <p className="small fw-bold text-uppercase mb-2 px-3" style={{ fontSize: '11px', letterSpacing: '0.5px', color: COLORS.textSecondary }}>Communities (Categories)</p>
                    <ul className="list-unstyled">
                        {categories.map((item, idx) => (
                            <li key={idx}>
                                <button
                                    onClick={() => onCategoryChange(activeCategory === item.id ? null : item.id)}
                                    className="d-flex align-items-center gap-3 py-2 px-3 text-decoration-none rounded-3 transition-all hover-bg border-0 w-100 text-start"
                                    style={{
                                        color: activeCategory === item.id ? COLORS.navyBlue : COLORS.textPrimary,
                                        background: activeCategory === item.id ? 'rgba(0, 0, 128, 0.05)' : 'transparent'
                                    }}
                                >
                                    <item.icon size={20} style={{ color: item.color }} />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Jurisdictions / Ideas */}
                <div className="mb-4">
                    <p className="small fw-bold text-uppercase mb-2 px-3" style={{ fontSize: '11px', letterSpacing: '0.5px', color: COLORS.textSecondary }}>Jurisdictions</p>
                    <ul className="list-unstyled">
                        {jurisdictions.map((item, idx) => (
                            <li key={idx}>
                                <button
                                    onClick={() => onJurisdictionChange(activeJurisdiction === item.label ? null : item.label)}
                                    className="d-flex align-items-center gap-3 py-2 px-3 text-decoration-none rounded-3 transition-all hover-bg border-0 w-100 text-start"
                                    style={{
                                        color: activeJurisdiction === item.label ? COLORS.navyBlue : COLORS.textPrimary,
                                        background: activeJurisdiction === item.label ? 'rgba(0, 0, 128, 0.05)' : 'transparent'
                                    }}
                                >
                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px' }}>
                                        <MapPin size={12} />
                                    </div>
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Create Community CTA */}
                <div className="px-3">
                    <button className="btn w-100 rounded-pill btn-outline-dark fw-bold btn-sm">
                        + Custom Feed
                    </button>
                </div>

            </div>
            <style jsx>{`
        .hover-bg:hover {
            background-color: rgba(0,0,0,0.05);
        }
      `}</style>
        </div>
    );
}
