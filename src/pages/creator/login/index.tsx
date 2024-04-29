import React, { FC, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch } from "react-redux";
import SignUpAvatar from "../../../assets/image/maskgroup.png";
import Mark from "../../../assets/logo/logo.png";
import Loading from "../../../components/Loading";
import CreatorAPIInstance from "../../../api/creatorAPIInstance";
import { setCreatorData } from "../../../store/authSlice";
import LoginForm from "./LoginForm";
import FormProviderWrapper from "../../../components/FormProviderWrapper";
import { useForm } from "react-hook-form";
import { defaultCreatorLoginFormData } from "../../../constants/defaultValues/creator.default.values";
import { yupResolver } from "@hookform/resolvers/yup";
import { creatorLoginSchema } from "../../../validators/creator.validator";
import { ICommonFormOptions } from "../../../interfaces/common.interface";

const Login: FC = () => {
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();

  const options: ICommonFormOptions = Object.freeze({
    mode: "all",
    reValidateMode: "onSubmit",
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: true,
    },
  });

  const creatorLoginMethods = useForm({
    ...options,
    defaultValues: defaultCreatorLoginFormData,
    resolver: yupResolver(creatorLoginSchema),
  });

  const handleSubmit = () => {
    setLoading(true);
    const values = creatorLoginMethods.getValues();
    CreatorAPIInstance.post("auth/login", values)
      .then(({ data }) => {
        dispatch(setCreatorData(data));
        navigator("/creator/dashboard");
      })
      .catch((err) => {
        setShowDialog(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="h-full w-full relative flex items-center justify-center">
      {loading && <Loading />}
      <div className="min-w-[400px] h-full bg-[#edecf2] px-[40px] py-[60px] hidden md:flex flex-col justify-between border-r-[1px] border-black">
        <div>
          <div className="flex items-center">
            <img src={Mark} alt="mark" className="w-[50px] me-2" />
            <h3 className="font-[Inter] text-primary text-[34px] font-medium -tracking-[1.02px]">
              presspool.ai
            </h3>
          </div>
          <div className="mt-10 flex">
            <span className="rounded-[14px] text-sm font-[Inter] font-medium -tracking-[.42px] bg-main text-[#2c2c2c] w-[28px] h-[28px] flex items-center justify-center me-3">
              1
            </span>
            <div className="text-left">
              <h3 className="text-primary font-[Inter] text-base font-semibold -tracking-[.6px]">
                Sign Up / Log In
              </h3>
              <p className="text-[#525252] font-[Inter] text-sm -tracking-[.24px] font-normal mt-2">
                Input your Presspool.ai email credentials <br /> and password
              </p>
            </div>
          </div>
          <div className="mt-6 flex">
            <span className="rounded-[14px] text-sm font-[Inter] font-medium -tracking-[.42px] text-[#2c2c2c] w-[28px] h-[28px] flex items-center justify-center me-3 border-[1px] border-[#9f9f9f]">
              2
            </span>
            <div className="text-left">
              <h3 className="text-primary font-[Inter] text-base font-semibold -tracking-[.6px]">
                Manage Sponsorships
              </h3>
              <p className="text-[#525252] font-[Inter] text-sm -tracking-[.24px] font-normal mt-2">
                View, manage, and accept your <br /> sponsorship inquiries all
                in one place <br /> with ease.
              </p>
            </div>
          </div>
          <div className="mt-6 flex">
            <span className="rounded-[14px] text-sm font-[Inter] font-medium -tracking-[.42px] text-[#2c2c2c] w-[28px] h-[28px] flex items-center justify-center me-3 border-[1px] border-[#9f9f9f]">
              3
            </span>
            <div className="text-left">
              <h3 className="text-primary font-[Inter] text-base font-semibold -tracking-[.6px]">
                Grow your revenue
              </h3>
              <p className="text-[#525252] font-[Inter] text-sm -tracking-[.24px] font-normal mt-2">
                Watch your revenue go up while <br />
                maintaining your audience’s trust and <br />
                interest
              </p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <p className="font-[Inter] text-xs -tracking-[.24px] text-left">
            "Working with Presspool has solved our
            <br />
            monetization issues by not only sending us tons of
            <br />
            sponsorship opportunities, but quality ones that <br />
            our audience actually wants to read about.”
          </p>
          <div className="mt-5 flex items-center">
            <img
              src={SignUpAvatar}
              alt="avatar-"
              className="w-[63px] h-[63px] rounded-[10px] me-2"
            />
            <div className="text-left">
              <p className="text-primary font-semibold -tracking-[.48px] font-[Inter] text-base">
                Liam Lawson
              </p>
              <p className="text-[#525252] font-[Inter] text-xs text-normal -tracking-[.36px]">
                Editor in Chief - AI Tool Report
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex xsm:flex-col flex-1 items-center h-full bg-white md:justify-center w-full xsm:pt-8 xsm:gap-16 xsm:bg-[#EDECF2]">
        <div className="flex items-center gap-1.5 md:hidden">
          <img src={Mark} alt="mark" className="w-[30px]" />
          <h3 className="font-[Inter] text-primary text-[22px] font-medium -tracking-[1.02px]">
            presspool.ai
          </h3>
        </div>
        <div className="w-full xl:max-w-[72%] px-[42px] xsm:bg-white xsm:h-full rounded-t-[10px] md:rounded-[10px] xsm:py-7 xsm:px-5">
          <div className="flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="47"
              height="44"
              className="xsm:w-10"
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
            <h2 className="font-[Inter] font-semibold text-[20px] md:text-[40px] -tracking-[1.2px] mt-3 md:mt-[26px]">
              Welcome Back
            </h2>
            <p className="font-[Inter] text-base -tracking-[.48px] text-[#444545] mt-3 md:mt-[10px]">
              Enter your details to login
            </p>
          </div>

          <FormProviderWrapper
            methods={creatorLoginMethods}
            onSubmit={handleSubmit}
          >
            <LoginForm />
          </FormProviderWrapper>
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
    </div>
  );
};

export default Login;
