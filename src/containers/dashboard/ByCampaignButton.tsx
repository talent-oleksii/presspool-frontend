import React, { useEffect, useRef, useState } from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router";

interface IByCampaignButton {
  id: string | undefined;
  items: Array<any>;
}

const ByCampaignButton: React.FC<IByCampaignButton> = ({ id, items }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<any>(null);

  const handleOpenChange = () => {
    setOpen(true);
  };

  const hide = () => {
    setOpen(false);
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/campaign/${itemId}`);
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
    <div ref={ref} className="group inline-flex flex-col w-[170px] relative">
      <button
        onClick={handleOpenChange}
        className={`font-[Inter] text-base items-center justify-center text-[#505050] flex px-4 py-[10px] rounded-[15px] ${
          id !== "all"
            ? "bg-white ring-1 ring-main shadow-md"
            : "bg-transparent ring-none"
        }`}
      >
        By Campaign
      </button>
      {open && (
        <Menu className="w-[300px] absolute top-[calc(100%+5px)] !shadow-md rounded-[15px] text-left z-[9]">
          {!!items.length ? (
            items.map((item) => (
              <Menu.Item
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="py-1 !h-auto !font-[Inter] !text-sm"
              >
                {item.name}
              </Menu.Item>
            ))
          ) : (
            <Menu.Item disabled>
              <span className="font-[Inter] !text-sm w-full text-gray-400">
                No Campaigns yet
              </span>
            </Menu.Item>
          )}
        </Menu>
      )}
    </div>
  );
};

export default ByCampaignButton;
