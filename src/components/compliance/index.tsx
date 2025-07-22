import { useEffect, useState } from "react";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { Table, Progress } from "antd";
import { Card } from "../card";

interface ComplianceData {
  Country: string;
  "Data Privacy Policy": string | null;
  "SAFE FLEET Policy Acceptance": string | null;
  Pledge: string | null;
  "Policy Scope": string | null;
  "Insurance Policy Upload": string | null;
  "Manager Pledge": string | null;
  Status: string;
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
  "Elearning 1",
  "Elearning 2",
  "Elearning 3",
  "Elearning 4",
  "Personal Vehicle Questionnaire 2025",
  "SAFE FLEET Policy Module Questions 2025",
  "Driver Assessment LATAM 2025 (Does not contain a video)",
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
    "#009688",
    "#397cda",
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
    fetch("/assets/compliance1-prod.xlsx")
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
      const rawValue = item[activity as keyof ComplianceData];
      if (!rawValue) return; // ignora null, undefined ou vazio

      const valLower = rawValue.toString().trim().toLowerCase();

      if (valLower === "n/a") return; // ignora "n/a" completamente

      // Conta como aplicável
      totalApplicable++;

      // Conta como feito se não for "no"
      if (valLower !== "no") {
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

  const total = filteredData.length;
  const totalComplete = filteredData.filter(
    (filter) => filter.Status === "Complete"
  );

  const percetage = (
    (Number(totalComplete.length) / Number(total)) *
    100
  ).toFixed(2);

  console.log(loading);

  return (
    <div style={{ padding: 20 }}>
      {!loading && (
        <div style={{ marginBottom: "1rem" }}>
          <Card title=" % Total Complete" value={percetage} />
        </div>
      )}

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
