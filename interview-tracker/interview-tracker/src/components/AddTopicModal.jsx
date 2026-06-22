import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';

const AddTopicModal = ({ onAdd, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    category: 'dsa',
    confidence: 50,
    notes: '',
  });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    onAdd({
      id: Date.now().toString(),
      ...form,
      lastRevised: today,
      revisionCount: 0,
      needsRevision: false,
      history: [{ date: today, score: form.confidence }],
    });
    onClose();
  };

  const cat = CATEGORIES.find(c => c.id === form.category);
  const confColor = form.confidence >= 75 ? '#10B981' : form.confidence >= 50 ? '#F59E0B' : '#F43F5E';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        width: '100%',
        maxWidth: '480px',
        padding: '28px',
        animation: 'slideUp 0.2s ease',
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Add New Topic</h2>
          <button onClick={onClose} style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            borderRadius: '8px',
            padding: '6px',
            display: 'flex',
          }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Topic name */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
              TOPIC NAME *
            </label>
            <input
              type="text"
              placeholder="e.g. Dynamic Programming"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text)',
                padding: '10px 14px',
                fontSize: '14px',
                outline: 'none',
              }}
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
              CATEGORY
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setForm({ ...form, category: c.id })}
                  style={{
                    background: form.category === c.id ? `${c.color}22` : 'var(--bg)',
                    border: `1px solid ${form.category === c.id ? c.color : 'var(--border)'}`,
                    color: form.category === c.id ? c.color : 'var(--text-muted)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: form.category === c.id ? 600 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Confidence */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 500 }}>
                INITIAL CONFIDENCE
              </label>
              <span style={{
                fontFamily: 'var(--mono)',
                fontSize: '16px',
                fontWeight: 600,
                color: confColor,
              }}>
                {form.confidence}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={form.confidence}
              onChange={e => setForm({ ...form, confidence: +e.target.value })}
              style={{ width: '100%', accentColor: confColor }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Beginner</span>
              <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Intermediate</span>
              <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Expert</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
              NOTES (OPTIONAL)
            </label>
            <textarea
              placeholder="What do you know? What needs more practice?"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text)',
                padding: '10px 14px',
                fontSize: '13px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim()}
            style={{
              background: form.name.trim() ? 'var(--primary)' : 'var(--border)',
              border: 'none',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              cursor: form.name.trim() ? 'pointer' : 'not-allowed',
              marginTop: '4px',
            }}
          >
            Add Topic
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTopicModal;
