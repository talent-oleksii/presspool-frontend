import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router";
import { CaretDownOutlined } from "@ant-design/icons";

interface IByCampaignButton {
  id: string | undefined;
  items: Array<any>;
  selectedCampaigns: Array<string>;
  setSelectedCampaigns: Dispatch<SetStateAction<string[]>>;
}

const ByCampaignButton: React.FC<IByCampaignButton> = ({
  id,
  items,
  setSelectedCampaigns,
  selectedCampaigns,
}) => {
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
    const campaignIds = selectedCampaigns.includes(itemId.toString())
      ? selectedCampaigns.filter((item) => Number(item) !== Number(itemId))
      : [...selectedCampaigns, itemId.toString()];

    setSelectedCampaigns(campaignIds);
    navigate(campaignIds.length ? `/campaign/${campaignIds.join(',')}` : `/campaign/all`);
    if(campaignIds.length === 0){
      hide();
    }
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
    <div
      ref={ref}
      className="group inline-flex flex-col min-w-[100px] relative"
    >
      <button
        onMouseEnter={handleOpenChange}
        className={`font-[Inter] text-[14px] font-semibold items-center gap-4 justify-between text-[#505050] flex px-4 py-[10px] rounded-[10px] ${
          id !== "all"
            ? "bg-white ring-1 ring-main shadow-md"
            : "bg-transparent ring-none"
        }`}
      >
        By Campaign
        <CaretDownOutlined />
      </button>
      {open && (
        <Menu
          selectedKeys={selectedCampaigns}
          className="w-[300px] absolute top-[calc(100%+5px)] !shadow-md rounded-[5px] text-left z-[9]"
        >
          {!!items.length ? (
            items.map((item) => (
              <Menu.Item
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="py-1 !h-auto !font-[Inter] !text-xs"
              >
                {item.name}
              </Menu.Item>
            ))
          ) : (
            <Menu.Item disabled>
              <span className="font-[Inter] !text-xs w-full text-gray-400">
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
