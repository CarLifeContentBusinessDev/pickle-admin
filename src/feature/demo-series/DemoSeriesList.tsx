import React from 'react';
import DemoTableList from '../../components/DemoTableList';

interface DemoSeriesListProps {
  broadcasting: any[];
  selectedLang: string;
  onDeleted?: () => void;
}

const gridCols =
  'minmax(40px,1fr) minmax(80px,1fr) minmax(80px,1fr) minmax(80px,1fr) minmax(120px,1fr) minmax(60px,1fr) minmax(80px,1fr) minmax(100px,1fr) minmax(140px,1fr)';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'title' },
  { key: 'channel', label: 'channel' },
  { key: 'frequency', label: 'frequency' },
  { key: 'img_url', label: '썸네일' },
  { key: 'order', label: '순위' },
  { key: 'language', label: '국가' },
  { key: 'programsCount', label: '프로그램 수' },
  { key: 'actions', label: '' },
];

const DemoSeriesList: React.FC<DemoSeriesListProps> = ({
  broadcasting,
  selectedLang,
  onDeleted,
}) => {
  return (
    <DemoTableList
      data={broadcasting}
      selectedLang={selectedLang}
      onDeleted={onDeleted}
      tableName='broadcastings'
      editPath='/demo/program'
      columns={columns}
      gridCols={gridCols}
    />
  );
};

export default DemoSeriesList;
