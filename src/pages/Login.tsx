import React, { FC, useState, Fragment } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';

import { useDispatch } from 'react-redux';
import { setAuthenticated, setToken, setUserData } from '../store/authSlice';

import APIInstance from "../api";

import Mark from '../assets/logo/logo_white.png';
import Loading from "../components/Loading";
import ForgotPassword from "./ForgotPassword";

interface typeLoginForm {
    email: string;
    password: string;
}

const Login: FC = () => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState<typeLoginForm>({
        email: '',
        password: '',
    });
    const [showDialog, setShowDialog] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    };

    const handleForgotPassword: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        setShowForgotPassword(true);
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        setLoading(true);
        APIInstance.get('auth/sign-in', {
            params: formData,
        }).then(data => {
            const ret = data.data.records;
            if (ret.length < 1) {
                setShowDialog(true);
            } else {
                dispatch(setAuthenticated());
                dispatch(setToken({ token: data.data.token }));
                // dispatch(setUserData({
                //     email: ret[0]['fields']['Email'],
                //     name: ret[0]['fields']['First Name'],
                //     fullName: ret[0]['fields']['Full Name'],
                //     company: ret[0]['fields']['Company Name'],
                //     verified: Number(data.data['verified']) === 0 ? 'false' : 'true',
                // }));
                navigator('/campaign/all');
            }
        }).catch(err => {
            setShowDialog(true);
        }).finally(() => setLoading(false));
    };

    return (
        <div className='flex h-full relative'>
            {loading && <Loading />}
            <div className='h-full flex flex-col justify-center items-center relative px-[104px] w-[46%] bg-gradient-to-b from-[#6c63ff] to-[#7FFBAE]'>
                <img src={Mark} alt="mark" className="w-[57x] h-[59px]" />
                <h2 className='font-bold mt-[37.89px] font-[Inter] text-[50px] 2xl:text-[50px] text-[white] z-[1] -tracking-[1.5px]'>Log In</h2>
                <p className='z-[1] font-[Inter] text-[white] text-[20px] mt-[20px]'>Access the power of the Presspool Platform to deliver your solution directly in front of targeted, engaged readers.</p>
            </div>
            <div className="flex flex-1 items-center justify-center bg-white w-full px-[82px]">
                <div className="rounded-[15px] w-full">
                    <div className="flex flex-col items-center justify-center">
                        <h2 className='font-[Inter] font-bold text-[44px] -tracking-[1.32px]'>Welcome Back</h2>
                        <p className='font-[Inter] text-lg -tracking-[.54px] text-[#7f8182] mt-[10px]'>Enter your details to login</p>
                    </div>

                    <form className="text-left py-8 mt-[60px]" onSubmit={handleSubmit}>
                        <div>
                            <label className="font-[Inter] text-base block text-base font-semibold my-1 -tracking-[.508px]">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                onChange={handleChange}
                                className="w-full border-[#7F8182] border-[1px] my-1 rounded-[10px] px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="font-[Inter] block text-base text-base font-semibold mt-[18px] -tracking-[.508px]">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                onChange={handleChange}
                                className="w-full border-[#7F8182] border-[1px] mt-[12px] rounded-[10px] px-4 py-2"
                            />
                        </div>
                        <div className="w-full text-right">
                            <div className="font-[Inter] text-[#6c63ff] text-sm 2xl:text-[17px] mt-[22px] underline" onClick={handleForgotPassword}>Forgot Password?</div>
                        </div>
                        <button className="rounded-[6px] bg-black w-full py-[10px] 2xl:py-[10px] my-2 2xl:my-4 text-base text-[white] mt-[32px]">Log In</button>

                        <p className="mt-[35px] font-[Inter] text-black text-[19px] flex items-center justify-center -tracking-[.574px]">
                            Don't have an account?
                            <Link className="block text-center text-[#6c63ff] ms-1" to="/">Sign Up</Link>
                        </p>
                    </form>
                </div>
                <Transition.Root show={showDialog} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={() => {
                        setShowDialog(false);
                    }}>
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
                                                    Log In Failed!
                                                </Dialog.Title>
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                                onClick={() => { setShowDialog(false); }}
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
                <ForgotPassword show={showForgotPassword} setShow={(show: boolean) => setShowForgotPassword(show)} />
            </div>
        </div>
    );
};

export default Login;