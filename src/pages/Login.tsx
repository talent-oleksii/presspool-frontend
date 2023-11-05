import { FC, useState, Fragment } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';

import { useAuthContext } from "../store/AuthContextProvider";
import APIInstance from "../api";

import Mark from '../assets/logo/logo.png';

interface typeLoginForm {
    email: string;
    password: string;
}

const Login: FC = () => {
    const [formData, setFormData] = useState<typeLoginForm>({
        email: '',
        password: '',
    });
    const [showDialog, setShowDialog] = useState(false);
    const navigator = useNavigate();
    const [, { setAuthenticated, setEmail, setUserType }] = useAuthContext();

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        APIInstance.get('auth/sign-in', {
            params: formData,
        }).then(data => {
            console.log('data:', data.data);
            const ret = data.data.records;
            console.log('ree:', ret.length);
            if (ret.length < 1) {
                setShowDialog(true);
            } else {
                setEmail(ret[0].fields.Email);
                setUserType(ret[0].fields['User Group']);
                setAuthenticated(true);
                navigator('/');
            }
        }).catch(err => {
            console.log('error:', err);
        });
    };

    return (
        <div className="flex flex-col items-center justify-center py-9 bg-[#fafafc] min-h-[100vh]">
            <div className="shadow-lg shadow-[#0a0a0a]/[.04] w-[450px] sm:w-[630px] bg-[white] rounded-[15px]">
                <div className="flex flex-col items-center justify-center p-7 border-b-[1px] border-[#ededed]">
                    <img src={Mark} alt="mark" className="w-[50px]" />
                    <p className="font-[Inter] text-2xl mt-3 font-bold">Sign In</p>
                </div>
                
                <form className="text-left p-8" onSubmit={handleSubmit}>
                    <div>
                        <label className="font-[Inter] block text-md font-semibold my-1">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            onChange={handleChange}
                            className="w-full border-indigo-500 border-[1px] my-1 rounded-[10px] px-4 py-2"
                        />
                    </div>
                    <div>
                        <label className="font-[Inter] block text-md font-semibold my-1">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            onChange={handleChange}
                            className="w-full border-indigo-500 border-[1px] my-1 rounded-[10px] px-4 py-2"
                        />
                    </div>
                    <button className="rounded-[10px] bg-[#212121] w-full py-2 my-4 text-[white]">Sign In</button>

                    <Link className="block text-center mt-5 text-[#6c63ff]" to="/">Sign Up</Link>
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
    );
};

export default Login;