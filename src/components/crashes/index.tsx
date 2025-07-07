import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import * as XLSX from "xlsx";
import * as S from "./styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Legend,
  Line,
} from "recharts";
import { Card } from "../card";
import { Select } from "antd";

const { Option } = Select;

interface CrasehsData {
  Date: string;
  Country: string;
  Classification: string;
  "Legal Entity Name": string;
  Fleet: string;
}

type CrashesDataWithYear = CrasehsData & { year: string | null };
type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

export const Crashes = () => {
  const [data, setData] = useState<CrasehsData[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);

  const selectedCountry = useSelector(
    (state: RootState) => state.country.selectedCountry
  );

  useEffect(() => {
    fetch("/crashes.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: CrasehsData[] = XLSX.utils.sheet_to_json(worksheet);

        const convertedData = jsonData.map((item) => {
          let dateString = item.Date;

          if (typeof item.Date === "number") {
            const excelDate = XLSX.SSF.parse_date_code(item.Date);
            if (excelDate) {
              const { y, m, d } = excelDate;
              dateString = `${y}-${String(m).padStart(2, "0")}-${String(
                d
              ).padStart(2, "0")}`;
            }
          }

          return {
            ...item,
            Date: dateString,
          };
        });

        setData(convertedData);
      })
      .catch((err) => console.error("Erro lendo Excel:", err));
  }, []);

  // Todas as entidades únicas
  const allEntities = Array.from(
    new Set(data.map((item) => item["Legal Entity Name"]))
  );

  // Aplicar filtros
  const filteredData = data.filter((item) => {
    const matchCountry =
      selectedCountry === "all" || item.Country === selectedCountry;
    const matchEntity =
      selectedEntities.length === 0 ||
      selectedEntities.includes(item["Legal Entity Name"]);
    return matchCountry && matchEntity;
  });

  // Adicionar ano
  const filteredDataWithYear: CrashesDataWithYear[] = filteredData.map(
    (item) => {
      const year = item.Date ? item.Date.slice(0, 4) : null;
      return { ...item, year };
    }
  );

  const data2024 = filteredDataWithYear.filter((item) => item.year === "2024");
  const data2025 = filteredDataWithYear.filter((item) => item.year === "2025");

  const total2024 = data2024.length;
  const total2025 = data2025.length;

  // Classificações
  const allClassifications = Array.from(
    new Set(data.map((item) => item.Classification))
  );

  const countClassifications = (dataset: CrashesDataWithYear[]) =>
    dataset.reduce((acc, curr) => {
      const key = curr.Classification;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const classificationCountsAllYears =
    countClassifications(filteredDataWithYear);

  const chartData = allClassifications.map((classification) => ({
    classification,
    count: classificationCountsAllYears[classification] || 0,
  }));

  // Trimestres
  const getQuarter = (month: number): Quarter => {
    if (month < 3) return "Q1";
    if (month < 6) return "Q2";
    if (month < 9) return "Q3";
    return "Q4";
  };

  const initQuarters = (): Record<Quarter, number> => ({
    Q1: 0,
    Q2: 0,
    Q3: 0,
    Q4: 0,
  });

  const quarters2024: Record<Quarter, number> = initQuarters();
  const quarters2025: Record<Quarter, number> = initQuarters();

  filteredDataWithYear.forEach((item) => {
    const date = new Date(item.Date);
    if (!isNaN(date.getTime())) {
      const quarter = getQuarter(date.getMonth());
      const year = date.getFullYear();
      if (year === 2024) quarters2024[quarter]++;
      else if (year === 2025) quarters2025[quarter]++;
    }
  });

  const lineChartData = (["Q1", "Q2", "Q3", "Q4"] as Quarter[]).map((q) => ({
    quarter: q,
    2024: quarters2024[q],
    2025: quarters2025[q],
  }));

  return (
    <S.Holder>
      <S.Left>
        {/* Filtro por Legal Entity */}
        <div style={{ marginBottom: "1rem" }}>
          <Select
            mode="multiple"
            style={{ width: "15rem" }}
            placeholder="Select Legal Entity Name(s)"
            onChange={setSelectedEntities}
            value={selectedEntities}
            allowClear
          >
            {allEntities.map((entity) => (
              <Option key={entity} value={entity}>
                {entity}
              </Option>
            ))}
          </Select>
        </div>

        <ResponsiveContainer
          height={500}
          style={{
            backgroundColor: "white",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          <BarChart data={chartData} layout="vertical" barCategoryGap={30}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="classification"
              width={350}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#009688" />
          </BarChart>
        </ResponsiveContainer>

        <span
          style={{
            padding: "1rem",
            backgroundColor: "white",
            borderRadius: "4px",
            textAlign: "center",
            display: "block",
          }}
        >
          Total: <b>{filteredData.length}</b>
        </span>
      </S.Left>

      <S.Right>
        <Card title="Year 2024" value={String(total2024)} footer="Crashes" />
        <Card title="Year 2025" value={String(total2025)} footer="Crashes" />
        <Card title="Total Injuries" value={"0"} footer="2024 - 2025" />

        <S.LittleChartHolder>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="2024"
                stroke="#009688"
                strokeWidth={1}
              />
              <Line
                type="monotone"
                dataKey="2025"
                stroke="#397cda"
                strokeWidth={1}
              />
            </LineChart>
          </ResponsiveContainer>
        </S.LittleChartHolder>
      </S.Right>
    </S.Holder>
  );
};
