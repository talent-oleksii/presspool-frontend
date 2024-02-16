import { FC } from "react";
import { motion } from "framer-motion";
import { MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS } from "../../utils/TransitionConstants";

import Ava from "../../assets/image/avaV2 1.png";

const Support: FC = () => {
  return (
    <div className="text-left relative h-[calc(100vh - 80px)] flex flex-col pt-1.5">
      <div className="h-fit">
        <h2 className="text-xl font-[Inter] text-black font-semibold -tracking-[.6px]">
          Presspool Support 📖
        </h2>
        <p className="mt-[6px] text-[#43474A] text-sm font-normal 2xl:text-md">
          Automatic and personal support options can be found below.
        </p>
      </div>
      <motion.div
        initial="hidden"
        animate="show"
        variants={MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS()}
        className=" pt-4"
      >
        <div className="pt-2 flex-1 flex flex-col items-center justify-between w-full rounded-[10px] bg-white">
          <div className="flex flex-col items-center justify-center">
            <img src={Ava} className="rounded-full w-[50px]" alt="ava" />
            <h2 className="font-[Inter] text-black text-xs font-semibold mt-[3px]">
              Talk to Ava
            </h2>
            <p className="font-[Inter] text-[#43474a] font-medium text-[12px] text-center mt-[5px]">
              Our support bot trained on our <br /> platfrom from A~Z!
            </p>
          </div>
          <iframe
            className="w-full h-[600px]"
            title="bot"
            src="https://widget.writesonic.com/CDN/index.html?service-base-url=https://api.botsonic.ai&token=c6f96462-0f55-4daf-8060-9b1f72f6ce7e&base-origin=https://bot.writesonic.com&instance-name=Botsonic&standalone=true&page-url=https://bot.writesonic.com/b7cab8fd-3964-42bc-9e94-acdea65cbcd0?t=share&workspace_id=380ff3fc-a06c-4403-b38d-e9b513c83508"
          />
        </div>
        <div className="mt-[24px] h-fit">
          {/* <div className='py-[30px] px-[35px] bg-white rounded-[10px] shadow-md'>
          <h2 className='font-[Inter] text-black text-xs font-semibold -tracking-[.48px]'>Human Support</h2>
          <p className='text-xs font-[Inter] text-[#43474a] font-medium mt-[18px] -tracking-[.36px]'>Email support@presspool.ai anytime, or send us a message on Slack and we will get back to you ASAP!</p>
          <a target="_blank" href="mailto:support@presspool.ai" rel="noreferrer" className='mt-[73px] rounded-[5px] w-full py-[13px] items-center flex justify-center text-xs font-[Inter] bg-black text-white'>Email Support</a>
        </div> */}
          <div className="bg-white rounded-[10px] shadow-md p-8">
            <h2 className="font-[Inter] text-black text-xs font-semibold -tracking-[.48px]">
              Additional Resources
            </h2>
            <div className="mt-[30px] min-w-[200px] flex">
              <a
                target="_blank"
                href="https://www.presspool.ai/terms"
                rel="noreferrer"
                className="flex text-[#7f8182] text-xs 2xl:text-md -tracking-[.42px]"
              >
                Terms of services
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  className="ms-[8px] font-medium font-[Inter] text-[#7f8182] text-xs"
                >
                  <rect
                    x="0.5"
                    y="5.11523"
                    width="13.625"
                    height="13.3846"
                    fill="white"
                    stroke="#7F8182"
                  />
                  <path
                    d="M18.4582 2.0643C18.4995 1.77191 18.3279 1.50589 18.0748 1.47013L13.9512 0.887391C13.6981 0.851631 13.4595 1.05967 13.4182 1.35206C13.3769 1.64444 13.5485 1.91046 13.8015 1.94622L17.467 2.46421L16.8685 6.69953C16.8272 6.99191 16.9988 7.25793 17.2518 7.29369C17.5049 7.32945 17.7435 7.12141 17.7848 6.82903L18.4582 2.0643ZM9.27108 10.2658L18.2711 2.41969L17.7289 1.57941L8.72892 9.42557L9.27108 10.2658Z"
                    fill="#7F8182"
                  />
                </svg>
              </a>
              <a
                target="_blank"
                href="https://www.presspool.ai/terms"
                rel="noreferrer"
                className="flex text-[#7f8182] ms-4 text-xs 2xl:text-md -tracking-[.42px]"
              >
                Billing Policy
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  className="ms-[8px] font-medium font-[Inter] text-[#7f8182] text-xs"
                >
                  <rect
                    x="0.5"
                    y="5.11523"
                    width="13.625"
                    height="13.3846"
                    fill="white"
                    stroke="#7F8182"
                  />
                  <path
                    d="M18.4582 2.0643C18.4995 1.77191 18.3279 1.50589 18.0748 1.47013L13.9512 0.887391C13.6981 0.851631 13.4595 1.05967 13.4182 1.35206C13.3769 1.64444 13.5485 1.91046 13.8015 1.94622L17.467 2.46421L16.8685 6.69953C16.8272 6.99191 16.9988 7.25793 17.2518 7.29369C17.5049 7.32945 17.7435 7.12141 17.7848 6.82903L18.4582 2.0643ZM9.27108 10.2658L18.2711 2.41969L17.7289 1.57941L8.72892 9.42557L9.27108 10.2658Z"
                    fill="#7F8182"
                  />
                </svg>
              </a>
              <a
                target="_blank"
                href="https://www.presspool.ai/terms"
                rel="noreferrer"
                className="flex text-[#7f8182] ms-4 text-xs 2xl:text-md -tracking-[.42px]"
              >
                Cancellation Policy
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  className="ms-[8px] font-medium font-[Inter] text-[#7f8182] text-xs"
                >
                  <rect
                    x="0.5"
                    y="5.11523"
                    width="13.625"
                    height="13.3846"
                    fill="white"
                    stroke="#7F8182"
                  />
                  <path
                    d="M18.4582 2.0643C18.4995 1.77191 18.3279 1.50589 18.0748 1.47013L13.9512 0.887391C13.6981 0.851631 13.4595 1.05967 13.4182 1.35206C13.3769 1.64444 13.5485 1.91046 13.8015 1.94622L17.467 2.46421L16.8685 6.69953C16.8272 6.99191 16.9988 7.25793 17.2518 7.29369C17.5049 7.32945 17.7435 7.12141 17.7848 6.82903L18.4582 2.0643ZM9.27108 10.2658L18.2711 2.41969L17.7289 1.57941L8.72892 9.42557L9.27108 10.2658Z"
                    fill="#7F8182"
                  />
                </svg>
              </a>
              <a
                target="_blank"
                href="https://www.presspool.ai/terms"
                rel="noreferrer"
                className="flex text-[#7f8182] ms-4 text-xs 2xl:text-md -tracking-[.42px]"
              >
                Refund Policy
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  className="ms-[8px] font-medium font-[Inter] text-[#7f8182] text-xs"
                >
                  <rect
                    x="0.5"
                    y="5.11523"
                    width="13.625"
                    height="13.3846"
                    fill="white"
                    stroke="#7F8182"
                  />
                  <path
                    d="M18.4582 2.0643C18.4995 1.77191 18.3279 1.50589 18.0748 1.47013L13.9512 0.887391C13.6981 0.851631 13.4595 1.05967 13.4182 1.35206C13.3769 1.64444 13.5485 1.91046 13.8015 1.94622L17.467 2.46421L16.8685 6.69953C16.8272 6.99191 16.9988 7.25793 17.2518 7.29369C17.5049 7.32945 17.7435 7.12141 17.7848 6.82903L18.4582 2.0643ZM9.27108 10.2658L18.2711 2.41969L17.7289 1.57941L8.72892 9.42557L9.27108 10.2658Z"
                    fill="#7F8182"
                  />
                </svg>
              </a>
            </div>
            {/* <a target="_blank" href="mailto:support@presspool.ai" rel="noreferrer" className='mt-[40px] rounded-[5px] w-full py-[13px] items-center flex justify-center text-xs font-[Inter] bg-black text-white'>Email Support</a> */}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Support;
