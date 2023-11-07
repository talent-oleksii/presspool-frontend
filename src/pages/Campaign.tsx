import { FC } from 'react';
import { Link, Routes, Route } from 'react-router-dom';

import Dashboard from './campaign/Dashboard';
import Approve from './campaign/Approve';
import Advertisement from './campaign/Advertisement';

import Logo from '../assets/logo/logo.png';
import Man from '../assets/image/Headshot 1.png';

const Campaign: FC = () => {
    return (
        <div className='flex min-h-[100vh] w-[1440px]'>
            <div className='w-[150px] px-5 py-8 flex flex-col border-r-[2px] border-[#7F8182] bg-[white] justify-between'>
                <div className='flex flex-col'>
                    <img src={Logo} className='w-[80px] my-10' alt="logo" />
                    
                    <Link className='w-full text-left my-5 text-[Inter] font-semibold' to="/campaign">Dashboard</Link>
                    <Link className='w-full text-left my-5 text-[Inter] font-semibold' to="/campaign/approve">Approve</Link>
                    <Link className='w-full text-left my-5 text-[Inter] font-semibold' to="/campaign/reports">Reports </Link>
                    <Link className='w-full text-left my-5 text-[Inter] font-semibold' to="/campaign/billing">Billing</Link>
                    <Link className='w-full text-left my-5 text-[Inter] font-semibold' to="/campaign/support">Support</Link>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <img src={Man} className='rounded-full' alt="avatar" />
                    <Link className='text-[Inter] my-9 font-semibold' to="/settings">Settings</Link>
                </div>
            </div>
            <div className='bg-[#F5F5F5] w-full'>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/advertisement/:id" element={<Advertisement />} />
                    <Route path="/approve" element={<Approve />} />
                </Routes>
            </div>
        </div>
    );
};

export default Campaign;