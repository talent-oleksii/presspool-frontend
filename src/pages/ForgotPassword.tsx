import { FC, Fragment, useEffect, useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import validator from 'validator';
import { motion } from 'framer-motion';
import APIInstance from '../api';

import { FADE_UP_ANIMATION_VARIANTS } from '../utils/TransitionConstants';

import Logo from '../assets/logo/logo.png';
import DialogUtils from '../utils/DialogUtils';

interface typeForgotPassword {
  show: boolean,
  setShow: Function;
}

const ForgotPassword: FC<typeForgotPassword> = ({ show, setShow }: typeForgotPassword) => {
  const [email, setEmail] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [step, setStep] = useState('initial'); // initial, verify, final
  const [code, setCode] = useState(['', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const codeRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    return () => {
      setStep('initial');
      setCode(['', '', '', '', '']);
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
    };
  }, [show]);

  const handleGoToVerify = () => {
    if (!validator.isEmail(email)) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);
    APIInstance.post('/auth/password', {
      email,
    }).then(() => {
      setStep('verify');
    }).catch(err => {
      DialogUtils.show('error', '', err.response.data.message);
    });
  };

  const handleGoToFinal = () => {
    APIInstance.post('/auth/verify-password-email', {
      email,
      code: code.join(''),
    }).then(() => {
      setShowWarning(false);
      setStep('final');
    }).catch(err => {
      setShowWarning(true);
    });
  };

  const handleSubmit = () => {
    if (!validator.isStrongPassword(newPassword) || newPassword !== confirmPassword) {
      return;
    }

    APIInstance.put('/auth/password', {
      email,
      password: newPassword,
    }).then(() => {
      setShow(false);
    }).catch(err => {
      console.log('error:', err);
    });
  };

  const handleInputChange = (index: number, value: string) => {
    let currentCode = [...code];
    currentCode[index] = value;
    setCode(currentCode);

    // Automatically focus on the next input
    if (index < codeRefs.length - 1 && value !== '') {
      if (codeRefs[index + 1].current) (codeRefs[index + 1].current as HTMLInputElement).focus();
    }

    if (index > 0 && value === '') {
      if (codeRefs[index - 1].current) (codeRefs[index - 1].current as HTMLInputElement).focus();
    }
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => { }}>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 bg-black/[.8]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={`relative bg-white rounded-[22px] text-left flex items-center justify-center flex-col shadow-xl border-[1px] border-black px-[36px] pt-[45px] pb-[26px]`}>
                <button onClick={() => setShow(false)} className='absolute right-4 top-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                    <path d="M13.4444 13.4444L20.5556 20.5556M20.5556 13.4444L13.4444 20.5556M17 1C29.8 1 33 4.2 33 17C33 29.8 29.8 33 17 33C4.2 33 1 29.8 1 17C1 4.2 4.2 1 17 1Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <img src={Logo} alt="logo" className='w-[50px] h-[50px]' />
                {
                  step === 'initial' &&
                  <motion.div
                    className='text-center relative'
                    initial="hidden"
                    animate="show"
                    variants={FADE_UP_ANIMATION_VARIANTS}
                  >
                    <h3 className='text-black font-[Inter] text-3xl mt-8 font-semibold -tracking-[.72px]'>Forgot Password?</h3>
                    <p className='text-[#7f8182] font-[Inter] text-sm mt-[10px] text-center'>Enter the email address associated with your account. Make sure <br /> it's the same email address you used when signing up.</p>
                    <p className='w-full text-left font-[Inter] text-sm font-medium -tracking-[.42px] mt-7'>
                      Email Address
                      {showWarning && <span className='text-[red] text-xs ms-2 font-[Inter] -tracking-[.48px]'>Enter Valid Email Address</span>}
                    </p>
                    <input
                      className={`w-full text-left mt-[10px] border-[1px] bg-white rounded-lg px-[16px] py-[12px] font-[Inter] text-base font-medium -tracking-[.48px] focus:ring-0 focus:border-main ${showWarning ? 'border-[red]' : 'border-[#7f8182]'}`}
                      placeholder='Enter your email address'
                      value={email}
                      type='email'
                      onChange={e => setEmail(e.target.value)}
                    />
                    <button className='mt-5 flex items-center justify-center text-sm bg-main text-black font-semibold font-[Inter] py-[13px] w-full rounded-[5px]' onClick={handleGoToVerify}>Continue</button>
                  </motion.div>
                }
                {
                  step === 'verify' &&
                  <motion.div
                    className='text-center relative'
                    initial="hidden"
                    animate="show"
                    variants={FADE_UP_ANIMATION_VARIANTS}
                  >
                    <h3 className='text-black font-[Inter] text-3xl mt-8 font-semibold -tracking-[.72px]'>Verification</h3>
                    <p className='text-[#7f8182] font-[Inter] text-sm mt-[10px] text-center'>Enter the code that we sent you to at your email</p>
                    <p className='w-full text-left font-[Inter] text-sm font-medium -tracking-[.42px] mt-[26px]'>
                      Code
                      {showWarning && <span className='text-[red] text-xs ms-2 font-[Inter] -tracking-[.48px]'>Enter Valid Code</span>}
                    </p>
                    <div className='flex gap-4 mt-[10px]'>
                      {codeRefs.map((ref, index) => (
                        <input
                          key={index}
                          ref={ref}
                          className='w-[68px] py-[8px] text-center rounded-lg border-[#7f8182] bg-white text-[22px] font-semibold -tracking-[.66px]'
                          placeholder='-'
                          maxLength={1}
                          value={code[index]}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          onKeyDown={(e) => {
                            // Handle backspace key to focus on the previous input
                            if (code[index].length === 0 && e.key === 'Backspace' && index > 0 && codeRefs[index - 1].current) {
                              (codeRefs[index - 1].current as HTMLInputElement).focus();
                            }
                          }}
                        />
                      ))}
                    </div>
                    <button className='mt-5 flex items-center justify-center text-sm bg-main text-black font-semibold font-[Inter] py-[13px] w-full rounded-[5px]' onClick={handleGoToFinal}>Continue</button>
                  </motion.div>
                }
                {
                  step === 'final' &&
                  <motion.div
                    className='text-center relative'
                    initial="hidden"
                    animate="show"
                    variants={FADE_UP_ANIMATION_VARIANTS}
                  >
                    <h3 className='text-black font-[Inter] text-3xl mt-8 font-semibold -tracking-[.72px]'>New Password</h3>
                    <p className='text-[#7f8182] font-[Inter] text-sm mt-[10px] text-center'>Set your new password for future logins</p>
                    <p className='w-full text-left font-[Inter] text-sm font-medium -tracking-[.42px] mt-[26px]'>
                      New Password
                      {newPassword.length > 0 && !validator.isStrongPassword(newPassword) && <span className='text-[red] text-xs ms-2 font-[Inter] -tracking-[.48px]'>Your password is not secure</span>}
                    </p>
                    <input
                      className={`w-full text-left mt-[10px] border-[1px] bg-white w-[600px] rounded-lg px-[16px] py-[12px] font-[Inter] text-base font-medium -tracking-[.48px] focus:ring-0 focus:border-main ${showWarning ? 'border-[red]' : 'border-[#7f8182]'}`}
                      placeholder='Enter here'
                      type='password'
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                    <p className='w-full text-left font-[Inter] text-sm font-medium -tracking-[.42px] mt-[16px]'>
                      Confirm Password
                      {confirmPassword.length > 0 && confirmPassword !== newPassword && <span className='text-[red] text-xs ms-2 font-[Inter] -tracking-[.48px]'>Password does not match</span>}
                    </p>
                    <input
                      className={`w-full text-left mt-[10px] border-[1px] bg-white w-[600px] rounded-lg px-[16px] py-[12px] font-[Inter] text-base font-medium -tracking-[.48px] focus:ring-0 focus:border-main ${showWarning ? 'border-[red]' : 'border-[#7f8182]'}`}
                      placeholder='Enter here'
                      type='password'
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <button className='mt-5 flex items-center justify-center text-sm bg-main text-black font-semibold font-[Inter] py-[13px] w-full rounded-[5px]' onClick={handleSubmit}>Submit</button>
                  </motion.div>
                }
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ForgotPassword;