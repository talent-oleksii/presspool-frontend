import { FC } from 'react';

import Ava from '../../assets/image/avaV2 1.png';

const AdminSupport: FC = () => {
  return (
    <div className='text-left'
    >
      <div className='h-fit'>
        <h2 className='text-[20px] 2xl:text-[24px] font-[Inter] text-black font-semibold -tracking-[.6px]'>Support</h2>
        <p className='mt-[6px] text-[#43474A] text-sm 2xl:text-md'>Talk to Ava to get any answers to send to Clients, or, just so you are up to date on our policies/workflows!</p>
      </div>

      <div className='pt-2 flex-1 flex flex-col items-center justify-between w-full rounded-[10px] mt-8 pt-4 bg-white'>
        <div className='flex flex-col items-center justify-center'>
          <img src={Ava} className='rounded-full w-[50px]' alt="ava" />
          <h2 className='font-[Inter] text-black text-sm font-semibold mt-[3px]'>Talk to Ava</h2>
          <p className='font-[Inter] text-[#43474a] font-medium text-[12px] text-center mt-[5px]'>Our support bot trained on our <br /> platfrom from A~Z!</p>
        </div>
        <iframe className='w-full h-[600px]' title="bot"
          src="https://widget.writesonic.com/CDN/index.html?service-base-url=https://api.botsonic.ai&token=c6f96462-0f55-4daf-8060-9b1f72f6ce7e&base-origin=https://bot.writesonic.com&instance-name=Botsonic&standalone=true&page-url=https://bot.writesonic.com/b7cab8fd-3964-42bc-9e94-acdea65cbcd0?t=share&workspace_id=380ff3fc-a06c-4403-b38d-e9b513c83508" />
      </div>
    </div>
  );
};

export default AdminSupport;