import { FC, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Select, Avatar, Table } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import { FADE_UP_ANIMATION_VARIANTS } from '../utils/TransitionConstants';

import AddTeammate from './AddTeammate';
import StripeUtil from '../utils/stripe';
import { selectAuth, setAvatar } from '../store/authSlice';
import { selectData } from '../store/dataSlice';
import APIInstance from '../api';
import Loading from '../components/Loading';
import DialogUtils from '../utils/DialogUtils';
import Column from 'antd/es/table/Column';

const Profile: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fullName, email, company } = useSelector(selectAuth);
  const { campaign, cardList } = useSelector(selectData);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  const [date, setDate] = useState<any>(null);
  const [teamData, setTeamData] = useState<Array<any>>([]);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [fileData, setFileData] = useState<Array<any>>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    APIInstance.get('data/profile', { params: { email } }).then(data => {
      setImage(data.data.profile.avatar);
      setDate(moment(Number(data.data.profile.create_time)).format('DD MMM, yyyy'));
      setTeamData(data.data.teamData);
    }).catch(err => {
      console.log('error:', err);
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const temp: Array<any> = [];
    campaign.forEach((item: any, index: number) => {
      if (item.additional_files) {
        const files = item.additional_files.split(',');
        files.forEach(async (fileName: string, fileIndex: number) => {
          const parts = fileName.split('/');
          // const fetchData = await fetch(fileName);
          // console.log('dd:', fetchData.headers);

          temp.push({
            key: index * campaign.length + fileIndex,
            name: parts[parts.length - 1],
            date: moment(Number(item.create_time)).format('MM/DD/YYYY HH:MM'),
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
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    setLoading(true);
    if (!file) return;
    const formData = new FormData();
    formData.append('email', email);
    formData.append('avatar', file);
    APIInstance.put('data/profile', formData).then((data) => { // here comes the data, you can use it.
      dispatch(setAvatar({ avatar: data.data.avatar }));
      DialogUtils.show('success', '', 'Your profile has successfully updated!');
    }).catch(err => {
      console.log('error:', err);
    }).finally(() => setLoading(false));
  };

  const getPlaceHolder = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 2) {
      return `${names[0].at(0)}${names[1].at(0)}`;
    } else if (names.length === 1) {
      return `${names[0].at(0)}`;
    } else {
      return '';
    }
  };

  const handleManagePayment = async () => {
    const customerId = await StripeUtil.getCustomerId(email);

    const session = await StripeUtil.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'https://go.presspool.ai/profile',
    });

    window.location.href = session.url;
    // window.open(session.url, '_blank');
  };

  const handleSaveTeam: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    setLoading(true);
    APIInstance.put('data/team-member', { teamData, owner: email }).then(data => {
      DialogUtils.show('success', '', 'Successfully Updated!');
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
  };

  const handleDownload = (url: string, fileName: string) => {
    const aElement = document.createElement('a');
    aElement.href = url;
    aElement.download = fileName;
    document.body.appendChild(aElement);
    aElement.click();
    document.body.removeChild(aElement);
  };

  return (
    <motion.div
      className='text-left relative'
      initial="hidden"
      animate="show"
      variants={FADE_UP_ANIMATION_VARIANTS}
    >
      {loading && <Loading />}
      <div className='flex items-center justify-between pr-4'>
        <h1 className='font-semibold font-[Inter] text-[24px] 2xl:text-[30px] -tracking-[1.02px]'>Account Details</h1>
      </div>
      <div className='border-b-[1px] border-b-[#bcbcbc] bg-white p-4 rounded-[10px] mt-4'>
        <p className='text-black text-lg font-medium -tracking-[.6px]'>Personal</p>
        <div className='items-center flex mt-4 gap-12'>
          <div className='flex flex-col'>
            <button className='relative'>
              {image ?
                <Avatar
                  src={image}
                  className='z-[0] transition-all duration-150  hover:blur-[1.5px] w-[100px] h-[100px]'
                />
                : <div className='z-[0] transition-all duration-150 hover:blur-[1.5px] w-[75px] h-[75px] bg-[#7ffbae] rounded-full flex items-center justify-center font-[Inter] text-2xl'>
                  {getPlaceHolder(fullName)}
                </div>
              }
              {/* <span className='opacity-0 absolute p-[27px] top-1/2 left-1/2 hover:opacity-100 -translate-x-1/2 -translate-y-1/2 hover:bg-[#505050]/[.5] rounded-full'>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                  <path d="M482.769-216.923 579.077-313l-96.308-96.077L457.692-384 513-328.692q-46.462.23-82.577-10.923-36.115-11.154-57.884-32.924-22.308-22.307-33.577-50.615-11.27-28.308-11.27-56.615 0-17 3.731-34T342.385-546l-27.077-24Q303.692-548.846 298-526.167q-5.692 22.678-5.692 46.167 0 35.651 13.846 70.364t40.923 62.175q27.077 27.461 71.154 40.807 44.077 13.346 90.538 13.577L457.692-242l25.077 25.077ZM645.462-390q11.615-21.154 17.307-43.833 5.693-22.678 5.693-46.167 0-35.53-13.731-70.592t-41.192-62.177q-26.693-27.462-71.034-40.693-44.341-13.23-90.505-13.23L503.077-718 478-743.077 381.692-647 478-550.923 503.077-576l-55.538-55.538q46.23 0 82.692 11.269 36.461 11.269 58.227 33.094 21.765 21.826 33.192 50.198 11.427 28.373 11.427 56.746 0 17-3.731 34T618.385-414l27.077 24ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120Z" />
                </svg>
              </span> */}
              <input
                ref={fileInputRef}
                type="file"
                hidden
                className='w-[75px] h-[75px]'
                accept='image/*'
                onChange={handleFileChange}
              />
            </button>
            <button
              className='text-[#0af] text-xs -tracking-[.36px] font-medium mt-4'
              onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }}
            >
              Edit
            </button>
          </div>
          <div className='flex gap-8 grid grid-cols-2 flex-1 pe-12'>
            <div className='col-span-1'>
              <p className='text-sm font-[Inter] font-semibold text-black -tracking-[.48px]'>Full Name</p>
              <input
                className='p-3 rounded-[9.5px] border-[1px] border-[#7f8182]/[.13] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb] w-full focus:ring-0 focus:border-[#7FFBAE]'
                value={fullName}
                disabled
              />
            </div>
            <div className='col-span-1'>
              <p className='text-sm font-[Inter] font-semibold text-black -tracking-[.48px]'>Email Address</p>
              <input
                className='p-3 rounded-[9.5px] border-[1px] border-[#7f8182]/[.13] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb] w-full focus:ring-0 focus:border-[#7FFBAE]'
                value={email}
                disabled
              />
            </div>
          </div>
        </div>
        {/* <div className='flex items-center justify-between w-full py-2 px-3'>
          <p className='font-[Inter] text-[#43474A] text-base font-medium -tracking-[.54px]'>{fullName}</p>
          <p className='font-[Inter] text-[#A3A3A3] text-sm font-medium text-base -tracking-[.48px]'>{`Date Joined: ${date}`}</p>
        </div> */}
        <button className='rounded-[5px] text-black bg-[#7FFBAE] font-[Inter] text-sm font-semibold px-8 py-1.5 mt-12' onClick={handlePublish}>Save</button>
      </div>
      <div className='mt-4 p-5 bg-white rounded-[10px] shadow-md'>
        <p className='text-black text-lg font-medium -tracking-[.6px]'>Company</p>
        <div className='grid grid-cols-2 gap-24 border-b-[1px] border-[#bcbcbc]'>
          <div className='col-span-1'>
            <p className='text-sm font-[Inter] font-semibold text-black mt-3 -tracking-[.48px]'>Company Name</p>
            <input
              className='p-3 rounded-[9.5px] border-[1px] border-[#7f8183]/[.13] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb] w-full focus:ring-0 focus:border-[#7FFBAE]'
              value={company}
              disabled
            />
          </div>
          <div className='col-span-1'>
            <h4 className='text-sm font-[Inter] font-semibold text-black mt-3 -tracking-[.48px]'>Payment Methods</h4>
            <div className='mt-2'>
              {
                cardList.map(item => (
                  <div key={item.id}>
                    {/* <div className='flex justify-between w-full'>
                      <p className='font-[Inter] text-[#7f8182] text-xs -tracking-[.42px]'>{`Added Date: ${moment.unix(Number(item.create_time)).format('DD MMM, yyyy')}`}</p>
                    </div> */}
                    <div className='bg-[#fbfbfb] text-sm border-[1px] border-[rgba(127, 129, 130, 0.13)] rounded-[10px] p-3 my-1.5'>{`${item.brand.toUpperCase()} **** **** **** ${item.last4}`}</div>
                  </div>
                ))
              }
              {
                cardList.length <= 0 &&
                <div>
                  <p className='text-sm font-[Inter] font-medium text-black mt-8 -tracking-[.48px]'>My Card</p>
                </div>
              }
            </div>
            <div className='flex my-4'>
              <button className='font-[Inter] text-[#7F8182] text-xs flex items-center -tracking-[.45px] font-medium border-[1px] border-[#7f8182] rounded-lg px-8 py-2' onClick={handleManagePayment}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='me-2'>
                  <path d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z" stroke="#7F8182" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Add New Card
              </button>
            </div>
          </div>
        </div>
        <div className='mt-2 border-b-[1px] border-[#bcbcbc] py-4'>
          <h4 className='font-[Inter] text-black text-base font-semibold -tracking-[.6px]'>Files</h4>
          <Table
            className='mt-2 file-table'
            dataSource={fileData}
          // columns={[{
          //   title: 'Name',
          //   dataIndex: 'name',
          //   key: 'name',
          // }, {
          //   title: 'Campaign Name',
          //   dataIndex: 'campaignName',
          //   key: 'campaignName',
          // }, {
          //   title: 'Size',
          //   dataIndex: 'size',
          //   key: 'size',
          // }, {
          //   title: 'Date Added',
          //   dataIndex: 'date',
          //   key: 'date',
          // }]}
          >
            <Column title="Name" dataIndex="name" key="name" />
            <Column title="Campaign Name" dataIndex="campaignName" key="campaign name" />
            <Column title="Date Added" dataIndex="date" key="date" />
            <Column title="" key="action" render={(_: any, record: any) => (
              <>
                <button className='text-xs font-bold -tracking-[.45px] text-[#7f8182]' onClick={e => { e.preventDefault(); handleDownload(record.fullUrl, record.name); }}>VIEW</button>
                {/* <button className='text-xs font-bold -tracking-[.45px] text-[#7f8182] ms-2'>DELETE</button> */}
              </>
            )} />
          </Table>
        </div>
        <div className='flex items-center justify-between mt-6'>
          <h4 className='font-[Inter] text-black text-base font-semibold -tracking-[.6px]'>Company Users</h4>
          <button className="font-[Inter] font-medium -tracking-[.45px] text-sm flex items-center text-white bg-black rounded-lg px-4 py-2" onClick={() => setShowAddTeamModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='ms-1 me-2'>
              <path d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Add New User
          </button>
        </div>
        <div className='grid grid-cols-3 gap-6'>
          {teamData.map(item => (
            <div className='mt-4 col-span-1 rounded-[12px] bg-white border-[1px] border-[#7f8182] shadow-md p-4' key={item.id}>
              <div className='border-b-[1px] border-[#ddd] pb-6'>
                <p className='font-[Inter] text-xs font-medium -tracking-[.36px] text-[#a3a3a3]'>{item.role === 'admin' ? 'Administrator' : 'Campaign Manager'}</p>
                <div className='flex items-center justify-between mt-2'>
                  <div className='flex'>
                    <Avatar className="bg-[#7FFBAE] text-black items-center justify-center flex" src={item.avatar} alt={getPlaceHolder(item.name)} size={40}>
                      {(!item.avatar || item.avatar.length <= 3) && <span className="text-xs font-[Inter] font-medium">{getPlaceHolder(item.name)}</span>}
                    </Avatar>
                    <div className='text-left ms-2'>
                      <p className='font-[Inter] text-[#43474a] text-sm font-medium -tracking-[.36px]'>{item.name}</p>
                      <p className='font-[Inter] text-[#A3A3A3] text-xs -tracking-[.3px]'>{item.manager}</p>
                    </div>
                  </div>
                  <button className='flex text-[10px] text-white px-2 py-[2px] bg-[#E3392E] rounded-[3.25px] font-[Inter] items-center justify-center' onClick={() => setTeamData(teamData.filter(team => team.id !== item.id))}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="9" viewBox="0 0 8 9" fill="none" className='me-1'>
                      <path d="M7.02844 1.7009C7.13382 1.70102 7.23518 1.74252 7.31181 1.81692C7.38844 1.89132 7.43455 1.99301 7.44073 2.10121C7.44691 2.2094 7.41268 2.31594 7.34504 2.39905C7.2774 2.48216 7.18146 2.53557 7.07681 2.54837L7.02844 2.55135H6.99495L6.61497 7.22883C6.61499 7.55422 6.49411 7.86731 6.27705 8.10405C6.06 8.34079 5.76319 8.48329 5.44735 8.50238L5.37458 8.5045H2.06686C1.40615 8.5045 0.866163 7.9734 0.829778 7.33513L0.827711 7.26412L0.446083 2.55135H0.413006C0.307623 2.55123 0.206261 2.50973 0.129631 2.43533C0.0530011 2.36093 0.00688714 2.25924 0.000711173 2.15105C-0.00546479 2.04285 0.0287634 1.93631 0.0964021 1.8532C0.164041 1.77009 0.259985 1.71668 0.364631 1.70388L0.413006 1.7009H7.02844ZM3.10507 3.88656C3.01844 3.83352 2.91596 3.81487 2.81689 3.8341C2.71783 3.85333 2.629 3.90912 2.56713 3.99099C2.50526 4.07285 2.47461 4.17514 2.48093 4.27862C2.48726 4.3821 2.53012 4.47963 2.60147 4.55289L3.13567 5.1027L2.60147 5.65252L2.56716 5.69249C2.5029 5.77796 2.47268 5.88537 2.48264 5.99292C2.49261 6.10047 2.542 6.20009 2.62079 6.27154C2.69958 6.34299 2.80187 6.38092 2.90686 6.37762C3.01186 6.37433 3.11171 6.33005 3.18611 6.25379L3.72072 5.7044L4.25533 6.25379L4.2942 6.28908C4.3773 6.35517 4.48174 6.38624 4.58632 6.376C4.69089 6.36575 4.78776 6.31495 4.85723 6.23392C4.92671 6.15289 4.96359 6.04769 4.96038 5.93971C4.95717 5.83172 4.91412 5.72904 4.83997 5.65252L4.30577 5.1027L4.83997 4.55289L4.87429 4.51292C4.93854 4.42745 4.96876 4.32003 4.9588 4.21248C4.94884 4.10493 4.89944 4.00532 4.82065 3.93386C4.74186 3.86241 4.63958 3.82448 4.53458 3.82778C4.42958 3.83108 4.32974 3.87535 4.25533 3.95162L3.72072 4.50101L3.18611 3.95162L3.14725 3.91632L3.10507 3.88656Z" fill="white" />
                      <path d="M4.5473 0C4.76662 0 4.97695 0.0896007 5.13203 0.249091C5.28711 0.408581 5.37423 0.624897 5.37423 0.85045C5.37411 0.958832 5.33376 1.06308 5.26142 1.14189C5.18907 1.2207 5.0902 1.26812 4.985 1.27447C4.87979 1.28082 4.7762 1.24562 4.69539 1.17606C4.61458 1.1065 4.56264 1.00782 4.55019 0.900202L4.5473 0.85045H2.89344L2.89055 0.900202C2.8781 1.00782 2.82617 1.1065 2.74535 1.17606C2.66454 1.24562 2.56095 1.28082 2.45575 1.27447C2.35054 1.26812 2.25167 1.2207 2.17933 1.14189C2.10698 1.06308 2.06663 0.958832 2.06651 0.85045C2.06645 0.635892 2.14524 0.429237 2.2871 0.271911C2.42895 0.114586 2.62339 0.0182181 2.83142 0.00212617L2.89344 0H4.5473Z" fill="white" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4 mt-4'>
                <div className='col-span-1'>
                  <p className='font-[Inter] text-xs font-medium -tracking-[.36px] text-[#a3a3a3]'>Access Level</p>
                  <select
                    className='mt-2 rounded-lg w-full border-[1px] border-black text-xs py-2'
                    value={item.role}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTeamData(teamData.map(team => {
                        if (team.id === item.id) return { ...team, role: value };
                        return team;
                      }))
                    }}
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Campaign Manager</option>
                  </select>
                </div>
                <div className='col-span-1'>
                  <p className='font-[Inter] text-xs font-medium -tracking-[.36px] text-[#a3a3a3]'>Campaigns Assigned</p>
                  <Select
                    mode="multiple"
                    disabled={item.role === 'admin'}
                    className='mt-2 w-full w-full'
                    value={item.campaign_list.length > 1 ? item.campaign_list.split(',').map((value: string) => Number(value)) : []}
                    onChange={e => {
                      setTeamData(teamData.map(team => {
                        if (team.id === item.id) return { ...team, campaign_list: e.join(',') };
                        return team;
                      }));
                    }}
                    placeholder={<p className='text-xs'>Select Campaigns</p>}
                    options={campaign.map(c => ({
                      value: c.id,
                      label: <p className='text-black text-xs font-[Inter]'>{c.name}</p>
                    }))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-8 font-[Inter] text-sm font-semibold flex items-center px-8 py-2 bg-[#7ffbae] rounded-[5px]" onClick={handleSaveTeam}>
          Save
        </button>
      </div>
      <AddTeammate
        show={showAddTeamModal}
        setShow={() => setShowAddTeamModal(false)}
      />
    </motion.div>
  );
};

export default Profile;