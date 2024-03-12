import { FC } from "react";
import "./AskDialog.css"; // Import your custom stylesheet

interface typeAskDialog {
  title: string;
  content: string;
  onClose: Function;
  okText: string;
  cancelText: string;
  onOk: Function;
}

const AskDialog: FC<typeAskDialog> = ({
  title,
  content,
  onClose,
  okText,
  cancelText,
  onOk,
}) => {
  return (
    <div className="ask-dialog-overlay">
      <div className="ask-dialog">
        <div className="w-full flex-col flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-[95px] h-[95px] flex items-center justify-center bg-[#D22A2A] rounded-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="99"
                height="99"
                viewBox="0 0 99 99"
                fill="none"
              >
                <path
                  d="M2 49.5C2 55.7378 3.22862 61.9145 5.61572 67.6775C8.00282 73.4404 11.5016 78.6768 15.9124 83.0876C20.3232 87.4984 25.5596 90.9972 31.3225 93.3843C37.0855 95.7714 43.2622 97 49.5 97C55.7378 97 61.9145 95.7714 67.6775 93.3843C73.4404 90.9972 78.6768 87.4984 83.0876 83.0876C87.4984 78.6768 90.9972 73.4404 93.3843 67.6775C95.7714 61.9145 97 55.7378 97 49.5C97 36.9022 91.9955 24.8204 83.0876 15.9124C74.1796 7.00445 62.0978 2 49.5 2C36.9022 2 24.8204 7.00445 15.9124 15.9124C7.00445 24.8204 2 36.9022 2 49.5Z"
                  fill="#D22A2A"
                />
                <path d="M49.5 28.3889V49.5V28.3889Z" fill="#D22A2A" />
                <path d="M49.5 70.6111H49.5528H49.5Z" fill="#D22A2A" />
                <path
                  d="M49.5 28.3889V49.5M49.5 70.6111H49.5528M2 49.5C2 55.7378 3.22862 61.9145 5.61572 67.6775C8.00282 73.4404 11.5016 78.6768 15.9124 83.0876C20.3232 87.4983 25.5596 90.9972 31.3225 93.3843C37.0855 95.7714 43.2622 97 49.5 97C55.7378 97 61.9145 95.7714 67.6775 93.3843C73.4404 90.9972 78.6768 87.4983 83.0876 83.0876C87.4983 78.6768 90.9972 73.4404 93.3843 67.6775C95.7714 61.9145 97 55.7378 97 49.5C97 36.9022 91.9955 24.8204 83.0876 15.9124C74.1796 7.00445 62.0978 2 49.5 2C36.9022 2 24.8204 7.00445 15.9124 15.9124C7.00445 24.8204 2 36.9022 2 49.5Z"
                  stroke="#D22A2A"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M49 28.3906V49.5017M49 70.6128H49.0528"
                  stroke="white"
                  strokeWidth="4.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="mt-[12px] font-[Inter] text-primary text-[20px] font-semibold text-center -tracking-[.6px]">
              {title.length > 0 ? title : "Are you sure?"}
            </h2>
          </div>

          <div className="mt-[10px]">
            <p className="font-[Inter] text-[15px] text-center text-secondry1 -tracking-[].45px]">
              {content}
            </p>
          </div>
          <div className="flex gap-5">
            <button
              onClick={() => onClose()}
              className="mt-[25px] bg-[#FFAAA5] rounded-[10px] py-2 font-[Inter] text-sm font-semibold w-[168px] border-[1px]"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onOk();
                onClose();
              }}
              className="mt-[25px] bg-white rounded-[10px] py-2 font-[Inter] text-sm font-semibold w-[168px] border-[1px] border-[#7f8182]"
            >
              {okText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskDialog;
