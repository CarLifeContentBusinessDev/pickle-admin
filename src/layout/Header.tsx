import { useState } from 'react';
import { getGraphToken } from '../utils/auth';
import { toast } from 'react-toastify';
import LoginPopup from '../feature/login/Login';
import type { LoginResponseData } from '../type';
import Button from '../components/Button';

const Header = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleLogin = async () => {
    if (!localStorage.getItem('accessToken'))
      return toast.warn('관리자 로그인을 먼저 해주세요!');
    const tk = await getGraphToken();
    if (tk && localStorage.getItem('accessToken')) {
      localStorage.setItem('loginToken', tk);
      toast.success('MS 로그인에 성공하였습니다.');
    }
  };

  const handlePopupLoginSuccess = (data: LoginResponseData) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    toast.success('관리자 로그인에 성공했습니다!');
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
            <Button onClick={() => setShowLoginPopup(true)}>
              관리자 로그인
            </Button>
          )}
          {!localStorage.getItem('loginToken') && (
            <Button onClick={handleLogin}>MS Graph 로그인</Button>
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
