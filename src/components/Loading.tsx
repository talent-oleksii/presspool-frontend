import { FC } from 'react';

const Loading: FC = () => {
  return (
    <div className='absolute w-full h-full justify-center items-center flex bg-white z-50 left-0 top-0'>
      <div className="inline-block animate-spin rounded-full border-t-4 border-blue-900 h-6 w-6" />
    </div>
  );
};

export default Loading;