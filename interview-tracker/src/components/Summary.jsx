import React from 'react';
import { CATEGORIES } from '../data/initialData';
import { CheckCircle, XCircle, Clock, Star } from 'lucide-react';

const Summary = ({ topics }) => {
  const readiness = topics.length
    ? Math.round(topics.reduce((s, t) => s + t.confidence, 0) / topics.length)
    : 0;

  const strong = topics.filter(t => t.confidence >= 75).sort((a, b) => b.confidence - a.confidence);
  const medium = topics.filter(t => t.confidence >= 50 && t.confidence < 75).sort((a, b) => b.confidence - a.confidence);
  const weak = topics.filter(t => t.confidence < 50).sort((a, b) => a.confidence - b.confidence);

  const catGroups = CATEGORIES.map(cat => ({
    ...cat,
    topics: topics.filter(t => t.category === cat.id),
  })).filter(c => c.topics.length > 0);

  const getReadinessLabel = (s) => {
    if (s >= 80) return { label: 'Highly Ready', color: '#10B981', desc: 'You are well-prepared for placement interviews. Keep revising to maintain this.' };
    if (s >= 65) return { label: 'Almost Ready', color: '#38BDF8', desc: 'Good progress! A few more focused sessions will get you interview-ready.' };
    if (s >= 50) return { label: 'Progressing', color: '#F59E0B', desc: 'You\'re on the right track. Focus on weak areas to boost your score.' };
    return { label: 'Early Stage', color: '#F43F5E', desc: 'You\'re just getting started. Consistent daily preparation is key.' };
  };

  const { label, color, desc } = getReadinessLabel(readiness);

  const TopicRow = ({ topic, icon: Icon, iconColor }) => {
    const cat = CATEGORIES.find(c => c.id === topic.category);
    const confColor = topic.confidence >= 75 ? '#10B981' : topic.confidence >= 50 ? '#F59E0B' : '#F43F5E';
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 0',
        borderBottom: '1px solid var(--border)',
      }}>
        <Icon size={14} style={{ color: iconColor, flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: '14px', color: 'var(--text)' }}>{topic.name}</span>
        <span style={{
          fontSize: '11px',
          background: `${cat?.color}18`,
          color: cat?.color,
          padding: '2px 8px',
          borderRadius: '8px',
          fontWeight: 600,
        }}>{cat?.label}</span>
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: '14px',
          fontWeight: 600,
          color: confColor,
          minWidth: '36px',
          textAlign: 'right',
        }}>{topic.confidence}</span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Overall status */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: `1px solid ${color}33`,
        padding: '24px',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: `${color}18`,
          border: `3px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 700, color }}>
            {readiness}
          </span>
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 700, color }}>{label}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.6 }}>
            {desc}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#10B981' }}>✓ {strong.length} strong</span>
            <span style={{ fontSize: '12px', color: '#F59E0B' }}>~ {medium.length} medium</span>
            <span style={{ fontSize: '12px', color: '#F43F5E' }}>✗ {weak.length} weak</span>
          </div>
        </div>
      </div>

      {/* Category-wise breakdown */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Category Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {catGroups.map(cat => {
            const avg = Math.round(cat.topics.reduce((s, t) => s + t.confidence, 0) / cat.topics.length);
            const catColor = avg >= 75 ? '#10B981' : avg >= 50 ? '#F59E0B' : '#F43F5E';
            return (
              <div key={cat.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: cat.color,
                      flexShrink: 0,
                      display: 'inline-block',
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{cat.label}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{cat.topics.length} topic{cat.topics.length > 1 ? 's' : ''}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 600, color: catColor }}>{avg}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${avg}%`, background: catColor, borderRadius: '3px', transition: 'width 0.6s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Strong */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Star size={15} style={{ color: '#10B981' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Strong Areas</h3>
          </div>
          {strong.length === 0
            ? <p style={{ color: 'var(--text-dim)', fontSize: '13px' }}>No strong topics yet</p>
            : strong.map(t => <TopicRow key={t.id} topic={t} icon={CheckCircle} iconColor="#10B981" />)
          }
        </div>

        {/* Weak */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Clock size={15} style={{ color: '#F43F5E' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Needs Work</h3>
          </div>
          {weak.length === 0
            ? <p style={{ color: 'var(--text-dim)', fontSize: '13px' }}>No weak topics! Great job.</p>
            : weak.map(t => <TopicRow key={t.id} topic={t} icon={XCircle} iconColor="#F43F5E" />)
          }
        </div>
      </div>

      {/* Interview tips */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(167,139,250,0.08) 100%)',
        borderRadius: 'var(--radius)',
        border: '1px solid rgba(99,102,241,0.25)',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#A78BFA', marginBottom: '12px' }}>
          📌 Preparation Recommendations
        </h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {weak.length > 0 && (
            <li style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
              <span style={{ color: '#F43F5E', flexShrink: 0 }}>→</span>
              Spend extra time on: <strong style={{ color: 'var(--text)' }}>{weak.slice(0, 3).map(t => t.name).join(', ')}</strong>
            </li>
          )}
          {topics.filter(t => t.needsRevision).length > 0 && (
            <li style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
              <span style={{ color: '#F59E0B', flexShrink: 0 }}>→</span>
              Flagged for revision: <strong style={{ color: 'var(--text)' }}>
                {topics.filter(t => t.needsRevision).map(t => t.name).join(', ')}
              </strong>
            </li>
          )}
          <li style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#10B981', flexShrink: 0 }}>→</span>
            Revise strong topics every 7 days to maintain confidence.
          </li>
          <li style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#6366F1', flexShrink: 0 }}>→</span>
            Target overall readiness ≥ 75 before appearing in interviews.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Summary;
