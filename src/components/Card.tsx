import { FC, ReactNode, memo } from "react";

interface ICard {
  title: string;
  value: string | number;
  percentageText: ReactNode;
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
      {percentageText}
      
    </div>
  );
});

export default Card;
