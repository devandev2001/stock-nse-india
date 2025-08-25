import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { MarketOverview } from './pages/MarketOverview';
import { EquityDetails } from './pages/EquityDetails';
import { IndexAnalysis } from './pages/IndexAnalysis';
import { OptionChain } from './pages/OptionChain';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MarketOverview />} />
          <Route path="equity" element={<EquityDetails />} />
          <Route path="indices" element={<IndexAnalysis />} />
          <Route path="options" element={<OptionChain />} />
          <Route path="activity" element={<MarketOverview />} />
          <Route path="corporate" element={<EquityDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;