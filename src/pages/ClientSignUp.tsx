import React, { FC, useState, Fragment } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Dialog, Transition } from '@headlessui/react';

import { useDispatch } from 'react-redux';
import { setAuthenticated, setToken, setUserData } from '../store/authSlice';

import APIInstance from '../api';
import SignUpBack from '../assets/image/sign upback.jpeg';
import Mark from '../assets/logo/logo.png';
import Loading from '../components/Loading';

interface FormData {
    fullName: string;
    company: string;
    email: string;
    password: string;
    agreeTerm: boolean;
}

const ClientSignUp: FC = () => {
    const dispatch = useDispatch();
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
        setLoading(true);
        APIInstance.post('auth/client-sign-up', {
            ...formData
        }).then(data => {
            const ret = data.data;
            dispatch(setAuthenticated());
            dispatch(setToken({ token: data.data.token }));
            dispatch(setUserData({
                email: ret['fields']['Email'],
                name: ret['fields']['First Name'],
                fullName: ret['fields']['Full Name'],
                company: ret['fields']['Company Name'],
                verified: Number(ret['verified']) === 0 ? false : true,
            }));
            setShowDialog(true);
        }).catch(err => {
            console.log('err:', err);
        }).finally(() => setLoading(false));
    };

    return (
        <div className='flex h-full relative'>
            {loading && <Loading />}
            <div className='h-full flex flex-col justify-center items-center relative px-[104px] w-[46%]'>
                <img className='absolute t-0 z-[0] w-full h-full object-cover' src={SignUpBack} alt="limit" />
                <h2 className='font-bold my-3 font-[Inter] text-[50px] text-[white] z-[1]'>Sign Up</h2>
                <p className='z-[1] font-[Inter] text-[white] text-[20px]'>Access the power of the Presspool Platform to deliver your solution directly in front of targeted, engaged readers.</p>
            </div>
            <div className='flex flex-col justify-center items-center px-[150px]'>
                <div className="shadow-lg shadow-[#0a0a0a]/[.04] w-full bg-[white] rounded-[15px] py-[50px]">
                    <div className="flex flex-col items-center justify-center py-3">
                        <img src={Mark} alt="mark" className="w-[50px]" />
                    </div>

                    <form className="text-left p-[20px]" onSubmit={handleSubmit}>
                        <input
                            id='fullName'
                            name='fullName'
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder='Full Name'
                            type="text"
                            className="w-full border-[1px] my-3 rounded-[10px] px-4 py-2"
                        />
                        <input
                            id='company'
                            name='company'
                            value={formData.company}
                            onChange={handleChange}
                            placeholder='Company Name'
                            type="text"
                            className="w-full border-[1px] my-3 rounded-[10px] px-4 py-2"
                        />
                        <input
                            id='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Email'
                            type="email"
                            className="w-full border-[1px] my-3 rounded-[10px] px-4 py-2"
                        />
                        <input
                            id='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            placeholder='Password'
                            type="password"
                            className="w-full border-[1px] my-3 rounded-[10px] px-4 py-2"
                        />
                        <div className='my-3 flex items-center'>
                            <input
                                checked={formData.agreeTerm}
                                onChange={e => setFormData({ ...formData, agreeTerm: e.target.checked })}
                                type="checkbox"
                                className='rounded-sm border-[1px] p-1'
                            />
                            <span className='ms-2 font-[Inter] text-md font-medium'>
                                I agree to the <a target='_blank' href='https://www.presspool.ai/terms' rel="noreferrer" className='text-[#6c63ff]'>Terms</a> and <a className='text-[#6c63ff]' target='_blank' href="https://www.presspool.ai/privacy-policy" rel="noreferrer">Privacy Policy</a>
                            </span>
                        </div>
                        <button
                            className="rounded-[10px] bg-[#212121] w-full py-2 my-4 text-[white] disabled:bg-[gray]"
                            type="submit"
                            disabled={!formData.agreeTerm}
                        >
                            Sign Up
                        </button>
                    </form>
                    <div className='flex items-center justify-center my-3'>
                        <Link className="text-md text-center w-full font-[Inter] text-[#6c63ff]" to="/login">Already have an account? Login</Link>
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
                        enter="ease-out duration-300"
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
                                enter="ease-out duration-300"
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