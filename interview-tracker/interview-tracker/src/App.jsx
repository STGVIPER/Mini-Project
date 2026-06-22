import React, { useState, useMemo } from 'react';
import { LayoutDashboard, BookOpen, BarChart2, FileText, Plus, Search, Filter, X } from 'lucide-react';
import { CATEGORIES, INITIAL_TOPICS } from './data/initialData';
import Dashboard from './components/Dashboard';
import TopicCard from './components/TopicCard';
import Analytics from './components/Analytics';
import Summary from './components/Summary';
import AddTopicModal from './components/AddTopicModal';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'topics', label: 'Topics', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'summary', label: 'Summary', icon: FileText },
];

export default function App() {
  const [view, setView] = useState('dashboard');
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const updateTopic = (updated) => {
    setTopics(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const deleteTopic = (id) => {
    setTopics(prev => prev.filter(t => t.id !== id));
  };

  const reviseTopic = (id) => {
    const today = new Date().toISOString().split('T')[0];
    setTopics(prev => prev.map(t => {
      if (t.id !== id) return t;
      const newHistory = [...t.history, { date: today, score: t.confidence }];
      return {
        ...t,
        lastRevised: today,
        revisionCount: t.revisionCount + 1,
        needsRevision: false,
        history: newHistory,
      };
    }));
  };

  const addTopic = (topic) => {
    setTopics(prev => [...prev, topic]);
  };

  const filteredTopics = useMemo(() => {
    let ts = topics;
    if (search.trim()) {
      ts = ts.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.notes.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterCat !== 'all') {
      ts = ts.filter(t => t.category === filterCat);
    }
    ts = [...ts].sort((a, b) => {
      if (sortBy === 'confidence_asc') return a.confidence - b.confidence;
      if (sortBy === 'confidence_desc') return b.confidence - a.confidence;
      if (sortBy === 'recent') return new Date(b.lastRevised) - new Date(a.lastRevised);
      return a.name.localeCompare(b.name);
    });
    return ts;
  }, [topics, search, filterCat, sortBy]);

  const readiness = topics.length
    ? Math.round(topics.reduce((s, t) => s + t.confidence, 0) / topics.length)
    : 0;

  const readinessColor = readiness >= 75 ? '#10B981' : readiness >= 50 ? '#F59E0B' : '#F43F5E';

  const ActiveIcon = NAV.find(n => n.id === view)?.icon || LayoutDashboard;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--sans)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'var(--primary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}>🎯</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1 }}>PrepTracker</div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>Placement Prep</div>
            </div>
          </div>
        </div>

        {/* Readiness pill */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Overall Readiness
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, height: '6px', background: 'var(--bg)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${readiness}%`,
                background: readinessColor,
                borderRadius: '3px',
                transition: 'width 0.6s',
                boxShadow: `0 0 8px ${readinessColor}66`,
              }} />
            </div>
            <span style={{
              fontFamily: 'var(--mono)',
              fontSize: '13px',
              fontWeight: 700,
              color: readinessColor,
              minWidth: '32px',
            }}>{readiness}%</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 12px', flex: 1 }}>
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = view === id;
            return (
              <button
                key={id}
                onClick={() => setView(id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: active ? 'var(--primary-dim)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  marginBottom: '2px',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  borderLeft: active ? '2px solid var(--primary)' : '2px solid transparent',
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Add topic button */}
        <div style={{ padding: '16px 12px' }}>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              width: '100%',
              background: 'var(--primary)',
              border: 'none',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              padding: '10px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              cursor: 'pointer',
            }}
          >
            <Plus size={15} /> Add Topic
          </button>
        </div>

        {/* Stats footer */}
        <div style={{ padding: '12px 20px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { label: 'Topics', value: topics.length },
              { label: 'Strong', value: topics.filter(t => t.confidence >= 75).length },
              { label: 'Weak', value: topics.filter(t => t.confidence < 50).length },
              { label: 'Revisions', value: topics.reduce((s, t) => s + t.revisionCount, 0) },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Top bar */}
        <header style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(15,23,42,0.8)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ActiveIcon size={18} style={{ color: 'var(--primary)' }} />
            <h1 style={{ fontSize: '18px', fontWeight: 700 }}>
              {NAV.find(n => n.id === view)?.label}
            </h1>
          </div>

          {/* Search (topics view) */}
          {view === 'topics' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '500px' }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
              }}>
                <Search size={14} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text)',
                    fontSize: '13px',
                    outline: 'none',
                    flex: 1,
                    minWidth: 0,
                  }}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', display: 'flex', cursor: 'pointer' }}>
                    <X size={12} />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                <option value="name">Sort: Name</option>
                <option value="confidence_desc">Sort: High Confidence</option>
                <option value="confidence_asc">Sort: Low Confidence</option>
                <option value="recent">Sort: Recent</option>
              </select>
            </div>
          )}

          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: 'var(--primary)',
              border: 'none',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} /> Add Topic
          </button>
        </header>

        {/* Content area */}
        <div style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {view === 'dashboard' && <Dashboard topics={topics} />}

          {view === 'topics' && (
            <div>
              {/* Category filter tabs */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <button
                  onClick={() => setFilterCat('all')}
                  style={{
                    background: filterCat === 'all' ? 'var(--primary-dim)' : 'var(--surface)',
                    border: `1px solid ${filterCat === 'all' ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
                    color: filterCat === 'all' ? 'var(--primary)' : 'var(--text-muted)',
                    borderRadius: '20px',
                    padding: '5px 14px',
                    fontSize: '12px',
                    fontWeight: filterCat === 'all' ? 600 : 400,
                    cursor: 'pointer',
                  }}
                >
                  All ({topics.length})
                </button>
                {CATEGORIES.map(cat => {
                  const count = topics.filter(t => t.category === cat.id).length;
                  if (!count) return null;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setFilterCat(filterCat === cat.id ? 'all' : cat.id)}
                      style={{
                        background: filterCat === cat.id ? `${cat.color}18` : 'var(--surface)',
                        border: `1px solid ${filterCat === cat.id ? cat.color : 'var(--border)'}`,
                        color: filterCat === cat.id ? cat.color : 'var(--text-muted)',
                        borderRadius: '20px',
                        padding: '5px 14px',
                        fontSize: '12px',
                        fontWeight: filterCat === cat.id ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {cat.label} ({count})
                    </button>
                  );
                })}
              </div>

              {filteredTopics.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
                  <BookOpen size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                  <p style={{ fontSize: '16px' }}>No topics found</p>
                  <p style={{ fontSize: '13px', marginTop: '8px' }}>
                    {search ? 'Try a different search query.' : 'Click "Add Topic" to get started.'}
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '16px',
                }}>
                  {filteredTopics.map(topic => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      onUpdate={updateTopic}
                      onDelete={deleteTopic}
                      onRevise={() => reviseTopic(topic.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'analytics' && <Analytics topics={topics} />}
          {view === 'summary' && <Summary topics={topics} />}
        </div>
      </main>

      {showAdd && <AddTopicModal onAdd={addTopic} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
