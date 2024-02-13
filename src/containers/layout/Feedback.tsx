import React, { useEffect, useRef, useState } from "react";
import { Menu, Space } from "antd";
import { EditOutlined, FlagOutlined } from "@ant-design/icons";
import SupportIcon from "../../icons/Support";

const Feedback: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<any>(null);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = () => {
    setOpen((prev) => !prev);
  };

  const handleItemClick = (url: string) => {
    window.open(url, "_blank");
    hide();
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        hide();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="flex items-center relative">
      <button
        onClick={handleOpenChange}
        className="flex font-[Inter] rounded-[20px] h-7 px-3 py-[3px] font-medium text-black text-xs whitespace-nowrap items-center border border-solid border-main bg-[#05be751a] hover:bg-main hover:text-black"
      >
        <span role="img" aria-label="support">
          <SupportIcon fontSize={18} />
        </span>
        <span className="font-[Inter] text-xs pl-1">Beta feedback</span>
      </button>
      {open && (
        <Menu className="w-[300px] absolute top-[calc(100%+8px)] right-[0] !shadow-md rounded-[15px] text-left z-[9]">
          <Menu.Item
            onClick={() =>
              handleItemClick("https://forms.gle/T9Kc6JvaVhzwozYR8")
            }
            className="py-1 !h-auto !text-xs"
          >
            <Space size="large">
              <EditOutlined style={{ fontSize: "20px" }} /> Give feedback
            </Space>
          </Menu.Item>
          <Menu.Item
            onClick={() =>
              handleItemClick("https://forms.gle/j1HCrRcrGK9roPhGA")
            }
            className="py-1 !h-auto !text-xs"
          >
            <Space size="large">
              <FlagOutlined style={{ fontSize: "20px" }} /> Request a feature
            </Space>
          </Menu.Item>
        </Menu>
      )}
    </div>
  );
};

export default Feedback;
