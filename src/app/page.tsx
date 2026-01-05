"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import { LeadCard } from '@/components/LeadCard';
import { DetailCanvas } from '@/components/DetailCanvas';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import { Search, MapPin, Clock, Filter, Loader2, Plus, Sparkles, Award, EyeOff, MessageSquare, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { COLORS, GRADIENTS, SHADOWS } from '@/lib/theme';

export default function Home() {
  const { t } = useTranslation();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string | null>(null);
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Infinite Scroll State
  const [leads, setLeads] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastLeadElementRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Reset when filter changes
  useEffect(() => {
    setLeads([]);
    setPage(0);
    setHasMore(true);
  }, [activeTab, debouncedSearch, selectedCategory, selectedJurisdiction]);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        let priorityParam = activeTab === 'all' || activeTab === 'myfeed' || activeTab === 'popular' || activeTab === 'trending' ? '' : activeTab.toUpperCase();
        let searchParam = debouncedSearch;
        let sortParam = 'newest';
        if (activeTab === 'popular') sortParam = 'popular';
        if (activeTab === 'trending') sortParam = 'trending';

        if (activeTab === 'myfeed') {
          searchParam = 'Appeal:';
          priorityParam = '';
        } else if (activeTab === 'traffic') {
          searchParam = 'Traffic:';
          priorityParam = '';
        } else if (activeTab === 'sos') {
          searchParam = 'SOS:';
          priorityParam = '';
        }

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/public-leads`);
        url.searchParams.append('limit', '10');
        url.searchParams.append('offset', (page * 10).toString());
        url.searchParams.append('priority', priorityParam);
        url.searchParams.append('search', searchParam);
        url.searchParams.append('sort', sortParam);
        if (selectedCategory) url.searchParams.append('category', selectedCategory);
        if (selectedJurisdiction) url.searchParams.append('jurisdiction', selectedJurisdiction);

        const res = await fetch(url.toString());
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Expected array but received:", data);
          setHasMore(false);
          return;
        }

        if (data.length < 10) {
          setHasMore(false);
        }

        setLeads(prev => {
          const combined = [...prev, ...data];
          // Unique by ID
          const uniqueLeads = Array.from(new Map(combined.map(item => [item.id, item])).values());

          // Inject mock data enhancements
          return uniqueLeads.map((l: any, idx) => ({
            ...l,
            responseCount: Math.floor(Math.random() * 50) + 10,
            // Pin the first critical or appeal lead in the first page
            isPinned: idx === 0 && page === 0 && (l.priority === 'CRITICAL' || l.title.includes('Appeal')),
            // Inject new assets for demo
            image_url: idx === 0 ? "/api/placeholder/400/320" : (idx === 1 ? "/api/placeholder/400/320" : l.image_url)
          }));
        });
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [page, activeTab, debouncedSearch]);

  return (
    <div className="min-vh-100" style={{ background: GRADIENTS.bg }}>
      <Header />

      <main className="container-fluid py-4" style={{ maxWidth: '1800px', margin: '0 auto' }}>
        <div className="row g-4">

          {/* LEFT SIDEBAR - Navigation & Ideas */}
          <div className="col-lg-2 pe-lg-4 border-end-lg-0">
            <LeftSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              activeCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              activeJurisdiction={selectedJurisdiction}
              onJurisdictionChange={setSelectedJurisdiction}
            />
          </div>

          {/* CENTER FEED - Functionality & Content */}
          <div className="col-lg-7 px-lg-4">

            {/* Create Post / Report Bar (Reddit Style) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card border-0 shadow-sm mb-4"
              style={{
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px', background: `linear-gradient(135deg, ${COLORS.navyBlue}, ${COLORS.darkNavy})` }}>
                  <Sparkles size={20} className="text-white" />
                </div>
                <input
                  type="text"
                  readOnly
                  onClick={() => router.push('/report?mode=anonymous')}
                  className="form-control hover-bg-light cursor-pointer"
                  style={{ borderRadius: '8px', backgroundColor: COLORS.surface, borderColor: COLORS.border }}
                  placeholder="Spot something suspicious? Report anonymously..."
                />
                <button
                  onClick={() => router.push('/report?mode=public')}
                  className="btn btn-link text-primary p-2 d-flex align-items-center gap-1 text-decoration-none fw-bold"
                  title="Featured Public Post"
                >
                  <MessageSquare size={20} /> <span className="d-none d-sm-inline">Public Post</span>
                </button>
              </div>
            </motion.div>

            {/* Filter Bar */}
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <button
                  className={`btn btn-sm rounded-pill fw-bold ${activeTab === 'myfeed' ? 'btn-primary' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab('myfeed')}
                >
                  My Feed (Appeals)
                </button>
                <button
                  className={`btn btn-sm rounded-pill fw-bold ${activeTab === 'all' ? 'btn-dark' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Posts
                </button>
                <button
                  className={`btn btn-sm rounded-pill fw-bold ${activeTab === 'critical' ? 'btn-danger text-white' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab('critical')}
                >
                  Critical
                </button>
                <button
                  className={`btn btn-sm rounded-pill fw-bold ${activeTab === 'rewards' ? 'btn-warning text-dark' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab('rewards')}
                >
                  <Award size={14} className="me-1" /> Rewards
                </button>
                <button
                  className={`btn btn-sm rounded-pill fw-bold ${activeTab === 'traffic' ? 'btn-info text-dark' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab('traffic')}
                >
                  Traffic
                </button>
                <button
                  className={`btn btn-sm rounded-pill fw-bold ${activeTab === 'sos' ? 'btn-dark text-warning' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab('sos')}
                >
                  🚨 SOS
                </button>
              </div>

              <div className="d-flex">
                <button className="btn btn-link text-muted p-1"><Filter size={18} /></button>
              </div>
            </div>

            {/* Pinned / Featured Section Title */}
            {leads.some(l => l.isPinned) && (
              <div className="mb-3 d-flex align-items-center gap-2">
                <div className="px-2 py-1 bg-warning text-dark fw-bold rounded" style={{ fontSize: '10px' }}>★ FEATURED</div>
                <h6 className="mb-0 fw-bold text-muted text-uppercase" style={{ letterSpacing: '1px', fontSize: '11px' }}>Priority Intelligence Dossier</h6>
              </div>
            )}

            {/* Main Feed Loop */}
            <div className="feed-container d-grid gap-3">
              {leads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  ref={index === leads.length - 1 ? lastLeadElementRef : null}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index < 5 ? index * 0.05 : 0 }}
                >
                  <LeadCard
                    lead={lead}
                    onClick={(l) => setSelectedLead(l)}
                    onReportAnonymously={(l) => router.push(`/report?mode=anonymous&ref=${l.id}&title=${encodeURIComponent(l.title)}`)}
                    onProvideNamedTip={(l) => router.push(`/report?mode=named&ref=${l.id}&title=${encodeURIComponent(l.title)}`)}
                  />
                </motion.div>
              ))}

              {loading && (
                <div className="text-center py-4">
                  <Loader2 className="animate-spin text-primary mx-auto" size={32} />
                </div>
              )}

              {leads.length === 0 && !loading && (
                <div className="text-center py-5">
                  <AlertCircle size={48} className="text-muted mb-3" />
                  <p className="text-muted fw-bold">No intelligence found. Be the first to report.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR - Impact & Stats */}
          <div className="col-lg-3 ps-lg-4 d-none d-lg-block">
            <RightSidebar />
          </div>

        </div>
      </main>

      <DetailCanvas leadId={selectedLead?.id} onClose={() => setSelectedLead(null)} />
    </div>
  );
}
