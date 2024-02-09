import { FC } from 'react';

const AdminMember: FC = () => {
  return (
    <div className="min-h-full w-full flex">
      <div className="text-left flex-1">
        <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">Team Members</h2>
        <p className="mt-1 text-[#43474a] font-[Inter] text-sm">One-stop shop to manage all clients</p>

        <button className='mt-8 rounded-[15px] bg-black text-white px-4 py-3 text-xs font-[Inter] font-semibold flex items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill='white' className='w-[18px] h-[18px] -ms-1 me-1'>
            <path d="M460-300h40v-160h160v-40H500v-160h-40v160H300v40h160v160Zm20.134 180q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120Z" />
          </svg>
          Add a new team member
        </button>
      </div>
    </div>
  )
};

export default AdminMember;