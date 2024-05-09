import React, { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";
import ErrorMessage from "../../../components/ErrorMessage";

const LoginForm: FC = () => {
  const [passwordType, setPasswordType] = useState("password");
  const {
    control,
    formState: { isValid, errors },
  } = useFormContext();

  const handleShowPassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return (
    <div className="text-left mt-9 md:py-8 md:mt-5 w-full flex justify-center flex-col">
      <div className="md:my-1">
        <label className="font-[Inter] text-[14px] md:text-base block font-medium -tracking-[.508px]">
          Email Address <abbr className="text-red-600">*</abbr>
        </label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              onChange={field.onChange}
              onBlur={field.onBlur}
              value={field.value}
              type="text"
              placeholder="Enter here..."
              className={`w-full border-secondry2 bg-transparent border-[1px] md:mt-2 xsm:mt-0.5 rounded-[10px] px-4 md:py-3 xsm:py2 ${
                !!errors[field.name] ? "!border-[#ff0000]" : ""
              }`}
            />
          )}
        />
        <ErrorMessage message={errors["email"]?.message} />
      </div>
      <div className="mt-2 md:mt-4">
        <label className="font-[Inter] block text-[14px] md:text-base font-medium -tracking-[.508px]">
          Password <abbr className="text-red-600">*</abbr>
        </label>
        <div
          className={`flex items-center justify-center border-secondry2 bg-transparent border-[1px] mt-3 md:mt-2 xsm:mt-0.5 rounded-[10px] px-4 ${
            !!errors["password"] ? "!border-[#ff0000]" : ""
          }`}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                type={passwordType}
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={field.value}
                placeholder="Enter here..."
                className={`flex-1 md:py-3 xsm:py2 px-0 bg-transparent border-none focus:ring-0 focus:border-none ${
                  !!errors[field.name] ? "border-[#ff0000]" : ""
                }`}
              />
            )}
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
        <ErrorMessage message={errors["password"]?.message} />
      </div>
      <div className="w-full text-right">
        <div className="font-[Inter] text-primary text-base mt-4 underline -tracking-[.504px] cursor-pointer">
          Forgot Password?
        </div>
      </div>
      <button
        type="submit"
        className="rounded-[10px] bg-main w-full py-[10px] 2xl:py-[10px] md:my-2 2xl:my-4 text-base text-primary md:mt-[32px] xsm:mt-4 font-semibold"
        disabled={!isValid}
      >
        Log In
      </button>
      <p className="mt-7 md:mt-[35px] font-[Inter] text-[#525252] text-base flex items-center justify-center -tracking-[.574px]">
        Don't have an account?
        <Link
          className="block text-center text-primary ms-1 underline"
          to="/publishers/signup"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
