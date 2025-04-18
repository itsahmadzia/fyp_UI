import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#34D399", "#FBBF24", "#EF4444"];

const data = {
  sentiment: {
    positive: 65,
    neutral: 20,
    negative: 15,
  },
  emotions: {
    happy: 50,
    sad: 10,
    angry: 5,
    fear: 5,
    surprise: 15,
    disgust: 15,
  },
};

const SentimentChart = ({ data }) => {
  const formatted = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-2">Sentiment Breakdown</h2>
      <PieChart width={300} height={250}>
        <Pie
          data={formatted}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {formatted.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

const EmotionChart = ({ data }) => {
  const formatted = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-2">Emotion Distribution</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={formatted}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#60A5FA" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const SummaryCards = ({ data }) => {
  const maxSentiment = Object.entries(data.sentiment).reduce((a, b) => (a[1] > b[1] ? a : b));
  const maxEmotion = Object.entries(data.emotions).reduce((a, b) => (a[1] > b[1] ? a : b));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-100 p-4 rounded-2xl">
        <h3 className="text-lg font-semibold">Dominant Sentiment</h3>
        <p className="text-2xl capitalize">{maxSentiment[0]} ({maxSentiment[1]}%)</p>
      </div>
      <div className="bg-blue-100 p-4 rounded-2xl">
        <h3 className="text-lg font-semibold">Dominant Emotion</h3>
        <p className="text-2xl capitalize">{maxEmotion[0]} ({maxEmotion[1]}%)</p>
      </div>
    </div>
  );
};

const SemanticEmotionUI = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Semantic & Emotional Analysis</h1>
      <SummaryCards data={data} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <SentimentChart data={data.sentiment} />
        <EmotionChart data={data.emotions} />
      </div>
    </div>
  );
};

export default SemanticEmotionUI;
