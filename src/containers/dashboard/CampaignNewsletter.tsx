import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectData } from "../../store/dataSlice";
import moment from "moment";

const CampaignNewsletter: React.FC<{ avgCPC: number }> = (props) => {
  const { avgCPC } = props;
  const { newsletter } = useSelector(selectData);

  const data: Array<any> = useMemo(() => {
    const aggregatedData = newsletter.reduce((acc, entry) => {
      const name = entry.name;
      if (!acc[name]) {
        acc[name] = {
          total_clicks: 0,
          unique_clicks: 0,
          verified_clicks: 0,
        };
      }

      acc[name].total_clicks += parseInt(entry.total_clicks);
      acc[name].unique_clicks += parseInt(entry.unique_clicks);
      acc[name].verified_clicks += parseInt(entry.verified_clicks);
      if (!acc[name].create_time) acc[name].create_time = entry.create_time;
      else acc[name].create_time = acc[name].create_time > entry.create_time ? entry.create_time : acc[name].create_time;
      return acc;
    }, {});
    return Object.entries(aggregatedData).map(([name, values]: any) => ({
      name,
      ...values,
    }));
  }, [newsletter]);

  return (
    <div className="col-span-1 p-5 flex flex-col bg-white rounded-[10px] shadow-md">
      <p className="font-[Inter] text-primary mb-4 text-left font-semibold w-full text-base">
        Engagement by Newsletter
      </p>
      <div className="text-secondry1 font-medium text-sm rounded-[10px] grid grid-cols-5 gap-3 min-h-[60px] items-end justify-center">
        <div>Name</div>
        <div className="text-center">Total Clicks</div>
        <div className="text-center">Unique Clicks</div>
        <div className="text-center">Verified Clicks</div>
        <div className="text-center">Projected Spend</div>
        {/* <div className="text-center">Rating</div> */}
      </div>
      {data.length
        ? data.map((item, index) => (
          <div
            key={index}
            className="rounded-[10px] grid grid-cols-5 gap-3 min-h-[60px] items-center justify-center"
          >
            <div className="text-primary font-bold text-sm">
              {/* {item.name.includes('.') ? <a href={`https://${item.name}`} target="_blank" rel="noreferrer" className="text-[red]/[.74]">{item.name}</a> : <p>{item.name}</p>} */}
              {item.name}
              <p className="font-normal text-xs">{moment(Number(item.create_time)).format('MM/DD/YYYY')}</p>
            </div>
            <div className="text-primary font-medium text-sm text-center">
              {item.total_clicks}
            </div>
            <div className="text-primary font-medium text-sm text-center">
              {item.unique_clicks}
            </div>
            <div className="text-primary font-medium text-sm text-center">
              {item.verified_clicks}
            </div>
            <div className="text-primary font-medium text-sm text-center">
              ${(avgCPC * item.verified_clicks)?.toFixed(2)}
            </div>
            {/* <div></div> */}
          </div>
        ))
        : null}
      {newsletter.length === 0 ? (
        <p className="font-[Inter] mt-4 text-[10px] text-center">
          No data is available yet. Please create and launch your first campaign
        </p>
      ) : null}
    </div>
  );
};

export default CampaignNewsletter;
