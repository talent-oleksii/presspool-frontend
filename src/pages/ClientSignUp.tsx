import { FC } from 'react';
import { Link } from 'react-router-dom';

import SignUpBack from '../assets/image/sign upback.jpeg';
import Mark from '../assets/logo/logo.png';

const ClientSignUp: FC = () => {
    return (
        <div className='grid sm:grid-cols-2 gap-4 min-h-[100vh]'>
            <div className='h-full flex flex-col justify-center items-center px-9 relative'>
                <img className='absolute t-0 z-[-1]' src={SignUpBack} alt="limit" />
                <h2 className='font-bold my-3 font-[Inter] text-[50px] text-[white]'>Sign Up</h2>
                <p className='font-[Inter] text-[white] text-[20px]'>Access the power of the Presspool Platform to deliver your solution directly in front of targeted, engaged readers.</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <div className="shadow-lg shadow-[#0a0a0a]/[.04] w-[450px] sm:w-[630px] bg-[white] rounded-[15px]">
                    <div className="flex flex-col items-center justify-center py-3">
                        <img src={Mark} alt="mark" className="w-[50px]" />
                    </div>
                    
                    <form className="text-left p-2">
                        <input
                            placeholder='Full Name'
                            type="text"
                            className="w-full border-indigo-500 border-[1px] my-3 rounded-[10px] px-4 py-2"
                        />
                        <input placeholder='Company Name' type="text" className="w-full border-indigo-500 border-[1px] my-3 rounded-[10px] px-4 py-2" />
                        <input placeholder='Email' type="email" className="w-full border-indigo-500 border-[1px] my-3 rounded-[10px] px-4 py-2" />
                        <input placeholder='Password' type="password" className="w-full border-indigo-500 border-[1px] my-3 rounded-[10px] px-4 py-2" />
                        <div className='my-3 flex items-center'>
                            <input type="checkbox" className='rounded-sm border-indigo-500 border-[1px]' />
                            <span className='ms-2 font-[Inter] text-md'>I agree to the Terms and Privacy Policy</span>
                        </div>
                        <button className="rounded-[10px] bg-[#212121] w-full py-2 my-4 text-[white]" type='submit'>Sign Up</button>

                        <div className='flex items-center justify-center my-4'>
                            <Link className="text-lg text-center w-full font-[Inter] text-[#6c63ff]" to="login">Already have an account? Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClientSignUp;