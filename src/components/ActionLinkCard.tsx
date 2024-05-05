import { FC } from "react";
import { Space } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

interface IActionLinkCard {
  heading: string;
  subHeading?: string;
  links?: Array<{
    image?: string;
    name: string;
    url: string;
    isInternal?: boolean;
    action?: Function;
  }>;
}

const ActionLinkCard: FC<IActionLinkCard> = ({
  heading,
  subHeading,
  links,
}) => (
  <div className="rounded-[10px] mt-8 text-left shadow-md">
    <div className="bg-black px-[19px] py-[12px] w-full rounded-t-[10px]">
      <p className="text-white text-sm font-semibold font-[Inter]">{heading}</p>
      <p className="text-white font-[Inter] font-semibold text-[10px] 2xl:text-xs mt-[5px]">
        {subHeading}
      </p>
    </div>
    <div className="bg-white py-4 w-full rounded-b-[10px]">
      {(links || []).map((link, index) => {
        if (link.action) {
          return (
            <button
              key={index}
              className="flex font-[Inter] font-normal text-xs 2xl:text-sm items-center px-4 py-2 w-full"
              onClick={() => link.action ? link.action() : () => { }}
            >
              <Space size="middle">
                <ExportOutlined style={{ fontSize: "18px", paddingTop: "2px" }} />
                {link.name}
              </Space>
            </button>
          );
        }
        return link.isInternal ? (
          <Link
            key={index}
            to={link.url}
            className="flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2"
          >
            <Space size="middle">
              <ExportOutlined style={{ fontSize: "18px", paddingTop: "2px" }} />
              {link.name}
            </Space>
          </Link>
        ) : (
          <a
            key={index}
            href={link.url}
            className="flex font-[Inter] font-500 text-xs items-center px-4 py-2"
            rel="noreferrer"
            target="_blank"
          >
            <Space size="middle">
              <ExportOutlined style={{ fontSize: "18px", paddingTop: "2px" }} />
              {link.name}
            </Space>
          </a>
        )
      }
      )}
    </div>
  </div>
);

export default ActionLinkCard;
