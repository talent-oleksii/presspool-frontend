import { FC, useState, Fragment } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';

import { useDispatch } from 'react-redux';
import { setAuthenticated, setToken, setUserData } from '../store/authSlice';

import APIInstance from "../api";
import SignUpBack from '../assets/image/sign upback.jpeg';

import Mark from '../assets/logo/logo.png';
import Loading from "../components/Loading";

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
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
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
                dispatch(setUserData({
                    email: ret[0]['fields']['Email'],
                    name: ret[0]['fields']['First Name'],
                    fullName: ret[0]['fields']['Full Name'],
                    company: ret[0]['fields']['Company Name'],
                    verified: Number(data.data['verified']) === 0 ? 'false' : 'true',
                }));
                navigator('/campaign/all');
            }
        }).catch(err => {
            setShowDialog(true);
        }).finally(() => setLoading(false));
    };

    return (
        <div className='flex h-full relative'>
            {loading && <Loading />}
            <div className='h-full flex flex-col justify-center items-center relative px-[104px] w-[46%]'>
                <img className='absolute t-0 z-[0] w-full h-full object-cover' src={SignUpBack} alt="limit" />
                <h2 className='font-bold my-3 font-[Inter] text-[50px] text-[white] z-[1]'>Sign In</h2>
                <p className='z-[1] font-[Inter] text-[white] text-[20px]'>Access the power of the Presspool Platform to deliver your solution directly in front of targeted, engaged readers.</p>
            </div>
            <div className="flex flex-1 items-center justify-center bg-white w-full px-[82px]">
                <div className="rounded-[15px] w-full">
                    <div className="flex flex-col items-center justify-center p-7">
                        <img src={Mark} alt="mark" className="w-[50px]" />
                    </div>

                    <form className="text-left p-8" onSubmit={handleSubmit}>
                        <div>
                            <label className="font-[Inter] text-base block text-md font-semibold my-1">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                onChange={handleChange}
                                className="w-full border-[#7F8182] border-[1px] my-1 rounded-[10px] px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="font-[Inter] block text-base text-md font-semibold mt-[18px]">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                onChange={handleChange}
                                className="w-full border-[#7F8182] border-[1px] mt-[12px] rounded-[10px] px-4 py-2"
                            />
                        </div>
                        <div className="w-full text-right">
                            <button className="font-[Inter] text-[#6c63ff] text-[17px] mt-[22px] underline">Forgot Password?</button>
                        </div>
                        <button className="rounded-[6px] bg-black w-full py-[15px] my-4 text-[white] mt-[32px]">Sign In</button>

                        <p className="mt-[35px] font-[Inter] text-black text-[19px] flex items-center justify-center">
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
            </div>
        </div>
    );
};

export default Login;