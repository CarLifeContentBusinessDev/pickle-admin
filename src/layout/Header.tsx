import { useState } from 'react';
import { getGraphToken } from '../utils/auth';
import { toast } from 'react-toastify';
import { getNewEpisodes } from '../utils/getNewEpisodes';
import LoginPopup from '../feature/Login';
import type { LoginResponseData, usingDataProps } from '../type';

interface HeaderProps {
  setLoading: (loading: boolean) => void;
  setNewEpi: (newEpi: usingDataProps[]) => void;
  setProgress: (progress: string) => void;
}

const Header = ({ setLoading, setNewEpi, setProgress }: HeaderProps) => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleLogin = async () => {
    if (!localStorage.getItem('accessToken'))
      return toast.warn('관리자 로그인을 먼저 해주세요!');
    const tk = await getGraphToken();
    if (tk && localStorage.getItem('accessToken')) {
      localStorage.setItem('loginToken', tk);
      toast.success('MS 로그인에 성공하였습니다.');
      handleSearchNew(tk, localStorage.getItem('accessToken')!);
    }
  };

  const handlePopupLoginSuccess = (data: LoginResponseData) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    toast.success('관리자 로그인에 성공했습니다!');
  };

  const handleSearchNew = async (token: string, accessToken: string) => {
    setLoading(true);
    const newList = await getNewEpisodes(token, accessToken, setProgress);
    setNewEpi(newList);
    setLoading(false);
  };

  return (
    <>
      <div className='w-full h-[10%] flex justify-between items-center mb-0 p-10 bg-white'>
        <h1 className='text-4xl font-bold flex gap-4'>
          <img src='/logo.svg' alt='로고' width={40} height={40} />
          PICKLE
        </h1>
        <div className='flex gap-4'>
          {!localStorage.getItem('accessToken') && (
            <button
              className='border cursor-pointer bg-[#3c25cc] text-white shadow-[0_2px_0_rgba(72,5,255,0.06)] px-5 py-2 rounded-md hover:bg-[#624ad9] transition-colors duration-100'
              onClick={() => setShowLoginPopup(true)}
            >
              관리자 로그인
            </button>
          )}
          {!localStorage.getItem('loginToken') && (
            <button
              className='border cursor-pointer bg-[#3c25cc] text-white shadow-[0_2px_0_rgba(72,5,255,0.06)] px-5 py-2 rounded-md hover:bg-[#624ad9] transition-colors duration-100'
              onClick={handleLogin}
            >
              MS Graph 로그인
            </button>
          )}
        </div>
      </div>
      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          onLoginSuccess={handlePopupLoginSuccess}
        />
      )}
    </>
  );
};

export default Header;
