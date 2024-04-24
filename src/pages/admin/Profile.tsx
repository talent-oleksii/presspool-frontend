import { FC, useState, useRef, useEffect } from "react";
import { Select, Avatar, Button } from "antd";
import { useSelector } from "react-redux";

import { selectAuth } from "../../store/authSlice";
import AdminAPIInstance from "../../api/adminApi";
import DialogUtils from "../../utils/DialogUtils";
import Loading from "../../components/Loading";
import StripeUtil from "../../utils/stripe";
import moment from "moment";

const Profile: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [image, setImage] = useState<any>(null);
  const { adminName, adminEmail, adminRole, adminCreateTime } =
    useSelector(selectAuth);
  const [accountManagers, setAccountManagers] = useState<Array<any>>([]);

  const [connected, setConnected] = useState(false);
  const [payoutEnabled, setPayoutEnabled] = useState(false);
  const [chargeEnabled, setChargeEnabled] = useState(false);

  const [text, setText] = useState('Connected');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      AdminAPIInstance.get("/user/account-manager"),
      checkIfAccountConnected(),
    ])
      .then((results: Array<any>) => {
        setAccountManagers(results[0].data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const getPlaceHolder = (name: string) => {
    if (!name) return "";
    const names = name.split(" ");
    if (names.length === 2) {
      return `${names[0].at(0)}${names[1].at(0)}`;
    } else if (names.length === 1) {
      return `${names[0].at(0)}`;
    } else {
      return "";
    }
  };

  const handleSaveTeam: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    // setLoading(true);
    AdminAPIInstance.put("/users", { data: accountManagers })
      .then((data) => {
        DialogUtils.show("success", "", "Successfully Updated!");
      })
      .finally(() => setLoading(false));
  };

  const handleConnectPaymentMethod = async () => {
    // create account for this account manager:
    setStripeLoading(true);
    const account = await StripeUtil.stripe.accounts.create({
      type: "standard",
      metadata: {
        work_email: adminEmail,
      },
    });
    const accountLink = await StripeUtil.stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://go.presspool.ai/admin/profile",
      return_url: "https://go.presspool.ai/admin/profile",
      type: "account_onboarding",
    });

    setStripeLoading(false);
    window.open(accountLink.url, "_self");
  };

  const checkIfAccountConnected = async () => {
    const accounts = await StripeUtil.stripe.accounts.list({ limit: 1000 });
    for (const account of accounts.data) {
      console.log('email:', account.metadata?.work_email);

      if (account.metadata?.work_email === adminEmail) {
        setConnected(true);
        setPayoutEnabled(account.payouts_enabled)
        setChargeEnabled(account.charges_enabled);

        return;
      }
    }
  };

  const handleHover = () => {
    setText('Go to Your Dashboard');
  };

  const handleLeave = () => {
    setText('Connected');
  };

  return (
    <div className="text-left">
      {loading && <Loading />}
      <div className="flex items-center justify-between pr-4">
        <h1 className="font-semibold font-[Inter] text-xl 2xl:text-xl -tracking-[1.02px]">
          Account
        </h1>
        {/* <button className='rounded-[10px] text-primary bg-main font-[Inter] text-xs px-4 py-1' onClick={handlePublish}>Publish</button> */}
      </div>
      <div className="mt-4 bg-white flex flex-col-2 justify-between p-6 rounded-[10px]">
        <div className="flex-1">
          <div className="items-center flex mt-4 gap-5">
            <div className="flex flex-col">
              <button className="relative">
                {image ? (
                  <Avatar
                    src={image}
                    className="z-[0] transition-all duration-150  hover:blur-[1.5px] w-[100px] h-[100px]"
                  />
                ) : (
                  <div className="z-[0] transition-all duration-150 hover:blur-[1.5px] w-[100px] h-[100px] bg-main rounded-full flex items-center justify-center font-[Inter] text-3xl">
                    {getPlaceHolder(adminName)}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  className="w-[75px] h-[75px]"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </button>
              <button
                className="text-[#0af] text-xs -tracking-[.36px] font-medium mt-4"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
              >
                Edit
              </button>
            </div>
            <div className="text-left ms-2 flex flex-col gap-1">
              <p className="font-[Inter] text-primary text-base font-semibold -tracking-[.36px] leading-[16px]">
                {adminName}
              </p>
              <p className="font-[Inter] text-secondry1 text-sm font-normal -tracking-[.3px]">
                {adminEmail}
              </p>
              <p className="font-[Inter] text-secondry2 text-sm font-normal -tracking-[.3px]">
                {`Date Joined : ${moment(
                  new Date((adminCreateTime / 1000) * 1000)
                ).format("DD MMM, YYYY")}`}
              </p>
            </div>
          </div>
        </div>
        {adminRole === "account_manager" && (
          <div className="flex-1">
            <div className="flex flex-col mt-4 gap-1">
              <p className="text-sm font-medium">Payment Account</p>
              <div className="mt-1">
                {!chargeEnabled ?
                  <Button
                    className="w-[206px] p-2 rounded-[10px] shadow-md text-white -tracking-[.42px] font-medium text-sm bg-[#6c63ff] flex items-center"
                    onClick={handleConnectPaymentMethod}
                    loading={stripeLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      className="me-2"
                    >
                      <path
                        d="M6 8.5H11M8.5 6V11M1 8.5C1 9.48491 1.19399 10.4602 1.5709 11.3701C1.94781 12.2801 2.50026 13.1069 3.1967 13.8033C3.89314 14.4997 4.71993 15.0522 5.62987 15.4291C6.53982 15.806 7.51509 16 8.5 16C9.48491 16 10.4602 15.806 11.3701 15.4291C12.2801 15.0522 13.1069 14.4997 13.8033 13.8033C14.4997 13.1069 15.0522 12.2801 15.4291 11.3701C15.806 10.4602 16 9.48491 16 8.5C16 6.51088 15.2098 4.60322 13.8033 3.1967C12.3968 1.79018 10.4891 1 8.5 1C6.51088 1 4.60322 1.79018 3.1967 3.1967C1.79018 4.60322 1 6.51088 1 8.5Z"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Connect Payment Method
                  </Button> : <a
                    className="inline-flex py-2 px-4 rounded-[10px] shadow-md -tracking-[.42px] font-medium text-sm bg-[#7FFBAE] flex items-center"
                    href="https://dashboard.stripe.com"
                    target="_blank"
                    rel="noreferrer"
                    onMouseOver={handleHover}
                    onMouseLeave={handleLeave}
                  >
                    {text}
                  </a>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
