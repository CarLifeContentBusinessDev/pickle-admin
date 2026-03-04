import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import EpisodeLayout from './feature/episode/EpisodeLayout';
import ChannelLayout from './feature/channel-book/ChannelLayout';
import CurationLayout from './feature/curation/CurationLayout';
import DemoCategoryLayout from './feature/demo-category/DemoCategoryLayout';
import DemoCategoryEdit from './feature/demo-category/DemoCategoryEdit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<EpisodeLayout />} />
          <Route path='/channel-book-list' element={<ChannelLayout />} />
          <Route path='/curation-list' element={<CurationLayout />} />
          <Route path='/demo'>
            <Route path='category-list' element={<DemoCategoryLayout />} />
            <Route
              path='category-list/edit/:id'
              element={<DemoCategoryEdit />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
