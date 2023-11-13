import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUnauthenticated } from '../store/authSlice';

import { CakeIcon, LifebuoyIcon, PencilIcon } from '@heroicons/react/20/solid';
import Logo from '../assets/logo/logo.png';
import Company from '../assets/image/company.png';
import Creator from '../assets/image/creator.png';
import Precise from '../assets/image/Precise.png';
import Launch from '../assets/image/Launch.png';
import Seamless from '../assets/image/Seamless.png';

const Landing: FC = () => {
    const [current, setCurrent] = useState<string>('precise');
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

    const handleLogout = () => {
        dispatch(setUnauthenticated());
    };

    return (
        <div className="pt-[90px] flex flex-col text-center items-center justify-center">
            <img alt="logo" src={Logo} className='h-[50px] my-4' />
            <h2 className="mt-2 font-[Inter] font-semibold text-[40px] text-black">Welcome to</h2>
            <h2 className="font-[Inter] font-semibold text-black text-[40px]">
                the
                <span className='bg-[#43474a] text-[#7FFBAE] mx-2 rounded-full px-2 py-0'>future</span>
                of AI marketing
            </h2>

            {!isAuthenticated ?
                <p className='mt-4 font-[Inter] font-semibold text-[14px]'>Already have an account? Sign in <Link to="/login" className='text-purple underline'>here</Link></p> :
                <button className='mt-3 text-md font-[Inter] text-[red]' onClick={handleLogout}>Log out</button>
            }
            <div className='flex items-center justify-center mt-3'>
                {!isAuthenticated ?
                    <>
                        <Link className='flex flex-col font-bold text-black text-sm items-center justify-center mx-1 bg-white rounded-[20px] w-[260px] h-[170px]' to="client-sign-up">
                            <img src={Company} alt="..." />
                            <p className='mb-0 mt-3'>I'm a</p>
                            <p className='mb-0 -mt-1'>Company</p>
                        </Link>
                        <button className='flex flex-col font-bold text-black text-sm items-center justify-center mx-1 bg-white rounded-[20px] w-[260px] h-[170px]'>
                            <img src={Creator} alt="..." />
                            <p className='mb-0 mt-3'>I'm a</p>
                            <p className='mb-0 -mt-1'>Creator</p>
                        </button>
                    </> :
                    <>
                        <Link className='font-bold underline' to="/campaign/all">Start Campaign</Link>
                    </>
                }
            </div>
            <div className='mt-[20px] w-[536px] rounded-[20px] bg-white flex flex-col items-center justify-center pt-[42px]'>
                <p className='text-black text-[18px] font-semibold'>Discover Features</p>

                <div className='flex justify-center items-center mt-3'>
                    <button className='bg-black text-gray-200 px-3 py-2 rounded-[10px] flex items-center mx-1 hover:ring-[2px] hover:ring-[#7FFBAE]' onClick={() => setCurrent('precise')}>
                        <CakeIcon className='h-[15px] me-2' />
                        Precise Targeting
                    </button>
                    <button className='bg-black text-gray-200 px-3 py-2 rounded-[10px] flex items-center mx-1 hover:ring-[2px] hover:ring-[#7FFBAE]' onClick={() => setCurrent('launch')}>
                        <LifebuoyIcon className='h-[15px] me-2' />
                        Easy Launch
                    </button>
                    <button className='bg-black text-gray-200 px-3 py-2 rounded-[10px] flex items-center mx-1 hover:ring-[2px] hover:ring-[#7FFBAE]' onClick={() => setCurrent('seamless')}>
                        <PencilIcon className='h-[15px] me-2' />
                        Seamless Tracking
                    </button>
                </div>

                <div className='mt-[30px]'>
                    {current === 'precise' && <img src={Precise} alt="..." />}
                    {current === 'launch' && <img src={Launch} alt="..." />}
                    {current === 'seamless' && <img src={Seamless} alt="..." />}
                </div>
            </div>
        </div>
    );
};

export default Landing;