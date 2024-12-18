import React from "react";
import Card from "../../components/Card";
import { useSelector } from "react-redux";
import { selectData } from "../../store/dataSlice";
import useAnalytics from "../../hooks/useAnalytics";
import { selectAuth } from "../../store/authSlice";

const CampaignStatsCard: React.FC<{ rootClassName?: string }> = (props) => {
  const { rootClassName } = props;
  const {
    clicked,
    selectedDateFilter,
    prevData,
    campaign: data,
    selectedPubllication,
  } = useSelector(selectData);
  const { isCreatorAuthenticated } = useSelector(selectAuth);
  const { totalClicks, uniqueClicks, totalBudget, avgCPC } = useAnalytics(
    clicked,
    data
  );

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
          : `rounded-[10px] grid ${
              isCreatorAuthenticated ? "grid-cols-4" : "grid-cols-4"
            } gap-3 min-h-[90px]`
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
      {/* {!isCreatorAuthenticated ? (
        <Card
          title={"Unique Clicks"}
          value={uniqueClicks}
          percentageText={calculateChangeDirection(
            prevData.uniqueClicks,
            uniqueClicks
          )}
        />
      ) : null} */}
      <Card
        title={"Verified Clicks"}
        value={uniqueClicks}
        percentageText={calculateChangeDirection(
          prevData.uniqueClicks,
          uniqueClicks
        )}
      />
      {isCreatorAuthenticated ? (
        <>
          <Card
            title={"Revenue Earned"}
            value={`$${(
              selectedPubllication?.cpc * Number(uniqueClicks)
            ).toFixed(2)}`}
            percentageText={calculateChangeDirection(
              selectedPubllication?.cpc * prevData.uniqueClicks,
              selectedPubllication?.cpc * uniqueClicks
            )}
          />
          <Card
            title={"Total Paid Out"}
            value={`$${0}`}
            percentageText={<div className="flex gap-2 h-[14px]"></div>}
          />
        </>
      ) : (
        <>
          <Card
            title={"AVG CPC"}
            value={`$${avgCPC.toFixed(2)}`}
            percentageText={calculateChangeDirection(prevData.avgCPC, avgCPC)}
          />
          <Card
            title={"Total Budget"}
            value={`$${totalBudget}`}
            percentageText={<div className="flex gap-2 h-[14px]"></div>}
          />
        </>
      )}
    </div>
  );
};

export default CampaignStatsCard;
