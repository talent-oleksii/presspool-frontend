import React, { FC, useState, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import validator from "validator";
import SignUpAvatar from "../../assets/image/maskgroup.png";
import Mark from "../../assets/logo/logo.png";
import Loading from "../../components/Loading";
import DialogUtils from "../../utils/DialogUtils";
import CreatorAPIInstance from "../../api/creatorAPIInstance";

interface ISignupFormData {
  fullName: string;
  newsletter: string | null;
  email: string | null;
  password: string;
  agreeTerm: boolean;
}

const SignUp: FC = () => {
  const [check, setCheck] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ISignupFormData>({
    fullName: "",
    newsletter: "",
    email: "",
    password: "",
    agreeTerm: false,
  });
  const [passwordType, setPasswordType] = useState("password");

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
    if (
      validator.isEmpty(formData.fullName) ||
      !validator.isEmail(formData.email || "") ||
      validator.isEmail(formData.newsletter || "") ||
      !validator.isStrongPassword(formData.password)
    )
      return;

    setLoading(true);
    CreatorAPIInstance.post("auth/signup", {
      ...formData,
    })
      .then((data) => {
        const ret = data.data;
        console.log(ret);
      })
      .catch((err) => {
        DialogUtils.show("error", "", err.response.data.message);
      })
      .finally(() => setLoading(false));
  };

  const handleShowPassword: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return (
    <div className="flex h-auto md:h-full xsm:min-h-full relative items-center justify-center w-full md:bg-white xsm:pt-8 xsm:bg-[#EDECF2]">
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
      <div className="flex xsm:flex-col flex-1 justify-center items-center md:h-full xsm:min-h-full  md:bg-white w-full">
        <div className="flex items-center gap-1.5 md:hidden">
          <img src={Mark} alt="mark" className="w-[30px]" />
          <h3 className="font-[Inter] text-primary text-[22px] font-medium -tracking-[1.02px]">
            presspool.ai
          </h3>
        </div>
        <div className="w-full xsm:min-h-full rounded-t-[10px] xsm:mt-16 xsm:pt-7 xsm:pb-48 md:rounded-[10px] xl:max-w-[72%] px-4 md:px-[42px] xsm:bg-white">
          <div className="flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="47"
              height="44"
              viewBox="0 0 47 44"
              fill="none"
              className="xsm:w-10"
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
              Welcome!
            </h2>
            <p className="font-[Inter] text-base -tracking-[.48px] text-[#444545] mt-3 md:mt-[10px]">
              Access the power of the Presspool Platform to deliver your
              solution <br className="xsm:hidden" /> directly in front of
              targeted, engaged readers.
            </p>
          </div>
          <form
            autoComplete="off"
            className="text-left mt-9 md:mt-[30px]"
            onSubmit={handleSubmit}
          >
            <label
              className={`font-[Inter] text-[14px] md:text-base 2xl:text-base font-medium -tracking-[.5px] ${
                check && validator.isEmpty(formData.fullName)
                  ? "text-[red]"
                  : "text-primary"
              }`}
            >
              Full Name
              {formData.fullName.length > 0 &&
                validator.isEmpty(formData.fullName) && (
                  <span className="ms-1 text-[red] text-xs">
                    *Input your full name
                  </span>
                )}
            </label>
            <input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter here..."
              type="text"
              className="w-full border-[1px] bg-transparent border-[#797979] md:mt-2 md:mb-3 xsm:mt-0.5 xsm:mb-2 rounded-[10px] px-4 md:py-3 xsm:py2 md:py-2"
            />
            <label
              className={`font-[Inter] text-[14px] md:text-base 2xl:text-base font-medium -tracking-[.5px] ${
                check && validator.isEmpty(formData.newsletter || "")
                  ? "text-[red]"
                  : "text-primary"
              }`}
            >
              Publication / Newsletter Name
              {formData.newsletter &&
                formData.newsletter.length > 0 &&
                validator.isEmpty(formData.newsletter) && (
                  <span className="ms-1 text-[red] text-xs">*</span>
                )}
            </label>
            <input
              id="newsletter"
              name="newsletter"
              value={formData.newsletter || ""}
              onChange={handleChange}
              placeholder="Enter here..."
              type="text"
              className="w-full border-[1px] bg-transparent border-[#797979] md:mt-2 md:mb-3 xsm:mt-0.5 xsm:mb-2 rounded-[10px] px-4 md:py-3 xsm:py2 md:py-2 disabled:bg-[#fbfbfb]"
            />
            <label
              className={`font-[Inter] text-[14px] md:text-base 2xl:text-base font-medium -tracking-[.5px] ${
                check && !validator.isEmail(formData.email || "")
                  ? "text-[red]"
                  : "text-primary"
              }`}
            >
              Email Address
              {formData.email &&
                formData.email.length > 0 &&
                !validator.isEmail(formData.email) && (
                  <span className="ms-1 text-[red] text-xs">
                    *Input valid email address
                  </span>
                )}
            </label>
            <input
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Enter here..."
              type="email"
              className="w-full border-[1px] bg-transparent border-[#797979] md:mt-2 md:mb-3 xsm:mt-0.5 xsm:mb-2 rounded-[10px] px-4 md:py-3 xsm:py2 md:py-2 disabled:bg-[#fbfbfb]"
            />
            <label
              className={`font-[Inter] text-[14px] md:text-base 2xl:text-base font-medium -tracking-[.5px] ${
                check && !validator.isStrongPassword(formData.password)
                  ? "text-[red]"
                  : "text-primary"
              }`}
            >
              Password
              {formData.password.length > 0 &&
                !validator.isStrongPassword(formData.password) && (
                  <span className="ms-1 text-[red] text-xs">
                    * Your password is not secure
                  </span>
                )}
            </label>
            <div className="w-full border-[1px] bg-transparent border-[#797979] rounded-[10px] px-4 flex md:mt-2 xsm:mt-0.5">
              <input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter here..."
                type={passwordType}
                className="flex-1 rounded-[10px] border-none bg-transparent px-0 md:py-3 xsm:py2 focus:ring-0 focus:border-none"
              />
              <button onClick={handleShowPassword}>
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
            <div className="mt-5 md:mt-4 flex items-center">
              <input
                checked={formData.agreeTerm}
                onChange={(e) =>
                  setFormData({ ...formData, agreeTerm: e.target.checked })
                }
                type="checkbox"
                className="w-4 h-4 text-main bg-gray-100 rounded border-[1px] border-black focus:ring-0"
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
              disabled={!formData.agreeTerm}
            >
              Sign Up
            </button>
          </form>
          <div className="flex items-center justify-center mt-7">
            <p className="text-base text-center w-full font-[Inter] text-[#525252] -tracking-[.574px]">
              Already have an account?{" "}
              <Link to="/creator/login" className="text-primary underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Transition.Root show={showDialog} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setShowDialog(false);
            navigator("/login");
          }}
        >
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-[10px] bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-xs font-semibold leading-6 text-gray-900"
                      >
                        Sign Up Success!
                      </Dialog.Title>
                      <p className="font-[Inter] text-xs mt-[15px]">
                        Please check your inbox to verify your email address
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-[10px] bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={() => {
                        setShowDialog(false);
                        navigator("/campaign/all");
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

export default SignUp;
