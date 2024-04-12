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

export { getPlaceHolder };
