import { useMemo } from "react";
import { getVerifiedClick } from "../utils/commonUtils";

const useAnalytics = (clicked: any[], data: any[]) => {
  const totalClicks = useMemo(
    () => clicked.reduce((prev, item) => prev + Number(item?.count ?? 0), 0),
    [clicked]
  );

  const uniqueClicks = useMemo(
    () =>
      clicked.reduce((prev, item) => prev + Number(item?.unique_click ?? 0), 0),
    [clicked]
  );

  const totalBudget = useMemo(
    () =>
      data.reduce(
        (prev, item) =>
          prev + (item.state === "active" ? Number(item?.price ?? 0) : 0),
        0
      ),
    [data]
  );

  const verifiedClicks = useMemo(
    () => clicked.reduce((prev, item) => prev + getVerifiedClick(item), 0),
    [clicked]
  );

  const avgCPC =
    totalBudget === 0 || uniqueClicks === 0
      ? 0
      : totalBudget / uniqueClicks > 11
        ? 11
        : totalBudget / uniqueClicks;

  const totalSpend = (uniqueClicks * avgCPC).toFixed(2);

  return {
    totalClicks,
    uniqueClicks,
    totalBudget,
    verifiedClicks,
    avgCPC,
    totalSpend,
  };
};

export default useAnalytics;
