import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import EpisodeLayout from './feature/episode/EpisodeLayout';
import ChannelLayout from './feature/channel-book/ChannelLayout';
import CurationLayout from './feature/curation/CurationLayout';
import DemoCategoryLayout from './feature/demo-category/DemoCategoryLayout';
import DemoCategoryEdit from './feature/demo-category/DemoCategoryEdit';
import DemoBroadcastingLayout from './feature/demo-broadcasting.tsx/DemoBroadcastingLayout';
import DemoBroadcastingEdit from './feature/demo-broadcasting.tsx/DemoBroadcastingEdit';
import DemoCategoryAdd from './feature/demo-category/DemoCategoryAdd';

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
            <Route path='category-list/add' element={<DemoCategoryAdd />} />
            <Route
              path='broadcasting-list'
              element={<DemoBroadcastingLayout />}
            />
            <Route
              path='broadcasting-list/edit/:id'
              element={<DemoBroadcastingEdit />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
