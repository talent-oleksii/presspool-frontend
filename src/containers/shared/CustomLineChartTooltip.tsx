import moment from "moment";
import { FC } from "react";

const CustomLineChartTooltip: FC = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="w-[129px] h-[83px] bg-[#EDECF2] p-2 flex flex-col justify-between rounded-[10px]">
        <p className="text-[10px] font-medium">
          {moment(label, "DD/MM/YYYY").format("MMM DD")}
        </p>
        <div className="w-full h-[1px] shrink-0 rounded-[10px] bg-[#A3A3A3]"></div>
        <div>
          <p className="text-[10px] font-bold">Totals</p>
          <p className="text-[8px] font-normal">Clicks: {payload[0].value}</p>
          <p className="text-[8px] font-normal">
            Unique Clicks: {payload[1].value}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export { CustomLineChartTooltip };
