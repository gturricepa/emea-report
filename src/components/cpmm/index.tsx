import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import * as XLSX from "xlsx";
import { Table, Button, Space, Spin } from "antd";
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
  const [loading, setLoading] = useState(true);
  const [selectedQuarters, setSelectedQuarters] = useState<
    ("Q1" | "Q2" | "Q3" | "Q4")[]
  >(["Q1"]);

  const selectedCountry = useSelector(
    (state: RootState) => state.country.selectedCountry
  );

  useEffect(() => {
    setLoading(true);
    fetch("/cpmm-final.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: GeneralData[] = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData);
      })
      .catch((err) => console.error("Erro lendo Excel:", err))
      .finally(() => setLoading(false));
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
      title: "Quarter",
      dataIndex: "Period",
      key: "Period",
      width: 100,
    },
    {
      title: "YTD",
      dataIndex: "Country",
      key: "country",
      width: 150,
    },
    {
      title: "Vehicles Count",
      dataIndex: "Vehicles Count",
      key: "vehicles",
      width: 150,
    },
    {
      title: "Miles",
      dataIndex: "Miles",
      key: "miles",
      width: 100,
    },
    {
      title: "Crashes Count",
      dataIndex: "Accident Count",
      key: "accidents",
      width: 150,
    },
    {
      title: "% Vehicles in Crashes",
      dataIndex: "% Vehicles in Accidents",
      key: "percent",
      width: 200,
    },
    {
      title: "Crashes with Injuries",
      dataIndex: "# Accidents with Injuries",
      key: "# Accidents with Injuries",
      width: 200,
    },
    {
      title: "CPMM",
      dataIndex: "APMM",
      key: "cpmm",
      render: (value: string) => renderColoredCell(value, cppmGoal),
      width: 100,
    },
    {
      title: "IPMM",
      dataIndex: "IPMM",
      key: "ipmm",
      render: (value: string) => renderColoredCell(value, ipmmGoal),
      width: 100,
    },
  ];
  const quarterOrder: ("Q1" | "Q2" | "Q3" | "Q4")[] = ["Q1", "Q2", "Q3", "Q4"];
  const quarters: ("Q1" | "Q2" | "Q3" | "Q4")[] = ["Q1", "Q2", "Q3", "Q4"];
  type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
  const sortByQuarterOrder = <T extends { quarter: string }>(arr: T[]) =>
    [...arr].sort(
      (a, b) =>
        quarterOrder.indexOf(a.quarter as Quarter) -
        quarterOrder.indexOf(b.quarter as Quarter)
    );

  const chartData = sortByQuarterOrder(
    selectedQuarters.map((quarter) => {
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
    })
  );

  const chartData2 = sortByQuarterOrder(
    selectedQuarters.map((quarter) => {
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
    })
  );

  const showAccumulated = selectedQuarters.length > 1;

  const accumulatedData = (() => {
    if (!showAccumulated) return null;

    const relevantData = filteredData.filter((item) =>
      selectedQuarters.includes(item.Period as Quarter)
    );

    // Variáveis para soma total de métricas
    let totalMiles = 0;
    let totalVehicles = 0;
    let totalCrashes = 0;
    let totalInjuries = 0;

    for (const item of relevantData) {
      const miles = parseFloat(String(item.Miles).replace(",", ".")) || 0;
      const vehicles = parseInt(item["Vehicles Count"]) || 0;
      const crashes = parseInt(item["Accident Count"]) || 0;
      const injuries = parseInt(item["# Accidents with Injuries"]) || 0;

      totalMiles += miles;
      totalVehicles += vehicles;
      totalCrashes += crashes;
      totalInjuries += injuries;
    }

    // Recalcula CPMM e IPMM no acumulado, pois a métrica precisa ser feita a partir dos totais
    const accumulatedCPMM =
      totalMiles > 0 ? (totalCrashes * 1_000_000) / totalMiles : 0;
    const accumulatedIPMM =
      totalMiles > 0 ? (totalInjuries * 1_000_000) / totalMiles : 0;

    return [
      {
        Period: "YTD Q2 2025",
        Country: selectedCountry === "all" ? "All Countries" : selectedCountry,
        "Vehicles Count": totalVehicles.toString(),
        Miles: totalMiles.toFixed(0),
        "Accident Count": totalCrashes.toString(),
        "% Vehicles in Accidents":
          totalVehicles > 0
            ? ((totalCrashes / totalVehicles) * 100).toFixed(2)
            : "0",
        "# Accidents with Injuries": totalInjuries.toString(),
        APMM: accumulatedCPMM.toFixed(2), // Aqui está o cálculo correto do CPMM acumulado
        IPMM: accumulatedIPMM.toFixed(2), // Aqui o cálculo correto do IPMM acumulado
      },
    ];
  })();
  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "5rem" }}
      >
        <Spin size="small" tip="Carregando dados..." />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16 }}>
        {quarters.map((quarter) => {
          const isDisabled =
            quarter === "Q3" || quarter === "Q4" || quarter === "Q2";
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
      {showAccumulated && accumulatedData && (
        <>
          <Table
            columns={columns}
            showHeader={false}
            dataSource={accumulatedData.map((item, index) => ({
              ...item,
              key: `acc-${index}`,
            }))}
            pagination={false}
          />
        </>
      )}

      {selectedQuarters.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: "2rem",
          }}
        >
          <ResponsiveContainer
            width="30%"
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
            width="30%"
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
                fill={"#154a65"}
                name="IPMM"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          {showAccumulated && accumulatedData && (
            <>
              <ResponsiveContainer
                width="30%"
                height={300}
                style={{
                  backgroundColor: "white",
                  borderRadius: "4px",
                  padding: ".5rem",
                }}
              >
                <BarChart data={accumulatedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="APMM"
                    name="CPMM"
                    fill={green}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="IPMM"
                    name="IPMM"
                    fill={"#154a65"}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      )}
    </div>
  );
};
