import { FC, Fragment, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import validator from "validator";
import { motion } from "framer-motion";
import APIInstance from "../api";

import { FADE_UP_ANIMATION_VARIANTS } from "../utils/TransitionConstants";

import Logo from "../assets/logo/logo.png";
import DialogUtils from "../utils/DialogUtils";
import AdminAPIInstance from "../api/adminApi";
import { LeftCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface typeForgotPassword {
  show: boolean;
  setShow: Function;
  isAdmin?: boolean;
}

const ForgotPassword: FC<typeForgotPassword> = ({
  show,
  setShow,
  isAdmin,
}: typeForgotPassword) => {
  const navigator = useNavigate();
  const [email, setEmail] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [step, setStep] = useState("initial"); // initial, verify, final
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const codeRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    return () => {
      setStep("initial");
      setCode(["", "", "", "", ""]);
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    };
  }, [show]);

  const handleGoToVerify = () => {
    if (!validator.isEmail(email)) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);
    if (isAdmin) {
      AdminAPIInstance.post("/auth/password", {
        email,
      })
        .then(() => setStep("verify"))
        .catch((err) => {
          DialogUtils.show("error", "", err.response.data.message);
        });
    } else {
      APIInstance.post("/auth/password", {
        email,
      })
        .then(() => {
          setStep("verify");
        })
        .catch((err) => {
          DialogUtils.show("error", "", err.response.data.message);
        });
    }
  };

  const handleGoToFinal = () => {
    if (isAdmin) {
      AdminAPIInstance.post("/auth/verify-password-email", {
        email,
        code: code.join(""),
      })
        .then(() => {
          setShowWarning(false);
          setStep("final");
        })
        .catch((err) => {
          setShowWarning(true);
        });
    } else {
      APIInstance.post("/auth/verify-password-email", {
        email,
        code: code.join(""),
      })
        .then(() => {
          setShowWarning(false);
          setStep("final");
        })
        .catch((err) => {
          setShowWarning(true);
        });
    }
  };

  const handleSubmit = () => {
    if (
      !validator.isStrongPassword(newPassword) ||
      newPassword !== confirmPassword
    ) {
      return;
    }

    if (isAdmin) {
      AdminAPIInstance.put("/auth/password", {
        email,
        password: newPassword,
      }).then(() => {
        setShow(false);
      });
    } else {
      APIInstance.put("/auth/password", {
        email,
        password: newPassword,
      }).then(() => {
        setShow(false);
      });
    }
  };

  const handleInputChange = (index: number, value: string) => {
    let currentCode = [...code];
    currentCode[index] = value;
    setCode(currentCode);

    // Automatically focus on the next input
    if (index < codeRefs.length - 1 && value !== "") {
      if (codeRefs[index + 1].current)
        (codeRefs[index + 1].current as HTMLInputElement).focus();
    }

    if (index > 0 && value === "") {
      if (codeRefs[index - 1].current)
        (codeRefs[index - 1].current as HTMLInputElement).focus();
    }
  };

  const handleBackClick = () => {
    if (step === "initial") {
      setShow(false);
    } else {
      setStep("initial");
    }
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 forgot-password-modal xsm:bg-[#EDECF2]"
        onClose={() => {}}
      >
        <div className="fixed inset-0 z-10 overflow-y-auto xsm:bg-[#EDECF2]">
          <div className="flex xsm:flex-col min-h-full md:justify-center md:p-4 text-center items-center sm:p-0 xsm:pt-8 md:bg-black/[.8]">
            <div className="flex items-center justify-center gap-1.5 md:hidden xsm:w-full xsm:relative">
              {/* <LeftCircleOutlined
                className="md:hidden absolute left-4"
                style={{ fontSize: "36px" }}
              /> */}
              <span
                onClick={handleBackClick}
                className="md:hidden absolute left-4 w-9 h-9"
              >
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 41 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.8817 27.0781L16.4219 20.6183L22.8817 14.1585"
                    stroke="black"
                    stroke-width="1.72"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M20.7311 40C23.276 40 25.7961 39.4987 28.1473 38.5248C30.4985 37.5509 32.6349 36.1234 34.4344 34.3239C36.234 32.5243 37.6615 30.3879 38.6354 28.0367C39.6093 25.6855 40.1106 23.1654 40.1106 20.6205C40.1106 18.0755 39.6093 15.5555 38.6354 13.2043C37.6615 10.8531 36.234 8.71667 34.4344 6.91712C32.6349 5.11757 30.4985 3.69008 28.1473 2.71617C25.796 1.74226 23.276 1.24099 20.7311 1.24099C18.1861 1.24099 15.6661 1.74226 13.3148 2.71617C10.9636 3.69008 8.82724 5.11757 7.02769 6.91712C5.22813 8.71667 3.80065 10.8531 2.82674 13.2043C1.85283 15.5555 1.35156 18.0755 1.35156 20.6205C1.35156 23.1654 1.85283 25.6855 2.82674 28.0367C3.80065 30.3879 5.22813 32.5243 7.02769 34.3239C8.82724 36.1234 10.9636 37.5509 13.3149 38.5248C15.6661 39.4987 18.1861 40 20.7311 40Z"
                    stroke="black"
                    stroke-width="1.72"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <img src={Logo} alt="mark" className="w-[30px]" />
              <h3 className="font-[Inter] text-black text-[22px] font-medium -tracking-[1.02px]">
                presspool.ai
              </h3>
            </div>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`xsm:flex-1 xsm:w-full xsm:-tracking-[.42px] relative bg-white xsm:rounded-t-[17.2px] md:rounded-[22px] text-left flex md:items-center md:justify-center flex-col shadow-xl md:border-[1px] border-black xsm:px-4 md:px-[36px] xsm:mt-10 md:pt-[45px] md:pb-[26px]`}
              >
                <button
                  onClick={() => setShow(false)}
                  className="absolute right-4 top-4 xsm:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                  >
                    <path
                      d="M13.4444 13.4444L20.5556 20.5556M20.5556 13.4444L13.4444 20.5556M17 1C29.8 1 33 4.2 33 17C33 29.8 29.8 33 17 33C4.2 33 1 29.8 1 17C1 4.2 4.2 1 17 1Z"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <img
                  src={Logo}
                  alt="logo"
                  className="w-[50px] h-[50px] xsm:hidden"
                />
                {step === "initial" && (
                  <motion.div
                    className="text-center relative"
                    initial="hidden"
                    animate="show"
                    variants={FADE_UP_ANIMATION_VARIANTS}
                  >
                    <h3 className="text-black font-[Inter] text-[20px] md:text-3xl mt-7 md:mt-8 font-semibold -tracking-[.72px]">
                      Forgot Password?
                    </h3>
                    <p className="text-[#7f8182] font-[Inter] text-[14px] xsm:leading-4 md:text-xs mt-6 md:mt-[10px] text-left md:text-center">
                      Enter the email address associated with your account. Make
                      sure <br className="xsm:hidden" /> it's the same email
                      address you used when signing up.
                    </p>
                    <p className="w-full text-left font-[Inter] text-[14px] md:text-xs font-medium -tracking-[.42px] mt-16 md:mt-7">
                      Email Address
                      {showWarning && (
                        <span className="text-[red] text-xs ms-2 font-[Inter] -tracking-[.48px]">
                          Enter Valid Email Address
                        </span>
                      )}
                    </p>
                    <input
                      className={`w-full border-[#7F8182] bg-transparent border-[1px] md:mt-2 xsm:mt-0.5 rounded-[10px] px-4 md:py-3 xsm:py2 ${
                        showWarning ? "border-[red]" : "border-[#7f8182]"
                      }`}
                      placeholder="Enter your email address"
                      value={email}
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      className="mt-5 flex items-center justify-center text-xs bg-main text-black font-semibold font-[Inter] py-[13px] w-full rounded-[5px]"
                      onClick={handleGoToVerify}
                    >
                      Continue
                    </button>
                  </motion.div>
                )}
                {step === "verify" && (
                  <motion.div
                    className="text-center relative"
                    initial="hidden"
                    animate="show"
                    variants={FADE_UP_ANIMATION_VARIANTS}
                  >
                    <h3 className="text-black font-[Inter] text-[20px] md:text-3xl mt-7 md:mt-8 font-semibold -tracking-[.72px]">
                      Verification
                    </h3>
                    <p className="text-[#7f8182] font-[Inter] text-xs mt-6 md:mt-[10px] text-center">
                      Enter the code that we sent you to at your email
                    </p>
                    <p className="w-full text-left font-[Inter] text-[14px] md:text-xs font-medium -tracking-[.42px] mt-10 md:mt-[26px]">
                      Code
                      {showWarning && (
                        <span className="text-[red] text-xs ms-2 font-[Inter] -tracking-[.48px]">
                          Enter Valid Code
                        </span>
                      )}
                    </p>
                    <div className="flex gap-4 md:mt-[10px] xsm:mt-0.5">
                      {codeRefs.map((ref, index) => (
                        <input
                          key={index}
                          ref={ref}
                          className="w-full md:w-[68px] py-[8px] text-center rounded-lg border-[#7f8182] bg-white text-[22px] font-semibold -tracking-[.66px]"
                          placeholder="-"
                          maxLength={1}
                          value={code[index]}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                          onKeyDown={(e) => {
                            // Handle backspace key to focus on the previous input
                            if (
                              code[index].length === 0 &&
                              e.key === "Backspace" &&
                              index > 0 &&
                              codeRefs[index - 1].current
                            ) {
                              (
                                codeRefs[index - 1].current as HTMLInputElement
                              ).focus();
                            }
                          }}
                        />
                      ))}
                    </div>
                    <button
                      className="mt-9 md:mt-5 flex items-center justify-center text-xs bg-main text-black font-semibold font-[Inter] py-[13px] w-full rounded-[5px]"
                      onClick={handleGoToFinal}
                    >
                      Continue
                    </button>
                  </motion.div>
                )}
                {step === "final" && (
                  <motion.div
                    className="text-center relative w-full"
                    initial="hidden"
                    animate="show"
                    variants={FADE_UP_ANIMATION_VARIANTS}
                  >
                    <h3 className="text-black font-[Inter] text-[20px] md:text-3xl mt-7 md:mt-8 font-semibold -tracking-[.72px]">
                      New Password
                    </h3>
                    <p className="text-[#7f8182] font-[Inter] text-[14px] md:text-xs mt-6 md:mt-[10px] text-center">
                      Set your new password for future logins
                    </p>
                    <p className="w-full text-left font-[Inter] text-[14px] md:text-xs font-medium -tracking-[.42px] mt-10 md:mt-[26px]">
                      New Password
                      {newPassword.length > 0 &&
                        !validator.isStrongPassword(newPassword) && (
                          <span className="text-[red] text-xs ms-2 font-[Inter] -tracking-[.48px]">
                            Your password is not secure
                          </span>
                        )}
                    </p>
                    <input
                      className={`w-full border-[#7F8182] bg-transparent border-[1px] md:mt-2 xsm:mt-0.5 rounded-[10px] px-4 md:py-3 xsm:py2 ${
                        showWarning ? "border-[red]" : "border-[#7f8182]"
                      }`}
                      placeholder="Enter here"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <p className="w-full text-left font-[Inter] text-[14px] md:text-xs font-medium -tracking-[.42px] mt-4">
                      Confirm Password
                      {confirmPassword.length > 0 &&
                        confirmPassword !== newPassword && (
                          <span className="text-[red] text-xs ms-2 font-[Inter] -tracking-[.48px]">
                            Password does not match
                          </span>
                        )}
                    </p>
                    <input
                      className={`w-full border-[#7F8182] bg-transparent border-[1px] md:mt-2 xsm:mt-0.5 rounded-[10px] px-4 md:py-3 xsm:py2 ${
                        showWarning ? "border-[red]" : "border-[#7f8182]"
                      }`}
                      placeholder="Enter here"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      className="mt-9 md:mt-5 flex items-center justify-center text-xs bg-main text-black font-semibold font-[Inter] py-[13px] w-full rounded-[5px]"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </motion.div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ForgotPassword;
