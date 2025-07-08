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
  APMM: string;
  IPMM: string;
  Period: string;
  "# Accidents with Injuries": string;
}

export const CPMM = () => {
  const [data, setData] = useState<GeneralData[]>([]);
  const [selectedQuarters, setSelectedQuarters] = useState<
    ("Q1" | "Q2" | "Q3" | "Q4")[]
  >(["Q1"]);

  const selectedCountry = useSelector(
    (state: RootState) => state.country.selectedCountry
  );

  useEffect(() => {
    fetch("/cpmm.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: GeneralData[] = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData);
      })
      .catch((err) => console.error("Erro lendo Excel:", err));
  }, []);

  const toggleQuarter = (quarter: "Q1" | "Q2" | "Q3" | "Q4") => {
    setSelectedQuarters((prev) =>
      prev.includes(quarter)
        ? prev.filter((q) => q !== quarter)
        : [...prev, quarter]
    );
  };

  const filteredData =
    selectedCountry === "all"
      ? data.filter(
          (item) =>
            item.Country === "All Countries" &&
            selectedQuarters.includes(item.Period as "Q1" | "Q2" | "Q3" | "Q4")
        )
      : data.filter(
          (item) =>
            item.Country === selectedCountry &&
            selectedQuarters.includes(item.Period as "Q1" | "Q2" | "Q3" | "Q4")
        );

  const green = "#009688";
  const cppmGoal = 5.69;
  const ipmmGoal = 0.03;

  const chartData = selectedQuarters.map((quarter) => {
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

  const chartData2 = selectedQuarters.map((quarter) => {
    const entry = data.find(
      (item) =>
        item.Period === quarter &&
        (selectedCountry === "all"
          ? item.Country === "All Countries"
          : item.Country === selectedCountry)
    );

    return {
      quarter,
      IPMM: entry ? parseFloat(String(entry.IPMM).replace(",", ".")) : 0,
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
          width: "7rem",
          fontWeight: "bold",
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
      >
        {value}
        {unit}
      </span>
    );
  };

  const columns = [
    {
      title: "YTD",
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
      title: "Crashes Count",
      dataIndex: "Accident Count",
      key: "accidents",
    },
    {
      title: "% Vehicles in Crashes",
      dataIndex: "% Vehicles in Accidents",
      key: "percent",
    },
    {
      title: "Crashes with Injuries",
      dataIndex: "# Accidents with Injuries",
      key: "# Accidents with Injuries",
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
    {
      title: "Quarter",
      dataIndex: "Period",
      key: "Period",
    },
  ];

  const quarters: ("Q1" | "Q2" | "Q3" | "Q4")[] = ["Q1", "Q2", "Q3", "Q4"];

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16 }}>
        {quarters.map((quarter) => {
          const isDisabled = quarter === "Q3" || quarter === "Q4";
          const isSelected = selectedQuarters.includes(quarter);

          return (
            <Button
              key={quarter}
              type="default"
              onClick={() => toggleQuarter(quarter)}
              disabled={isDisabled}
              style={{
                backgroundColor: isSelected ? green : undefined,
                color: isSelected ? "white" : green,
                borderColor: green,
                opacity: isDisabled ? 0.4 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
            >
              <span
                style={{
                  backgroundColor: isSelected ? green : undefined,
                  color: isSelected ? "white" : green,
                  borderColor: green,
                  opacity: isDisabled ? 0.4 : 1,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                }}
              >
                {quarter}
              </span>
            </Button>
          );
        })}
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData.map((item, index) => ({
          ...item,
          key: index,
        }))}
        pagination={false}
      />

      {selectedQuarters.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <h3 style={{ width: "100%", textAlign: "center", marginTop: "2rem" }}>
            CPMM-IPMM by Quarter 2025
          </h3>
          <ResponsiveContainer
            width="45%"
            height={300}
            style={{
              backgroundColor: "white",
              borderRadius: "4px",
              padding: ".5rem",
            }}
          >
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="CPMM"
                fill={green}
                name="CPMM"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer
            width="45%"
            height={300}
            style={{
              backgroundColor: "white",
              borderRadius: "4px",
              padding: ".5rem",
            }}
          >
            <BarChart data={chartData2}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="IPMM"
                fill={green}
                name="IPMM"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
