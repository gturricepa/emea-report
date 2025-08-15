import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

// === TIPOS ===

type Quarter = "Q1" | "Q2";

type TrainingData = {
  Quarter: string;
  Country: string;
  HRD: number | string;
  "Commentary Drive": number | string;
  PIFS: number | string;
  BTW: number | string;
  Year: number;
  CPMM: string | number;
};

type ChartData = {
  Quarter: string;
  [year: number]: number;
};

// === UTILIDADES ===

const prepareChartData = (
  data: TrainingData[],
  field: keyof TrainingData
): ChartData[] => {
  const quarters: Quarter[] = ["Q1", "Q2"];
  const years = [2024, 2025];

  return quarters.map((q) => {
    const row: ChartData = { Quarter: q };
    years.forEach((y) => {
      row[y] = data
        .filter((item) => item.Quarter === q && item.Year === y)
        .reduce((acc, curr) => acc + Number(curr[field] || 0), 0);
    });
    return row;
  });
};

// === COMPONENTES ===

const FieldBarChart = ({
  data,
  field,
  label,
}: {
  data: TrainingData[];
  field: keyof TrainingData;
  label: string;
}) => {
  const chartData = prepareChartData(data, field);

  return (
    <div
      style={{
        marginBottom: 20,
        backgroundColor: "white",
        borderRadius: 8,
        padding: "1rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: 600,
      }}
    >
      <h3 style={{ textAlign: "center" }}>{label}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Quarter" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey={2024} fill="#8884d8" name="2024" />
          <Bar dataKey={2025} fill="#009688" name="2025" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const CPMMLineChart = ({ data }: { data: TrainingData[] }) => {
  const quarters: Quarter[] = ["Q1", "Q2"];

  type DataEntry = {
    Quarter: string;
    Year: number;
    CPMM: number | string;
  };

  type ChartPoint = {
    Quarter: string;
  } & {
    [key: `CPMM_${number}`]: number;
  };

  const chartData: ChartPoint[] = quarters.map((quarter) => {
    const point: ChartPoint = { Quarter: quarter };

    [2024, 2025].forEach((year) => {
      const entry = data.find(
        (d: DataEntry) => d.Quarter === quarter && d.Year === year
      );
      point[`CPMM_${year}`] = entry ? Number(entry.CPMM) || 0 : 0;
    });

    return point;
  });

  return (
    <div
      style={{
        marginBottom: 20,
        backgroundColor: "white",
        borderRadius: 8,
        padding: "1rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: 600,
      }}
    >
      <h3 style={{ textAlign: "center" }}>CPMM</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Quarter" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="CPMM_2024"
            stroke="#ff7300"
            name="CPMM 2024"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="CPMM_2025"
            stroke="#de119d"
            name="CPMM 2025"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// === COMPONENTE PRINCIPAL ===

export const Trainings = () => {
  const [data, setData] = useState<TrainingData[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCountry = useSelector(
    (state: RootState) => state.country.selectedCountry
  );

  useEffect(() => {
    setLoading(true);
    fetch("assets/trainings Van 3 1.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: TrainingData[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: 0,
        });
        setData(jsonData);
      })
      .catch((err) => console.error("Erro lendo Excel:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredData =
    selectedCountry === "all"
      ? data.filter((item) => item.Country === "All Countries")
      : data.filter((item) => item.Country === selectedCountry);

  if (loading) return <p>Loading...</p>;
  if (filteredData.length === 0)
    return <p>No data found for selected country.</p>;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "2rem",
        padding: "2rem",
      }}
    >
      <FieldBarChart data={filteredData} field="BTW" label="BTW" />
      <CPMMLineChart data={filteredData} />
      <FieldBarChart data={filteredData} field="PIFS" label="PIFS" />
      <FieldBarChart
        data={filteredData}
        field="Commentary Drive"
        label="Commentary Drive"
      />
    </div>
  );
};
