import React from 'react';
import DemoTableList from '../../components/DemoTableList';

interface DemoCategoryListProps {
  categories: any[];
  selectedLang: string;
  onDeleted?: () => void;
}

const gridCols =
  'minmax(40px,1fr) minmax(120px,2fr) minmax(120px,2fr) minmax(60px,1fr) minmax(80px,2fr) minmax(100px,1fr) minmax(140px,1fr)';

const columns = [
  { key: 'id', label: 'id' },
  { key: 'title', label: 'title' },
  { key: 'img_url', label: 'thumbnail' },
  { key: 'order', label: 'order' },
  { key: 'language', label: 'language' },
  { key: 'programsCount', label: '프로그램 수' },
  { key: 'actions', label: '' },
];

const DemoCategoryList: React.FC<DemoCategoryListProps> = ({
  categories,
  selectedLang,
  onDeleted,
}) => {
  return (
    <DemoTableList
      data={categories}
      selectedLang={selectedLang}
      onDeleted={onDeleted}
      tableName='categories'
      editPath='/demo/category-list/edit'
      columns={columns}
      gridCols={gridCols}
    />
  );
};

export default DemoCategoryList;
