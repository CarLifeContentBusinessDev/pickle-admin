import React from 'react';
import DemoTableList from '../../components/DemoTableList';

interface DemoSeriesListProps {
  series: any[];
  selectedLang: string;
  onDeleted?: () => void;
}

const gridCols =
  'minmax(40px,0.5fr) minmax(80px,1fr) minmax(80px,2fr) minmax(80px,2fr) minmax(40px,0.5fr) minmax(40px,1fr) minmax(40px,1fr) minmax(80px,0.5fr) minmax(140px,1fr)';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'img_url', label: '썸네일' },
  { key: 'title', label: 'title' },
  { key: 'subtitle', label: 'subtitle' },
  { key: 'language', label: '국가' },
  { key: 'sections.title', label: '섹션' },
  { key: 'oem_key', label: 'OEM' },
  { key: 'order', label: '순서' },
  { key: 'actions', label: '' },
];

const DemoSeriesList: React.FC<DemoSeriesListProps> = ({
  series,
  selectedLang,
  onDeleted,
}) => {
  return (
    <DemoTableList
      data={series}
      selectedLang={selectedLang}
      onDeleted={onDeleted}
      tableName='series'
      editPath='/demo/series'
      columns={columns}
      gridCols={gridCols}
    />
  );
};

export default DemoSeriesList;
