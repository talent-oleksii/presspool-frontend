import React, { useEffect, useRef, useState } from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router";

interface ISelectList {
  id: string | undefined;
  items: Array<any>;
  setValue: Function;
  name: string;
}

const SelectList: React.FC<ISelectList> = ({ id, items, setValue, name }: ISelectList) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<any>(null);

  const handleOpenChange = () => {
    setOpen(true);
  };

  const hide = () => {
    setOpen(false);
  };

  const handleItemClick = (itemId: string) => {
    setValue(itemId);
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
    <div ref={ref} className="group inline-flex min-w-[170px] flex-col relative me-2">
      <button
        onClick={handleOpenChange}
        className={`font-[Inter] text-[14px] font-semibold items-center justify-center text-[#505050] flex px-4 py-[10px] rounded-[15px] ${id !== "all"
          ? "bg-white ring-1 ring-main shadow-md"
          : "bg-transparent ring-none"
          }`}
      >
        {name}
      </button>
      {open && (
        <Menu className="w-[300px] absolute top-[calc(100%+5px)] !shadow-md rounded-[15px] text-left z-[9]">
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
                No Data yet
              </span>
            </Menu.Item>
          )}
        </Menu>
      )}
    </div>
  );
};

export default SelectList;
