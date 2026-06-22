import React, { useState } from 'react';
import { BookOpen, RefreshCw, ChevronDown, ChevronUp, Edit3, Trash2, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';

const TopicCard = ({ topic, onUpdate, onDelete, onRevise }) => {
  const [expanded, setExpanded] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(topic.notes);

  const cat = CATEGORIES.find(c => c.id === topic.category);
  const color = cat?.color || '#6366F1';

  const getConfidenceColor = (c) => {
    if (c >= 75) return '#10B981';
    if (c >= 50) return '#F59E0B';
    return '#F43F5E';
  };

  const confColor = getConfidenceColor(topic.confidence);
  const daysSince = topic.lastRevised
    ? Math.floor((new Date() - new Date(topic.lastRevised)) / 86400000)
    : 999;

  const saveNote = () => {
    onUpdate({ ...topic, notes: noteText });
    setEditingNote(false);
  };

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      border: `1px solid ${topic.needsRevision ? '#F59E0B44' : 'var(--border)'}`,
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: topic.needsRevision ? '0 0 0 1px #F59E0B22' : 'none',
    }}>
      {/* Top accent bar */}
      <div style={{ height: '3px', background: color, opacity: 0.8 }} />

      <div style={{ padding: '16px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                background: `${color}22`,
                color,
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '10px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>{cat?.label}</span>
              {topic.needsRevision && (
                <span style={{
                  background: '#F59E0B22',
                  color: '#F59E0B',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '10px',
                }}>⚠ Needs Revision</span>
              )}
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginTop: '6px', color: 'var(--text)' }}>
              {topic.name}
            </h3>
          </div>

          {/* Confidence badge */}
          <div style={{
            background: `${confColor}18`,
            border: `1px solid ${confColor}44`,
            borderRadius: '8px',
            padding: '6px 12px',
            textAlign: 'center',
            minWidth: '60px',
            flexShrink: 0,
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: 600, color: confColor, lineHeight: 1 }}>
              {topic.confidence}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>confidence</div>
          </div>
        </div>

        {/* Confidence bar */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${topic.confidence}%`,
              background: confColor,
              borderRadius: '3px',
              transition: 'width 0.6s ease',
              boxShadow: `0 0 8px ${confColor}66`,
            }} />
          </div>
        </div>

        {/* Meta info */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RefreshCw size={11} />
            {topic.revisionCount}x revised
          </span>
          <span style={{ fontSize: '12px', color: daysSince > 5 ? '#F59E0B' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BookOpen size={11} />
            {daysSince === 0 ? 'Today' : `${daysSince}d ago`}
          </span>
        </div>

        {/* Confidence slider */}
        <div style={{ marginTop: '12px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
            Adjust Confidence
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={topic.confidence}
            onChange={e => onUpdate({ ...topic, confidence: +e.target.value })}
            style={{
              width: '100%',
              accentColor: confColor,
              cursor: 'pointer',
            }}
          />
        </div>

        {/* Actions row */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button
            onClick={onRevise}
            style={{
              flex: 1,
              background: 'var(--primary-dim)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: 'var(--primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '7px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            <RotateCcw size={12} /> Mark Revised
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-sm)',
              padding: '7px 12px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Notes {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <button
            onClick={() => onDelete(topic.id)}
            style={{
              background: 'rgba(244,63,94,0.1)',
              border: '1px solid rgba(244,63,94,0.2)',
              color: '#F43F5E',
              borderRadius: 'var(--radius-sm)',
              padding: '7px 10px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Expanded notes */}
        {expanded && (
          <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            {editingNote ? (
              <div>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'var(--bg)',
                    border: '1px solid var(--primary)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text)',
                    padding: '8px',
                    fontSize: '13px',
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button onClick={saveNote} style={{
                    background: 'var(--primary)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>Save</button>
                  <button onClick={() => { setEditingNote(false); setNoteText(topic.notes); }} style={{
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 14px',
                    fontSize: '12px',
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, paddingRight: '28px' }}>
                  {topic.notes || 'No notes yet. Click edit to add notes.'}
                </p>
                <button
                  onClick={() => setEditingNote(true)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    padding: '2px',
                  }}
                >
                  <Edit3 size={13} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicCard;
