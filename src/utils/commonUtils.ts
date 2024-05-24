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
      item.duration > item.count * 0.37 &&
      item.duration > 0
      ? item?.unique_click
      : 0
  );
};

// Function to convert JSON to CSV
const jsonToCSV = (jsonData: any[]) => {
  const csvRows: string[] = [];
  const headers = Object.keys(jsonData[0]);
  csvRows.push(headers.join(","));

  for (const row of jsonData) {
    const values = headers.map((header) => {
      let value = row[header];
      if (Array.isArray(value)) {
        value = value.map((val: string) => val.replace(/"/g, '""')).join(",");
      } else if (typeof value === "object" && value !== null) {
        value = JSON.stringify(value);
      }
      const escaped = ("" + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
};
// Function to download CSV file
const downloadCSVFile = (csv: any, filename: any) => {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export { getPlaceHolder, getVerifiedClick, jsonToCSV, downloadCSVFile };
