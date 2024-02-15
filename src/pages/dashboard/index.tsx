import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useParams } from "react-router";
import { DatePicker } from "antd";
import { selectAuth } from "../../store/authSlice";
import { selectData } from "../../store/dataSlice";
import CampaignOverView from "./CampaignOverView";
import CampaignDetail from "./CampaignDetail";
import NewsLetterDetail from "./NewsLetterDetail";
import { FADE_UP_ANIMATION_VARIANTS, MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS } from "../../utils/TransitionConstants";
import ByCampaignButton from "../../containers/dashboard/ByCampaignButton";

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

    const campaignData = fullCampaign.filter((item) => {
      return (
        item.create_time >= range[0].unix().toString() &&
        item.create_time <= range[1].unix().toString()
      );
    });
    setCampaign(campaignData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullCampaign, range]);

  return (
    <div className="text-left relative">
      <h1 className="font-semibold font-[Inter] text-xl -tracking-[.6px]">
        Welcome {name} 🤝
      </h1>
      <p className="text-[14px] text-[#43474A]">
        Here’s a snapshot of your account, all in one place
      </p>

      <motion.div
        className="flex"
        initial="hidden"
        animate="show"
        variants={MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS()}
      >
        <div className="flex-1">
          <div className="flex justify-between items-center mt-4">
            <div>
              <Link
                className={`inline-flex items-center justify-center text-[#505050] text-[14px] font-semibold px-4 py-[10px] font-[Inter] rounded-[15px] sm:w-[170px] me-2 ${
                  id === "all"
                    ? "bg-white border border-solid border-main shadow-md"
                    : "bg-transparent ring-none"
                }`}
                to="/campaign/all"
              >
                Overview
              </Link>
              <ByCampaignButton id={id} items={campaign} />
            </div>
            <div>
              <DatePicker.RangePicker
                className="font-[Inter] rounded-[15px] py-2 border-[#7F8182] w-[250px] shadow-md"
                onChange={(e) => setRange(e)}
                getPopupContainer={() =>
                  document.getElementById("range-date-picker") as HTMLElement
                }
              />
              <div id="range-date-picker"></div>
            </div>
          </div>
          {id === "all" ? (
            <CampaignOverView data={campaign} />
          ) : id === "news" ? (
            <NewsLetterDetail />
          ) : (
            <CampaignDetail id={id} />
          )}
        </div>
        {/* <div className='min-w-[300px] pl-[30px] pr-[20px] sm:pr-[50px] mt-[22px]'>
					<div className='relative h-auto'>
						<div className='bg-main px-[18px] py-[12px] rounded-t-[14px] w-full top-0 z-10'>
							<p className='text-black text-xs font-semibold font-[Inter]'>Quick Actions:</p>
							<p className='text-[#505050] font-[Inter] font-semibold text-xs 2xl:text-xs mt-[4px]'>Let’s get you where you need to go</p>
						</div>
						<div className='bg-white py-2 w-full z-0 rounded-b-[14px] shadow-md'>
							<Link to="/new" className='flex font-[Inter] font-medium text-xs 2xl:text-xs items-center px-3 py-2'>
								<img src={LinkImage} alt="link" className='w-[17px] me-2' />
								Create New Campaign
							</Link>
							<Link to="/detail" className='flex font-[Inter] font-medium text-xs 2xl:text-xs items-center px-3 py-2'>
								<img src={LinkImage} alt="link" className='w-[17px] me-2' />
								Manage Campaigns
							</Link>
							<Link to="/billing" className='flex font-[Inter] font-medium text-xs 2xl:text-xs items-center px-3 py-2'>
								<img src={LinkImage} alt="link" className='w-[17px] me-2' />
								View Billing
							</Link>
							<a href="https://forms.gle/j1HCrRcrGK9roPhGA" className='flex font-[Inter] font-medium text-xs 2xl:text-xs items-center px-3 py-2' target='_blank' rel="noreferrer">
								<img src={LinkImage} alt="link" className='w-[17px] me-2' />
								Request a Feature
							</a>
							<a href="https://forms.gle/T9Kc6JvaVhzwozYR8" className='flex font-[Inter] font-medium text-xs 2xl:text-xs items-center px-3 py-2' target='_blank' rel="noreferrer">
								<img src={LinkImage} alt="link" className='w-[17px] me-2' />
								Give Feedback
							</a>
							<Link to="/profile" className='flex font-[Inter] font-medium text-xs 2xl:text-xs items-center px-3 py-2'>
								<img src={LinkImage} alt="link" className='w-[17px] me-2' />
								My Profile
							</Link>
						</div>
					</div>
					<div className='relative mt-4'>
						<div className='bg-main px-[19px] py-[12px] rounded-t-[14px] w-full z-10'>
							<p className='text-black text-xs font-semibold font-[Inter]'>Resources</p>
							<p className='text-[#505050] font-[Inter] font-semibold text-xs 2xl:text-xs mt-[5px]'>We are always here for you</p>
						</div>
						<div className='bg-white py-2 rounded-b-[14px] w-full z-0 top-[70px] shadow-md'>
							<a href="https://blog.presspool.ai" className='flex font-[Inter] font-medium text-xs 2xl:text-xs items-center px-3 py-2' rel='noreferrer' target='_blank'>
								<img src={LinkImage} alt="link" className='w-[17px] me-2' />
								Blog
							</a>
							<a target="_blank" href="mailto:support@presspool.ai" rel="noreferrer" className='flex font-[Inter] font-medium text-xs 2xl:text-xs items-center px-3 py-2'>
								<img src={LinkImage} alt="link" className='w-[17px] me-2' />
								Support
							</a>
						</div>
					</div>
				</div> */}
      </motion.div>
    </div>
  );
};

export default Dashboard;
