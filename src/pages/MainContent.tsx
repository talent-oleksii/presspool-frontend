import { FC, useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Dropdown, MenuProps } from "antd";
import {
  setUnauthenticated,
  selectAuth,
  setAuthenticated,
  setUserData,
} from "../store/authSlice";

import CreateCampaign from "./dashboard/CreateCampaign";
import Dashboard from "./dashboard";
import Billing from "./billing";
import Support from "./support";
import Detail from "./campaign";
import Profile from "./Profile";
import Logo from "../assets/logo/logo.png";
import APIInstance from "../api";
import Loading from "../components/Loading";
import { setCampaign, setClicked, setCardList } from "../store/dataSlice";
import AddTeammate from "./AddTeammate";

import HelpImage from "../assets/icon/help.png";
import CampaignImage from "../assets/icon/campaign.png";
import AccountImage from "../assets/image/account.png";
import FeedbackImage from "../assets/icon/topbar-help.png";
import LogoutImage from "../assets/icon/logout.png";
import LinkImage from "../assets/icon/link.png";

import "./style.scss";
import RaiseBudget from "./campaign/RaiseBudget";

const MainContent: FC = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { fullName, email, email_verified, avatar } = useSelector(selectAuth);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);

  //auth check
  useEffect(() => {
    setLoading(true);
    APIInstance.post("auth/check", {
      email,
    })
      .then((data) => {
        const ret = data.data.records;
        if (ret.length < 1) {
          dispatch(setUnauthenticated());
          navigator("/login");
        } else {
          dispatch(setAuthenticated());
          dispatch(
            setUserData({
              email: ret[0]["fields"]["Email"],
              name: ret[0]["fields"]["First Name"],
              fullName: ret[0]["fields"]["Full Name"],
              company: ret[0]["fields"]["Company Name"],
              verified: Number(data.data["verified"]) === 0 ? "false" : "true",
              email_verified:
                Number(data.data["email_verified"]) === 0 ? "false" : "true",
              avatar: data.data["avatar"],
            })
          );

          Promise.all([
            APIInstance.get("data/campaign", {
              params: { email: ret[0]["fields"]["Email"] },
            }),
            APIInstance.get("stripe/card", {
              params: { email: ret[0]["fields"]["Email"] },
            }),
          ])
            .then((results: Array<any>) => {
              dispatch(setClicked(results[0].data.clicked));
              dispatch(setCampaign({ campaign: results[0].data.data }));
              dispatch(setCardList({ cardList: results[1].data }));

              if (location.pathname === "/") navigator("/campaign/all");
            })
            .catch((err) => {
              console.log("err:", err);
            })
            .finally(() => setLoading(false));
        }
      })
      .catch((err) => {
        dispatch(setUnauthenticated());
        navigator("/login");
      })
      .finally();
    (function (w: any, d: any, s: any, o: any, f: any, js: any, fjs: any) {
      w["botsonic_widget"] = o;
      w[o] =
        w[o] ||
        function () {
          (w[o].q = w[o].q || []).push(arguments);
        };
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      js = d.createElement(s);
      fjs = d.getElementsByTagName(s)[0];
      if (!js) return;
      js.id = o;
      js.src = f;
      js.async = 1;
      fjs.parentNode?.insertBefore(js, fjs);
    })(
      window,
      document,
      "script",
      "Botsonic",
      "https://widget.writesonic.com/CDN/botsonic.min.js",
      null,
      null
    );

    // Initialize the script
    (window as any).Botsonic("init", {
      serviceBaseUrl: "https://api.botsonic.ai",
      token: "c6f96462-0f55-4daf-8060-9b1f72f6ce7e",
    });

    return () => {
      (window as any).Botsonic("destory");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    dispatch(setUnauthenticated());
    navigator("/");
  };

  const getPlaceHolder = () => {
    const names = fullName.split(" ");
    if (names.length === 2) {
      return `${names[0].at(0)}${names[1].at(0)}`;
    } else if (names.length === 1) {
      return `${names[0].at(0)}`;
    } else {
      return "";
    }
  };

  const getOffsetBack = () => {
    if (location.pathname.indexOf("campaign") > -1) return "top-[2%]";
    if (location.pathname.indexOf("detail") > -1) return "top-[26%]";
    if (location.pathname.indexOf("profile") > -1) return "top-[50%]";
    if (location.pathname.indexOf("support") > -1) return "top-[74%]";

    return "top-0";
  };

  const profileItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link
          to="/profile"
          className="font-[Inter] font-medium text-xs flex items-center"
        >
          <svg
            viewBox="0 0 512 512"
            className="w-[12px] -ms-1 me-2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M336 240c17.68 0 31.99-14.25 31.99-32s-14.31-32-31.99-32c-17.8 0-32.02 14.25-32.02 32S318.2 240 336 240zM175.1 240c17.8 0 32.02-14.25 32.02-32s-14.22-32-32.02-32c-17.68 0-31.99 14.25-31.99 32S158.3 240 175.1 240zM340 312.6C319.2 337.6 288.5 352 256 352s-63.21-14.25-84.04-39.38c-8.477-10.25-23.61-11.5-33.79-3.125C128 318 126.7 333.1 135.1 343.3c29.91 36 74.11 56.73 120.9 56.73s90.94-20.73 120.9-56.73c8.598-10.12 7.145-25.25-3.027-33.75C363.7 301.1 348.5 302.4 340 312.6zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464z" />
          </svg>
          My Profile
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <button
          className="font-[Inter] font-medium text-xs flex items-center"
          onClick={() => setShowAddTeamModal(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
            fill="none"
            className="w-[12px] -ms-1 me-2"
          >
            <path
              d="M4.33333 6H7.66667M6 4.33333V7.66667M1 6C1 6.65661 1.12933 7.30679 1.3806 7.91342C1.63188 8.52005 2.00017 9.07124 2.46447 9.53553C2.92876 9.99983 3.47996 10.3681 4.08658 10.6194C4.69321 10.8707 5.34339 11 6 11C6.65661 11 7.30679 10.8707 7.91342 10.6194C8.52005 10.3681 9.07124 9.99983 9.53553 9.53553C9.99983 9.07124 10.3681 8.52005 10.6194 7.91342C10.8707 7.30679 11 6.65661 11 6C11 4.67392 10.4732 3.40215 9.53553 2.46447C8.59785 1.52678 7.32608 1 6 1C4.67392 1 3.40215 1.52678 2.46447 2.46447C1.52678 3.40215 1 4.67392 1 6Z"
              stroke="black"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Add a teammate
        </button>
      ),
    },
    {
      key: "2",
      label: (
        <button
          className="font-[Inter] font-medium text-xs flex items-center"
          onClick={() => handleLogout()}
        >
          <img
            alt="Support"
            src={LogoutImage}
            className="w-[14px] me-2 -ms-1"
          />
          Log Out
        </button>
      ),
      onClick: handleLogout,
    },
  ];

  const feedbackItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          href="https://forms.gle/T9Kc6JvaVhzwozYR8"
          className="font-[Inter] font-medium text-xs flex items-center"
          target="_blank"
          rel="noreferrer"
        >
          <span className="-ms-1 w-[20px] font-[Inter]">✐</span>
          Give feedback
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          href="https://forms.gle/j1HCrRcrGK9roPhGA"
          className="font-[Inter] font-medium text-xs flex items-center"
          target="_blank"
          rel="noreferrer"
        >
          <span className="-ms-1 w-[20px]">⚐</span>
          Request a feature
        </a>
      ),
    },
  ];

  const handleReload = () => {
    setLoading(true);
    Promise.all([
      APIInstance.get("data/campaign", { params: { email } }),
      APIInstance.get("stripe/card", { params: { email } }),
    ])
      .then((results: Array<any>) => {
        dispatch(setClicked(results[0].data.clicked));
        dispatch(setCampaign({ campaign: results[0].data.data }));
        dispatch(setCardList({ cardList: results[1].data }));

        if (location.pathname === "/") navigator("/campaign/all");
      })
      .catch((err) => {
        console.log("err:", err);
      })
      .finally(() => setLoading(false));
  };

  if (email_verified === "false") {
    return <div>Your email is not verified yet, please verify your email</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="w-full z-[7] pt-5 pl-5 pr-5">
        <div className="flex bg-[#fffdfd] rounded-full items-center pl-[18px] pr-[15px] h-[60px] w-full justify-between">
          <div className="flex items-center justify-center">
            <Link to="/" className="text-left w-full">
              <img src={Logo} className="h-[18px]" alt="logo" />
            </Link>
            {/* <button
              className="ms-2 font-[Inter] -tracking-[.6px] text-sm whitespace-nowrap rounded-full bg-black text-white px-2 py-[2px]"
              onClick={handleReload}
            >
              Reload Data
            </button> */}
          </div>

          <div className="flex items-center">
            <Dropdown placement="bottomRight" menu={{ items: feedbackItems }}>
              <button className="flex font-[Inter] bg-main rounded-[10px] px-3 py-[3px] font-medium text-black text-xs whitespace-nowrap items-center">
                <img
                  alt="Support"
                  src={FeedbackImage}
                  className="w-[14px] me-1 -ms-1"
                />
                <span className="font-[Inter] text-xs ms-1">Beta feedback</span>
              </button>
            </Dropdown>
            {/* <div className="ms-[44px]">
              <Dropdown
                placement="bottomRight"
                menu={{ items: profileItems }}
              >
                <button className="flex justify-center items-center border-none p-0 font-[Inter] text-[11px]">
                  <Avatar className="bg-main text-black items-center justify-center flex" src={avatar} alt={getPlaceHolder()} size="small">
                    {(!avatar || avatar.length <= 3) && <span className="text-xs font-[Inter] font-medium">{getPlaceHolder()}</span>}
                  </Avatar>

                  <span className="font-[Inter] text-xs font-medium ms-1">↓</span>
                </button>
              </Dropdown>
            </div> */}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-12 h-calc-vh">
        <div className="col-span-1 pt-12 pl-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col items-center justify-center">
              <Link
                to="/new"
                className={`text-xs font-[Inter] flex items-center font-semibold text-left py-[18px] px-[12px] w-full bg-main rounded-[15px] text-black ${
                  location.pathname.indexOf("new") > -1
                    ? "ring-black ring-[1px]"
                    : "ring-0"
                }`}
              >
                <svg
                  enableBackground="new 0 0 32 32"
                  version="1.1"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] ms-1 me-2"
                >
                  <g>
                    <g id="Grid" />
                    <g id="Meter" />
                    <g id="Email" />
                    <g id="Email_Notification" />
                    <g id="Inbox" />
                    <g id="Inbox_Notification" />
                    <g id="List" />
                    <g id="Grid_1_" />
                    <g id="Add">
                      <g>
                        <circle
                          cx="16"
                          cy="16"
                          fill="none"
                          r="14"
                          stroke="#000000"
                          strokeMiterlimit="10"
                        />
                        <g>
                          <line
                            fill="none"
                            stroke="#000000"
                            strokeMiterlimit="10"
                            x1="16"
                            x2="16"
                            y1="7.6"
                            y2="24.4"
                          />
                          <line
                            fill="none"
                            stroke="#000000"
                            strokeMiterlimit="10"
                            x1="24.4"
                            x2="7.6"
                            y1="16"
                            y2="16"
                          />
                        </g>
                      </g>
                    </g>
                    <g id="Minus" />
                    <g id="Basket" />
                  </g>
                </svg>
                Create New Campaign
              </Link>

              <div className="relative w-full">
                <Link
                  className={`w-full text-left my-1.5 font-[Inter] text-xs font-medium rounded-[15px] px-3 py-2.5 flex items-center text-black hover:bg-white`}
                  to="/campaign/all"
                >
                  <svg
                    fill="none"
                    height="15"
                    viewBox="0 0 15 15"
                    width="15"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[16px] ms-1 me-2"
                  >
                    <path
                      clipRule="evenodd"
                      d="M2.8 1L2.74967 0.99997C2.52122 0.999752 2.32429 0.999564 2.14983 1.04145C1.60136 1.17312 1.17312 1.60136 1.04145 2.14983C0.999564 2.32429 0.999752 2.52122 0.99997 2.74967L1 2.8V5.2L0.99997 5.25033C0.999752 5.47878 0.999564 5.67572 1.04145 5.85017C1.17312 6.39864 1.60136 6.82688 2.14983 6.95856C2.32429 7.00044 2.52122 7.00025 2.74967 7.00003L2.8 7H5.2L5.25033 7.00003C5.47878 7.00025 5.67572 7.00044 5.85017 6.95856C6.39864 6.82688 6.82688 6.39864 6.95856 5.85017C7.00044 5.67572 7.00025 5.47878 7.00003 5.25033L7 5.2V2.8L7.00003 2.74967C7.00025 2.52122 7.00044 2.32429 6.95856 2.14983C6.82688 1.60136 6.39864 1.17312 5.85017 1.04145C5.67572 0.999564 5.47878 0.999752 5.25033 0.99997L5.2 1H2.8ZM2.38328 2.01382C2.42632 2.00348 2.49222 2 2.8 2H5.2C5.50779 2 5.57369 2.00348 5.61672 2.01382C5.79955 2.05771 5.94229 2.20045 5.98619 2.38328C5.99652 2.42632 6 2.49222 6 2.8V5.2C6 5.50779 5.99652 5.57369 5.98619 5.61672C5.94229 5.79955 5.79955 5.94229 5.61672 5.98619C5.57369 5.99652 5.50779 6 5.2 6H2.8C2.49222 6 2.42632 5.99652 2.38328 5.98619C2.20045 5.94229 2.05771 5.79955 2.01382 5.61672C2.00348 5.57369 2 5.50779 2 5.2V2.8C2 2.49222 2.00348 2.42632 2.01382 2.38328C2.05771 2.20045 2.20045 2.05771 2.38328 2.01382ZM9.8 1L9.74967 0.99997C9.52122 0.999752 9.32429 0.999564 9.14983 1.04145C8.60136 1.17312 8.17312 1.60136 8.04145 2.14983C7.99956 2.32429 7.99975 2.52122 7.99997 2.74967L8 2.8V5.2L7.99997 5.25033C7.99975 5.47878 7.99956 5.67572 8.04145 5.85017C8.17312 6.39864 8.60136 6.82688 9.14983 6.95856C9.32429 7.00044 9.52122 7.00025 9.74967 7.00003L9.8 7H12.2L12.2503 7.00003C12.4788 7.00025 12.6757 7.00044 12.8502 6.95856C13.3986 6.82688 13.8269 6.39864 13.9586 5.85017C14.0004 5.67572 14.0003 5.47878 14 5.25033L14 5.2V2.8L14 2.74967C14.0003 2.52122 14.0004 2.32429 13.9586 2.14983C13.8269 1.60136 13.3986 1.17312 12.8502 1.04145C12.6757 0.999564 12.4788 0.999752 12.2503 0.99997L12.2 1H9.8ZM9.38328 2.01382C9.42632 2.00348 9.49222 2 9.8 2H12.2C12.5078 2 12.5737 2.00348 12.6167 2.01382C12.7995 2.05771 12.9423 2.20045 12.9862 2.38328C12.9965 2.42632 13 2.49222 13 2.8V5.2C13 5.50779 12.9965 5.57369 12.9862 5.61672C12.9423 5.79955 12.7995 5.94229 12.6167 5.98619C12.5737 5.99652 12.5078 6 12.2 6H9.8C9.49222 6 9.42632 5.99652 9.38328 5.98619C9.20045 5.94229 9.05771 5.79955 9.01382 5.61672C9.00348 5.57369 9 5.50779 9 5.2V2.8C9 2.49222 9.00348 2.42632 9.01382 2.38328C9.05771 2.20045 9.20045 2.05771 9.38328 2.01382ZM2.74967 7.99997L2.8 8H5.2L5.25033 7.99997C5.47878 7.99975 5.67572 7.99956 5.85017 8.04145C6.39864 8.17312 6.82688 8.60136 6.95856 9.14983C7.00044 9.32429 7.00025 9.52122 7.00003 9.74967L7 9.8V12.2L7.00003 12.2503C7.00025 12.4788 7.00044 12.6757 6.95856 12.8502C6.82688 13.3986 6.39864 13.8269 5.85017 13.9586C5.67572 14.0004 5.47878 14.0003 5.25033 14L5.2 14H2.8L2.74967 14C2.52122 14.0003 2.32429 14.0004 2.14983 13.9586C1.60136 13.8269 1.17312 13.3986 1.04145 12.8502C0.999564 12.6757 0.999752 12.4788 0.99997 12.2503L1 12.2V9.8L0.99997 9.74967C0.999752 9.52122 0.999564 9.32429 1.04145 9.14983C1.17312 8.60136 1.60136 8.17312 2.14983 8.04145C2.32429 7.99956 2.52122 7.99975 2.74967 7.99997ZM2.8 9C2.49222 9 2.42632 9.00348 2.38328 9.01382C2.20045 9.05771 2.05771 9.20045 2.01382 9.38328C2.00348 9.42632 2 9.49222 2 9.8V12.2C2 12.5078 2.00348 12.5737 2.01382 12.6167C2.05771 12.7995 2.20045 12.9423 2.38328 12.9862C2.42632 12.9965 2.49222 13 2.8 13H5.2C5.50779 13 5.57369 12.9965 5.61672 12.9862C5.79955 12.9423 5.94229 12.7995 5.98619 12.6167C5.99652 12.5737 6 12.5078 6 12.2V9.8C6 9.49222 5.99652 9.42632 5.98619 9.38328C5.94229 9.20045 5.79955 9.05771 5.61672 9.01382C5.57369 9.00348 5.50779 9 5.2 9H2.8ZM9.8 8L9.74967 7.99997C9.52122 7.99975 9.32429 7.99956 9.14983 8.04145C8.60136 8.17312 8.17312 8.60136 8.04145 9.14983C7.99956 9.32429 7.99975 9.52122 7.99997 9.74967L8 9.8V12.2L7.99997 12.2503C7.99975 12.4788 7.99956 12.6757 8.04145 12.8502C8.17312 13.3986 8.60136 13.8269 9.14983 13.9586C9.32429 14.0004 9.52122 14.0003 9.74967 14L9.8 14H12.2L12.2503 14C12.4788 14.0003 12.6757 14.0004 12.8502 13.9586C13.3986 13.8269 13.8269 13.3986 13.9586 12.8502C14.0004 12.6757 14.0003 12.4788 14 12.2503L14 12.2V9.8L14 9.74967C14.0003 9.52122 14.0004 9.32429 13.9586 9.14983C13.8269 8.60136 13.3986 8.17312 12.8502 8.04145C12.6757 7.99956 12.4788 7.99975 12.2503 7.99997L12.2 8H9.8ZM9.38328 9.01382C9.42632 9.00348 9.49222 9 9.8 9H12.2C12.5078 9 12.5737 9.00348 12.6167 9.01382C12.7995 9.05771 12.9423 9.20045 12.9862 9.38328C12.9965 9.42632 13 9.49222 13 9.8V12.2C13 12.5078 12.9965 12.5737 12.9862 12.6167C12.9423 12.7995 12.7995 12.9423 12.6167 12.9862C12.5737 12.9965 12.5078 13 12.2 13H9.8C9.49222 13 9.42632 12.9965 9.38328 12.9862C9.20045 12.9423 9.05771 12.7995 9.01382 12.6167C9.00348 12.5737 9 12.5078 9 12.2V9.8C9 9.49222 9.00348 9.42632 9.01382 9.38328C9.05771 9.20045 9.20045 9.05771 9.38328 9.01382Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  className={`w-full text-left my-1.5 font-[Inter] text-xs font-medium rounded-[15px] px-3 py-2.5 flex items-center text-black hover:bg-white`}
                  to="/detail"
                >
                  <img
                    alt="Support"
                    src={CampaignImage}
                    className="w-[16px] me-2 ms-1"
                  />
                  Campaigns
                </Link>
                <Link
                  className={`w-full text-left my-1.5 font-[Inter] text-xs font-medium rounded-[15px] px-3 py-2.5 flex items-center text-black hover:bg-white`}
                  to="/profile"
                >
                  <img
                    alt="account"
                    src={AccountImage}
                    className="w-[16px] me-2 ms-1"
                  />
                  Account
                </Link>
                <Link
                  className={`w-full text-left my-1.5 font-[Inter] text-xs font-medium rounded-[15px] px-3 py-2.5 flex items-center text-black hover:bg-white`}
                  to="/support"
                >
                  <img
                    alt="Support"
                    src={HelpImage}
                    className="w-[16px] me-2 ms-1"
                  />
                  Support
                </Link>
                {(location.pathname.indexOf("campaign") > -1 ||
                  location.pathname.indexOf("detail") > -1 ||
                  location.pathname.indexOf("profile") > -1 ||
                  location.pathname.indexOf("support") > -1) && (
                  <div
                    className={`absolute h-[22%] bg-white w-full rounded-[15px] shadow-sm -z-[1] transition-all duration-500 transform ${getOffsetBack()} `}
                  />
                )}
              </div>
            </div>
            <div className="relative mt-4 text-left">
              <div className="bg-main px-[19px] py-[12px] rounded-t-[14px] w-full z-10">
                <p className="text-black text-base font-semibold font-[Inter]">
                  Resources
                </p>
                <p className="text-[#505050] font-[Inter] font-semibold text-[10px] 2xl:text-xs mt-[5px]">
                  We are always here for you
                </p>
              </div>
              <div className="bg-white py-2 rounded-b-[14px] w-full z-0 top-[70px] shadow-md">
                <a
                  href="https://blog.presspool.ai"
                  className="flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2"
                  rel="noreferrer"
                  target="_blank"
                >
                  <img src={LinkImage} alt="link" className="w-[17px] me-2" />
                  Blog
                </a>
                <a
                  target="_blank"
                  href="mailto:support@presspool.ai"
                  rel="noreferrer"
                  className="flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2"
                >
                  <img src={LinkImage} alt="link" className="w-[17px] me-2" />
                  Support
                </a>
              </div>
            </div>
          </div>
          <button
            className="font-[Inter] font-medium text-sm flex items-center"
            onClick={() => handleLogout()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              className="w-[26px] h-[22px] me-2 -ms-1"
            >
              <path d="M224.615-160Q197-160 178.5-178.5 160-197 160-224.615v-510.77Q160-763 178.5-781.5 197-800 224.615-800h256.154v40H224.615q-9.23 0-16.923 7.692Q200-744.615 200-735.385v510.77q0 9.23 7.692 16.923Q215.385-200 224.615-200h256.154v40H224.615Zm433.846-178.461-28.077-28.77L723.154-460H367.692v-40h355.462l-92.77-92.769 28.077-28.77L800-480 658.461-338.461Z" />
            </svg>
            Log Out
          </button>
        </div>
        {loading && <Loading />}
        <div className="col-span-4 pt-12 pr-12 overflow-y-auto bg-[#EDECF2]">
          {!loading && (
            <Routes>
              <Route path="/campaign/:id" element={<Dashboard />} />
              <Route path="/new/*" element={<CreateCampaign />} />
              <Route path="/edit/*" element={<CreateCampaign />} />
              <Route path="/raise-budget/:id" element={<RaiseBudget />} />
              <Route path="/detail" element={<Detail />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/support" element={<Support />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          )}
        </div>
      </div>

      <AddTeammate
        show={showAddTeamModal}
        setShow={() => setShowAddTeamModal(false)}
      />
    </div>
  );
};

export default MainContent;
