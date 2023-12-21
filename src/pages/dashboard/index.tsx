import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useParams } from 'react-router';
import { Dropdown, DatePicker, MenuProps } from 'antd';

import { selectAuth } from '../../store/authSlice';
import { selectData } from '../../store/dataSlice';
import CampaignOverView from './CampaignOverView';
import CampaignDetail from './CampaignDetail';
import NewsLetterDetail from './NewsLetterDetail';
import { FADE_UP_ANIMATION_VARIANTS } from '../../utils/TransitionConstants';

const Dashboard: FC = () => {
	const [range, setRange] = useState<any>([]);
	const { name } = useSelector(selectAuth);
	const { campaign: fullCampaign } = useSelector(selectData);
	const [campaign, setCampaign] = useState<Array<any>>([]);
	const { id } = useParams();

	useEffect(() => {
		if (!range || !range[0] || !range[1]) {
			setCampaign(fullCampaign);
			return;
		}

		const campaignData = fullCampaign.filter(item => {
			return item.create_time >= range[0].unix().toString() && item.create_time <= range[1].unix().toString();
		});
		setCampaign(campaignData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fullCampaign, range]);

	const items: MenuProps['items'] = campaign.length > 0 ? campaign.map(item => ({
		key: item.id,
		label: <Link to={`/campaign/${item.id}`} className='font-[Inter] text-md w-full'>{item.name}</Link>,
	})) : [{
		key: 'none',
		label: <span className='font-[Inter] text-md w-full text-gray-400'>No Campaigns yet</span>,
		disabled: true
	}];

	return (
		<motion.div
			className='text-left relative'
			initial="hidden"
			animate="show"
			variants={FADE_UP_ANIMATION_VARIANTS}
		>
			<h1 className='font-semibold font-[Inter] text-[20px] 2xl:text-[24px] -tracking-[.6px]'>Welcome {name} 🤝</h1>
			<p className='mt-[5px] 2xl:mt-2 text-sm 2xl:text-md text-[#43474A]'>Here’s a snapshot of your account, all in one place</p>

			<div className='flex'>
				<div className='flex-1'>
					<div className='flex justify-between items-center mt-[22px]'>
						<div>
							<Link
								className={`inline-flex text-left text-[#505050] text-sm 2xl:text-md px-3 py-[10px] font-[Inter] rounded-[15px] sm:w-[170px] me-2 ${id === 'all' ? 'bg-white ring-1 ring-[#7FFBAE]' : 'bg-transparent ring-none'}`}
								to="/campaign/all"
							>
								Overview
							</Link>
							<div className="group inline-flex flex-col">

								<Dropdown
									className='text-left'
									placement='bottomRight'
									menu={{ items }}
								>
									<button className={`font-[Inter] text-sm text-[#505050] 2xl:text-base flex items-center px-4 py-[10px] rounded-[15px] ${id !== 'all' ? 'bg-white ring-1 ring-[#7FFBAE]' : 'bg-transparent ring-none'}`}>
										By Campaign
										<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" className="mx-5">
											<path d="M450.001-779.999v485.077L222.154-522.768 180.001-480 480-180.001 779.999-480l-42.153-42.768-227.847 227.846v-485.077h-59.998Z" fill='#505050' />
										</svg>
									</button>
								</Dropdown>
							</div>
						</div>
						<DatePicker.RangePicker
							className='font-[Inter] rounded-[15px] py-[10px] border-[#7F8182]'
							onChange={(e) => setRange(e)}
						/>
					</div>
					{
						id === 'all' ? <CampaignOverView data={campaign} /> : id === 'news' ? <NewsLetterDetail /> : <CampaignDetail id={id} />
					}

				</div>
				<div className='min-w-[330px] pl-[30px] pr-[50px] mt-[22px]'>
					<div className='relative h-[300px]'>
						<div className='bg-[#7FFBAE] p-[19px] rounded-t-[14px] w-full top-0 z-10'>
							<p className='text-black text-base font-semibold font-[Inter]'>Quick Actions:</p>
							<p className='text-[#505050] font-[Inter] font-semibold text-[10px] 2xl:text-xs mt-[4px]'>Let’s get you where you need to go</p>
						</div>
						<div className='bg-white py-2 w-full z-0 rounded-b-[14px] shadow-md'>
							<Link to="/detail" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2'>
								<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
									<rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
									<path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
								</svg>
								Manage Campaigns
							</Link>
							<a href="https://forms.gle/j1HCrRcrGK9roPhGA" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2' target='_blank' rel="noreferrer">
								<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
									<rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
									<path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
								</svg>
								Feature Request
							</a>
							<Link to="/billing" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2'>
								<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
									<rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
									<path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
								</svg>
								View Billing
							</Link>
							<Link to="/support" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2'>
								<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
									<rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
									<path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
								</svg>
								Contact Support
							</Link>
							<a href="https://forms.gle/T9Kc6JvaVhzwozYR8" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2' target='_blank' rel="noreferrer">
								<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
									<rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
									<path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
								</svg>
								Give Feedback
							</a>
						</div>
					</div>
					<div className='relative'>
						<div className='bg-[#7FFBAE] p-[19px] rounded-t-[14px] w-full z-10'>
							<p className='text-black text-base font-semibold font-[Inter]'>Resources</p>
							<p className='text-[#505050] font-[Inter] font-semibold text-[10px] 2xl:text-xs mt-[5px]'>We are always here for you</p>
						</div>
						<div className='bg-white py-2 rounded-b-[14px] w-full z-0 top-[70px] shadow-md'>
							<a href="https://blog.presspool.ai" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2' rel='noreferrer' target='_blank'>
								<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
									<rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
									<path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
								</svg>
								Blog
							</a>
							<a href="https://join.slack.com/t/presspoolsupport/shared_invite/zt-1ytywzzld-974gUfTB8zCYlP4~f5XT1Q" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2' target='_blank' rel='noreferrer'>
								<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
									<rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
									<path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
								</svg>
								Go to Slack
							</a>
						</div>
					</div>
				</div>
			</div>
		</motion.div >
	);
};

export default Dashboard;