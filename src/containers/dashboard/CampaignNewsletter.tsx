import React from "react";

const CampaignNewsletter: React.FC = () => {
  return (
    <div className="col-span-1 p-5 flex flex-col bg-white rounded-[10px] shadow-md">
      <p className="font-[Inter] text-primary mb-4 text-left font-semibold w-full text-base">
        Engagement by Newsletter
      </p>
      <div className="text-secondry1 font-medium text-sm rounded-[20px] grid grid-cols-5 gap-3 min-h-[60px] items-end justify-center">
        <div>Name</div>
        <div>Total Clicks</div>
        <div>Unique Clicks</div>
        <div>Total Spent</div>
        <div>Rating</div>
      </div>
      <p className="font-[Inter] mt-4 text-[10px] text-center">
        No data is available yet. Please create and launch your first campaign
      </p>
    </div>
  );
};

export default CampaignNewsletter;
