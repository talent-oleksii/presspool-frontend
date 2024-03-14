import { FC, useState, useRef, useEffect } from 'react';
import { Select, Avatar } from 'antd';
import { useSelector } from 'react-redux';

import { selectAuth } from '../../store/authSlice';
import AdminAPIInstance from '../../api/adminApi';
import DialogUtils from '../../utils/DialogUtils';
import Loading from '../../components/Loading';
import StripeUtil from '../../utils/stripe';

const Profile: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  const { adminName, adminEmail, adminRole } = useSelector(selectAuth);
  const [accountManagers, setAccountManagers] = useState<Array<any>>([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      AdminAPIInstance.get('/user/account-manager'),
      AdminAPIInstance.get('/users'),
    ]).then((results: Array<any>) => {
      setAccountManagers(results[0].data);
      setUsers(results[1].data);
    }).finally(() => setLoading(false));
  }, []);

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

  const handleSaveTeam: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    // setLoading(true);
    AdminAPIInstance.put('/users', { data: accountManagers }).then(data => {
      DialogUtils.show('success', '', 'Successfully Updated!');
    }).finally(() => setLoading(false));
  };

  const handleConnectPaymentMethod = async () => {
    // create account for this account manager:
    const account = await StripeUtil.stripe.accounts.create({
      type: 'standard'
    });
    const accountLink = await StripeUtil.stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://go.presspool.ai/admin/profile',
      return_url: 'https://go.presspool.ai/admin/profile',
      type: 'account_onboarding',
    });

    window.open(accountLink.url);
  };

  return (
    <div className='text-left'>
      {loading && <Loading />}
      <div className='flex items-center justify-between pr-4'>
        <h1 className='font-semibold font-[Inter] text-[24px] 2xl:text-[30px] -tracking-[1.02px]'>My Profile</h1>
        {/* <button className='rounded-[10px] text-primary bg-main font-[Inter] text-xs px-4 py-1' onClick={handlePublish}>Publish</button> */}
      </div>
      <div className='pt-[30px] pb-[23px] flex items-center border-b-[1px] border-b-[#bcbcbc]'>
        <button className='relative items-center justify-center flex' onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }}>
          {image ?
            <Avatar
              src={image}
              className='z-[0] transition-all duration-150  hover:blur-[1.5px] w-[75px] h-[75px]'
            />
            : <div className='z-[0] transition-all duration-150 hover:blur-[1.5px] w-[75px] h-[75px] bg-main rounded-[10px] flex items-center justify-center font-[Inter] text-3xl'>
              {getPlaceHolder(adminName)}
            </div>
          }
          <span className='opacity-0 absolute p-[27px] top-1/2 left-1/2 hover:opacity-100 -translate-x-1/2 -translate-y-1/2 hover:bg-[#505050]/[.5] rounded-[10px]'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
              <path d="M482.769-216.923 579.077-313l-96.308-96.077L457.692-384 513-328.692q-46.462.23-82.577-10.923-36.115-11.154-57.884-32.924-22.308-22.307-33.577-50.615-11.27-28.308-11.27-56.615 0-17 3.731-34T342.385-546l-27.077-24Q303.692-548.846 298-526.167q-5.692 22.678-5.692 46.167 0 35.651 13.846 70.364t40.923 62.175q27.077 27.461 71.154 40.807 44.077 13.346 90.538 13.577L457.692-242l25.077 25.077ZM645.462-390q11.615-21.154 17.307-43.833 5.693-22.678 5.693-46.167 0-35.53-13.731-70.592t-41.192-62.177q-26.693-27.462-71.034-40.693-44.341-13.23-90.505-13.23L503.077-718 478-743.077 381.692-647 478-550.923 503.077-576l-55.538-55.538q46.23 0 82.692 11.269 36.461 11.269 58.227 33.094 21.765 21.826 33.192 50.198 11.427 28.373 11.427 56.746 0 17-3.731 34T618.385-414l27.077 24ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120Z" />
            </svg>
          </span>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            className='w-[75px] h-[75px]'
            accept='image/*'
            onChange={handleFileChange}
          />
        </button>
        <div className='flex items-center justify-between w-full py-2 px-3'>
          <p className='font-[Inter] text-secondry1 text-xs font-medium -tracking-[.54px]'>{adminName}</p>
          {/* <p className='font-[Inter] text-[#A3A3A3] text-xs font-medium text-xs -tracking-[.48px]'>{`Date Joined: ${date}`}</p>? */}

          <button className='p-2 rounded-[10px] shadow-md text-white -tracking-[.42px] font-medium text-sm bg-[#6c63ff] flex items-center' onClick={handleConnectPaymentMethod}>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className='me-2'>
              <path d="M6 8.5H11M8.5 6V11M1 8.5C1 9.48491 1.19399 10.4602 1.5709 11.3701C1.94781 12.2801 2.50026 13.1069 3.1967 13.8033C3.89314 14.4997 4.71993 15.0522 5.62987 15.4291C6.53982 15.806 7.51509 16 8.5 16C9.48491 16 10.4602 15.806 11.3701 15.4291C12.2801 15.0522 13.1069 14.4997 13.8033 13.8033C14.4997 13.1069 15.0522 12.2801 15.4291 11.3701C15.806 10.4602 16 9.48491 16 8.5C16 6.51088 15.2098 4.60322 13.8033 3.1967C12.3968 1.79018 10.4891 1 8.5 1C6.51088 1 4.60322 1.79018 3.1967 3.1967C1.79018 4.60322 1 6.51088 1 8.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Connect Payment Method
          </button>
        </div>
      </div>
      <div className='mt-4 p-5 bg-white rounded-[10px] shadow-md grid grid-cols-2 gap-24'>
        <div className='col-span-1'>
          <h4 className='font-[Inter] text-primary text-xs font-semibold -tracking-[.6px]'>Personal Information</h4>
          <p className='text-xs font-[Inter] font-semibold text-primary mt-8 -tracking-[.48px]'>Full Name</p>
          <input
            className='p-3 rounded-[10px] border-[1px] border-[rgba(127, 129, 130, .13)] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb] w-full focus:ring-0 focus:border-main'
            value={adminName}
            disabled
          />
          <p className='text-xs font-[Inter] font-semibold text-primary mt-3 -tracking-[.48px]'>Email Address</p>
          <input
            className='p-3 rounded-[10px] border-[1px] border-[rgba(127, 129, 130, .13)] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb] w-full focus:ring-0 focus:border-main'
            value={adminEmail}
            disabled
          />
        </div>
        <div className='col-span-1'>
          <h4 className='font-[Inter] text-primary text-xs font-semibold -tracking-[.6px]'>Change Password</h4>
          <p className='text-xs font-[Inter] font-semibold text-primary mt-8 -tracking-[.48px]'>Old Password</p>
          <input
            className='p-3 rounded-[10px] border-[1px] border-[rgba(127, 129, 130, .13)] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb] w-full focus:ring-0 focus:border-main'
            value={adminName}
            disabled
          />
          <p className='text-xs font-[Inter] font-semibold text-primary mt-3 -tracking-[.48px]'>Enter New Password</p>
          <input
            className='p-3 rounded-[10px] border-[1px] border-[rgba(127, 129, 130, .13)] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb] w-full focus:ring-0 focus:border-main'
            value={adminEmail}
            disabled
          />
        </div>
      </div>
      {
        adminRole === 'super_admin' &&
        <div className='mt-6 p-5 bg-white rounded-[10px] shadow-md'>
          <div className='flex items-center justify-between'>
            <h4 className='font-[Inter] text-primary text-xs font-semibold -tracking-[.6px]'>My Team (Manage their Access Below)</h4>
            {/* <button className="font-[Inter] font-medium -tracking-[.45px] text-xs flex items-center bg-main rounded-[10px] px-4 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='ms-1 me-2'>
              <path d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Add Account Manager
          </button> */}
          </div>
          <div className='grid grid-cols-3 gap-6'>
            {accountManagers.map((item: any) => (
              <div className='mt-4 col-span-1 rounded-[10px] bg-white border-[1px] border-[#7f8182] shadow-md p-4' key={item.id}>
                <div className='border-b-[1px] border-[#ddd] pb-6'>
                  <p className='font-[Inter] text-xs font-medium -tracking-[.36px] text-[#a3a3a3]'>Account Manager</p>
                  <div className='flex items-center justify-between mt-2'>
                    <div className='flex'>
                      <Avatar className="bg-main text-primary items-center justify-center flex" src={item.avatar} alt={getPlaceHolder(item.name)} size={40}>
                        {(!item.avatar || item.avatar.length <= 3) && <span className="text-xs font-[Inter] font-medium">{getPlaceHolder(item.name)}</span>}
                      </Avatar>
                      <div className='text-left ms-2'>
                        <p className='font-[Inter] text-secondry1 text-xs font-medium -tracking-[.36px]'>{item.name}</p>
                        <p className='font-[Inter] text-[#A3A3A3] text-xs -tracking-[.3px]'>{item.email}</p>
                      </div>
                    </div>
                    <button className='flex text-xs text-white px-2 py-[2px] bg-[#E3392E] rounded-[10px] font-[Inter] items-center justify-center'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="9" viewBox="0 0 8 9" fill="none" className='me-1'>
                        <path d="M7.02844 1.7009C7.13382 1.70102 7.23518 1.74252 7.31181 1.81692C7.38844 1.89132 7.43455 1.99301 7.44073 2.10121C7.44691 2.2094 7.41268 2.31594 7.34504 2.39905C7.2774 2.48216 7.18146 2.53557 7.07681 2.54837L7.02844 2.55135H6.99495L6.61497 7.22883C6.61499 7.55422 6.49411 7.86731 6.27705 8.10405C6.06 8.34079 5.76319 8.48329 5.44735 8.50238L5.37458 8.5045H2.06686C1.40615 8.5045 0.866163 7.9734 0.829778 7.33513L0.827711 7.26412L0.446083 2.55135H0.413006C0.307623 2.55123 0.206261 2.50973 0.129631 2.43533C0.0530011 2.36093 0.00688714 2.25924 0.000711173 2.15105C-0.00546479 2.04285 0.0287634 1.93631 0.0964021 1.8532C0.164041 1.77009 0.259985 1.71668 0.364631 1.70388L0.413006 1.7009H7.02844ZM3.10507 3.88656C3.01844 3.83352 2.91596 3.81487 2.81689 3.8341C2.71783 3.85333 2.629 3.90912 2.56713 3.99099C2.50526 4.07285 2.47461 4.17514 2.48093 4.27862C2.48726 4.3821 2.53012 4.47963 2.60147 4.55289L3.13567 5.1027L2.60147 5.65252L2.56716 5.69249C2.5029 5.77796 2.47268 5.88537 2.48264 5.99292C2.49261 6.10047 2.542 6.20009 2.62079 6.27154C2.69958 6.34299 2.80187 6.38092 2.90686 6.37762C3.01186 6.37433 3.11171 6.33005 3.18611 6.25379L3.72072 5.7044L4.25533 6.25379L4.2942 6.28908C4.3773 6.35517 4.48174 6.38624 4.58632 6.376C4.69089 6.36575 4.78776 6.31495 4.85723 6.23392C4.92671 6.15289 4.96359 6.04769 4.96038 5.93971C4.95717 5.83172 4.91412 5.72904 4.83997 5.65252L4.30577 5.1027L4.83997 4.55289L4.87429 4.51292C4.93854 4.42745 4.96876 4.32003 4.9588 4.21248C4.94884 4.10493 4.89944 4.00532 4.82065 3.93386C4.74186 3.86241 4.63958 3.82448 4.53458 3.82778C4.42958 3.83108 4.32974 3.87535 4.25533 3.95162L3.72072 4.50101L3.18611 3.95162L3.14725 3.91632L3.10507 3.88656Z" fill="white" />
                        <path d="M4.5473 0C4.76662 0 4.97695 0.0896007 5.13203 0.249091C5.28711 0.408581 5.37423 0.624897 5.37423 0.85045C5.37411 0.958832 5.33376 1.06308 5.26142 1.14189C5.18907 1.2207 5.0902 1.26812 4.985 1.27447C4.87979 1.28082 4.7762 1.24562 4.69539 1.17606C4.61458 1.1065 4.56264 1.00782 4.55019 0.900202L4.5473 0.85045H2.89344L2.89055 0.900202C2.8781 1.00782 2.82617 1.1065 2.74535 1.17606C2.66454 1.24562 2.56095 1.28082 2.45575 1.27447C2.35054 1.26812 2.25167 1.2207 2.17933 1.14189C2.10698 1.06308 2.06663 0.958832 2.06651 0.85045C2.06645 0.635892 2.14524 0.429237 2.2871 0.271911C2.42895 0.114586 2.62339 0.0182181 2.83142 0.00212617L2.89344 0H4.5473Z" fill="white" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
                <div className='mt-4'>
                  <div className='w-full'>
                    <p className='font-[Inter] text-xs font-medium -tracking-[.36px] text-[#a3a3a3]'>Users Assigned</p>
                    <Select
                      mode="multiple"
                      disabled={item.role === 'admin'}
                      className='mt-2 w-full w-full'
                      value={item.assigned_users && item.assigned_users.length > 1 ? item.assigned_users.split(',').map((value: string) => Number(value)) : []}
                      onChange={e => {
                        setAccountManagers(accountManagers.map(manager => {
                          if (manager.id === item.id) {
                            return {
                              ...manager,
                              assigned_users: e.join(',')
                            }
                          }
                          return manager;
                        }))
                      }}
                      placeholder={<p className='text-xs'>Select User</p>}
                      options={users.map((c: any) => ({
                        value: c.id,
                        label: <p className='text-primary text-xs font-[Inter]'>{c.name}</p>
                      }))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 font-[Inter] text-xs font-semibold flex items-center px-8 py-2 bg-main rounded-[10px]" onClick={handleSaveTeam}>
            Save
          </button>
        </div>
      }
    </div>
  );
};

export default Profile;