import React, { useRef, useEffect, useState } from 'react';

const getRandomColor = () => {
  const colors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#F7B801', '#A66DD4', '#FF922B'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Check if two rectangles collide
const isColliding = (a, b) => {
  return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
  );
};

const WordCloud = ({ data }) => {
  const canvasRef = useRef(null);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const positions = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 800;
    const height = canvas.height = 600;
    ctx.clearRect(0, 0, width, height);
    positions.current = [];

    const centerX = width / 2;
    const centerY = height / 2;

    data.forEach((item, index) => {
      const fontSize = item.size;
      const color = getRandomColor();
      ctx.font = `${fontSize}px 'Segoe UI', sans-serif`;
      const textWidth = ctx.measureText(item.word).width;
      const textHeight = fontSize;

      // Try placing on a spiral path until a non-colliding spot is found
      let angle = 0;
      let radius = 0;
      let placed = false;
      let x, y;

      while (!placed && radius < 300) {
        angle += 0.3;
        radius += 2;

        x = centerX + radius * Math.cos(angle) - textWidth / 2;
        y = centerY + radius * Math.sin(angle) - textHeight / 2;

        const newBox = { x, y, width: textWidth, height: textHeight };

        const collision = positions.current.some(pos => isColliding(pos, newBox));

        if (!collision) {
          ctx.fillStyle = color;
          ctx.shadowColor = 'rgba(0,0,0,0.2)';
          ctx.shadowBlur = 2;
          ctx.fillText(item.word, x, y + fontSize);

          positions.current.push({
            ...item,
            x,
            y,
            width: textWidth,
            height: textHeight,
            color,
          });

          placed = true;
        }
      }
    });
  }, [data]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    let found = false;

    positions.current.forEach((item) => {
      const isHovered =
        x >= item.x &&
        x <= item.x + item.width &&
        y >= item.y &&
        y <= item.y + item.height;

      ctx.font = `${item.size}px 'Segoe UI', sans-serif`;
      ctx.fillStyle = isHovered ? '#222' : item.color;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = isHovered ? 5 : 2;
      ctx.fillText(item.word, item.x, item.y + item.size);

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
          border: '1px solid #ddd',
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
