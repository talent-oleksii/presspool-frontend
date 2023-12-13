import React, { FC, useState, Fragment } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Dialog, Transition } from '@headlessui/react';
import validator from 'validator';

import { useDispatch } from 'react-redux';
import { setAuthenticated, setToken, setUserData } from '../store/authSlice';

import APIInstance from '../api';
import Mark from '../assets/logo/logo_white.png';
import Loading from '../components/Loading';
import DialogUtils from '../utils/DialogUtils';

interface FormData {
    fullName: string;
    company: string;
    email: string;
    password: string;
    agreeTerm: boolean;
}

const ClientSignUp: FC = () => {
    const dispatch = useDispatch();
    const [check, setCheck] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        company: '',
        email: '',
        password: '',
        agreeTerm: false,
    });

    const navigator = useNavigate();

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        setCheck(true);
        if (validator.isEmpty(formData.fullName) ||
            !validator.isEmail(formData.email) ||
            validator.isEmail(formData.company) ||
            !validator.isStrongPassword(formData.password)) return;

        setLoading(true);
        APIInstance.post('auth/client-sign-up', {
            ...formData
        }).then(data => {
            const ret = data.data;
            dispatch(setAuthenticated());
            dispatch(setToken({ token: ret.token }));
            // dispatch(setUserData({
            //     email: ret['fields']['Email'],
            //     name: ret['fields']['First Name'],
            //     fullName: ret['fields']['Full Name'],
            //     company: ret['fields']['Company Name'],
            //     verified: Number(ret['verified']) === 0 ? false : true,
            //     email_verified: Number(ret['email_verified'] === 0 ? false : true),
            //     avatar: '',
            // }));
            setShowDialog(true);
        }).catch(err => {
            DialogUtils.show('error', '', err.response.data.message);
        }).finally(() => setLoading(false));
    };

    return (
        <div className='flex h-full relative'>
            {loading && <Loading />}
            <div className='h-full flex flex-col justify-center items-center relative px-[104px] w-[46%] bg-gradient-to-b from-[#7FFBAE] to-[#6c63ff]'>
                <img src={Mark} alt="mark" className="w-[57px] h-[59px]" />
                <h2 className='font-bold mt-[52px] font-[Inter] text-[50px] text-[white] z-[1]'>Sign Up</h2>
                <p className='z-[1] font-[Inter] text-[white] text-[20px] mt-[20px]'>Access the power of the Presspool Platform to deliver your solution directly in front of targeted, engaged readers.</p>
            </div>
            <div className='flex flex-1 justify-center items-center px-[82px] bg-white'>
                <div className="w-full bg-[white] rounded-[15px]">
                    <div className="flex flex-col items-center justify-center">
                        <h2 className='font-[Inter] font-bold text-[44px] -tracking-[1.32px]'>Welcome</h2>
                        <p className='font-[Inter] text-lg -tracking-[.54px] text-[#7f8182] mt-[10px]'>Enter your details to sign up</p>
                    </div>

                    <form className="text-left mt-[50px]" onSubmit={handleSubmit}>
                        <label className={`font-[Inter] text-base 2xl:text-[17px] font-medium -tracking-[.5px] ${check && validator.isEmpty(formData.fullName) ? 'text-[red]' : 'text-black'}`}>
                            Full Name
                            {check && validator.isEmpty(formData.fullName) && <span className='ms-1 text-[red] text-xs'>*Input your full name</span>}
                        </label>
                        <input
                            id='fullName'
                            name='fullName'
                            value={formData.fullName}
                            onChange={handleChange}
                            // placeholder='Enter here'
                            type="text"
                            className="w-full border-[1px] border-[#7F8182] my-3 rounded-[10px] px-4 py-2"
                        />
                        <label className={`font-[Inter] text-base 2xl:text-[17px] font-medium -tracking-[.5px] ${check && validator.isEmpty(formData.company) ? 'text-[red]' : 'text-black'}`}>
                            Company Name
                            {check && validator.isEmpty(formData.company) && <span className='ms-1 text-[red] text-xs'>*Input company name</span>}
                        </label>
                        <input
                            id='company'
                            name='company'
                            value={formData.company}
                            onChange={handleChange}
                            // placeholder='Company Name'
                            type="text"
                            className="w-full border-[1px] border-[#7F8182] my-3 rounded-[10px] px-4 py-2"
                        />
                        <label className={`font-[Inter] text-md 2xl:text-[17px] font-medium -tracking-[.5px] ${check && !validator.isEmail(formData.email) ? 'text-[red]' : 'text-black'}`}>
                            Email Address
                            {check && !validator.isEmail(formData.email) && <span className='ms-1 text-[red] text-xs'>*Input valid email address</span>}
                        </label>
                        <input
                            id='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            // placeholder='Email'
                            type="email"
                            className="w-full border-[1px] border-[#7F8182] my-3 rounded-[10px] px-4 py-2"
                        />
                        <label className={`font-[Inter] text-md 2xl:text-[17px] font-medium -tracking-[.5px] ${check && !validator.isStrongPassword(formData.password) ? 'text-[red]' : 'text-black'}`}>
                            Password
                            {check && !validator.isStrongPassword(formData.password) && <span className='ms-1 text-[red] text-xs'>* Your password is not secure</span>}
                        </label>
                        <input
                            id='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            // placeholder='Password'
                            type="password"
                            className="w-full border-[1px] my-3 rounded-[10px] px-4 py-2"
                        />
                        <div className='my-3 flex items-center'>
                            <input
                                checked={formData.agreeTerm}
                                onChange={e => setFormData({ ...formData, agreeTerm: e.target.checked })}
                                type="checkbox"
                                className='rounded-sm border-[1px] border-[#7F8182] p-1 rounded-[5px]'
                            />
                            <span className='ms-2 font-[Inter] text-lg font-medium'>
                                I agree to the <a target='_blank' href='https://www.presspool.ai/terms' rel="noreferrer" className='text-[#6c63ff]'>Terms</a> and <a className='text-[#6c63ff]' target='_blank' href="https://www.presspool.ai/privacy-policy" rel="noreferrer">Privacy Policy</a>
                            </span>
                        </div>
                        <button
                            className="rounded-[6px] text-base bg-black w-full py-[10px] 2xl:py-[15px] mt-[50px] text-[white] disabled:bg-[gray]"
                            type="submit"
                            disabled={!formData.agreeTerm}
                        >
                            Sign Up
                        </button>
                    </form>
                    <div className='flex items-center justify-center mt-[36px]'>
                        <p className="text-[19px] text-center w-full font-[Inter] text-black text-md 2xl:text-lg -tracking-[.574px]" >Already have an account? <Link to="/login" className='text-[#6c63ff] underline'>Login</Link></p>
                    </div>
                </div>
            </div>
            <Transition.Root show={showDialog} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => {
                    setShowDialog(false);
                    navigator('/login');
                }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-500"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                    <div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-base font-semibold leading-6 text-gray-900"
                                            >
                                                Sign Up Success!
                                            </Dialog.Title>
                                            <p className='font-[Inter] text-sm mt-[15px]'>Please check your inbox to verify your email address</p>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                            onClick={() => {
                                                setShowDialog(false); navigator('/campaign/all');;
                                            }}
                                        >
                                            OK
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default ClientSignUp;