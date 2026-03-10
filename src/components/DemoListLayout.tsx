import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import { LANGUAGES, type LanguageCode } from '../constants/languages';

interface DemoListLayoutProps {
  parentMenu: string;
  childMenu: string;
  count?: number;
  selectedLang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
  addLabel: string;
  onAdd: () => void;
  children?: React.ReactNode;
}

const DemoListLayout = ({
  parentMenu,
  childMenu,
  count,
  selectedLang,
  onLangChange,
  addLabel,
  onAdd,
  children,
}: DemoListLayoutProps) => {
  return (
    <div className='p-10 flex flex-col'>
      <h1 className='mb-4 indent-1' style={{ fontSize: '16px' }}>
        <span className='text-gray-500'>{parentMenu} / </span>
        <span className='font-bold'>{childMenu}</span>
      </h1>

      <div className='w-full rounded-2xl bg-white mt-4 p-8 flex flex-col'>
        <div className='flex justify-between items-center'>
          <h3 className='text-point-color font-semibold'>
            총 <span className='font-extrabold'>{count}</span>개
          </h3>

          <div className='flex gap-4 items-center'>
            <Dropdown
              value={selectedLang}
              options={[...LANGUAGES]}
              onChange={(v) => onLangChange(v as LanguageCode)}
            />

            <Button onClick={onAdd}>{addLabel}</Button>
          </div>
        </div>

        <div className='mt-4'>{children}</div>
      </div>
    </div>
  );
};

export default DemoListLayout;
