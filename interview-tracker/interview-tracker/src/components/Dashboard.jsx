import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, Legend,
} from 'recharts';
import { TrendingUp, BookOpen, RefreshCw, AlertTriangle, Target, Award } from 'lucide-react';
import ReadinessGauge from './ReadinessGauge';
import { CATEGORIES } from '../data/initialData';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div style={{
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    padding: '20px',
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
  }}>
    <div style={{
      background: `${color}18`,
      borderRadius: '10px',
      padding: '10px',
      color,
      flexShrink: 0,
    }}>
      <Icon size={20} />
    </div>
    <div>
      <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--mono)', color }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{sub}</div>}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1E293B',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '12px',
    }}>
      <p style={{ color: '#94A3B8', marginBottom: '4px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const Dashboard = ({ topics }) => {
  const readinessScore = topics.length
    ? Math.round(topics.reduce((s, t) => s + t.confidence, 0) / topics.length)
    : 0;

  const needsRevision = topics.filter(t => t.needsRevision).length;
  const totalRevisions = topics.reduce((s, t) => s + t.revisionCount, 0);
  const strongTopics = topics.filter(t => t.confidence >= 75).length;
  const weakTopics = topics.filter(t => t.confidence < 50).length;

  // Category radar data
  const radarData = CATEGORIES.map(cat => {
    const catTopics = topics.filter(t => t.category === cat.id);
    return {
      subject: cat.label,
      score: catTopics.length
        ? Math.round(catTopics.reduce((s, t) => s + t.confidence, 0) / catTopics.length)
        : 0,
    };
  }).filter(d => d.score > 0);

  // Confidence distribution bar
  const distData = [
    { range: '0–25', count: topics.filter(t => t.confidence < 25).length, color: '#F43F5E' },
    { range: '25–50', count: topics.filter(t => t.confidence >= 25 && t.confidence < 50).length, color: '#F59E0B' },
    { range: '50–75', count: topics.filter(t => t.confidence >= 50 && t.confidence < 75).length, color: '#38BDF8' },
    { range: '75–100', count: topics.filter(t => t.confidence >= 75).length, color: '#10B981' },
  ];

  // Top 5 topics trend (last 4 data points each)
  const trendTopics = [...topics]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 4);

  // Build common dates
  const allDates = [...new Set(
    trendTopics.flatMap(t => t.history.map(h => h.date))
  )].sort();

  const trendData = allDates.map(date => {
    const entry = { date: date.slice(5) }; // MM-DD
    trendTopics.forEach(t => {
      const point = t.history.find(h => h.date === date);
      if (point) entry[t.name.slice(0, 15)] = point.score;
    });
    return entry;
  });

  const lineColors = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Gauge */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Overall Readiness
          </div>
          <ReadinessGauge score={readinessScore} />
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center' }}>
            Based on {topics.length} topic{topics.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <StatCard icon={Target} label="Total Topics" value={topics.length} color="#6366F1" sub="being tracked" />
          <StatCard icon={Award} label="Strong Topics" value={strongTopics} color="#10B981" sub="confidence ≥ 75" />
          <StatCard icon={AlertTriangle} label="Needs Revision" value={needsRevision} color="#F59E0B" sub="flagged topics" />
          <StatCard icon={RefreshCw} label="Total Revisions" value={totalRevisions} color="#38BDF8" sub="sessions done" />
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Radar */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          padding: '20px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '16px' }}>
            Category Coverage
          </h3>
          {radarData.length >= 3 ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
              Add topics in 3+ categories to see radar
            </div>
          )}
        </div>

        {/* Confidence distribution */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          padding: '20px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '16px' }}>
            Confidence Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={distData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="range" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Topics" radius={[4, 4, 0, 0]}>
                {distData.map((entry, i) => (
                  <rect key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend chart */}
      {trendData.length >= 2 && (
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          padding: '20px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '16px' }}>
            Confidence Trends — Top Topics
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94A3B8' }} />
              {trendTopics.map((t, i) => (
                <Line
                  key={t.id}
                  type="monotone"
                  dataKey={t.name.slice(0, 15)}
                  stroke={lineColors[i]}
                  strokeWidth={2}
                  dot={{ fill: lineColors[i], r: 3 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weak areas alert */}
      {weakTopics > 0 && (
        <div style={{
          background: 'rgba(244,63,94,0.08)',
          border: '1px solid rgba(244,63,94,0.25)',
          borderRadius: 'var(--radius)',
          padding: '16px 20px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
        }}>
          <AlertTriangle size={18} style={{ color: '#F43F5E', flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#F43F5E' }}>
              {weakTopics} topic{weakTopics > 1 ? 's' : ''} need urgent attention
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Topics with confidence below 50 are highlighted in red. Prioritize revising them before your interview.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
