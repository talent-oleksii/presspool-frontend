import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  NavLink,
  useLocation,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Dropdown, MenuProps, Space } from "antd";
import {
  selectAuth,
  setAdminAuthenticated,
  setAdminToken,
  setAdminUserData,
} from "../../store/authSlice";
import Logo from "../../assets/logo/logo.png";
import AdminAPIInstance from "../../api/adminApi";
import Loading from "../../components/Loading";
import AdminDashboard from "./Dashboard";
import AdminMember from "./Member";
import AdminCampaign from "./Campaign";
import AdminBilling from "./Billing";
import AdminSupport from "./Support";
import AdminProfile from "./Profile";
import ClientImage from "../../assets/icon/account.png";
import TeamImage from "../../assets/icon/team.png";
import InviteNewClient from "./ui/InviteNewClient";
import AdminDashboardClient from "./dashboard/Client";
import AdminClient from "./Client";
import AdminClientCampaign from "./ClientCampaign";
import InviteAccountManager from "./ui/InviteAccountManager";
import TrainingHub from "./TrainingHub";
import ActionLinkCard from "../../components/ActionLinkCard";
import SupportIcon from "../../icons/Support";
import { LogoutOutlined, PlusCircleOutlined } from "@ant-design/icons";
import GridIcon from "../../icons/Grid";
import AccountInfoIcon from "../../icons/AccountInfo";

const Admin = (props: React.PropsWithChildren) => {
  const location = useLocation();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { isAdminAuthenticated, adminToken, adminRole } =
    useSelector(selectAuth);

  const [loading, setLoading] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showInviteAM, setShowInviteAM] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated) navigator("/admin/login");
    else {
      setLoading(true);
      AdminAPIInstance.post("auth/check", { token: adminToken })
        .then((data) => {
          dispatch(setAdminAuthenticated({ state: true }));
          dispatch(setAdminToken({ token: data.data.token }));
          dispatch(
            setAdminUserData({
              userName: data.data.name,
              email: data.data.email,
              role: data.data.role,
              id: data.data.id,
              link: data.data.link,
              adminCreateTime: data.data.create_time,
            })
          );
          if (!location.pathname.includes("/admin/"))
            navigator("/admin/dashboard");
        })
        .catch(() => {
          setAdminAuthenticated({ state: false });
          navigator("/admin/login");
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminAuthenticated]);

  const { adminLink } = useSelector(selectAuth);

  const handleLogout = () => {
    localStorage.clear();
    navigator("/admin/login");
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            className="w-[18px] h-[18px] -ms-1 me-2"
          >
            <path d="M160-160v-100.769l527.231-527.77q6.146-5.481 13.573-8.471 7.427-2.99 15.486-2.99 8.06 0 15.616 2.538 7.556 2.539 13.94 9.154l42.693 42.923q6.615 6.385 9.038 14.008Q800-723.754 800-716.131q0 8.131-2.741 15.558-2.74 7.427-8.72 13.573l-527.77 527H160Zm540.154-496.461L760-715.538 715.538-760l-59.077 59.846 43.693 43.693Z" />
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            className="w-[18px] h-[18px] -ms-1 me-2"
          >
            <path d="M240-140v-620h287.693l16 80H760v320H552.307l-16-80H280v300h-40Z" />
          </svg>
          Request a feature
        </a>
      ),
    },
  ];

  const links = [
    {
      name: "Presspool GPT",
      url: "https://content.presspool.ai",
    },
    { name: "Presspool CRM", url: "https://sales.presspool.ai" },
    { name: "Tracking Dashboard", url: "https://dash.presspool.ai" },
    { name: "Training Hub", url: "/admin/training-hub" },
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

          <div className="flex items-center relative">
            <Dropdown placement="bottomRight" menu={{ items: feedbackItems }}>
              <button className="flex font-[Inter] rounded-[10px] h-7 px-3 py-[3px] font-medium text-primary text-xs whitespace-nowrap items-center border border-solid border-main bg-[#05be751a] hover:bg-main hover:text-primary">
                <span role="img" aria-label="support">
                  <SupportIcon fontSize={18} />
                </span>
                <span className="font-[Inter] text-xs pl-1">Beta feedback</span>
              </button>
            </Dropdown>
            {/* <div className="ms-[44px]">
              <Dropdown
                placement="bottomRight"
                menu={{ items: profileItems }}
              >
                <button className="flex justify-center items-center border-none p-0 font-[Inter] text-[11px]">
                  <Avatar className="bg-main text-primary items-center justify-center flex" alt={getPlaceHolder()} size="small">
                    <span className="text-xs font-[Inter] font-medium">{getPlaceHolder()}</span>
                  </Avatar>

                  <span className="font-[Inter] text-xs font-medium ms-1">↓</span>
                </button>
              </Dropdown>
            </div> */}
          </div>
        </div>
      </div>
      <div className="flex xsm:flex-col md:grid md:grid-cols-[206px_repeat(4,1fr)] gap-4 h-full md:h-calc-vh xsm:px-9 xsm:py-8">
        <div className="col-span-1 pt-3 pb-3 pl-2.5 flex flex-col justify-between xsm:hidden">
          <div>
            <div className="flex flex-col gap-3.5 items-center justify-center">
              {adminRole === "super_admin" && (
                <button
                  className={`text-xs font-[Inter] flex shadow-md items-center font-semibold text-left pl-4 py-4 pr-4 w-full bg-main rounded-[10px] text-primary ring-0 ${
                    location.pathname.indexOf("new") > -1
                      ? "ring-black ring-[2px]"
                      : "ring-0"
                  }`}
                  onClick={() => setShowInviteAM(true)}
                >
                  <Space size="middle">
                    <PlusCircleOutlined
                      style={{ fontSize: "18px", paddingTop: "2px" }}
                    />
                    Add Account Manager
                  </Space>
                </button>
              )}
              {adminRole === "account_manager" && (
                <button
                  className={`text-xs font-[Inter] flex items-center font-semibold text-left py-[18px] px-[12px] w-full bg-main rounded-[10px] text-primary ${
                    location.pathname.indexOf("new") > -1
                      ? "ring-black ring-[1px]"
                      : "ring-0"
                  }`}
                  onClick={() => setShowInvite(true)}
                >
                  <Space size="middle">
                    <PlusCircleOutlined
                      style={{ fontSize: "18px", paddingTop: "2px" }}
                    />
                    Invite New Client
                  </Space>
                </button>
              )}
              <InviteNewClient
                show={showInvite}
                onClose={() => setShowInvite(false)}
                link={adminLink}
              />
              <InviteAccountManager
                show={showInviteAM}
                onClose={() => setShowInviteAM(false)}
              />
              <NavLink
                className={({ isActive }) =>
                  ` w-full text-left font-[Inter] rounded-[10px] text-xs pl-4 py-3 pr-4 font-500 flex items-center text-primary hover:bg-white ${
                    isActive ? "bg-white shadow-md" : ""
                  }`
                }
                to="/admin/dashboard"
              >
                <Space size="middle">
                  <GridIcon />
                  Dashboard
                </Space>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  ` w-full text-left font-[Inter] rounded-[10px] text-xs pl-4 py-3 pr-4 font-500 flex items-center text-primary hover:bg-white ${
                    isActive ? "bg-white shadow-md" : ""
                  }`
                }
                to="/admin/client"
              >
                <Space size="middle">
                  <img alt="Support" src={ClientImage} className="w-[16px]" />
                  Clients
                </Space>
              </NavLink>
              {adminRole === "super_admin" && (
                <NavLink
                  className={({ isActive }) =>
                    ` w-full text-left font-[Inter] rounded-[10px] text-xs pl-4 py-3 pr-4 font-500 flex items-center text-primary hover:bg-white ${
                      isActive ? "bg-white shadow-md" : ""
                    }`
                  }
                  to="/admin/member"
                >
                  <Space size="middle">
                    <img alt="Team" src={TeamImage} className="w-[16px]" />
                    My Team
                  </Space>
                </NavLink>
              )}
              <NavLink
                className={({ isActive }) =>
                  ` w-full text-left font-[Inter] rounded-[10px] text-xs pl-4 py-3 pr-4 font-500 flex items-center text-primary hover:bg-white ${
                    isActive ? "bg-white shadow-md" : ""
                  }`
                }
                to="/admin/profile"
              >
                <Space size="middle">
                  <AccountInfoIcon />
                  Account
                </Space>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  ` w-full text-left font-[Inter] rounded-[10px] text-xs pl-4 py-3 pr-4 font-500 flex items-center text-primary hover:bg-white ${
                    isActive ? "bg-white shadow-md" : ""
                  }`
                }
                to="/admin/support"
              >
                <Space size="middle">
                  <SupportIcon />
                  Support
                </Space>
              </NavLink>
            </div>
            <div className="relative mt-4 text-left">
              <ActionLinkCard
                heading={"Resources"}
                subHeading={"We are always here for you"}
                links={links}
              />
            </div>
          </div>
          <button
            className="font-[Inter] font-medium text-xs flex items-center"
            onClick={() => handleLogout()}
          >
            <Space size="middle">
              <LogoutOutlined style={{ fontSize: "22px", paddingTop: "4px" }} />
              Log Out
            </Space>
          </button>
        </div>
        {loading && <Loading />}
        <div className="col-span-4 pt-1 md:pt-2.5 pb-4 md:pr-8 md:pl-2 overflow-y-auto bg-[#EDECF2]">
          {!loading && props?.children}
        </div>
      </div>
    </div>
  );
};

export default Admin;
