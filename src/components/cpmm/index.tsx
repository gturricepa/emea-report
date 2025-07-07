import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import * as XLSX from "xlsx";
import { Table, Button, Space } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface GeneralData {
  Country: string;
  "Vehicles Count": string;
  Miles: string;
  "Accident Count": string;
  "% Vehicles in Accidents": string;
  APMM: string; // CPMM real
  IPMM: string;
  Period: string;
}

export const CPMM = () => {
  const [data, setData] = useState<GeneralData[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState<"Q1" | "Q2">("Q1");

  const selectedCountry = useSelector(
    (state: RootState) => state.country.selectedCountry
  );

  useEffect(() => {
    fetch("/cpmm.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: GeneralData[] = XLSX.utils.sheet_to_json(worksheet);
        if (jsonData.length > 0) {
          setData(jsonData);
        }
      })
      .catch((err) => console.error("Erro lendo Excel:", err));
  }, []);

  const filteredData =
    selectedCountry === "all"
      ? data.filter(
          (item) =>
            item.Country === "All Countries" && item.Period === selectedQuarter
        )
      : data.filter(
          (item) =>
            item.Country === selectedCountry && item.Period === selectedQuarter
        );

  const green = "#009688";
  const cppmGoal = 5.69;
  const ipmmGoal = 0.03;

  const chartData = ["Q1", "Q2"].map((quarter) => {
    const entry = data.find(
      (item) =>
        item.Period === quarter &&
        (selectedCountry === "all"
          ? item.Country === "All Countries"
          : item.Country === selectedCountry)
    );

    return {
      quarter,
      CPMM: entry ? parseFloat(String(entry.APMM).replace(",", ".")) : 0,
    };
  });

  const chartData2 = ["Q1", "Q2"].map((quarter) => {
    const entry = data.find(
      (item) =>
        item.Period === quarter &&
        (selectedCountry === "all"
          ? item.Country === "All Countries"
          : item.Country === selectedCountry)
    );

    return {
      quarter,
      CPMM: entry ? parseFloat(String(entry.IPMM).replace(",", ".")) : 0,
    };
  });

  const renderColoredCell = (value: string, goal: number, unit?: string) => {
    const numValue = parseFloat(String(value).replace(",", "."));
    const isAboveGoal = numValue > goal;
    const color = isAboveGoal ? "#c91313" : "#169c57";
    const backgroundColor = isAboveGoal
      ? "rgba(255, 0, 0, 0.15)"
      : "rgba(0, 128, 0, 0.15)";

    return (
      <span
        style={{
          color,
          borderRadius: "4px",
          border: `1px solid ${color}`,
          backgroundColor,
          display: "inline-block",
          minWidth: "50px",
          textAlign: "center",
          padding: "2px 8px",
        }}
      >
        {value}
        {unit}
      </span>
    );
  };

  const columns = [
    {
      title: "Country",
      dataIndex: "Country",
      key: "country",
    },
    {
      title: "Vehicles Count",
      dataIndex: "Vehicles Count",
      key: "vehicles",
    },
    {
      title: "Miles",
      dataIndex: "Miles",
      key: "miles",
    },
    {
      title: "Accident Count",
      dataIndex: "Accident Count",
      key: "accidents",
    },
    {
      title: "% Vehicles in Accidents",
      dataIndex: "% Vehicles in Accidents",
      key: "percent",
    },
    {
      title: "CPMM",
      dataIndex: "APMM",
      key: "cpmm",
      render: (value: string) => renderColoredCell(value, cppmGoal),
    },
    {
      title: "IPMM",
      dataIndex: "IPMM",
      key: "ipmm",
      render: (value: string) => renderColoredCell(value, ipmmGoal),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="default"
          onClick={() => setSelectedQuarter("Q1")}
          style={{
            backgroundColor: selectedQuarter === "Q1" ? green : undefined,
            color: selectedQuarter === "Q1" ? "white" : green,
            borderColor: green,
          }}
        >
          <span
            style={{
              color: selectedQuarter === "Q1" ? "white" : "green",
            }}
          >
            Q1
          </span>
        </Button>
        <Button
          type="default"
          onClick={() => setSelectedQuarter("Q2")}
          style={{
            backgroundColor: selectedQuarter === "Q2" ? green : undefined,
            color: selectedQuarter === "Q2" ? "white" : green,
            borderColor: green,
          }}
        >
          <span
            style={{
              color: selectedQuarter === "Q1" ? "green" : "white",
            }}
          >
            Q2
          </span>
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData.map((item, index) => ({
          ...item,
          key: index,
        }))}
        pagination={false}
      />

      <h3 style={{ width: "100%", textAlign: "center", marginTop: "2rem" }}>
        CPMM-IPMM by Quarter 2025
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveContainer
          width="40%"
          height={300}
          style={{ backgroundColor: "white", borderRadius: "4px" }}
        >
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="CPMM" fill={green} name="CPMM" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer
          width="40%"
          height={300}
          style={{ backgroundColor: "white", borderRadius: "4px" }}
        >
          <BarChart data={chartData2}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="CPMM" fill={green} name="IPMM" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
