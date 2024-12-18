import { FC, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, Table } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import { MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS } from "../utils/TransitionConstants";

import AddTeammate from "./AddTeammate";
import StripeUtil from "../utils/stripe";
import { selectAuth, setAvatar } from "../store/authSlice";
import { selectData, setCardList } from "../store/dataSlice";
import APIInstance from "../api";
import Loading from "../components/Loading";
import DialogUtils from "../utils/DialogUtils";
import Column from "antd/es/table/Column";
import { AddCard } from "../containers/addCard";

const Profile: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const companyfileInputRef = useRef<HTMLInputElement>(null);
  const { fullName, email, company, createTime, domain } =
    useSelector(selectAuth);
  const { campaign, cardList } = useSelector(selectData);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [companyImage, setCompanyImage] = useState<any>(null);
  const [teamData, setTeamData] = useState<Array<any>>([]);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [fileData, setFileData] = useState<Array<any>>([]);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    APIInstance.get("data/profile", { params: { email } })
      .then((data) => {
        setImage(data.data.profile.avatar);
        setCompanyImage(data.data.profile.team_avatar);
        setTeamData(data.data.teamData);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const temp: Array<any> = [];
    campaign.forEach((item: any, index: number) => {
      if (item.additional_files) {
        const files = item.additional_files.split(",");
        files.forEach(async (fileName: string, fileIndex: number) => {
          const parts = fileName.split("/");
          // const fetchData = await fetch(fileName);
          temp.push({
            key: index * campaign.length + fileIndex,
            name: parts[parts.length - 1],
            date: moment(Number(item.create_time)).format("MM/DD/YYYY HH:MM"),
            // size: Number(fetchData) / 1024 / 1024,
            fullUrl: fileName,
            campaignName: item.name,
          });
        });
      }
    });
    setFileData(temp);
  }, [campaign]);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("avatar", file);
      APIInstance.put("data/profile", formData)
        .then((data) => {
          // here comes the data, you can use it.
          dispatch(setAvatar({ avatar: data.data.avatar }));
          DialogUtils.show(
            "success",
            "",
            "Your profile has successfully updated!"
          );
        })
        .finally(() => setLoading(false));
    }
  };

  const handleCompanyFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyImage(reader.result);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("team_avatar", file);
      APIInstance.put("data/profile", formData)
        .then((data) => {
          // here comes the data, you can use it.
          dispatch(setAvatar({ avatar: data.data.avatar }));
          DialogUtils.show(
            "success",
            "",
            "Your company logo successfully updated!"
          );
        })
        .finally(() => setLoading(false));
    }
  };

  // const handlePublish = () => {
  //   setLoading(true);
  //   if (!file) return;
  //   const formData = new FormData();
  //   formData.append("email", email);
  //   formData.append("avatar", file);
  //   APIInstance.put("data/profile", formData)
  //     .then((data) => {
  //       // here comes the data, you can use it.
  //       dispatch(setAvatar({ avatar: data.data.avatar }));
  //       DialogUtils.show(
  //         "success",
  //         "",
  //         "Your profile has successfully updated!"
  //       );
  //     })
  //     .finally(() => setLoading(false));
  // };

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

  // const handleManagePayment = async () => {
  //   const customerId = await StripeUtil.getCustomerId(email);

  //   const session = await StripeUtil.stripe.billingPortal.sessions.create({
  //     customer: customerId,
  //     return_url: 'https://go.presspool.ai/profile',
  //   });

  //   window.location.href = session.url;
  //   // window.open(session.url, '_blank');
  // };

  const handleSaveTeam: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    setLoading(true);
    APIInstance.put("data/team-member", { teamData, owner: email })
      .then((data) => {
        DialogUtils.show("success", "", "Successfully Updated!");
      })
      .finally(() => setLoading(false));
  };

  const handleDownload = (url: string, fileName: string) => {
    const aElement = document.createElement("a");
    aElement.href = url;
    aElement.download = fileName;
    document.body.appendChild(aElement);
    aElement.click();
    document.body.removeChild(aElement);
  };

  const handleAddCard = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onAddCardSuccess = async (cards: Array<any>) => {
    dispatch(setCardList({ cardList: cards }));
    handleClose();
  };

  const handleRemoveCard = async (customerId: string, cardId: string) => {
    setLoading(true);
    const { data } = await StripeUtil.deleteCard(customerId, cardId);
    dispatch(
      setCardList({
        cardList: data.map((item) => ({
          create_time: item.created,
          card_id: item.id,
          last4: item.card?.last4,
          brand: item.card?.brand,
          customer_id: item.customer,
        })),
      })
    );
    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center justify-between pr-4 pt-1.5">
        <h1 className="font-semibold font-[Inter] text-xl 2xl:text-xl -tracking-[1.02px]">
          Account Details
        </h1>
      </div>
      <motion.div
        className="text-left flex flex-col"
        initial="hidden"
        animate="show"
        variants={MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS()}
      >
        {loading && <Loading />}

        <div className="mt-4 p-6 bg-white rounded-[10px] shadow-md">
          <div className="bg-white pb-7 flex flex-col-2 justify-between border-b-[1px] border-[#bcbcbc]">
            <div className="flex-1">
              <p className="text-primary text-lg font-medium -tracking-[.6px]">
                Personal
              </p>
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
                        {getPlaceHolder(fullName)}
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
                    {fullName}
                  </p>
                  <p className="font-[Inter] text-secondry1 text-sm font-normal -tracking-[.3px]">
                    {email}
                  </p>
                  <p className="font-[Inter] text-secondry2 text-sm font-normal -tracking-[.3px]">
                    {`Date Joined : ${moment(new Date(createTime)).format(
                      "DD MMM, YYYY"
                    )}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-primary text-lg font-medium -tracking-[.6px]">
                Company
              </p>
              <div className="items-center flex mt-4 gap-5">
                <div className="flex flex-col">
                  <button className="relative">
                    {companyImage ? (
                      <Avatar
                        src={companyImage}
                        className="z-[0] transition-all duration-150  hover:blur-[1.5px] w-[100px] h-[100px]"
                      />
                    ) : (
                      <div className="z-[0] transition-all duration-150 hover:blur-[1.5px] w-[100px] h-[100px] bg-main rounded-full flex items-center justify-center font-[Inter] text-3xl">
                        {getPlaceHolder(company)}
                      </div>
                    )}
                    <input
                      ref={companyfileInputRef}
                      type="file"
                      hidden
                      className="w-[75px] h-[75px]"
                      accept="image/*"
                      onChange={handleCompanyFileChange}
                    />
                  </button>
                  <button
                    className="text-[#0af] text-xs -tracking-[.36px] font-medium mt-4"
                    onClick={() => {
                      if (companyfileInputRef.current)
                        companyfileInputRef.current.click();
                    }}
                  >
                    Edit
                  </button>
                </div>
                <div className="text-left ms-2 flex flex-col gap-1">
                  <p className="font-[Inter] text-primary text-base font-semibold -tracking-[.36px] leading-[16px]">
                    {company}
                  </p>
                  <p className="font-[Inter] text-secondry1 text-sm font-normal -tracking-[.3px]">
                    {domain}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 mt-7">
            <h4 className="text-base font-[Inter] font-medium text-primary mt-3 -tracking-[.48px]">
              Payment Methods
            </h4>
            <div className="mt-2">
              {cardList.map((item, index) => (
                <div key={index}>
                  {/* <div className='flex justify-between w-full'>
                      <p className='font-[Inter] text-[#7f8182] text-xs -tracking-[.42px]'>{`Added Date: ${moment.unix(Number(item.create_time)).format('DD MMM, yyyy')}`}</p>
                    </div> */}
                  <div className="bg-[#fbfbfb] w-[424px] text-base text-primary border-[1px] border-[rgba(127, 129, 130, 0.13)] rounded-[10px] p-3 my-1.5 flex justify-between">
                    {`${item.brand.toUpperCase()} **** **** **** ${item.last4}`}
                    <div
                      role="button"
                      className="text-secondry2 cursor-pointer"
                      onClick={() =>
                        handleRemoveCard(item.customer_id, item.card_id)
                      }
                    >
                      Remove
                    </div>
                  </div>
                </div>
              ))}
              {cardList.length <= 0 && (
                <div>
                  <p className="text-xs font-[Inter] font-medium text-primary mt-8 -tracking-[.48px]">
                    My Card
                  </p>
                </div>
              )}
            </div>
            <div className="flex my-4">
              <button
                className="font-[Inter] text-secondry2 text-xs flex items-center -tracking-[.45px] font-medium border-[1px] border-[#7f8182] rounded-[10px] px-8 py-2"
                onClick={handleAddCard}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="me-2"
                >
                  <path
                    d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z"
                    stroke="#7F8182"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add New Card
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <h4 className="font-[Inter] text-primary text-base font-medium -tracking-[.6px]">
              Files
            </h4>
            <button className="font-[Inter] font-medium -tracking-[.45px] text-xs flex items-center text-white bg-black rounded-[10px] px-4 py-2 gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Upload
            </button>
          </div>
          <div className="border-b-[1px] border-[#bcbcbc] py-4">
            <Table className="file-table" dataSource={fileData}>
              <Column
                title="Name"
                key="name"
                className="!text-xs !text-secondry1"
                render={(_: any, record: any) => (
                  <>
                    <span className="!text-xs !font-normal !text-secondry2">{record.name}</span>
                  </>
                )}
              />
              <Column
                title="Campaign Name"
                key="campaign name"
                className="!text-xs !text-secondry1"
                render={(_: any, record: any) => (
                  <>
                    <span className="!text-xs !font-normal !text-secondry2">{record.campaignName}</span>
                  </>
                )}
              />
              <Column
                title="Date Added"
                key="date"
                className="!text-xs !text-secondry1"
                render={(_: any, record: any) => (
                  <>
                    <span className="!text-xs !font-normal !text-secondry2">{record.date}</span>
                  </>
                )}
              />
              <Column
                title={" "}
                key="action"
                render={(_: any, record: any) => (
                  <>
                    <button
                      className="text-xs font-bold -tracking-[.45px] text-secondry2"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(record.fullUrl, record.name);
                      }}
                    >
                      VIEW
                    </button>
                    {/* <button className='text-xs font-bold -tracking-[.45px] text-[#7f8182] ms-2'>DELETE</button> */}
                  </>
                )}
              />
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <h4 className="font-[Inter] text-primary text-base font-medium -tracking-[.6px]">
              Users
            </h4>
            <button
              className="font-[Inter] font-medium -tracking-[.45px] text-xs flex items-center text-white bg-black rounded-[10px] px-4 py-2 gap-4"
              onClick={() => setShowAddTeamModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Add New User
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {teamData.map((item) => (
              <div
                className="col-span-1 rounded-[10px] bg-white border-[1px] border-[#7f8182] shadow-md p-4"
                key={item.id}
              >
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <Avatar
                      className="bg-main text-primary items-center justify-center flex"
                      src={item.avatar}
                      alt={getPlaceHolder(item.name)}
                      size={53}
                    >
                      {(!item.avatar || item.avatar.length <= 3) && (
                        <span className="text-xs font-[Inter] font-medium">
                          {getPlaceHolder(item.name)}
                        </span>
                      )}
                    </Avatar>
                    <div className="text-left ms-2 flex flex-col gap-1 justify-between">
                      <div>
                        <p className="font-[Inter] text-secondry1 text-sm font-medium -tracking-[.36px] leading-[14px]">
                          {item.name}
                        </p>
                        <p className="font-[Inter] text-secondry1 text-xs font-normal -tracking-[.3px]">
                          {item.manager}
                        </p>
                      </div>
                      <p className="font-[Inter] text-secondry2 text-[10px] font-normal -tracking-[.3px]">
                        {`Joined : ${moment(
                          new Date((item.create_time / 1000) * 1000)
                        ).format("MM/DD/YYYY")}`}
                      </p>
                    </div>
                  </div>
                  <button
                    className="flex text-sm font-medium text-white p-5 bg-[#FF4D42] h-[24px] rounded-[10px] font-[Inter] items-center justify-center"
                    onClick={() =>
                      setTeamData(
                        teamData.filter((team) => team.id !== item.id)
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 8 9"
                      fill="none"
                      className="me-1"
                    >
                      <path
                        d="M7.02844 1.7009C7.13382 1.70102 7.23518 1.74252 7.31181 1.81692C7.38844 1.89132 7.43455 1.99301 7.44073 2.10121C7.44691 2.2094 7.41268 2.31594 7.34504 2.39905C7.2774 2.48216 7.18146 2.53557 7.07681 2.54837L7.02844 2.55135H6.99495L6.61497 7.22883C6.61499 7.55422 6.49411 7.86731 6.27705 8.10405C6.06 8.34079 5.76319 8.48329 5.44735 8.50238L5.37458 8.5045H2.06686C1.40615 8.5045 0.866163 7.9734 0.829778 7.33513L0.827711 7.26412L0.446083 2.55135H0.413006C0.307623 2.55123 0.206261 2.50973 0.129631 2.43533C0.0530011 2.36093 0.00688714 2.25924 0.000711173 2.15105C-0.00546479 2.04285 0.0287634 1.93631 0.0964021 1.8532C0.164041 1.77009 0.259985 1.71668 0.364631 1.70388L0.413006 1.7009H7.02844ZM3.10507 3.88656C3.01844 3.83352 2.91596 3.81487 2.81689 3.8341C2.71783 3.85333 2.629 3.90912 2.56713 3.99099C2.50526 4.07285 2.47461 4.17514 2.48093 4.27862C2.48726 4.3821 2.53012 4.47963 2.60147 4.55289L3.13567 5.1027L2.60147 5.65252L2.56716 5.69249C2.5029 5.77796 2.47268 5.88537 2.48264 5.99292C2.49261 6.10047 2.542 6.20009 2.62079 6.27154C2.69958 6.34299 2.80187 6.38092 2.90686 6.37762C3.01186 6.37433 3.11171 6.33005 3.18611 6.25379L3.72072 5.7044L4.25533 6.25379L4.2942 6.28908C4.3773 6.35517 4.48174 6.38624 4.58632 6.376C4.69089 6.36575 4.78776 6.31495 4.85723 6.23392C4.92671 6.15289 4.96359 6.04769 4.96038 5.93971C4.95717 5.83172 4.91412 5.72904 4.83997 5.65252L4.30577 5.1027L4.83997 4.55289L4.87429 4.51292C4.93854 4.42745 4.96876 4.32003 4.9588 4.21248C4.94884 4.10493 4.89944 4.00532 4.82065 3.93386C4.74186 3.86241 4.63958 3.82448 4.53458 3.82778C4.42958 3.83108 4.32974 3.87535 4.25533 3.95162L3.72072 4.50101L3.18611 3.95162L3.14725 3.91632L3.10507 3.88656Z"
                        fill="white"
                      />
                      <path
                        d="M4.5473 0C4.76662 0 4.97695 0.0896007 5.13203 0.249091C5.28711 0.408581 5.37423 0.624897 5.37423 0.85045C5.37411 0.958832 5.33376 1.06308 5.26142 1.14189C5.18907 1.2207 5.0902 1.26812 4.985 1.27447C4.87979 1.28082 4.7762 1.24562 4.69539 1.17606C4.61458 1.1065 4.56264 1.00782 4.55019 0.900202L4.5473 0.85045H2.89344L2.89055 0.900202C2.8781 1.00782 2.82617 1.1065 2.74535 1.17606C2.66454 1.24562 2.56095 1.28082 2.45575 1.27447C2.35054 1.26812 2.25167 1.2207 2.17933 1.14189C2.10698 1.06308 2.06663 0.958832 2.06651 0.85045C2.06645 0.635892 2.14524 0.429237 2.2871 0.271911C2.42895 0.114586 2.62339 0.0182181 2.83142 0.00212617L2.89344 0H4.5473Z"
                        fill="white"
                      />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-10 font-[Inter] text-sm font-semibold flex items-center px-8 py-2 bg-main rounded-[10px]"
            onClick={handleSaveTeam}
          >
            Save
          </button>
        </div>
      </motion.div>
      <AddTeammate
        show={showAddTeamModal}
        setShow={() => setShowAddTeamModal(false)}
      />
      {open ? (
        <AddCard
          open={open}
          onClose={handleClose}
          onSuccess={onAddCardSuccess}
        />
      ) : null}
    </>
  );
};

export default Profile;
