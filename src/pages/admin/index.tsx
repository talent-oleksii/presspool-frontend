import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';

import Dashboard from './Dashboard';
import Company from './Company';
import Campaign from './Campaign';
import Newsletter from './Creator';

const Admin: FC = () => {
  const location = useLocation();

  return (
    <div className='text-left'>
      <h2 className='text-[32px] text-black font-[Inter] font-semibold'>Admin Dashboard 🚀</h2>
      <p className='my-3 font-[Inter] text-gray-700 text-lg'>Presspool at a glance</p>
      <div className='bg-white rounded-[10px] p-2 flex justify-between items-center'>
        <div className='flex'>
          <Link to="/admin/overview" className={`rounded-[5px] sm:min-w-[170px] py-3 px-5 font-[Inter] ${location.pathname.includes('/admin/overview') ? 'bg-black text-white' : 'bg-white text-black'}`}>Overview</Link>
          <Link to="/admin/campaign" className={`rounded-[5px] sm:min-w-[170px] py-3 px-5 font-[Inter] ${location.pathname.includes('/admin/campaign') ? 'bg-black text-white' : 'bg-white text-black'}`}>By Campaign</Link>
          <Link to="/admin/company" className={`rounded-[5px] sm:min-w-[170px] py-3 px-5 font-[Inter] ${location.pathname.includes('/admin/company') ? 'bg-black text-white' : 'bg-white text-black'}`}>By Company</Link>
          <Link to="/admin/creator" className={`rounded-[5px] sm:min-w-[170px] py-3 px-5 font-[Inter] ${location.pathname.includes('/admin/creator') ? 'bg-black text-white' : 'bg-white text-black'}`}>By Creator</Link>
        </div>

        <select className='border-[1px] px-2 py-1 font-[Inter] rounded-[10px]'>
          <option>Last 4 weeks</option>
          <option>Last 2 weeks</option>
        </select>
      </div>
      <div className='py-2'>
        <Routes>
          <Route path="/overview" element={<Dashboard />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/company" element={<Company />} />
          <Route path="/creator" element={<Newsletter />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;