import { FC, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUnauthenticated } from "../store/authSlice";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import Logo from "../assets/logo/logo.png";
import Creator from "../assets/image/creator.png";
import Company from "../assets/image/company.png";
import Precise from "../assets/image/Precise.png";
import Launch from "../assets/image/Launch.png";
import Seamless from "../assets/image/Seamless.png";

const Landing: FC = () => {
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.search.length > 10) {
      navigate(`/client-sign-up/${location.search}`);
    }
    if (isAuthenticated) {
      navigate("/campaign/all");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    dispatch(setUnauthenticated());
  };

  return (
    <div className="w-full h-screen pt-8 flex flex-col px-8">
      <div className="flex flex-col text-center items-center justify-center">
        <img alt="logo" src={Logo} className="w-[30px] mb-5" />
        <h2 className="font-[Inter] font-semibold text-[24px] leading-7 md:text-[34px] mt-7 md:mt-[12px] text-black md:mb-2 -tracking-[1.2px]">
          Welcome to the
          {/* <h2 className="font-[Inter] font-semibold text-black text-[40px] -tracking-[1.2px] -mt-5"> */}
          <span className="bg-[#43474a] text-main mx-2 rounded-full px-2 py-0">
            future
          </span>
          of marketing
        </h2>
        <div className="flex items-center justify-center mt-12 md:mt-4 xsm:flex-wrap gap-5 md:gap-6">
          {!isAuthenticated ? (
            <>
              <Link
                className="flex flex-col font-semibold -tracking-[.42px] text-black py-[15px] text-sm 2xl:text-sm items-center justify-center bg-white rounded-[10px] shadow-md w-[250px]"
                to="client-sign-up"
              >
                <img
                  alt="creator"
                  src={Company}
                  className="w-[45px] h-[35.966px]"
                />
                <p className="mb-0 mt-[9px]">I'm a Company</p>
                {/* <p className='mb-0 -mt-1'>Company</p> */}
              </Link>
              <button className="flex flex-col font-semibold -tracking-[.42px] text-black py-[15px] text-sm 2xl:text-sm items-center justify-center  bg-white rounded-[10px] shadow-md w-[250px]">
                <img
                  alt="creator"
                  src={Creator}
                  className="w-[40px] h-[36.269px]"
                />
                <p className="mb-0 mt-[9px]">I'm a Creator</p>
                {/* <p className='mb-0 -mt-1'>Creator</p> */}
              </button>
            </>
          ) : (
            <>
              <Link className="font-bold underline" to="/campaign/all">
                Start Campaign
              </Link>
            </>
          )}
        </div>
        {!isAuthenticated ? (
          <p className="mt-12 md:mt-5 font-[Inter] font-medium text-sm text-[#7F8182]">
            Already have an account? Sign in{" "}
            <Link to="/login" className="text-black underline">
              here
            </Link>
          </p>
        ) : (
          <button
            className="mt-3 text-xs 2xl:text-md font-[Inter] text-[red]"
            onClick={handleLogout}
          >
            Log out
          </button>
        )}
      </div>
      <div className="hidden overflow-hidden md:flex flex-1 items-center flex-col mt-5 rounded-[10px] px-[15px] pt-[19px] pb-[14px] w-full px-8 shadow-md bg-[#fffdfd]">
        <p className="text-black text-xl font-semibold -tracking-[.54px]">
          Discover Features
        </p>
        <div className="">
          <div className="flex justify-center items-center mt-[15px]">
            <button
              className={`font-semibold text-lg justify-center px-12 py-2 min-w-[145px] -tracking-[.54px] rounded-[4.5px] items-center flex flex-col hover:border-main border-b-[1px] ${current === 0
                ? "text-black border-main"
                : "text-[#525252] border-[#EDECF2]"
                }`}
              onClick={() => setCurrent(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="23"
                viewBox="0 0 31 30"
                fill="none"
                className="mb-2"
              >
                <path
                  d="M15.5028 7.22525C13.9098 7.22525 12.3527 7.68141 11.0282 8.53604C9.7037 9.39068 8.6714 10.6054 8.06181 12.0266C7.45222 13.4478 7.29272 15.0117 7.60349 16.5204C7.91425 18.0291 8.68132 19.415 9.8077 20.5027C10.9341 21.5905 12.3692 22.3312 13.9315 22.6313C15.4938 22.9315 17.1132 22.7774 18.5849 22.1887C20.0566 21.6001 21.3144 20.6032 22.1994 19.3241C23.0844 18.0451 23.5568 16.5413 23.5568 15.003M17.1135 1.08729C14.1272 0.763756 11.1106 1.34439 8.48091 2.74889C5.85124 4.15339 3.73851 6.31233 2.43498 8.92707C1.13144 11.5418 0.701515 14.4831 1.20468 17.3441C1.70784 20.2051 3.11922 22.8445 5.24358 24.897C7.36794 26.9495 10.1003 28.3138 13.0627 28.8012C16.0251 29.2885 19.071 28.8748 21.7793 27.6173C24.4876 26.3598 26.7243 24.3206 28.18 21.7819C29.6357 19.2431 30.2385 16.3302 29.9049 13.4462M20.3352 10.3364V5.6697L25.1676 1.00304V5.6697H30L25.1676 10.3364H20.3352ZM20.3352 10.3364L15.5028 15.003M13.8919 15.003C13.8919 15.4156 14.0617 15.8112 14.3637 16.103C14.6658 16.3947 15.0755 16.5586 15.5028 16.5586C15.93 16.5586 16.3397 16.3947 16.6418 16.103C16.9438 15.8112 17.1136 15.4156 17.1136 15.003C17.1136 14.5905 16.9438 14.1948 16.6418 13.9031C16.3397 13.6114 15.93 13.4475 15.5028 13.4475C15.0755 13.4475 14.6658 13.6114 14.3637 13.9031C14.0617 14.1948 13.8919 14.5905 13.8919 15.003Z"
                  stroke={current === 0 ? "black" : "#525252"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Easy Campaign Creation
            </button>
            <button
              className={`font-semibold text-lg justify-center px-12 py-2 min-w-[145px] -tracking-[.54px] rounded-[4.5px] items-center flex flex-col hover:border-main border-b-[1px] ${current === 1
                ? "text-black border-main"
                : "text-[#525252] border-[#EDECF2]"
                }`}
              onClick={() => setCurrent(1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 31 31"
                fill="none"
                className="mb-2"
              >
                <path
                  d="M6.51132 19.0682C4.63083 20.1299 3.11026 21.7289 2.14452 23.6604C1.17877 25.5919 0.811876 27.7678 1.09086 29.9091C3.23223 30.1881 5.40812 29.8212 7.33961 28.8555C9.27109 27.8897 10.8701 26.3692 11.9318 24.4887M1.09087 17.2614C4.3126 17.6443 7.31184 19.0999 9.60598 21.394C11.9001 23.6882 13.3557 26.6874 13.7386 29.9091C15.3357 28.9884 16.6716 27.6756 17.6201 26.0948C18.5685 24.514 19.0982 22.7175 19.1591 20.875C22.1929 19.8078 24.8422 17.8649 26.7718 15.292C28.7015 12.7191 29.8249 9.6318 30 6.42046C30 4.98287 29.4289 3.60415 28.4124 2.58762C27.3959 1.57108 26.0171 1 24.5795 1C21.3682 1.17509 18.2809 2.2985 15.708 4.22816C13.1351 6.15782 11.1922 8.80708 10.125 11.8409C8.28249 11.9018 6.48596 12.4315 4.90518 13.3799C3.32441 14.3284 2.01161 15.6643 1.09087 17.2614ZM19.1591 10.0341C19.1591 10.5133 19.3494 10.9729 19.6883 11.3117C20.0271 11.6506 20.4867 11.8409 20.9659 11.8409C21.4451 11.8409 21.9047 11.6506 22.2435 11.3117C22.5824 10.9729 22.7727 10.5133 22.7727 10.0341C22.7727 9.55491 22.5824 9.09534 22.2435 8.75649C21.9047 8.41765 21.4451 8.22729 20.9659 8.22729C20.4867 8.22729 20.0271 8.41765 19.6883 8.75649C19.3494 9.09534 19.1591 9.55491 19.1591 10.0341Z"
                  stroke={current === 1 ? "black" : "#525252"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Transparent Analytics
            </button>
            <button
              className={`font-semibold text-lg justify-center px-12 py-2 min-w-[145px] -tracking-[.54px] rounded-[4.5px] items-center flex flex-col hover:border-main border-b-[1px] ${current === 2
                ? "text-black border-main"
                : "text-[#525252] border-[#EDECF2]"
                }`}
              onClick={() => setCurrent(2)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 31 31"
                fill="none"
                className="mb-2"
              >
                <path
                  d="M10.6667 28.1875V17.3125C10.6667 16.8318 10.4969 16.3708 10.1948 16.0309C9.89264 15.691 9.48285 15.5 9.05556 15.5H2.61111C2.18382 15.5 1.77403 15.691 1.47188 16.0309C1.16974 16.3708 1 16.8318 1 17.3125V28.1875C1 28.6682 1.16974 29.1292 1.47188 29.4691C1.77403 29.809 2.18382 30 2.61111 30M10.6667 28.1875C10.6667 28.6682 10.4969 29.1292 10.1948 29.4691C9.89264 29.809 9.48285 30 9.05556 30H2.61111M10.6667 28.1875C10.6667 28.6682 10.8364 29.1292 11.1386 29.4691C11.4407 29.809 11.8505 30 12.2778 30H18.7222C19.1495 30 19.5593 29.809 19.8615 29.4691C20.1636 29.1292 20.3333 28.6682 20.3333 28.1875M10.6667 28.1875V10.0625C10.6667 9.5818 10.8364 9.12078 11.1386 8.78087C11.4407 8.44096 11.8505 8.25 12.2778 8.25H18.7222C19.1495 8.25 19.5593 8.44096 19.8615 8.78087C20.1636 9.12078 20.3333 9.5818 20.3333 10.0625V28.1875M2.61111 30H25.1667M20.3333 28.1875C20.3333 28.6682 20.5031 29.1292 20.8052 29.4691C21.1074 29.809 21.5172 30 21.9444 30H28.3889C28.8162 30 29.226 29.809 29.5281 29.4691C29.8303 29.1292 30 28.6682 30 28.1875V2.8125C30 2.3318 29.8303 1.87078 29.5281 1.53087C29.226 1.19096 28.8162 1 28.3889 1H21.9444C21.5172 1 21.1074 1.19096 20.8052 1.53087C20.5031 1.87078 20.3333 2.3318 20.3333 2.8125V28.1875Z"
                  stroke={current === 2 ? "black" : "#525252"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Real, Measureable ROI
            </button>
          </div>
          <div className="flex items-center justify-center">
            <Carousel
              className="mt-[15px]"
              showStatus={false}
              showThumbs={false}
              animationHandler="slide"
              selectedItem={current}
              showArrows={false}
              showIndicators={false}
            >
              <div>
                <img src={Precise} alt="..." className="!w-[70%] max-w-[870px] rounded-md" />
              </div>
              <div>
                <img src={Launch} alt="..." className="!w-[70%] max-w-[870px] rounded-md" />
              </div>
              <div>
                <img src={Seamless} alt="..." className="!w-[70%] max-w-[870px] rounded-md" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
