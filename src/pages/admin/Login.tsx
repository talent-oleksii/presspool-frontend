import React, { FC, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";

import { useDispatch } from "react-redux";
import ForgotPassword from "../ForgotPassword";
import {
  setAdminAuthenticated,
  setAdminToken,
  setAdminUserData,
} from "../../store/authSlice";

import AdminAPIInstance from "../../api/adminApi";
import SignUpAvatar from "../../assets/image/signup-avatar.jpeg";

import Mark from "../../assets/logo/logo.png";
import Loading from "../../components/Loading";

interface typeLoginForm {
  email: string;
  password: string;
}

const AdminLogin: FC = () => {
  const dispatch = useDispatch();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [formData, setFormData] = useState<typeLoginForm>({
    email: "",
    password: "",
  });
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const navigator = useNavigate();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    setLoading(true);
    AdminAPIInstance.post("auth/login", formData)
      .then((data) => {
        console.log(data.data);
        dispatch(setAdminAuthenticated({ state: true }));
        dispatch(setAdminToken({ token: data.data.token }));
        dispatch(
          setAdminUserData({
            userName: data.data.name,
            email: data.data.email,
            role: data.data.role,
            id: data.data.id,
            link: data.data.link,
            adminCreateTime: data.data.create_time,
          })
        );
        navigator("/admin/dashboard");
      })
      .catch((err) => {
        setShowDialog(true);
      })
      .finally(() => setLoading(false));
  };

  const handleShowPassword: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleForgotPassword: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  return (
    <div className="h-full w-full relative flex items-center justify-center">
      {loading && <Loading />}
      <div className="min-w-[400px] h-full bg-[#edecf2] px-[40px] py-[60px] flex flex-col justify-between border-r-[1px] border-black">
        <div>
          <div className="flex items-center">
            <img src={Mark} alt="mark" className="w-[50px] me-2" />
            <h3 className="font-[Inter] text-primary text-[34px] font-medium -tracking-[1.02px]">
              presspool.ai
            </h3>
          </div>
          <div className="mt-10 flex">
            <span className="rounded-[10px] text-xs font-[Inter] font-medium -tracking-[.42px] bg-main text-[#2c2c2c] w-[28px] h-[28px] flex items-center justify-center me-3">
              1
            </span>
            <div className="text-left">
              <h3 className="text-primary font-[Inter] text-lg font-semibold -tracking-[.6px]">
                Sign Up / Log In
              </h3>
              <p className="text-[#525252] font-[Inter] text-xs -tracking-[.24px] font-normal mt-2">
                Input your Presspool.ai email credentials <br /> and password
              </p>
            </div>
          </div>
          <div className="mt-6 flex">
            <span className="rounded-[10px] text-xs font-[Inter] font-medium -tracking-[.42px] text-[#2c2c2c] w-[28px] h-[28px] flex items-center justify-center me-3 border-[1px] border-[#9f9f9f]">
              2
            </span>
            <div className="text-left">
              <h3 className="text-primary font-[Inter] text-lg font-semibold -tracking-[.6px]">
                Access your clients / campaigns
              </h3>
              <p className="text-[#525252] font-[Inter] text-xs -tracking-[.24px] font-normal mt-2">
                Access your assigned Clients and
                <br />
                their campaigns all in one place
              </p>
            </div>
          </div>
          <div className="mt-6 flex">
            <span className="rounded-[10px] text-xs font-[Inter] font-medium -tracking-[.42px] text-[#2c2c2c] w-[28px] h-[28px] flex items-center justify-center me-3 border-[1px] border-[#9f9f9f]">
              3
            </span>
            <div className="text-left">
              <h3 className="text-primary font-[Inter] text-lg font-semibold -tracking-[.6px]">
                Grow your client base
              </h3>
              <p className="text-[#525252] font-[Inter] text-xs -tracking-[.24px] font-normal mt-2">
                The more campaigns you manage <br />
                successfully, the more money you
                <br />
                can make by increasing your <br />
                Client's spent
              </p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <p className="font-[Inter] text-xs -tracking-[.24px] text-left">
            "Was a game-changer, helping me generate sign-
            <br />
            ups and connect with a highly targeted audience. It's
            <br />
            the secret weapon that boosted our awareness as a<br />
            new player in the market."
          </p>
          <div className="mt-5 flex items-center">
            <img
              src={SignUpAvatar}
              alt="avatar-"
              className="w-[63px] h-[63px] rounded-[10px] me-2"
            />
            <div className="text-left">
              <p className="text-primary font-semibold -tracking-[.48px] font-[Inter] text-xs">
                Morgan A.
              </p>
              <p className="text-[#525252] font-[Inter] text-xs text-normal -tracking-[.36px]">
                Marketing Manager
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-[82px] bg-white h-full relative">
        <div className="rounded-[10px] w-full xl:max-w-[72%] px-[42px]">
          <div className="flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="47"
              height="44"
              viewBox="0 0 47 44"
              fill="none"
            >
              <path
                d="M17.1765 12V7C17.1765 5.67392 17.7095 4.40215 18.6582 3.46447C19.6069 2.52678 20.8936 2 22.2353 2H39.9412C41.2829 2 42.5696 2.52678 43.5183 3.46447C44.467 4.40215 45 5.67392 45 7V37C45 38.3261 44.467 39.5979 43.5183 40.5355C42.5696 41.4732 41.2829 42 39.9412 42H22.2353C20.8936 42 19.6069 41.4732 18.6582 40.5355C17.7095 39.5979 17.1765 38.3261 17.1765 37V32M2 22H34.8824M34.8824 22L27.2941 14.5M34.8824 22L27.2941 29.5"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="font-[Inter] font-semibold text-[40px] -tracking-[1.2px] mt-[26px]">
              Welcome Back To Admin
            </h2>
            <p className="font-[Inter] text-base -tracking-[.48px] text-[#444545] mt-[10px]">
              Enter your details to login
            </p>
          </div>

          <form
            className="text-left py-8 mt-5 w-full flex justify-center flex-col"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="font-[Inter] text-[16.931px] block font-medium my-1 -tracking-[.508px]">
                Email Address
                <span className="text-[red]">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter here..."
                onChange={handleChange}
                className="w-full border-secondry2 bg-transparent border-[1px] mt-1 rounded-[10px] px-4 py-2"
              />
            </div>
            <div>
              <label className="font-[Inter] block text-[16.931px] font-medium mt-[18px] -tracking-[.508px]">
                Password
                <span className="text-[red]">*</span>
              </label>
              <div className="flex items-center justify-center border-secondry2 bg-transparent border-[1px] mt-1 rounded-[10px] px-4">
                <input
                  id="password"
                  name="password"
                  type={passwordType}
                  placeholder="Enter here..."
                  onChange={handleChange}
                  className="flex-1 py-2 px-0 bg-transparent border-none focus:ring-0 focus:border-none"
                />
                <span onClick={handleShowPassword} className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="21"
                    viewBox="0 0 30 21"
                    fill="none"
                  >
                    <path
                      d="M12.3915 10.2433C12.3915 11.0273 12.7029 11.7792 13.2573 12.3336C13.8117 12.888 14.5636 13.1995 15.3477 13.1995C16.1317 13.1995 16.8836 12.888 17.438 12.3336C17.9924 11.7792 18.3038 11.0273 18.3038 10.2433C18.3038 9.45926 17.9924 8.70735 17.438 8.15295C16.8836 7.59856 16.1317 7.28711 15.3477 7.28711C14.5636 7.28711 13.8117 7.59856 13.2573 8.15295C12.7029 8.70735 12.3915 9.45926 12.3915 10.2433Z"
                      stroke="black"
                      strokeWidth="2.17682"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M28.6505 10.2435C25.1031 16.1559 20.6688 19.1121 15.3477 19.1121C10.0266 19.1121 5.59234 16.1559 2.04492 10.2435C5.59234 4.33118 10.0266 1.375 15.3477 1.375C20.6688 1.375 25.1031 4.33118 28.6505 10.2435Z"
                      stroke="black"
                      strokeWidth="2.17682"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="w-full text-right">
              <div
                className="font-[Inter] text-primary text-[17px] mt-4 underline -tracking-[.504px]"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </div>
            </div>
            <button className="rounded-[10px] bg-[#7ffbae] w-full py-[10px] 2xl:py-[10px] my-2 text-[16.931px] 2xl:my-4 text-primary text-semibold mt-[32px]">
              Log In
            </button>

            <p className="mt-[35px] font-[Inter] text-[#525252] text-lg flex items-center justify-center -tracking-[.574px]">
              Don't have an account?
              <Link
                className="block text-center text-primary ms-1 underline"
                to="/admin/signup"
              >
                Sign Up
              </Link>
            </p>
          </form>

          <div className="absolute left-1/2 bottom-4 -translate-x-1/2">
            <p className="text-xs -tracking-[.36px] font-[Inter]">Optimized for Desktop</p>
            <p className="text-[10px] -tracking-[.3px] text-[#525252]">Switch to a larger screen for the full suite of features.</p>
          </div>
        </div>
        <Transition.Root show={showDialog} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => {
              setShowDialog(false);
            }}
          >
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
                  <Dialog.Panel className="relative transform overflow-hidden rounded-[10px] bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                    <div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-semibold leading-6 text-gray-900"
                        >
                          Log In Failed!
                        </Dialog.Title>
                      </div>
                    </div>

                    <div className="mt-5">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-[10px] bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                        onClick={() => {
                          setShowDialog(false);
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
      <ForgotPassword
        show={showForgotPassword}
        setShow={(show: boolean) => setShowForgotPassword(show)}
        isAdmin
      />
    </div>
  );
};

export default AdminLogin;
