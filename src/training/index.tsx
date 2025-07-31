// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../store";
// import * as XLSX from "xlsx";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   CartesianGrid,
//   LineChart,
//   Line,
// } from "recharts";
// import { Card } from "../components/card";

// type Quarter = "Q1" | "Q2";

// type TrainingData = {
//   Quarter: Quarter;
//   Country: string;
//   HRD: number | string;
//   "Commentary Drive": number | string;
//   PIFS: number | string;
//   BTW: number | string;
//   Year: number;
//   CPMM: number | string;
// };

// type ChartData = {
//   Quarter: Quarter;
//   [year: number]: number;
// };

// type CPMMChartPoint = {
//   label: string; // ex: "Q1 2024"
//   CPMM: number;
// };

// const prepareChartData = (
//   data: TrainingData[],
//   field: keyof TrainingData
// ): ChartData[] => {
//   const quarters: Quarter[] = ["Q1", "Q2"];
//   const years = [2024, 2025];

//   return quarters.map((q) => {
//     const row: ChartData = { Quarter: q };
//     years.forEach((y) => {
//       row[y] = data
//         .filter((item) => item.Quarter === q && item.Year === y)
//         .reduce((acc, curr) => acc + Number(curr[field] || 0), 0);
//     });
//     return row;
//   });
// };

// const FieldBarChart = ({
//   data,
//   field,
//   label,
// }: {
//   data: TrainingData[];
//   field: keyof TrainingData;
//   label: string;
// }) => {
//   const chartData = prepareChartData(data, field);

//   return (
//     <div style={{ flex: "1 1 300px", minWidth: 300, marginBottom: 10 }}>
//       <h3 style={{ textAlign: "center" }}>{label}</h3>
//       <ResponsiveContainer
//         width="100%"
//         height={300}
//         style={{
//           backgroundColor: "white",
//           borderRadius: "4px",
//           marginBottom: "1rem",
//           padding: ".5rem",
//         }}
//       >
//         <BarChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="Quarter" />
//           <YAxis allowDecimals={false} />
//           <Tooltip />
//           <Legend />
//           <Bar
//             dataKey={2024}
//             fill="#8884d8"
//             name="2024"
//             radius={[0, 4, 4, 0]}
//           />
//           <Bar
//             dataKey={2025}
//             fill="#009688"
//             name="2025"
//             radius={[0, 4, 4, 0]}
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// const prepareCPMMChartData = (data: TrainingData[]): CPMMChartPoint[] => {
//   const quarters: Quarter[] = ["Q1", "Q2"];
//   const years = [2024, 2025];
//   const order = { Q1: 1, Q2: 2 };

//   console.log("Dados brutos recebidos para CPMM:", data);

//   const result: CPMMChartPoint[] = [];

//   years.forEach((year) => {
//     quarters.forEach((quarter) => {
//       const item = data.find((d) => d.Quarter === quarter && d.Year === year);
//       const CPMM = item ? Number(item.CPMM) || 0 : 0;
//       const label = `${quarter} ${year}`;
//       console.log(`Encontrado CPMM para ${label}:`, CPMM);
//       result.push({ label, CPMM });
//     });
//   });

//   // Ordena pela ordem natural Q1/Q2 e ano
//   result.sort((a, b) => {
//     const [qA, yA] = a.label.split(" ");
//     const [qB, yB] = b.label.split(" ");
//     if (+yA !== +yB) return +yA - +yB;
//     return order[qA as Quarter] - order[qB as Quarter];
//   });

//   console.log("Dados formatados para gráfico CPMM:", result);

//   return result;
// };

// const CPMMLineChart = ({ data }: { data: TrainingData[] }) => {
//   const chartData = prepareCPMMChartData(data);

//   return (
//     <div style={{ width: "80%", marginBottom: 40 }}>
//       <h3 style={{ textAlign: "center" }}>CPMM</h3>
//       <ResponsiveContainer
//         width="100%"
//         height={300}
//         style={{ backgroundColor: "white" }}
//       >
//         <LineChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="label" />
//           <YAxis allowDecimals={false} />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="CPMM"
//             stroke="#ff7300"
//             activeDot={{ r: 8 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export const Trainings = () => {
//   const [data, setData] = useState<TrainingData[]>([]);
//   const [loading, setLoading] = useState(true);

//   const selectedCountry = useSelector(
//     (state: RootState) => state.country.selectedCountry
//   );

//   useEffect(() => {
//     setLoading(true);
//     fetch("/assets/trainings.xlsx")
//       .then((res) => res.arrayBuffer())
//       .then((buffer) => {
//         const workbook = XLSX.read(buffer, { type: "array" });
//         const firstSheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[firstSheetName];
//         const jsonData: TrainingData[] = XLSX.utils.sheet_to_json(worksheet, {
//           defval: 0, // valores vazios viram zero
//         });
//         if (jsonData.length > 0) {
//           setData(jsonData);
//         }
//       })
//       .catch((err) => console.error("Erro lendo Excel:", err))
//       .finally(() => setLoading(false));
//   }, []);

//   const filteredData =
//     selectedCountry === "all"
//       ? data.filter((item) => item.Country === "All Countries")
//       : data.filter((item) => item.Country === selectedCountry);

//   console.log("Dados filtrados por país:", filteredData);

//   if (loading) return <p>Loading...</p>;

//   if (filteredData.length === 0)
//     return <p>No data found for selected country.</p>;

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexWrap: "wrap",
//         gap: 20,
//         width: "100%",
//         justifyContent: "center",
//       }}
//     >
//       <FieldBarChart data={filteredData} field="HRD" label="HRD" />
//       <FieldBarChart data={filteredData} field="PIFS" label="PIFS" />
//       <FieldBarChart
//         data={filteredData}
//         field="Commentary Drive"
//         label="Commentary Drive"
//       />
//       <FieldBarChart data={filteredData} field="BTW" label="BTW" />
//       <CPMMLineChart data={filteredData} />
//     </div>
//   );
// };

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
  Line,
} from "recharts";

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

const prepareCPMMByYearAndQuarter = (
  data: TrainingData[],
  years: number[],
  quarters: Quarter[]
) => {
  const cpmms: { [key: string]: number } = {};

  quarters.forEach((q) => {
    years.forEach((y) => {
      const item = data.find((d) => d.Quarter === q && d.Year === y);
      cpmms[`${q}_${y}`] = item ? Number(item.CPMM) || 0 : 0;
    });
  });

  return cpmms;
};

const FieldBarChart = ({
  data,
  field,
  label,
}: {
  data: TrainingData[];
  field: keyof TrainingData;
  label: string;
}) => {
  const quarters: Quarter[] = ["Q1", "Q2"];
  const years = [2024, 2025];

  const chartData = prepareChartData(data, field);
  const cpmms = prepareCPMMByYearAndQuarter(data, years, quarters);

  const enhancedChartData = chartData.map((row) => ({
    ...row,
    CPMM_2024: cpmms[`${row.Quarter}_2024`],
    CPMM_2025: cpmms[`${row.Quarter}_2025`],
  }));

  return (
    <div
      style={{
        flex: "1 1 48%",
        minWidth: 450,
        maxWidth: 600,
        marginBottom: 40,
        backgroundColor: "white",
        borderRadius: 8,
        padding: "1rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ textAlign: "center" }}>{label}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={enhancedChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Quarter" />
          <YAxis allowDecimals={false} />
          <YAxis
            yAxisId="right"
            orientation="right"
            allowDecimals={false}
            stroke="#ff7300"
          />
          <Tooltip />
          <Legend />
          <Bar dataKey={2024} fill="#8884d8" name="2024" />
          <Bar dataKey={2025} fill="#009688" name="2025" />
          <Line
            type="monotone"
            dataKey="CPMM_2024"
            stroke="#ff7300"
            name="CPMM 2024"
            strokeWidth={1}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            yAxisId="right"
          />
          <Line
            type="monotone"
            dataKey="CPMM_2025"
            stroke="#de119d"
            name="CPMM 2025"
            strokeWidth={1}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            yAxisId="right"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const Trainings = () => {
  const [data, setData] = useState<TrainingData[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCountry = useSelector(
    (state: RootState) => state.country.selectedCountry
  );

  useEffect(() => {
    setLoading(true);
    fetch("/assets/trainings Van 2.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: TrainingData[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: 0,
        });
        if (jsonData.length > 0) {
          setData(jsonData);
        }
      })
      .catch((err) => console.error("Erro lendo Excel:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredData =
    selectedCountry === "all"
      ? data.filter((item) => item.Country === "All Countries")
      : data.filter((item) => item.Country === selectedCountry);

  console.log(filteredData);
  if (loading) return <p>Loading...</p>;
  if (filteredData.length === 0)
    return <p>No data found for selected country.</p>;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 24,
        width: "100%",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          // backgroundColor: "red",
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FieldBarChart data={filteredData} field="BTW" label="BTW" />
      </div>

      {/* <FieldBarChart data={filteredData} field="HRD" label="HRD" /> */}
      <FieldBarChart data={filteredData} field="PIFS" label="PIFS" />
      <FieldBarChart
        data={filteredData}
        field="Commentary Drive"
        label="Commentary Drive"
      />
    </div>
  );
};
