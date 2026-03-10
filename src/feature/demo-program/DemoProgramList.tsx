import React from 'react';
import DemoTableList from '../../components/DemoTableList';

interface DemoProgramListProps {
  programs: any[];
  selectedLang: string;
  onDeleted?: () => void;
}

const gridCols =
  'minmax(40px,0.5fr) minmax(80px,1fr) minmax(80px,2fr) minmax(80px,2fr) minmax(40px,1fr) minmax(40px,1fr) minmax(40px,1fr) minmax(80px,1fr) minmax(40px,1fr) minmax(140px,1fr)';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'img_url', label: '썸네일' },
  { key: 'title', label: 'title' },
  { key: 'subtitle', label: 'subtitle' },
  { key: 'type', label: 'type' },
  { key: 'category_id', label: '카테고리 ID' },
  { key: 'broadcasting_id', label: '방송사 ID' },
  { key: 'language', label: '국가' },
  { key: 'is_sequential', label: '역순' },
  { key: 'actions', label: '' },
];

const DemoProgramList: React.FC<DemoProgramListProps> = ({
  programs,
  selectedLang,
  onDeleted,
}) => {
  return (
    <DemoTableList
      data={programs}
      selectedLang={selectedLang}
      onDeleted={onDeleted}
      tableName='programs'
      editPath='/demo/program'
      columns={columns}
      gridCols={gridCols}
    />
  );
};

export default DemoProgramList;
