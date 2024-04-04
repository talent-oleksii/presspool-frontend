import { FC } from "react";

const CustomEngagementChannelLegend: FC = ({ payload}: any) => {
  if (payload && payload.length) {
    return (
      <div className="text-center">
        <div className="text-xl font-semibold">
          {payload[0].payload.value + payload[1].payload.value}
        </div>
        <div className="text-sm font-normal">Total Engagement</div>
      </div>
    );
  }

  return null;
};

export { CustomEngagementChannelLegend };
