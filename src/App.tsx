import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChannelLayout from './feature/channel-book/ChannelLayout';
import CurationLayout from './feature/curation/CurationLayout';
import DemoCategoryLayout from './feature/demo-category/DemoCategoryLayout';
import DemoCategoryEdit from './feature/demo-category/DemoCategoryEdit';
import DemoBroadcastingLayout from './feature/demo-broadcasting/DemoBroadcastingLayout';
import DemoBroadcastingEdit from './feature/demo-broadcasting/DemoBroadcastingEdit';
import DemoCategoryAdd from './feature/demo-category/DemoCategoryAdd';
import DemoBroadcastingAdd from './feature/demo-broadcasting/DemoBroadcastingAdd';
import EpisodeLayout from './feature/episode/EpisodeLayout';
import Layout from './layout/Layout';
import DemoProgramLayout from './feature/demo-program/DemoProgramLayout';
import DemoProgramEdit from './feature/demo-program/DemoProgramEdit';
import DemoProgramAdd from './feature/demo-program/DemoProgramAdd';
import DemoEpisodeLayout from './feature/demo-episode/DemoEpisodeLayout';
import DemoEpisodeEdit from './feature/demo-episode/DemoEpisodeEdit';
import DemoEpisodeAdd from './feature/demo-episode/DemoEpisodeAdd';
import DemoSeriesLayout from './feature/demo-series/DemoSeriesLayout';
import DemoSeriesEdit from './feature/demo-series/DemoSeriesEdit';
import DemoSeriesAdd from './feature/demo-series/DemoSeriesAdd';
import DemoThemeLayout from './feature/demo-theme/DemoThemeLayout';
import DemoThemeEdit from './feature/demo-theme/DemoThemeEdit';
import DemoThemeAdd from './feature/demo-theme/DemoThemeAdd';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<EpisodeLayout />} />
          <Route path='/channel-book-list' element={<ChannelLayout />} />
          <Route path='/curation-list' element={<CurationLayout />} />{' '}
          <Route path='/stg/episode-list' element={<EpisodeLayout />} />
          <Route path='/stg/channel-book-list' element={<ChannelLayout />} />
          <Route path='/stg/curation-list' element={<CurationLayout />} />
          <Route path='/demo'>
            <Route path='program'>
              <Route index element={<DemoProgramLayout />} />
              <Route path=':id' element={<DemoProgramEdit />} />
              <Route path='new' element={<DemoProgramAdd />} />
            </Route>

            <Route path='episode'>
              <Route index element={<DemoEpisodeLayout />} />
              <Route path=':id' element={<DemoEpisodeEdit />} />
              <Route path='new' element={<DemoEpisodeAdd />} />
            </Route>

            <Route path='series'>
              <Route index element={<DemoSeriesLayout />} />
              <Route path=':id' element={<DemoSeriesEdit />} />
              <Route path='new' element={<DemoSeriesAdd />} />
            </Route>

            <Route path='theme'>
              <Route index element={<DemoThemeLayout />} />
              <Route path=':id' element={<DemoThemeEdit />} />
              <Route path='new' element={<DemoThemeAdd />} />
            </Route>

            <Route path='category'>
              <Route index element={<DemoCategoryLayout />} />
              <Route path=':id' element={<DemoCategoryEdit />} />
              <Route path='new' element={<DemoCategoryAdd />} />
            </Route>

            <Route path='broadcasting'>
              <Route index element={<DemoBroadcastingLayout />} />
              <Route path=':id' element={<DemoBroadcastingEdit />} />
              <Route path='new' element={<DemoBroadcastingAdd />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
