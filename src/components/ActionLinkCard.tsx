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
  <div className="rounded-[14px] mt-4 text-left shadow-md">
    <div className="bg-black px-[19px] py-[12px] w-full rounded-t-[14px]">
      <p className="text-white text-base font-semibold font-[Inter]">
        {heading}
      </p>
      <p className="text-white font-[Inter] font-semibold text-xs 2xl:text-xs mt-[5px]">
        {subHeading}
      </p>
    </div>
    <div className="bg-white py-2 w-full rounded-b-[14px]">
      {(links || []).map((link, index) => (
        <a
          key={index}
          href={link.url}
          className="flex font-[Inter] font-500 text-base items-center px-5 py-3"
          rel="noreferrer"
          target="_blank"
        >
          <Space size="large">
            <ExportOutlined style={{ fontSize: "22px" }} />
            {link.name}
          </Space>
        </a>
      ))}
    </div>
  </div>
);

export default ActionLinkCard;
