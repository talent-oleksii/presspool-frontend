import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLongRightIcon, PencilIcon } from '@heroicons/react/20/solid';

import LogoWithText from  '../assets/logo/pp full transparent.png';
import SampleImage from '../assets/image/Target audience inbox.png';

const Landing: FC = () => {
    return (
        <div className="p-5 flex flex-col text-center bg-[white] items-center justify-center">
            <img alt="logo" src={LogoWithText} className='h-[80px] my-4' />
            <h2 className="mt-4 text-4xl text-normal">Welcome to the future of</h2>
            <h2 className="mt-5 text-3xl text-normal">client acquistion, marketing, growth</h2>
            <img alt="pic" src={SampleImage} className='my-4' />

            <div className='flex items-center justify-center'>
                <button className='flex font-bold text-[white] text-sm items-center bg-[black] rounded-md px-4 py-2 me-2'>
                    <ArrowLongRightIcon className='me-3 h-[25px]' />
                    I'm a Company
                </button>
                <button className='flex font-bold text-[white] text-sm items-center bg-purple rounded-md px-4 py-2 ms-2'>
                    <PencilIcon className='me-3 h-[25px]' />
                    I'm a Creator
                </button>
            </div>

            <p className='mt-4'>Already have an account? Sign in <Link to="sign-in" className='text-purple'>here</Link></p>
        </div>
    );
};

export default Landing;