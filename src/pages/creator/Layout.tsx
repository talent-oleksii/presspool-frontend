import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Feedback from "../../containers/layout/Feedback";

import Logo from "../../assets/logo/logo.png";
import Mark from "../../assets/logo/logo.png";
import { Space } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import GridIcon from "../../icons/Grid";
import CampaignIcon from "../../icons/Campaign";
import AccountInfoIcon from "../../icons/AccountInfo";
import SupportIcon from "../../icons/Support";
import ActionLinkCard from "../../components/ActionLinkCard";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/authSlice";

const CreatorLayout = (props: React.PropsWithChildren) => {
  const location = useLocation();
  const navigator = useNavigate();
  const { creatorData } = useSelector(selectAuth);
  const { email_verified } = creatorData;

  const handleLogout = () => {
    localStorage.clear();
    navigator("/creator/login");
  };

  const links = [
    {
      name: "Join Slack",
      url: "https://join.slack.com/t/presspoolsupport/shared_invite/zt-1ytywzzld-974gUfTB8zCYlP4~f5XT1Q",
    },
    { name: "Training Hub", url: "https://blog.presspool.ai" },
  ];

  return (
    <div className="min-h-full w-full h-full">
      {!!!email_verified ? (
        <div>Your email is not verified yet, please verify your email</div>
      ) : (
        <>
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
                  <NavLink
                    to="/creator/campaign"
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
                    to="/creator/reporting/all"
                    className={` w-full text-left font-[Inter] rounded-[10px] text-xs  pl-4 py-3 pr-4 font-400 flex items-center text-primary hover:bg-white ${
                      location.pathname.startsWith("/creator/reporting/")
                        ? "bg-white shadow-md"
                        : ""
                    }`}
                  >
                    <Space size="middle">
                      <GridIcon />
                      Reporting
                    </Space>
                  </NavLink>
                  <NavLink
                    to="/creator/billing"
                    className={({ isActive }) =>
                      ` w-full text-left font-[Inter] rounded-[10px] text-xs pl-4 py-3 pr-4 font-400 flex items-center text-primary hover:bg-white ${
                        isActive ? "bg-white shadow-md" : ""
                      }`
                    }
                  >
                    <Space size="middle">
                      <AccountInfoIcon />
                      Billing
                    </Space>
                  </NavLink>
                  <NavLink
                    to="/creator/support"
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
                  <LogoutOutlined
                    style={{ fontSize: "22px", paddingTop: "4px" }}
                  />
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
            <div className="col-span-4 pt-1 md:pt-2.5 pb-4 md:pr-8 md:pl-2 overflow-y-auto bg-[#EDECF2]">
              {props?.children}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreatorLayout;
