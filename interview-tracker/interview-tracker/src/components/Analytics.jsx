import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { CATEGORIES } from '../data/initialData';

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
        <p key={i} style={{ color: p.color || '#F8FAFC', fontWeight: 600 }}>
          {p.name}: {typeof p.value === 'number' ? Math.round(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const Analytics = ({ topics }) => {
  // Per-topic confidence bar
  const topicBar = [...topics]
    .sort((a, b) => b.confidence - a.confidence)
    .map(t => ({
      name: t.name.length > 18 ? t.name.slice(0, 18) + '…' : t.name,
      confidence: t.confidence,
      fill: t.confidence >= 75 ? '#10B981' : t.confidence >= 50 ? '#F59E0B' : '#F43F5E',
    }));

  // Category average
  const catAvg = CATEGORIES.map(cat => {
    const ts = topics.filter(t => t.category === cat.id);
    return {
      name: cat.label,
      avg: ts.length ? Math.round(ts.reduce((s, t) => s + t.confidence, 0) / ts.length) : 0,
      count: ts.length,
      color: cat.color,
    };
  }).filter(c => c.count > 0);

  // Revision frequency
  const revisionData = [...topics]
    .sort((a, b) => b.revisionCount - a.revisionCount)
    .slice(0, 8)
    .map(t => ({
      name: t.name.length > 16 ? t.name.slice(0, 16) + '…' : t.name,
      revisions: t.revisionCount,
    }));

  // Pie: strong vs medium vs weak
  const pieData = [
    { name: 'Strong (≥75)', value: topics.filter(t => t.confidence >= 75).length, color: '#10B981' },
    { name: 'Medium (50–74)', value: topics.filter(t => t.confidence >= 50 && t.confidence < 75).length, color: '#F59E0B' },
    { name: 'Weak (<50)', value: topics.filter(t => t.confidence < 50).length, color: '#F43F5E' },
  ].filter(d => d.value > 0);

  const chartCard = (title, children) => (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      padding: '20px',
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '20px' }}>
        {title}
      </h3>
      {children}
    </div>
  );

  if (!topics.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
        <p style={{ fontSize: '16px' }}>No topics to analyze yet.</p>
        <p style={{ fontSize: '13px', marginTop: '8px' }}>Add topics to see analytics.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Pie chart */}
        {chartCard('Readiness Breakdown',
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: '#94A3B8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* Category avg */}
        {chartCard('Average Confidence by Category',
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catAvg} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avg" name="Avg Confidence" radius={[0, 4, 4, 0]}>
                {catAvg.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* All topics confidence */}
      {chartCard('Confidence per Topic',
        <ResponsiveContainer width="100%" height={Math.max(200, topicBar.length * 36)}>
          <BarChart data={topicBar} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} width={130} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="confidence" name="Confidence" radius={[0, 4, 4, 0]}>
              {topicBar.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Revision frequency */}
      {revisionData.length > 0 && chartCard('Revision Count per Topic',
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revisionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revisions" name="Revisions" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Analytics;
