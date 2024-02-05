import React, { useState } from "react";
import { Button, Popover, Menu, Space } from "antd";
import FeedbackImage from "../../assets/icon/topbar-help.png";
import { EditOutlined, FlagOutlined } from "@ant-design/icons";

const Feedback: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleItemClick = (url: string) => {
    window.open(url, "_blank");
    hide();
  };

  const menu = (
    <Menu className="w-[300px]">
      <Menu.Item
        onClick={() => handleItemClick("https://forms.gle/T9Kc6JvaVhzwozYR8")}
      >
        <Space size="large">
          <EditOutlined /> Give feedback
        </Space>
      </Menu.Item>
      <Menu.Item
        onClick={() => handleItemClick("https://forms.gle/j1HCrRcrGK9roPhGA")}
      >
        <Space size="large">
          <FlagOutlined /> Request a feature
        </Space>
      </Menu.Item>
    </Menu>
  );

  return (
    <Popover
      content={menu}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      arrowContent={null}
      arrow={false}
      placement="bottomLeft"
      rootClassName="p-[0px]"
    >
      <button className="flex font-[Inter] rounded-[20px] h-10 px-3 py-[3px] font-medium text-black text-xs whitespace-nowrap items-center border border-solid border-main bg-[#05be751a] hover:bg-main hover:text-black">
        <img
          alt="Support"
          src={FeedbackImage}
          className="w-[14px] me-1 -ms-1"
        />
        <span className="font-[Inter] text-xs ms-1">Beta feedback</span>
      </button>
    </Popover>
  );
};

export default Feedback;
