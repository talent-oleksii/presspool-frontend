const getPlaceHolder = (name: string) => {
  if (!name) return "";
  const names = name.split(" ");
  if (names.length === 2) {
    return `${names[0].at(0)}${names[1].at(0)}`;
  } else if (names.length === 1) {
    return `${names[0].at(0)}`;
  } else {
    return "";
  }
};

const getVerifiedClick = (item: any) => {
  return Number(
    (item?.user_medium === "newsletter" || item?.user_medium === "referral") &&
      item.duration > item.count * 1.5 &&
      item.duration > 0
      ? item?.unique_click
      : 0
  );
};

export { getPlaceHolder, getVerifiedClick };
