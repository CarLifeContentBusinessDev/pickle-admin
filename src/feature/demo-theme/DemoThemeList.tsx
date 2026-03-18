import React from 'react';
import DemoTableList from '../../components/DemoTableList';

interface DemoThemeListProps {
  themes: any[];
  selectedLang: string;
  onDeleted?: () => void;
}

const gridCols =
  'minmax(40px,0.5fr) minmax(80px,2fr) minmax(80px,3fr) minmax(80px,2fr) minmax(120px,1fr) minmax(60px,1fr) minmax(140px,1fr)';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'title' },
  { key: 'subtitle', label: 'subtitle' },
  { key: 'sections.title', label: '섹션' },
  { key: 'order', label: '순서' },
  { key: 'language', label: '국가' },
  { key: 'actions', label: '' },
];

const DemoThemeList: React.FC<DemoThemeListProps> = ({
  themes,
  selectedLang,
  onDeleted,
}) => {
  return (
    <DemoTableList
      data={themes}
      selectedLang={selectedLang}
      onDeleted={onDeleted}
      tableName='themes'
      editPath='/demo/theme'
      columns={columns}
      gridCols={gridCols}
    />
  );
};

export default DemoThemeList;
