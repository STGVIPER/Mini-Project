import React, { useEffect, useState } from 'react';

const ReadinessGauge = ({ score }) => {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const size = 200;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arc = circumference * 0.75;
  const offset = arc - (animated / 100) * arc;

  const getColor = (s) => {
    if (s >= 75) return '#10B981';
    if (s >= 50) return '#F59E0B';
    return '#F43F5E';
  };

  const getLabel = (s) => {
    if (s >= 80) return 'Interview Ready!';
    if (s >= 65) return 'Almost There';
    if (s >= 50) return 'Keep Grinding';
    return 'Just Starting';
  };

  const color = getColor(score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ position: 'relative', width: size, height: size * 0.85 }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(135deg)', overflow: 'visible' }}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc} ${circumference - arc}`}
            strokeLinecap="round"
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc - offset} ${circumference - (arc - offset)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.5s' }}
          />
          {/* Glow */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 6}
            strokeDasharray={`${arc - offset} ${circumference - (arc - offset)}`}
            strokeLinecap="round"
            opacity={0.15}
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.5s' }}
          />
        </svg>

        {/* Center text */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '20px',
        }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '42px',
            fontWeight: 600,
            color,
            lineHeight: 1,
            transition: 'color 0.5s',
          }}>
            {Math.round(animated)}
          </span>
          <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, letterSpacing: '0.05em' }}>
            / 100
          </span>
        </div>
      </div>

      <div style={{
        background: `${color}22`,
        border: `1px solid ${color}44`,
        borderRadius: '20px',
        padding: '6px 16px',
        fontSize: '13px',
        fontWeight: 600,
        color,
        letterSpacing: '0.03em',
        transition: 'all 0.5s',
      }}>
        {getLabel(score)}
      </div>
    </div>
  );
};

export default ReadinessGauge;
