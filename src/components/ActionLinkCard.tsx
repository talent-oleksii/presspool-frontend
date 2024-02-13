import { FC } from "react";
import { Space } from "antd";
import { ExportOutlined } from "@ant-design/icons";

interface IActionLinkCard {
  heading: string;
  subHeading?: string;
  links?: Array<{
    image?: string;
    name: string;
    url: string;
  }>;
}

const ActionLinkCard: FC<IActionLinkCard> = ({
  heading,
  subHeading,
  links,
}) => (
  <div className="rounded-3.5 mt-8 text-left shadow-md">
    <div className="bg-black px-[19px] py-[12px] w-full rounded-t-[14px]">
      <p className="text-white text-sm font-semibold font-[Inter]">{heading}</p>
      <p className="text-white font-[Inter] font-semibold text-xs 2xl:text-xs mt-[5px]">
        {subHeading}
      </p>
    </div>
    <div className="bg-white py-0 w-full rounded-b-[14px]">
      {(links || []).map((link, index) => (
        <a
          key={index}
          href={link.url}
          className="flex font-[Inter] font-500 text-sm items-center px-4 py-3"
          rel="noreferrer"
          target="_blank"
        >
          <Space size="middle">
            <ExportOutlined style={{ fontSize: "20px", paddingTop: "4px" }} />
            {link.name}
          </Space>
        </a>
      ))}
    </div>
  </div>
);

export default ActionLinkCard;
