import React, { useRef, useEffect, useState } from "react";

const data = [
  { score: 90, label: "ABC Church", fill: "#43e97b" },
  { score: 60, label: "ABC Synagogue", fill: "#ff6f61" },
  { score: 80, label: "ABC Mosque", fill: "#30cfd0" },
  { score: 40, label: "ABC NGO", fill: "#f6d365" },
  { score: 100, label: "ABC Education", fill: "#4facfe" },
];

const BubbleCloud = () => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Simple bubble layout algorithm
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const angleIncrement = (2 * Math.PI) / data.length;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.3;

    const newPositions = data.map((item, index) => {
      const angle = index * angleIncrement;
      // Add some randomness to the radius and angle for more organic placement
      const randomRadius = radius * (0.8 + Math.random() * 0.4);
      const randomAngle = angle + (Math.random() - 0.5) * 0.5;

      return {
        x: centerX + Math.cos(randomAngle) * randomRadius,
        y: centerY + Math.sin(randomAngle) * randomRadius,
        ...item,
      };
    });

    setPositions(newPositions);
  }, [dimensions, data]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "400px",
        border: "1px solid #eee",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {positions.map((item, index) => {
        const size = 40 + (item.score / 100) * 60; // Adjust size based on score
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${item.x - size / 2}px`,
              top: `${item.y - size / 2}px`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              backgroundColor: item.fill,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              fontWeight: "bold",
              fontSize: `${Math.max(10, size / 5)}px`,
              opacity: 0.8,
              transform: `translate(-50%, -50%)`, // Center the bubble
              cursor: "pointer",
              transition: "all 0.3s ease",
              textAlign: "center",
              padding: "4px",
              boxSizing: "border-box",
              wordBreak: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={item.label}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};

export default BubbleCloud;