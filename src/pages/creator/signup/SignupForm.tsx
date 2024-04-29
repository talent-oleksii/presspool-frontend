import { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import ErrorMessage from "../../../components/ErrorMessage";

const SignupForm: FC = () => {
  const [passwordType, setPasswordType] = useState("password");
  const {
    control,
    formState: { isValid, errors },
  } = useFormContext();

  const handleShowPassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return (
    <div className="text-left mt-9 md:mt-[30px]">
      <div className="mt-2 md:mt-4">
        <label
          className={`font-[Inter] text-[14px] md:text-base 2xl:text-base font-medium -tracking-[.5px]`}
        >
          Full Name <abbr className="text-red-600">*</abbr>
        </label>
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <input
              onChange={field.onChange}
              onBlur={field.onBlur}
              value={field.value}
              type="text"
              placeholder="Enter here..."
              className={`w-full border-[1px] bg-transparent border-[#797979] md:mt-2 xsm:mt-0.5 xsm:mb-2 rounded-[10px] px-4 md:py-3 xsm:py2 md:py-2 ${
                !!errors[field.name] ? "!border-[#ff0000]" : ""
              }`}
            />
          )}
        />
        <ErrorMessage message={errors["fullName"]?.message} />
      </div>
      <div className="mt-2 md:mt-4">
        <label
          className={`font-[Inter] text-[14px] md:text-base 2xl:text-base font-medium -tracking-[.5px]`}
        >
          Publication / Newsletter Name <abbr className="text-red-600">*</abbr>
        </label>
        <Controller
          name="newsletter"
          control={control}
          render={({ field }) => (
            <input
              onChange={field.onChange}
              onBlur={field.onBlur}
              value={field.value}
              type="text"
              placeholder="Enter here..."
              className={`w-full border-[1px] bg-transparent border-[#797979] md:mt-2 xsm:mt-0.5 xsm:mb-2 rounded-[10px] px-4 md:py-3 xsm:py2 md:py-2 disabled:bg-[#fbfbfb] ${
                !!errors[field.name] ? "!border-[#ff0000]" : ""
              }`}
            />
          )}
        />
        <ErrorMessage message={errors["newsletter"]?.message} />
      </div>
      <div className="mt-2 md:mt-4">
        <label
          className={`font-[Inter] text-[14px] md:text-base 2xl:text-base font-medium -tracking-[.5px]`}
        >
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
              className={`w-full border-[1px] bg-transparent border-[#797979] md:mt-2 xsm:mt-0.5 xsm:mb-2 rounded-[10px] px-4 md:py-3 xsm:py2 md:py-2 disabled:bg-[#fbfbfb] ${
                !!errors[field.name] ? "!border-[#ff0000]" : ""
              }`}
            />
          )}
        />
        <ErrorMessage message={errors["email"]?.message} />
      </div>
      <div className="mt-2 md:mt-4">
        <label
          className={`font-[Inter] text-[14px] md:text-base 2xl:text-base font-medium -tracking-[.5px]`}
        >
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
                className={`flex-1 md:py-3 xsm:py2 px-0 bg-transparent border-none focus:ring-0 focus:border-none`}
              />
            )}
          />
          <button type="button" onClick={handleShowPassword}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="21"
              viewBox="0 0 30 21"
              fill="none"
            >
              <path
                d="M12.3915 10.2433C12.3915 11.0273 12.7029 11.7792 13.2573 12.3336C13.8117 12.888 14.5636 13.1995 15.3477 13.1995C16.1317 13.1995 16.8836 12.888 17.438 12.3336C17.9924 11.7792 18.3038 11.0273 18.3038 10.2433C18.3038 9.45926 17.9924 8.70735 17.438 8.15295C16.8836 7.59856 16.1317 7.28711 15.3477 7.28711C14.5636 7.28711 13.8117 7.59856 13.2573 8.15295C12.7029 8.70735 12.3915 9.45926 12.3915 10.2433Z"
                stroke="#525252"
                strokeWidth="2.17682"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M28.6505 10.2435C25.1031 16.1559 20.6688 19.1121 15.3477 19.1121C10.0266 19.1121 5.59234 16.1559 2.04492 10.2435C5.59234 4.33118 10.0266 1.375 15.3477 1.375C20.6688 1.375 25.1031 4.33118 28.6505 10.2435Z"
                stroke="#525252"
                strokeWidth="2.17682"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <ErrorMessage message={errors["password"]?.message} />
      </div>
      <div className="mt-5 md:mt-4 flex items-center">
        <Controller
          name="agreeTerm"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="w-4 h-4 text-main bg-gray-100 rounded border-[1px] border-black focus:ring-0"
              type="checkbox"
            />
          )}
        />
        <span className="ms-2 font-[Inter] -tracking-[.544px] text-base text-[#525252]">
          I agree to the{" "}
          <a
            target="_blank"
            href="https://www.presspool.ai/terms"
            rel="noreferrer"
            className="text-primary underline"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            className="text-primary underline"
            target="_blank"
            href="https://www.presspool.ai/privacy-policy"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
        </span>
      </div>
      <button
        className="rounded-[10px] text-base bg-main w-full py-[10px] 2xl:py-[15px] mt-6 text-primary font-semibold disabled:bg-[gray]"
        type="submit"
        disabled={!isValid}
      >
        Sign Up
      </button>
    </div>
  );
};

export default SignupForm;
