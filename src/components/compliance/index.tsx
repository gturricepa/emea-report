import { useEffect, useState } from "react";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { Table, Progress } from "antd";

interface ComplianceData {
  Country: string;
  "Data Privacy Policy": string | null;
  "SAFE FLEET Policy Acceptance": string | null;
  Pledge: string | null;
  "Policy Scope": string | null;
  "Insurance Policy Upload": string | null;
  "Manager Pledge": string | null;
}

interface ActivitySummary {
  activity: string;
  percent: number;
}
const activities = [
  "Data Privacy Policy",
  "SAFE FLEET Policy Acceptance",
  "Pledge",
  "Policy Scope",
  "Insurance Policy Upload",
  "Manager Pledge",
];

export const Compliance = () => {
  const [data, setData] = useState<ComplianceData[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = [
    "#009688",
    "#397cda",
    "#009688",
    "#397cda",
    "#009688",
    "#397cda",
  ];

  const selectedCountry = useSelector(
    (state: RootState) => state.country.selectedCountry
  );

  useEffect(() => {
    setLoading(true);
    fetch("/compliance.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: ComplianceData[] = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData);
      })
      .catch((err) => console.error("Erro lendo Excel:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredData =
    selectedCountry === "all"
      ? data
      : data.filter((item) => item.Country === selectedCountry);

  const summary = activities.map((activity) => {
    let totalApplicable = 0;
    let totalDone = 0;

    filteredData.forEach((item) => {
      const value = item[activity as keyof ComplianceData];

      if (value === null || value === undefined) return;

      const valLower = value.toString().trim().toLowerCase();

      // Conta como aplicável sempre
      totalApplicable++;

      // Só conta como feito se for diferente de "no" e "n/a"
      if (valLower !== "no" && valLower !== "n/a") {
        totalDone++;
      }
    });

    const percent =
      totalApplicable > 0 ? (totalDone / totalApplicable) * 100 : 0;

    return {
      activity,
      percent: parseFloat(percent.toFixed(2)),
    };
  });

  const columns = [
    {
      title: "Activity",
      dataIndex: "activity",
      key: "activity",
      width: 250,
    },
    {
      title: "Completion %",
      dataIndex: "percent",
      key: "percent",
      width: 200,
      render: (percent: number, _record: ActivitySummary, index: number) => (
        <Progress
          percent={percent}
          status={percent === 100 ? "success" : "active"}
          strokeWidth={12}
          strokeColor={colors[index % colors.length]}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Table
        columns={columns}
        dataSource={summary.map((item) => ({
          ...item,
          key: item.activity,
        }))}
        pagination={false}
        loading={loading}
      />
    </div>
  );
};
