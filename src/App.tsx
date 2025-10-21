import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import EpisodeLayout from './feature/episode/EpisodeLayout';
import ChannelLayout from './feature/channel-book/ChannelLayout';
import CurationLayout from './feature/curation/CurationLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<EpisodeLayout />} />
          <Route path='/channel-book-list' element={<ChannelLayout />} />
          <Route path='/curation-list' element={<CurationLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
