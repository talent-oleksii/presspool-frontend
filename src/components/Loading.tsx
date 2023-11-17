import { FC } from 'react';
import './Loading.css';

import Logo from '../assets/logo/logo.png';

const Loading: FC = () => {
  return (
    <div className='absolute w-full h-full justify-center items-center flex bg-transparent z-50 left-0 top-0'>
      <div className="inline-block loader" />
      <img alt="logo" src={Logo} className='absolute z-50 w-[100px] h-[100px] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2' />
    </div>
  );
};

export default Loading;