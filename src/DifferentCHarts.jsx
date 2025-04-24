import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, ScatterChart, Scatter, ComposedChart, FunnelChart, Funnel
} from 'recharts';

// Separate JSON data with slightly adjusted values
const analyticsData = {
  averageAnalytics: {
    sentiments: {
      positive: 68.7,
      neutral: 18.2,
      negative: 13.1
    },
    six_emotions: {
      sadness: 8.3,
      joy: 38.5,
      love: 28.2,
      anger: 15.7,
      fear: 5.2,
      surprise: 4.1
    },
    dailyTrend: [
      { day: 'Mon', positive: 65, negative: 15 },
      { day: 'Tue', positive: 70, negative: 10 },
      { day: 'Wed', positive: 62, negative: 18 },
      { day: 'Thu', positive: 75, negative: 8 },
      { day: 'Fri', positive: 68, negative: 12 }
    ]
  }
};

// Chart Components
const SentimentPieChart = () => {
  const data = [
    { name: 'Positive', value: analyticsData.averageAnalytics.sentiments.positive },
    { name: 'Neutral', value: analyticsData.averageAnalytics.sentiments.neutral },
    { name: 'Negative', value: analyticsData.averageAnalytics.sentiments.negative }
  ];

  const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

  return (
    <div className="chart-container">
      <h3>Sentiment Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const EmotionRadarChart = () => {
  const data = [
    { emotion: 'Joy', value: analyticsData.averageAnalytics.six_emotions.joy },
    { emotion: 'Love', value: analyticsData.averageAnalytics.six_emotions.love },
    { emotion: 'Anger', value: analyticsData.averageAnalytics.six_emotions.anger },
    { emotion: 'Sadness', value: analyticsData.averageAnalytics.six_emotions.sadness },
    { emotion: 'Fear', value: analyticsData.averageAnalytics.six_emotions.fear },
    { emotion: 'Surprise', value: analyticsData.averageAnalytics.six_emotions.surprise }
  ];

  return (
    <div className="chart-container">
      <h3>Emotion Intensity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="emotion" />
          <PolarRadiusAxis angle={30} domain={[0, 50]} />
          <Radar name="Emotions" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Tooltip formatter={(value) => [`${value}%`, 'Intensity']} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const DailyTrendAreaChart = () => {
  return (
    <div className="chart-container">
      <h3>Weekly Sentiment Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={analyticsData.averageAnalytics.dailyTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
          <Legend />
          <Area type="monotone" dataKey="positive" stackId="1" stroke="#4CAF50" fill="#4CAF50" name="Positive" />
          <Area type="monotone" dataKey="negative" stackId="2" stroke="#F44336" fill="#F44336" name="Negative" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const EmotionComposedChart = () => {
  const data = Object.entries(analyticsData.averageAnalytics.six_emotions).map(([emotion, value]) => ({
    emotion,
    value
  }));

  return (
    <div className="chart-container">
      <h3>Emotion Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="emotion" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
          <Legend />
          <Bar dataKey="value" barSize={20} fill="#8884d8" name="Percentage" />
          <Line type="monotone" dataKey="value" stroke="#ff7300" name="Trend" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

const SentimentFunnelChart = () => {
  const data = [
    { name: 'Positive', value: analyticsData.averageAnalytics.sentiments.positive, fill: '#4CAF50' },
    { name: 'Neutral', value: analyticsData.averageAnalytics.sentiments.neutral, fill: '#FFC107' },
    { name: 'Negative', value: analyticsData.averageAnalytics.sentiments.negative, fill: '#F44336' },

  ];

  return (
    <div className="chart-container">
      <h3>Sentiment Funnel</h3>
      <ResponsiveContainer width="100%" height={300}>
        <FunnelChart>
          <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Funnel>
          <Legend />
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
};

const EmotionScatterChart = () => {
  const data = Object.entries(analyticsData.averageAnalytics.six_emotions).map(([emotion, value]) => ({
    emotion,
    value,
    size: value * 2 // Scale for better visualization
  }));

  return (
    <div className="chart-container">
      <h3>Emotion Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="emotion" name="Emotion" />
          <YAxis dataKey="value" name="Percentage" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value) => [`${value}%`, 'Intensity']} />
          <Legend />
          <Scatter name="Emotions" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{payload[0].payload.name}</p>
          <p style={{ color: payload[0].color }}>{`Value: ${payload[0].value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Process emotion data with all emotions included
  const processEmotionData = () => {
    return [
      { name: 'Joy', value: analyticsData.averageAnalytics.six_emotions.joy, color: '#FFD700' },
      { name: 'Love', value: analyticsData.averageAnalytics.six_emotions.love, color: '#FF69B4' },
      { name: 'Anger', value: analyticsData.averageAnalytics.six_emotions.anger, color: '#FF4500' },
      { name: 'Sadness', value: analyticsData.averageAnalytics.six_emotions.sadness, color: '#1E90FF' },
      { name: 'Fear', value: analyticsData.averageAnalytics.six_emotions.fear, color: '#9932CC' },
      { name: 'Surprise', value: analyticsData.averageAnalytics.six_emotions.surprise, color: '#00CED1' }
    ];
  };
const DoubleDonutChart = () => {
  const sentimentData = [
    { name: 'Positive', value: analyticsData.averageAnalytics.sentiments.positive, color: '#4CAF50' },
    { name: 'Neutral', value: analyticsData.averageAnalytics.sentiments.neutral, color: '#FFC107' },
    { name: 'Negative', value: analyticsData.averageAnalytics.sentiments.negative, color: '#F44336' }
  ];

  const emotionData = processEmotionData();

  return (
    <div className="chart-card" style={{ 
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3>Sentiment & Emotion Analysis</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          {/* Outer Pie (Sentiments) */}
          <Pie
            data={sentimentData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={60}
            dataKey="value"
           
          >
            {sentimentData.map((entry, index) => (
              <Cell key={`outer-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          
          {/* Inner Pie (All Emotions) */}
          <Pie
            data={emotionData}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={50}
            dataKey="value"
     
          >
            {emotionData.map((entry, index) => (
              <Cell key={`inner-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Main Dashboard Component
const AnalyticsDashboard = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Analytics Dashboard</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '20px'
      }}>
        <SentimentPieChart />
        <EmotionRadarChart />
        <DailyTrendAreaChart />
        <EmotionComposedChart />
        <SentimentFunnelChart />
        <EmotionScatterChart />
        <DoubleDonutChart/>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;