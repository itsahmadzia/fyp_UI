import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const BubbleWordCloud = ({ data, width, height, colors, maxFontSize = 36, minFontSize = 12 }) => {
  const canvasRef = useRef(null);

  // Pack bubbles with controlled overlap
  const packBubbles = () => {
    const bubbles = [];
    const maxCount = Math.max(...data.map(item => item.value));
    
    // Sort data by value (descending) so larger bubbles are placed first
    const sortedData = [...data].sort((a, b) => b.value - a.value);
    
    sortedData.forEach((item, index) => {
      // Normalize the value to a reasonable size
      const radius = 30 + (item.value / maxCount) * 70;
      
      // Select color from provided colors or random
      const color = colors && colors.length > 0 
        ? colors[index % colors.length]
        : `hsl(${Math.random() * 360}, 70%, 60%)`;
      
      // For first bubble, place in center
      if (index === 0) {
        bubbles.push({
          text: item.text,
          x: width / 2,
          y: height / 2,
          radius,
          color,
        });
        return;
      }
      
      // For subsequent bubbles, find position near existing bubbles
      let bestPlacement;
      let bestDistance = Infinity;
      
      // Try to place near existing bubbles (creates organic overlap)
      for (let i = 0; i < bubbles.length; i++) {
        const existingBubble = bubbles[i];
        
        // Try at various angles around the existing bubble
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
          const x = existingBubble.x + Math.cos(angle) * (existingBubble.radius + radius * 0.7);
          const y = existingBubble.y + Math.sin(angle) * (existingBubble.radius + radius * 0.7);
          
          // Check if this position keeps the bubble within canvas
          if (x - radius < 0 || x + radius > width || y - radius < 0 || y + radius > height) {
            continue;
          }
          
          // Calculate distance to nearest existing bubble
          let minDist = Infinity;
          bubbles.forEach(b => {
            const dist = Math.sqrt(Math.pow(x - b.x, 2) + Math.pow(y - b.y, 2)) - b.radius;
            if (dist < minDist) minDist = dist;
          });
          
          // Prefer positions that are close but not too close to existing bubbles
          if (minDist > -radius * 0.3 && minDist < bestDistance) {
            bestDistance = minDist;
            bestPlacement = { x, y };
          }
        }
      }
      
      // If no good placement found (shouldn't happen with reasonable data), place randomly
      if (!bestPlacement) {
        bestPlacement = {
          x: Math.random() * (width - radius * 2) + radius,
          y: Math.random() * (height - radius * 2) + radius
        };
      }
      
      bubbles.push({
        text: item.text,
        x: bestPlacement.x,
        y: bestPlacement.y,
        radius,
        color,
      });
    });
    
    return bubbles;
  };

  // Calculate optimal font size for text to fit in bubble
  const getOptimalFontSize = (ctx, text, maxWidth, maxHeight) => {
    let fontSize = maxFontSize;
    ctx.font = `${fontSize}px Arial`;
    let metrics = ctx.measureText(text);
    
    // Reduce font size until text fits
    while ((metrics.width > maxWidth * 1.8 || fontSize > maxHeight) && fontSize > minFontSize) {
      fontSize -= 1;
      ctx.font = `${fontSize}px Arial`;
      metrics = ctx.measureText(text);
    }
    
    return fontSize;
  };

  // Draw all bubbles on canvas
  const drawBubbles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    
    const bubbles = packBubbles();
    
    bubbles.forEach(bubble => {
      // Draw bubble
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fillStyle = bubble.color;
      ctx.fill();
      
      // Set up text properties
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      
      // Calculate maximum text width (80% of bubble diameter)
      const maxTextWidth = bubble.radius * 1.6;
      const maxTextHeight = bubble.radius * 0.8;
      
      // Get optimal font size
      const fontSize = getOptimalFontSize(ctx, bubble.text, maxTextWidth, maxTextHeight);
      ctx.font = `bold ${fontSize}px Arial`;
      
      // Draw text
      ctx.fillText(bubble.text, bubble.x, bubble.y);
    });
  };

  useEffect(() => {
    drawBubbles();
    
    // Redraw when window is resized
    const handleResize = () => {
      drawBubbles();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data, width, height]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        style={{ 
          width: '100%', 
          height: 'auto', 
          maxWidth: '100%',
          display: 'block',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};

BubbleWordCloud.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  colors: PropTypes.arrayOf(PropTypes.string),
  maxFontSize: PropTypes.number,
  minFontSize: PropTypes.number,
};

BubbleWordCloud.defaultProps = {
  width: 800,
  height: 600,
  maxFontSize: 36,
  minFontSize: 12,
  colors: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F06292', '#7986CB', '#9575CD',
    '#64B5F6', '#81C784', '#FFD54F', '#BA68C8'
  ],
};

export default BubbleWordCloud;