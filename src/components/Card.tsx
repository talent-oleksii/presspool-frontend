import { FC, memo } from "react";

interface ICard {
  title: string;
  value: string | number;
  percentage: number;
  totalCountLast4Week: number;
}

const Card: FC<ICard> = memo<ICard>(
  ({ title, value, percentage, totalCountLast4Week }) => {
    return (
      <div className="card col-span-1 py-5 flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md">
        <h2 className="text-[25px] leading-[25px] font-[Inter] font-semibold">
          {value}
        </h2>
        <p className="text-[10px] font-[Inter] mt-6 text-[#43474A] font-semibold">
          {title}
        </p>
        <div className="bg-main rounded-full h-5 leading-5 mt-6 px-3 font-[Inter] text-[10px] font-semibold text-black">
          {percentage ?? 0}%
        </div>
        <p className="text-[#7F8182] text-[8px] mt-2 font-semibold">
          from {totalCountLast4Week} (last 4 weeks)
        </p>
      </div>
    );
  }
);

export default Card;
