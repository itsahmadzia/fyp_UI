import { useState } from 'react'
import WordCloud from './WordCloud';
import SemanticEmotionUI from './Sentiment';
import UsingLibrary from '../UsingLibrary';
import AnalyticsDashboard from './DifferentCHarts';


function App() {
  const [count, setCount] = useState(0)
    const data = [
  { word: 'React', size: 100, meta: { type: 'framework' } },
  { word: 'JavaScript', size: 30, meta: { type: 'language' } },
  { word: 'Canvas', size: 25, meta: { type: 'API' } },
  { word: 'Frontend', size: 45, meta: { type: 'domain' } },
  { word: 'Backend', size: 20, meta: { type: 'domain' } },
];
  return (
    <>
  {/* <WordCloud data={data}>


  </WordCloud>
  <SemanticEmotionUI></SemanticEmotionUI>
  <UsingLibrary></UsingLibrary> */}
<AnalyticsDashboard/>
    </>
  )
}

export default App
