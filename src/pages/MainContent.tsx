import { FC, useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setUnauthenticated,
  selectAuth,
  setAuthenticated,
  setUserData,
} from "../store/authSlice";
import { setCardList } from "../store/dataSlice";
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
import { LogoutOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Space } from "antd";

import "./style.scss";
import CampaignIcon from "../icons/Campaign";
import AccountInfoIcon from "../icons/AccountInfo";
import SupportIcon from "../icons/Support";
import GridIcon from "../icons/Grid";
import Feedback from "../containers/layout/Feedback";
import Mark from "../assets/logo/logo.png";
import QuickGuide from "./QuickGuide";

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
              createTime: ret[0]["createdTime"],
              domain : ret[0]["fields"]["Domain"],
            })
          );

          APIInstance.get("stripe/card", {
            params: { email: ret[0]["fields"]["Email"] },
          })
            .then((res) => {
              dispatch(setCardList({ cardList: res.data }));
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

  if (email_verified === "false") {
    return <div>Your email is not verified yet, please verify your email</div>;
  }

  const links = [
    {
      name: "Slack Support",
      url: "https://join.slack.com/t/presspoolsupport/shared_invite/zt-1ytywzzld-974gUfTB8zCYlP4~f5XT1Q",
    },
    { name: "Blog", url: "https://blog.presspool.ai" },
    { name: "Quick Guide", url: "https://go.presspool.ai/guide" },
  ];

  return (
    <div className="min-h-full w-full h-full">
      <div className="w-full z-[7] pt-2.5 pl-2.5 pr-8 xsm:hidden">
        <div className="flex bg-[#fffdfd] rounded-[10px] items-center pl-2.5 pr-2.5 h-[40px] w-full justify-between">
          <div className="flex items-center justify-center px-2 border-r-2 border-grey-100 border-solid">
            <Link to="/" className="text-left w-full ">
              <img src={Logo} className="h-5" alt="logo" />
            </Link>
          </div>
          <Feedback />
        </div>
      </div>
      <div className="flex xsm:flex-col md:grid md:grid-cols-[206px_repeat(4,1fr)] gap-4 h-full md:h-calc-vh xsm:px-9 xsm:py-8">
        <div className="col-span-1 pt-3 pb-3 pl-2.5 flex flex-col justify-between xsm:hidden">
          <div>
            <div className="flex flex-col gap-3.5 items-center justify-center">
              <Link
                to="/new"
                className={`text-xs font-[Inter] flex shadow-md items-center font-semibold text-left pl-4 py-4 pr-4 w-full bg-main rounded-[10px] text-primary ${
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
                className={` w-full text-left font-[Inter] rounded-[10px] text-xs  pl-4 py-3 pr-4 font-400 flex items-center text-primary hover:bg-white ${
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
                  ` w-full text-left font-[Inter] rounded-[10px] text-xs pl-4 py-3 pr-4 font-400 flex items-center text-primary hover:bg-white ${
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
                  ` w-full text-left font-[Inter] rounded-[10px] text-xs pl-4 py-3 pr-4 font-400 flex items-center text-primary hover:bg-white ${
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
                  ` w-full text-left font-[Inter] rounded-[10px] text-xs pl-4 py-3 pr-4 font-400 flex items-center text-primary hover:bg-white ${
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
        <div className="flex justify-between gap-4 md:hidden">
          <div className="flex items-center gap-1.5 md:hidden">
            <img src={Mark} alt="mark" className="w-[24px]" />
            <h3 className="font-[Inter] text-primary text-[16px] md:text-[22px] font-medium -tracking-[1.02px]">
              presspool.ai
            </h3>
          </div>
          <svg
            width="24"
            height="18"
            viewBox="0 0 24 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1H22.3333M1 9H22.3333M1 17H22.3333"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {loading && <Loading />}
        <div className="col-span-4 pt-1 md:pt-2.5 pb-4 md:pr-8 md:pl-2 overflow-y-auto bg-[#EDECF2]">
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
              <Route path="/guide" element={<QuickGuide />} />
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
