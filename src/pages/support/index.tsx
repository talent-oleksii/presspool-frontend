import { FC } from 'react';

import Ava from '../../assets/image/rica.png';

const Support: FC = () => {

  return (
    <div className='text-left relative'>
      <h2 className='text-[32px] font-[Inter] text-black font-semibold'>Presspool Support📖</h2>
      <p className='my-2 text-[#43474A] font-normal'>Automatic and personal support options can be found below.</p>

      <div className='bg-white h-[200px] flex items-center justify-between mt-[100px] p-10'>
        <div>
          <h2 className='font-[Inter] text-black font-semibold text-[28px]'>Human Support</h2>
          <p className='font-[Inter] text-[#43474a] font-medium text-[18px]'>Email support@presspool.ai anytime, or send us a message on Slack
            and we will get back to you ASAP!</p>
        </div>
        <a target='_blank' rel='noreferrer' className='px-4 py-2 text-[Inter] rounded-[5px] bg-black text-white' href="https://join.slack.com/t/presspoolsupport/shared_invite/zt-1ytywzzld-974gUfTB8zCYlP4~f5XT1Q">Go to Slack</a>
      </div>

      <div className='flex items-center justify-center mt-9'>
        <div className='bg-white w-[320px] h-[200px] rounded-[10px] flex flex-col items-center justify-center'>
          <img src={Ava} className='my-3 w-[50px] h-[50px]' alt="ava" />
          <h2 className='font-[Inter] text-[28px] text-black font-semibold my-3'>Talk to Ava</h2>
          <p className='font-[Inter] text-[14px] text-black font-normal'>Our support bot trained on our platform from A~Z!</p>
        </div>
      </div>
    </div>
  );
};

export default Support;