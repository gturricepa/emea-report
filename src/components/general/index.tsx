import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Card } from "../card";
import * as S from "./styles";
import type { RootState } from "../../store";
import { WorldMap } from "react-svg-worldmap";
import { AimOutlined, StockOutlined } from "@ant-design/icons";

interface GeneralData {
  Country: string;
  "Vehicles Count": string;
  Miles: string;
  "Accident Count": string;
  "% Vehicles in Accidents": string;
  APMM: string;
  IPMM: string;
  HRD: string;
  "Commentary Drive": string;
  PIFS: string;
  BTW: "string";
}

interface TableRow {
  key: string;
  title: string;
  value: number | string;
}

export const General = () => {
  const [data, setData] = useState<GeneralData[]>([]);

  const selectedCountry = useSelector(
    (state: RootState) => state.country.selectedCountry
  );

  useEffect(() => {
    fetch("/main-total.xlsx")
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
      ? data.filter((item) => item.Country === "All Countries")
      : data.filter((item) => item.Country === selectedCountry);

  const totalCrashes = filteredData.reduce(
    (acc, item) => acc + Number(item["Accident Count"] || 0),
    0
  );
  const totalCars = filteredData.reduce(
    (acc, item) => acc + Number(item["Vehicles Count"] || 0),
    0
  );
  const totalMiles = filteredData.reduce(
    (acc, item) => acc + Number(item.Miles || 0),
    0
  );
  const totalPercentage = filteredData.reduce(
    (acc, item) => acc + Number(item["% Vehicles in Accidents"] || 0),
    0
  );
  const totalCPMM = filteredData.reduce(
    (acc, item) => acc + Number(item.APMM || 0),
    0
  );
  const totalIPMM = filteredData.reduce(
    (acc, item) => acc + Number(item.IPMM || 0),
    0
  );

  const totalHRD = filteredData.reduce(
    (acc, item) => acc + Number(item.HRD || 0),
    0
  );

  const totalCommentaryDrive = filteredData.reduce(
    (acc, item) => acc + Number(item["Commentary Drive"] || 0),
    0
  );
  const totalPIFS = filteredData.reduce(
    (acc, item) => acc + Number(item.PIFS || 0),
    0
  );

  const totalBTW = filteredData.reduce(
    (acc, item) => acc + Number(item.BTW || 0),
    0
  );

  const cppmGoal = 5.69;
  const ipmmGoal = 0.03;

  const tableData: TableRow[] = [
    { key: "miles", title: "Miles", value: totalMiles },
    { key: "cars", title: "Vehicles", value: totalCars },
    { key: "crashes", title: "Crashes", value: totalCrashes },
    {
      key: "percentage",
      title: "Vehicles in Crashes %",
      value: totalPercentage,
    },
    { key: "injuries", title: "Crashes with Injuries", value: "0" },
    { key: "cpmm", title: "CPMM", value: totalCPMM },
    { key: "ipmm", title: "IPMM", value: totalIPMM },
  ];

  const columns: ColumnsType<TableRow> = [
    {
      title: "YTD",
      dataIndex: "title",
      key: "title",
      width: "50%",
    },
    {
      title: selectedCountry === "all" ? "All Countries" : selectedCountry,
      dataIndex: "value",
      key: "value",
      render: (value, record) => {
        const numValue = parseFloat(value.toString());

        if (record.key === "cpmm" || record.key === "ipmm") {
          const goal = record.key === "cpmm" ? cppmGoal : ipmmGoal;
          const isAboveGoal = numValue > goal;
          const color = isAboveGoal ? "#c91313" : "#169c57";
          const backgroundColor = isAboveGoal
            ? "rgba(255, 0, 0, 0.10)"
            : "rgba(0, 128, 0, 0.10)";

          return (
            <span
              style={{
                color,
                borderRadius: "4px",
                border: `1px solid ${color}`,
                backgroundColor,
                display: "inline-block",
                width: "7rem",
                textAlign: "center",
                fontWeight: "bold",
                paddingLeft: "2rem",
                paddingRight: "2rem",
              }}
            >
              {value}
            </span>
          );
        }

        return typeof value === "number" ? value.toLocaleString() : value;
      },
    },
  ];

  const countryMap: Record<string, string> = {
    "United Kingdom": "GB",
    Portugal: "PT",
    Ireland: "IE",
    Algeria: "DZ",
    Holland: "NL",
    India: "IN",
  };

  const mapData =
    selectedCountry === "all"
      ? Object.values(countryMap).map((code) => ({ country: code, value: 1 }))
      : countryMap[selectedCountry]
      ? [{ country: countryMap[selectedCountry], value: 1 }]
      : [];

  const zoomConfigByCountry: Record<
    string,
    { scale: number; x: number; y: number }
  > = {
    all: { scale: 2.5, x: -25, y: -55 },
    PT: { scale: 4.2, x: -20, y: -50 },
    IE: { scale: 4.2, x: -20, y: -25 },
    GB: { scale: 4, x: -25, y: -30 },
    DZ: { scale: 3.5, x: -20, y: -60 },
    NL: { scale: 4.5, x: -35, y: -35 },
    IN: { scale: 3.2, x: -20, y: -10 },
  };

  const mapCountryCode =
    selectedCountry === "all" ? "all" : countryMap[selectedCountry] || "all";
  const zoomConfig =
    zoomConfigByCountry[mapCountryCode] || zoomConfigByCountry["all"];

  return (
    <S.Holder>
      <S.Data>
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          bordered
          style={{ width: "98%" }}
        />
        {/* <b>Q1 / Q2 - 2025</b> */}
        <S.DataCardHolder>
          <Card
            title="Total High Hisk Drivers"
            value={totalHRD.toString()}
            footer="YTD 2025"
            icon={<StockOutlined />}
          />
          <Card
            title="Total BTW"
            value={totalBTW.toString()}
            footer="YTD 2025"
            icon={<StockOutlined />}
          />
          <Card
            title="Total Commentary Drive"
            value={totalCommentaryDrive.toString()}
            footer="YTD 2025"
            icon={<StockOutlined />}
          />
          <Card
            title="Total PIFS"
            value={totalPIFS.toString()}
            footer="YTD 2025"
            icon={<StockOutlined />}
          />
          {/* <Card
            title="Total PIFS"
            value={totalPIFS.toString()}
            footer="YTD 2025"
          /> */}
        </S.DataCardHolder>
      </S.Data>

      <S.Goals>
        <Card
          title="TOTAL GOAL"
          value={cppmGoal.toString()}
          footer="YTD 2025"
          icon={<AimOutlined />}
        />
        <Card
          title="IPMM GOAL"
          value={ipmmGoal.toString()}
          footer="YTD 2025"
          icon={<AimOutlined />}
        />

        <S.ChartHolder
          $scale={zoomConfig.scale}
          $x={zoomConfig.x}
          $y={zoomConfig.y}
        >
          <WorldMap color="#009688" size="responsive" data={mapData} />
        </S.ChartHolder>
      </S.Goals>
    </S.Holder>
  );
};
