import { Parser } from "json2csv";

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.error("No data available for export.");
    return;
  }

  const fields = Object.keys(data[0]);
  const parser = new Parser({ fields });
  const csv = parser.parse(data);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
