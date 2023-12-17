import React, { FC, useState, Fragment } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';

import { useDispatch } from 'react-redux';
import { setAdminAuthenticated, setAdminToken, setAdminUserData } from "../../store/authSlice";

import AdminAPIInstance from "../../api/adminApi";

import Mark from '../../assets/logo/logo.png';
import Loading from "../../components/Loading";

interface typeLoginForm {
  email: string;
  password: string;
}

const AdminLogin: FC = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<typeLoginForm>({
    email: '',
    password: '',
  });
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
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
    AdminAPIInstance.post('auth/login', formData).then(data => {
      dispatch(setAdminAuthenticated({ state: true }));
      dispatch(setAdminToken({ token: data.data.token }));
      dispatch(setAdminUserData({ userName: data.data.name, email: data.data.email }));
      navigator('/admin/dashboard');
    }).catch(err => {
      setShowDialog(true);
    }).finally(() => setLoading(false));
  };

  const handleShowPassword: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  return (
    <div className='h-full relative flex items-center justify-center'>
      {loading && <Loading />}
      <div className="flex flex-1 items-center justify-center xl:max-w-[56%] px-[82px]">
        <div className="rounded-[15px] w-full">
          <div className="flex flex-col items-center justify-center">
            <img src={Mark} alt="mark" className="w-[32x] h-[34px]" />
            <h2 className='font-[Inter] font-semibold text-[40px] -tracking-[1.2px] mt-[26px]'>Welcome Back To Admin</h2>
            <p className='font-[Inter] text-base -tracking-[.48px] text-[#444545] mt-[10px]'>Enter your details to login</p>
          </div>

          <form className="text-left py-8 mt-[20px] w-full flex justify-center flex-col" onSubmit={handleSubmit}>
            <div>
              <label className="font-[Inter] text-base block font-medium my-1 -tracking-[.508px]">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter here..."
                onChange={handleChange}
                className="w-full border-[#7F8182] bg-transparent border-[1px] mt-[12px] rounded-[10px] px-4 py-2"
              />
            </div>
            <div>
              <label className="font-[Inter] block text-base font-medium mt-[18px] -tracking-[.508px]">Password</label>
              <div className="flex items-center justify-center border-[#7F8182] bg-transparent border-[1px] mt-[12px] rounded-[10px] px-4">
                <input
                  id="password"
                  name="password"
                  type={passwordType}
                  placeholder="Enter here..."
                  onChange={handleChange}
                  className="flex-1 py-2 px-0 bg-transparent border-none focus:ring-0 focus:border-none"
                />
                <span onClick={handleShowPassword} className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="21" viewBox="0 0 30 21" fill="none">
                    <path d="M12.3915 10.2433C12.3915 11.0273 12.7029 11.7792 13.2573 12.3336C13.8117 12.888 14.5636 13.1995 15.3477 13.1995C16.1317 13.1995 16.8836 12.888 17.438 12.3336C17.9924 11.7792 18.3038 11.0273 18.3038 10.2433C18.3038 9.45926 17.9924 8.70735 17.438 8.15295C16.8836 7.59856 16.1317 7.28711 15.3477 7.28711C14.5636 7.28711 13.8117 7.59856 13.2573 8.15295C12.7029 8.70735 12.3915 9.45926 12.3915 10.2433Z" stroke="black" strokeWidth="2.17682" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M28.6505 10.2435C25.1031 16.1559 20.6688 19.1121 15.3477 19.1121C10.0266 19.1121 5.59234 16.1559 2.04492 10.2435C5.59234 4.33118 10.0266 1.375 15.3477 1.375C20.6688 1.375 25.1031 4.33118 28.6505 10.2435Z" stroke="black" strokeWidth="2.17682" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
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
      </div>
    </div>
  );
};

export default AdminLogin;