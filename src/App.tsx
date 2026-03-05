import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChannelLayout from './feature/channel-book/ChannelLayout';
import CurationLayout from './feature/curation/CurationLayout';
import EpisodeLayout from './feature/episode/EpisodeLayout';
import Layout from './layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<EpisodeLayout />} />
          <Route path='/channel-book-list' element={<ChannelLayout />} />
          <Route path='/curation-list' element={<CurationLayout />} />
          <Route path='/stg/episode-list' element={<EpisodeLayout />} />
          <Route path='/stg/channel-book-list' element={<ChannelLayout />} />
          <Route path='/stg/curation-list' element={<CurationLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
