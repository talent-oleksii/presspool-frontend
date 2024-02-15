import { FC, useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MenuProps } from "antd";
import {
  setUnauthenticated,
  selectAuth,
  setAuthenticated,
  setUserData,
} from "../store/authSlice";
import { setCampaign, setClicked, setCardList } from "../store/dataSlice";
import CreateCampaign from "./dashboard/CreateCampaign";
import Dashboard from "./dashboard";
import Billing from "./billing";
import Support from "./support";
import Detail from "./campaign";
import Profile from "./Profile";
import Logo from "../assets/logo/logo.png";
import APIInstance from "../api";
import Loading from "../components/Loading";
import AddTeammate from "./AddTeammate";
import RaiseBudget from "./campaign/RaiseBudget";
import ActionLinkCard from "../components/ActionLinkCard";
import {
  LogoutOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Space } from "antd";

import "./style.scss";
import CampaignIcon from "../icons/Campaign";
import AccountInfoIcon from "../icons/AccountInfo";
import SupportIcon from "../icons/Support";
import GridIcon from "../icons/Grid";
import Feedback from "../containers/layout/Feedback";

const MainContent: FC = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { email, email_verified } = useSelector(selectAuth);
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
            .finally(() => setLoading(false));
        }
      })
      .catch(() => {
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

  if (email_verified === "false") {
    return <div>Your email is not verified yet, please verify your email</div>;
  }

  const links = [
    {
      name: "Slack Support",
      url: "https://join.slack.com/t/presspoolsupport/shared_invite/zt-1ytywzzld-974gUfTB8zCYlP4~f5XT1Q",
    },
    { name: "Blog", url: "https://blog.presspool.ai" },
    { name: "Support", url: "mailto:support@presspool.ai" },
  ];

  return (
    <div className="min-h-full w-full h-full">
      <div className="w-full z-[7] pt-2.5 pl-2.5 pr-8">
        <div className="flex bg-[#fffdfd] rounded-[15px] items-center pl-2.5 pr-2.5 h-[40px] w-full justify-between">
          <div className="flex items-center justify-center px-2 border-r-2 border-grey-100 border-solid">
            <Link to="/" className="text-left w-full ">
              <img src={Logo} className="h-5" alt="logo" />
            </Link>
            {/* <button
              className="ms-2 font-[Inter] -tracking-[.6px] text-xs whitespace-nowrap rounded-full bg-black text-white px-2 py-[2px]"
              onClick={handleReload}
            >
              Reload Data
            </button> */}
          </div>

          <Feedback />
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
      <div className="grid grid-cols-[206px_repeat(4,1fr)] gap-4 h-calc-vh">
        <div className="col-span-1 pt-3 pb-3 pl-2.5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col gap-3.5 items-center justify-center">
              <Link
                to="/new"
                className={`text-xs font-[Inter] flex shadow-md items-center font-semibold text-left pl-4 py-4 pr-4 w-full bg-main rounded-[15px] text-black ${
                  location.pathname.indexOf("new") > -1
                    ? "ring-black ring-[2px]"
                    : "ring-0"
                }`}
              >
                <Space size="middle">
                  <PlusCircleOutlined
                    style={{ fontSize: "18px", paddingTop: "2px" }}
                  />
                  Create New Campaign
                </Space>
              </Link>
              <NavLink
                to="/campaign/all"
                className={` w-full text-left font-[Inter] rounded-[15px] text-xs  pl-4 py-3 pr-4 font-400 flex items-center text-black hover:bg-white ${
                  location.pathname.startsWith("/campaign/")
                    ? "bg-white shadow-md"
                    : ""
                }`}
              >
                <Space size="middle">
                  <GridIcon />
                  Dashboard
                </Space>
              </NavLink>
              <NavLink
                to="/detail"
                className={({ isActive }) =>
                  ` w-full text-left font-[Inter] rounded-[15px] text-xs pl-4 py-3 pr-4 font-400 flex items-center text-black hover:bg-white ${
                    isActive ? "bg-white shadow-md" : ""
                  }`
                }
              >
                <Space size="middle">
                  <CampaignIcon />
                  Campaigns
                </Space>
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  ` w-full text-left font-[Inter] rounded-[15px] text-xs pl-4 py-3 pr-4 font-400 flex items-center text-black hover:bg-white ${
                    isActive ? "bg-white shadow-md" : ""
                  }`
                }
              >
                <Space size="middle">
                  <AccountInfoIcon />
                  Account
                </Space>
              </NavLink>
              <NavLink
                to="/support"
                className={({ isActive }) =>
                  ` w-full text-left font-[Inter] rounded-[15px] text-xs pl-4 py-3 pr-4 font-400 flex items-center text-black hover:bg-white ${
                    isActive ? "bg-white shadow-md" : ""
                  }`
                }
              >
                <Space size="middle">
                  <SupportIcon />
                  Support
                </Space>
              </NavLink>
            </div>
            <ActionLinkCard
              heading={"Resources"}
              subHeading={"We are always here for you"}
              links={links}
            />
          </div>
          <button
            className="flex font-[Inter] font-medium text-[15px] items-center"
            onClick={() => handleLogout()}
          >
            <Space size="middle">
              <LogoutOutlined style={{ fontSize: "22px", paddingTop: "4px" }} />
              Log Out
            </Space>
          </button>
        </div>
        {loading && <Loading />}
        <div className="col-span-4 pt-2.5 pb-4 pr-8 pl-2 overflow-y-auto bg-[#EDECF2]">
          {!loading && (
            <Routes>
              <Route path="/campaign/:id" element={<Dashboard />} />
              <Route path="/new" element={<CreateCampaign />} />
              <Route path="/edit/:id" element={<CreateCampaign />} />
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
