import { FC, memo } from "react";

interface ICard {
  title: string;
  value: string | number;
  percentageText: string;
}

const Card: FC<ICard> = memo<ICard>(({ title, value, percentageText }) => {
  return (
    <div className="card col-span-1 p-3 flex flex-col justify-between items-start rounded-[10px] bg-white shadow-md gap-3">
      <p className="text-xs font-[Inter] text-secondry2 font-semibold">
        {title}
      </p>
      <h2 className="text-[25px] leading-[25px] font-[Inter] font-semibold">
        {value}
      </h2>
      <div className="flex gap-2">
        <div className="bg-main rounded-[10px] w-[14px] h-[14px] font-[Inter] leading-[12px] text-[10px] font-medium text-primary text-center">
          <span>+</span>
        </div>
        <p className="text-[#172935] text-[10px] font-semibold">
          {percentageText}
        </p>
      </div>
    </div>
  );
});

export default Card;
