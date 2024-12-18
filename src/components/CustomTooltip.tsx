import { FC, useRef } from "react";
import { Tooltip } from "antd";

interface ICustomTooltip {
  title: string | JSX.Element;
}

const CustomTooltip: FC<ICustomTooltip> = ({ title }) => {
  const ref = useRef(null);
  return (
    <>
      <Tooltip
        title={title}
        color="#EDECF2"
        getPopupContainer={() => ref.current as unknown as HTMLElement}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          className="h-[20px] w-[20px] ms-1"
        >
          <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>
      </Tooltip>
      <div ref={ref}></div>
    </>
  );
};

export default CustomTooltip;
