import { FC, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUnauthenticated } from "../store/authSlice";

import "react-responsive-carousel/lib/styles/carousel.min.css";

import Logo from "../assets/logo/logo.png";
import Creator from "../assets/image/creator.png";
import Company from "../assets/image/company.png";

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
    <div className="w-full h-screen flex flex-col">
      <div className="flex flex-col h-full text-center items-center justify-center">
        <img alt="logo" src={Logo} className="w-[30px] mb-5" />
        <h2 className="font-[Inter] font-semibold text-[24px] leading-7 md:text-[34px] mt-7 md:mt-[12px] text-primary md:mb-2 -tracking-[1.2px]">
          Welcome to the
          {/* <h2 className="font-[Inter] font-semibold text-primary text-[40px] -tracking-[1.2px] -mt-5"> */}
          <span className="bg-[#43474a] text-main mx-2 rounded-[10px] px-2 py-0">
            Future
          </span>
          of Marketing
        </h2>
        <div className="flex items-center justify-center mt-12 md:mt-4 xsm:flex-wrap gap-5 md:gap-6">
          {!isAuthenticated ? (
            <>
              <Link
                className="flex flex-col font-semibold -tracking-[.42px] text-primary py-[15px] text-sm 2xl:text-sm items-center justify-center bg-white rounded-[10px] shadow-md w-[250px]"
                to="login"
              >
                <img
                  alt="creator"
                  src={Company}
                  className="w-[45px] h-[35.966px]"
                />
                <p className="mb-0 mt-[9px]">I'm a Company</p>
                {/* <p className='mb-0 -mt-1'>Company</p> */}
              </Link>
              <Link
                className="flex flex-col font-semibold -tracking-[.42px] text-primary py-[15px] text-sm 2xl:text-sm items-center justify-center  bg-white rounded-[10px] shadow-md w-[250px]"
                to="publishers"
              >
                <img
                  alt="creator"
                  src={Creator}
                  className="w-[40px] h-[36.269px]"
                />
                <p className="mb-0 mt-[9px]">I'm a Publisher</p>
                {/* <p className='mb-0 -mt-1'>Creator</p> */}
              </Link>
            </>
          ) : (
            <>
              <Link className="font-bold underline" to="/campaign/all">
                Start Campaign
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
