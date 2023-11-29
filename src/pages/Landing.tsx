import { FC, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUnauthenticated } from '../store/authSlice';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import Logo from '../assets/logo/logo.png';
import Precise from '../assets/image/Precise.png';
import Launch from '../assets/image/Launch.png';
import Seamless from '../assets/image/Seamless.png';

const Landing: FC = () => {
    const [current, setCurrent] = useState(0);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/campaign/all');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = () => {
        dispatch(setUnauthenticated());
    };

    return (
        <div className="pt-[15px] flex flex-col text-center items-center justify-center">
            <img alt="logo" src={Logo} className='w-[30px] my-2' />
            <h2 className="mt-2 font-[Inter] font-semibold text-3xl 2xl:text-5xl text-black mb-2 -tracking-[1.2px]">Welcome to</h2>
            <h2 className="font-[Inter] font-semibold text-black text-3xl 2xl:text-5xl -tracking-[1.2px]">
                the
                <span className='bg-[#43474a] text-[#7FFBAE] mx-2 rounded-full px-2 py-0'>future</span>
                of AI marketing
            </h2>
            <div className='flex items-center justify-center mt-[15px]'>
                {!isAuthenticated ?
                    <>
                        <Link className='flex flex-col font-bold text-black px-[100px] py-[20px] text-sm 2xl:text-base items-center justify-center mx-[10px] bg-white rounded-[20px] shadow-md' to="client-sign-up">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='w-[40px] h-[40px]'>
                                <path d="M109.231-153.846v-650l180-125.385 180 125.385v130h381.538v520H109.231Zm40-40h120v-120h-120v120Zm0-160h120v-120h-120v120Zm0-160h120v-120h-120v120Zm0-160h120v-120h-120v120Zm160 0h120v-120h-120v120Zm0 480h501.538v-440H309.231v440Zm255.384-280v-40H700v40H564.615Zm0 160v-40H700v40H564.615Zm-135.384-160v-40h40v40h-40Zm0 160v-40h40v40h-40Z" />
                            </svg>
                            <p className='mb-0 mt-3'>I'm a</p>
                            <p className='mb-0 -mt-1'>Company</p>
                        </Link>
                        <button className='flex flex-col font-bold text-black px-[100px] py-[20px] text-sm 2xl:text-base items-center justify-center mx-[10px] bg-white rounded-[20px] shadow-md'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='w-[40px] h-[40px]'>
                                <path d="M375.385-624.615v-40h329.23v40h-329.23Zm0 110.769v-40h329.23v40h-329.23ZM569.231-120v-88.385l213.307-212.307q5.924-5.154 12.308-7.616 6.385-2.461 12.769-2.461 6.616 0 13.385 2.577t11.923 7.73l37 37.77q4.923 5.923 7.5 12.307Q880-364 880-357.615q0 6.384-2.077 12.884t-8 12.424L657.616-120h-88.385Zm238.384-199.385 37-38.23-37-37.77-38 38 38 38ZM240-120q-33.846 0-56.923-23.077Q160-166.154 160-200v-110.769h120V-840h520v314.846q-10.769.308-20.5 2.269-9.731 1.962-19.5 5.577V-800H320v489.231h213.846l-60 60V-120H240Z" />
                            </svg>
                            <p className='mb-0 mt-3'>I'm a</p>
                            <p className='mb-0 -mt-1'>Creator</p>
                        </button>
                    </> :
                    <>
                        <Link className='font-bold underline' to="/campaign/all">Start Campaign</Link>
                    </>
                }
            </div>
            {!isAuthenticated ?
                <p className='mt-[20px] font-[Inter] font-semibold text-sm'>Already have an account? Sign in <Link to="/login" className='text-purple underline'>here</Link></p> :
                <button className='mt-3 text-sm 2xl:text-md font-[Inter] text-[red]' onClick={handleLogout}>Log out</button>
            }
            <div className='mt-[20px] rounded-[20px] bg-[#1B1A1A] px-[55px] py-[20px]'>
                <p className='text-white text-base 2xl:text-lg font-semibold'>Discover Features</p>

                <div className='flex justify-center items-center mt-[15px]'>
                    <button className='bg-black text-gray-200 text-xs px-[8.87px] py-[8.3px] rounded-[4.5px] flex items-center mx-1 border-[.59px] border-white hover:border-[#7FFBAE]' onClick={() => setCurrent(0)}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" className='me-[3.5px]'>
                            <path d="M5.02433 1.60256L6.77348 3.24576M1.52605 4.88896L3.27519 6.53216M0.870117 7.14848H2.61926L7.21076 2.83508C7.44272 2.61718 7.57302 2.32164 7.57302 2.01348C7.57302 1.70532 7.44272 1.40978 7.21076 1.19188C6.97881 0.973978 6.66422 0.851563 6.33619 0.851562C6.00816 0.851562 5.69357 0.973978 5.46162 1.19188L0.870117 5.50528V7.14848ZM8.74127 5.50516V7.14836H5.24298L6.99212 5.50516H8.74127Z" stroke="white" strokeWidth="0.787115" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Precise Targeting
                    </button>
                    <button className='bg-black text-gray-200 text-xs px-[8.87px] py-[8.3px] rounded-[4.5px] flex items-center mx-1 border-[.59px] border-white hover:border-[#7FFBAE]' onClick={() => setCurrent(1)}>
                        <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg" className='me-[3.5px]'>
                            <path d="M4.56596 2.81402C4.13361 2.81402 3.71096 2.94225 3.35148 3.1825C2.99199 3.42275 2.7118 3.76422 2.54635 4.16374C2.38089 4.56326 2.3376 5.00288 2.42195 5.427C2.5063 5.85113 2.7145 6.24071 3.02022 6.54649C3.32593 6.85227 3.71545 7.0605 4.13949 7.14487C4.56354 7.22923 5.00307 7.18593 5.40251 7.02045C5.80195 6.85496 6.14336 6.57472 6.38357 6.21516C6.62377 5.85561 6.75198 5.43289 6.75198 5.00045M5.00316 1.08899C4.19261 0.998042 3.37384 1.16127 2.6601 1.55609C1.94636 1.95091 1.37292 2.55781 1.01912 3.29285C0.665314 4.02789 0.548624 4.85472 0.685192 5.65899C0.821759 6.46326 1.20483 7.2052 1.78143 7.78219C2.35802 8.35919 3.09963 8.74271 3.90368 8.87971C4.70772 9.0167 5.53446 8.90041 6.26954 8.54691C7.00461 8.19341 7.61169 7.62017 8.0068 6.90649C8.4019 6.19281 8.56551 5.37397 8.47499 4.56323M5.87757 3.68859V2.37674L7.18918 1.06488V2.37674H8.50079L7.18918 3.68859H5.87757ZM5.87757 3.68859L4.56596 5.00045M4.12876 5.00045C4.12876 5.11643 4.17482 5.22765 4.25681 5.30966C4.3388 5.39167 4.45001 5.43774 4.56596 5.43774C4.68191 5.43774 4.79312 5.39167 4.87511 5.30966C4.9571 5.22765 5.00316 5.11643 5.00316 5.00045C5.00316 4.88448 4.9571 4.77325 4.87511 4.69124C4.79312 4.60924 4.68191 4.56316 4.56596 4.56316C4.45001 4.56316 4.3388 4.60924 4.25681 4.69124C4.17482 4.77325 4.12876 4.88448 4.12876 5.00045Z" stroke="white" strokeWidth="0.787115" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Easy Launch
                    </button>
                    <button className='bg-black text-gray-200 text-xs px-[8.87px] py-[8.3px] rounded-[4.5px] flex items-center mx-1 border-[.59px] border-white hover:border-[#7FFBAE]' onClick={() => setCurrent(2)}>
                        <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg" className='me-[3.5px]'>
                            <path d="M5.63659 2.37631L6.94845 3.68817M1.70102 8.9356L8.26031 2.37631L6.94845 1.06445L0.38916 7.62374L1.70102 8.9356ZM3.01288 1.06445C3.01288 1.2964 3.10502 1.51885 3.26903 1.68287C3.43305 1.84688 3.6555 1.93903 3.88745 1.93903C3.6555 1.93903 3.43305 2.03117 3.26903 2.19518C3.10502 2.3592 3.01288 2.58165 3.01288 2.8136C3.01288 2.58165 2.92073 2.3592 2.75672 2.19518C2.59271 2.03117 2.37026 1.93903 2.1383 1.93903C2.37026 1.93903 2.59271 1.84688 2.75672 1.68287C2.92073 1.51885 3.01288 1.2964 3.01288 1.06445ZM7.38574 5.43731C7.38574 5.66926 7.47788 5.89171 7.64189 6.05573C7.80591 6.21974 8.02836 6.31189 8.26031 6.31189C8.02836 6.31189 7.80591 6.40403 7.64189 6.56804C7.47788 6.73206 7.38574 6.95451 7.38574 7.18646C7.38574 6.95451 7.29359 6.73206 7.12958 6.56804C6.96557 6.40403 6.74312 6.31189 6.51116 6.31189C6.74312 6.31189 6.96557 6.21974 7.12958 6.05573C7.29359 5.89171 7.38574 5.66926 7.38574 5.43731Z" stroke="white" strokeWidth="0.787115" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        Seamless Tracking
                    </button>
                </div>
                <div className='flex items-center justify-center'>
                    <Carousel
                        className='mt-[30px] w-[430px]'
                        showStatus={false}
                        showThumbs={false}
                        selectedItem={current}
                        showArrows={false}
                        showIndicators={false}
                    >
                        <div className='w-[430px]'>
                            <img src={Precise} alt="..." />
                        </div>
                        <div className='w-[430px]'>
                            <img src={Launch} alt="..." />
                        </div>
                        <div className='w-[430px]'>
                            <img src={Seamless} alt="..." />
                        </div>
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default Landing;