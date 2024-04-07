import React, { useMemo } from "react";
import Card from "../../components/Card";
import { useSelector } from "react-redux";
import { selectData } from "../../store/dataSlice";

const CampaignStatsCard: React.FC<{ rootClassName?: string }> = (props) => {
  const { rootClassName } = props;
  const {
    clicked,
    selectedDateFilter,
    prevData,
    campaign: data,
  } = useSelector(selectData);
  const totalClicks = useMemo(
    () => clicked.reduce((prev, item) => prev + Number(item?.count ?? 0), 0),
    [clicked]
  );

  const uniqueClicks = useMemo(
    () =>
      clicked.reduce((prev, item) => prev + Number(item?.unique_click ?? 0), 0),
    [clicked]
  );

  const totalSpend = useMemo(
    () => data.reduce((prev, item) => prev + Number(item?.price ?? 0), 0),
    [data]
  );

  const verifiedClicks = useMemo(
    () =>
      clicked.reduce(
        (prev, item) =>
          prev +
          Number(
            item?.user_medium === "newsletter" &&
              item.duration > item.count * 1.2 &&
              item.duration > 0
              ? item?.unique_click
              : 0
          ),
        0
      ),
    [clicked]
  );

  const avgCPC =
    totalSpend === 0 || verifiedClicks === 0
      ? 0
      : totalSpend / verifiedClicks > 10
      ? 10
      : totalSpend / verifiedClicks;

  const calculateChangeDirection = (oldValue: number, newValue: number) => {
    const difference = newValue - oldValue;
    const percentageDifference =
      oldValue > 0 ? (difference / oldValue) * 100 : 100;
    let changeDirection;
    if (difference > 0) {
      changeDirection = "increase";
    } else if (difference < 0) {
      changeDirection = "decrease";
    } else {
      changeDirection = "no change";
    }

    return (
      <div className="flex gap-2">
        {selectedDateFilter !== "All Time" ? (
          <div
            className={`${
              changeDirection === "decrease" ? "bg-error" : "bg-main"
            } rounded-[10px] w-[14px] h-[14px] font-[Inter] leading-[12px] text-[10px] font-medium text-primary text-center`}
          >
            {changeDirection === "decrease" ? (
              <span className="text-[white]">-</span>
            ) : (
              <span>+</span>
            )}
          </div>
        ) : null}
        <p className="text-[#172935] text-[10px] font-semibold">
          {selectedDateFilter !== "All Time"
            ? `${Math.abs(percentageDifference).toFixed(
                2
              )}% from ${selectedDateFilter}`
            : "All Time"}
        </p>
      </div>
    );
  };

  return (
    <div
      className={
        rootClassName
          ? rootClassName
          : `rounded-[10px] grid grid-cols-5 gap-3 min-h-[90px]`
      }
    >
      <Card
        title={"Total Clicks"}
        value={totalClicks}
        percentageText={calculateChangeDirection(
          prevData.totalClicks,
          totalClicks
        )}
      />
      <Card
        title={"Unique Clicks"}
        value={uniqueClicks}
        percentageText={calculateChangeDirection(
          prevData.uniqueClicks,
          uniqueClicks
        )}
      />
      <Card
        title={"Verified Clicks"}
        value={verifiedClicks}
        percentageText={calculateChangeDirection(
          prevData.verifiedClicks,
          verifiedClicks
        )}
      />
      <Card
        title={"Total Budget"}
        value={`$${totalSpend}`}
        percentageText={calculateChangeDirection(
          prevData.totalBudget,
          totalSpend
        )}
      />
      <Card
        title={"AVG CPC"}
        value={`$${avgCPC.toFixed(2)}`}
        percentageText={calculateChangeDirection(prevData.avgCPC, avgCPC)}
      />
    </div>
  );
};

export default CampaignStatsCard;
