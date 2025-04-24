import React, { useRef, useEffect, useState } from 'react';

const getRandomColor = () => {
  const colors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#F7B801', '#A66DD4'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const WordCloud = ({ data }) => {
  const canvasRef = useRef(null);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const positions = useRef([]);

  // Static positions for 5 bubbles (x, y, radius multiplier)
  const staticPositions = [
    { x: 0.4, y: 0.5, radius: 1.0 },
    { x: 0.6, y: 0.5, radius: 0.9 },
    { x: 0.5, y: 0.4, radius: 0.8 },
    { x: 0.3, y: 0.6, radius: 0.7 },
    { x: 0.7, y: 0.6, radius: 0.6 }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 800;
    const height = canvas.height = 600;
    ctx.clearRect(0, 0, width, height);
    positions.current = [];

    data.slice(0, 5).forEach((item, index) => {
      const position = staticPositions[index % staticPositions.length];
      const fontSize = item.size * 1.5; // Increase font size for bubble effect
      const color = getRandomColor();
      const text = item.word;
      
      // Calculate position based on static positions
      const x = width * position.x;
      const y = height * position.y;
      const bubbleRadius = fontSize * position.radius * 1.5;

      // Draw bubble
      ctx.beginPath();
      ctx.arc(x, y, bubbleRadius, 0, Math.PI * 2);
      ctx.fillStyle = color + '80'; // Add transparency
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.font = `bold ${fontSize}px 'Segoe UI', sans-serif`;
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y);

      // Save position for hover detection
      positions.current.push({
        ...item,
        x: x - bubbleRadius,
        y: y - bubbleRadius,
        width: bubbleRadius * 2,
        height: bubbleRadius * 2,
        color,
        centerX: x,
        centerY: y,
        radius: bubbleRadius
      });
    });
  }, [data]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    let found = false;

    // Redraw all bubbles
    positions.current.forEach((item) => {
      const distance = Math.sqrt(
        Math.pow(x - item.centerX, 2) + 
        Math.pow(y - item.centerY, 2)
      );
      const isHovered = distance <= item.radius;

      // Draw bubble
      ctx.beginPath();
      ctx.arc(item.centerX, item.centerY, item.radius, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? `${item.color}CC` : `${item.color}80`;
      ctx.fill();
      ctx.strokeStyle = item.color;
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.stroke();

      // Draw text
      ctx.font = `bold ${item.size * 1.5}px 'Segoe UI', sans-serif`;
      ctx.fillStyle = isHovered ? '#fff' : '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.word, item.centerX, item.centerY);

      if (isHovered && !found) {
        found = true;
        setHoveredWord(item);
        setTooltipPos({ x: e.clientX, y: e.clientY });
      }
    });

    if (!found) setHoveredWord(null);
  };

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseMove={handleMouseMove}
        style={{
          border: '2px solid #eee',
          borderRadius: '10px',
          background: '#fafafa',
          cursor: 'pointer',
        }}
      />
      {hoveredWord && (
        <div style={{
          position: 'fixed',
          top: tooltipPos.y + 10,
          left: tooltipPos.x + 10,
          backgroundColor: '#fff',
          border: `2px solid ${hoveredWord.color}`,
          padding: '10px 14px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '14px',
          minWidth: '150px',
          zIndex: 999,
        }}>
          <strong style={{ color: hoveredWord.color }}>{hoveredWord.word}</strong>
          <div style={{ marginTop: '4px' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(hoveredWord.meta, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordCloud;