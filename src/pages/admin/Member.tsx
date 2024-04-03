import { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Select, Avatar } from 'antd';
import { selectAuth } from '../../store/authSlice';
import AdminAPIInstance from '../../api/adminApi';

import UsersImage from '../../assets/image/users.png';

const AdminMember: FC = () => {
  const [searchKey, setSearchKey] = useState('');
  const [accountManagers, setAccountManagers] = useState<Array<any>>([]);
  const [users, setUsers] = useState([]);

  const { adminRole } = useSelector(selectAuth);

  useEffect(() => {
    Promise.all([
      AdminAPIInstance.get('/user/account-manager'),
      AdminAPIInstance.get('/users'),
    ]).then((results: Array<any>) => {
      setAccountManagers(results[0].data);
      setUsers(results[1].data);
    });
  }, []);

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

  return (
    <div className="min-h-full w-full flex">
      <div className="text-left flex-1">
        <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">Presspool Team</h2>
        <div className="mt-4 flex gap-4">
          <div className='bg-white rounded-[10px] px-5 pt-3'>
            <div className='flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none">
                <path d="M16.668 4.42188C17.552 4.42188 18.3999 4.77306 19.025 5.39819C19.6501 6.02331 20.0013 6.87115 20.0013 7.75521C20.0013 8.63926 19.6501 9.48711 19.025 10.1122C18.3999 10.7374 17.552 11.0885 16.668 11.0885" fill="black" />
                <path d="M7.77865 4.42188V16.6441C7.77865 16.9388 7.66158 17.2214 7.45321 17.4298C7.24483 17.6381 6.96222 17.7552 6.66753 17.7552H5.55642C5.26174 17.7552 4.97912 17.6381 4.77075 17.4298C4.56238 17.2214 4.44531 16.9388 4.44531 16.6441V11.0885" fill="black" />
                <path d="M10 4.42052L15.0267 0.231626C15.1727 0.109968 15.3504 0.0324611 15.539 0.00818732C15.7275 -0.0160865 15.9191 0.0138786 16.0912 0.0945711C16.2633 0.175264 16.4088 0.30334 16.5108 0.463793C16.6127 0.624245 16.6668 0.810425 16.6667 1.00051V14.5072C16.6668 14.6973 16.6127 14.8835 16.5108 15.0439C16.4088 15.2044 16.2633 15.3324 16.0912 15.4131C15.9191 15.4938 15.7275 15.5238 15.539 15.4995C15.3504 15.4752 15.1727 15.3977 15.0267 15.2761L10 11.0872H1.11111C0.816426 11.0872 0.533811 10.9701 0.325437 10.7617C0.117063 10.5534 0 10.2708 0 9.97607V5.53163C0 5.23694 0.117063 4.95433 0.325437 4.74595C0.533811 4.53758 0.816426 4.42052 1.11111 4.42052H10Z" fill="black" />
              </svg>
              <p className='text-base font-medium -tracking-[.48px] ms-2'>Team Members</p>
            </div>
            <p className='-tracking-[.75px] text-[25px] font-semibold text-[#57d386] mt-4 mb-0'>2</p>
          </div>
          <div className='bg-white rounded-[10px] px-5 pt-3'>
            <div className='flex items-center'>
              <img src={UsersImage} className='w-[25px] h-[21px]' alt="users" />
              <p className='text-base font-medium -tracking-[.48px] ms-2'>Total Clients</p>
            </div>
            <p className='-tracking-[.75px] text-[25px] font-semibold text-[#57d386] mt-4 mb-0'>3</p>
          </div>
          <div className='bg-white rounded-[10px] px-5 pt-3'>
            <div className='flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none">
                <path d="M16.668 4.42188C17.552 4.42188 18.3999 4.77306 19.025 5.39819C19.6501 6.02331 20.0013 6.87115 20.0013 7.75521C20.0013 8.63926 19.6501 9.48711 19.025 10.1122C18.3999 10.7374 17.552 11.0885 16.668 11.0885" fill="black" />
                <path d="M7.77865 4.42188V16.6441C7.77865 16.9388 7.66158 17.2214 7.45321 17.4298C7.24483 17.6381 6.96222 17.7552 6.66753 17.7552H5.55642C5.26174 17.7552 4.97912 17.6381 4.77075 17.4298C4.56238 17.2214 4.44531 16.9388 4.44531 16.6441V11.0885" fill="black" />
                <path d="M10 4.42052L15.0267 0.231626C15.1727 0.109968 15.3504 0.0324611 15.539 0.00818732C15.7275 -0.0160865 15.9191 0.0138786 16.0912 0.0945711C16.2633 0.175264 16.4088 0.30334 16.5108 0.463793C16.6127 0.624245 16.6668 0.810425 16.6667 1.00051V14.5072C16.6668 14.6973 16.6127 14.8835 16.5108 15.0439C16.4088 15.2044 16.2633 15.3324 16.0912 15.4131C15.9191 15.4938 15.7275 15.5238 15.539 15.4995C15.3504 15.4752 15.1727 15.3977 15.0267 15.2761L10 11.0872H1.11111C0.816426 11.0872 0.533811 10.9701 0.325437 10.7617C0.117063 10.5534 0 10.2708 0 9.97607V5.53163C0 5.23694 0.117063 4.95433 0.325437 4.74595C0.533811 4.53758 0.816426 4.42052 1.11111 4.42052H10Z" fill="black" />
              </svg>
              <p className='text-base font-medium -tracking-[.48px] ms-2'>Total Campaigns</p>
            </div>
            <p className='-tracking-[.75px] text-[25px] font-semibold text-[#57d386] mt-4 mb-0'>3</p>
          </div>
          <div className='bg-white rounded-[10px] px-5 pt-3'>
            <div className='flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M0 9C-1.76116e-08 10.1819 0.232792 11.3522 0.685084 12.4442C1.13738 13.5361 1.80031 14.5282 2.63604 15.364C3.47177 16.1997 4.46392 16.8626 5.55585 17.3149C6.64778 17.7672 7.8181 18 9 18C10.1819 18 11.3522 17.7672 12.4442 17.3149C13.5361 16.8626 14.5282 16.1997 15.364 15.364C16.1997 14.5282 16.8626 13.5361 17.3149 12.4442C17.7672 11.3522 18 10.1819 18 9C18 7.8181 17.7672 6.64778 17.3149 5.55585C16.8626 4.46392 16.1997 3.47177 15.364 2.63604C14.5282 1.80031 13.5361 1.13738 12.4442 0.685084C11.3522 0.232792 10.1819 0 9 0C7.8181 0 6.64778 0.232792 5.55585 0.685084C4.46392 1.13738 3.47177 1.80031 2.63604 2.63604C1.80031 3.47177 1.13738 4.46392 0.685084 5.55585C0.232792 6.64778 -1.76116e-08 7.8181 0 9Z" fill="black" />
                <path d="M11.8 5.99918C11.6188 5.68494 11.3557 5.42588 11.0386 5.24973C10.7215 5.07358 10.3625 4.98698 10 4.99918H8C7.46957 4.99918 6.96086 5.20989 6.58579 5.58497C6.21071 5.96004 6 6.46875 6 6.99918C6 7.52961 6.21071 8.03832 6.58579 8.41339C6.96086 8.78847 7.46957 8.99918 8 8.99918H10C10.5304 8.99918 11.0391 9.20989 11.4142 9.58497C11.7893 9.96004 12 10.4687 12 10.9992C12 11.5296 11.7893 12.0383 11.4142 12.4134C11.0391 12.7885 10.5304 12.9992 10 12.9992H8C7.63749 13.0114 7.27849 12.9248 6.96142 12.7486C6.64435 12.5725 6.38115 12.3134 6.2 11.9992M9 4V14" stroke="#F5F5F5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className='text-base font-medium -tracking-[.48px] ms-2'>Total Spend</p>
            </div>
            <p className='-tracking-[.75px] text-[25px] font-semibold text-[#57d386] mt-4 mb-0'>$12185</p>
          </div>
          <div className='bg-white rounded-[10px] px-5 pt-3'>
            <div className='flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
                <path d="M0 18V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0H12C12.5304 0 13.0391 0.210714 13.4142 0.585786C13.7893 0.960859 14 1.46957 14 2V18L11 16L9 18L7 16L5 18L3 16L0 18Z" fill="black" />
                <path d="M9 5H6.5C6.10218 5 5.72064 5.15804 5.43934 5.43934C5.15804 5.72064 5 6.10218 5 6.5C5 6.89782 5.15804 7.27936 5.43934 7.56066C5.72064 7.84196 6.10218 8 6.5 8H7.5C7.89782 8 8.27936 8.15804 8.56066 8.43934C8.84196 8.72064 9 9.10218 9 9.5C9 9.89782 8.84196 10.2794 8.56066 10.5607C8.27936 10.842 7.89782 11 7.5 11H5M7 11V12.5M7 3.5V5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className='text-base font-medium -tracking-[.48px] ms-2'>Total Commission</p>
            </div>
            <p className='-tracking-[.75px] text-[25px] font-semibold text-[#57d386] mt-4 mb-0'>$12185</p>
          </div>
        </div>
        <div className='mt-4 flex'>
          <div className="rounded-[10px] border-[1px] border-[#7f8182] gap-[15px] px-3 py-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
              <path d="M12.0016 1.07199C12.9542 1.62201 13.7832 2.36255 14.4368 3.24735C15.0903 4.13216 15.5544 5.14222 15.8 6.21444C16.0456 7.28666 16.0675 8.39801 15.8643 9.47908C15.6611 10.5601 15.2372 11.5877 14.619 12.4976L19.5637 17.4412C19.839 17.7125 19.9989 18.0795 20.0102 18.4659C20.0216 18.8522 19.8833 19.228 19.6244 19.5149C19.3655 19.8018 19.0058 19.9777 18.6203 20.006C18.2349 20.0342 17.8534 19.9126 17.5554 19.6665L17.4414 19.5635L12.4977 14.6188C11.3149 15.4222 9.93848 15.894 8.51156 15.9851C7.08464 16.0761 5.65938 15.7832 4.38408 15.1366C3.10878 14.4901 2.03003 13.5136 1.26007 12.3088C0.490105 11.104 0.0570647 9.71489 0.00600086 8.28598L0 8.00094L0.0050008 7.7159C0.0542013 6.33646 0.459431 4.99321 1.18131 3.8167C1.90318 2.64019 2.91715 1.67044 4.12465 1.00171C5.33216 0.332977 6.69213 -0.0119965 8.07239 0.00031853C9.45265 0.0126336 10.8063 0.381819 12.0016 1.07199Z" fill="#7F8182" />
              <circle cx="8.00781" cy="8" r="6" fill="#F5F5F5" />
            </svg>
            <input
              placeholder='Search by Name'
              className='text-[#7f8182] text-sm font-semibold bg-transparent border-none focus:ring-0 p-0'
              value={searchKey}
              onChange={e => setSearchKey(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex">
          {
            adminRole === 'super_admin' &&
            <div className='bg-white rounded-[10px] w-full mb-2'>
              {accountManagers.map((item: any) => (
                <div className='mt-4 col-span-1 rounded-[10px] border-[1px] border-[#7f8182] shadow-md p-4' key={item.id}>
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
          }
        </div>
      </div>
    </div>
  )
};

export default AdminMember;