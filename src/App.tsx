import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import EpisodeLayout from './feature/episode/EpisodeLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<EpisodeLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
