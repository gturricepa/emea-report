import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  SafetyOutlined,
  BarChartOutlined,
  LineChartOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import single from "../../assets/single.png";
import main from "../../assets/main.png";
import jnj from "../../assets/jnj.svg";

import * as S from "./styles";
import { ContentData } from "../content-data";
const { Sider, Content } = Layout;

export const Main = () => {
  type SessionType =
    | "general"
    | "cpmm - ipmm"
    | "compliance"
    | "crashes"
    | "trainings";
  const [collapsed, setCollapsed] = useState(true);
  const [selectedSession, setSelectedSession] =
    useState<SessionType>("general");

  return (
    <S.Holder>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{ backgroundColor: "#fcfbfb" }}
        >
          <S.LogoWrapper>
            <S.SingleLogo
              src={single}
              alt="Single logo"
              collapsed={collapsed}
            />
            <S.FullLogo src={main} alt="Main logo" collapsed={collapsed} />
          </S.LogoWrapper>

          <Menu
            theme="light"
            defaultSelectedKeys={["general"]}
            mode="inline"
            onClick={({ key }) => setSelectedSession(key as SessionType)}
          >
            <Menu.Item key="general" icon={<HomeOutlined />}>
              General
            </Menu.Item>
            <Menu.Item key="crashes" icon={<SafetyOutlined />}>
              Crashes
            </Menu.Item>
            <Menu.Item key="cpmm - ipmm" icon={<BarChartOutlined />}>
              CPMM - IPMM
            </Menu.Item>
            <Menu.Item key="compliance" icon={<LineChartOutlined />}>
              Compliance
            </Menu.Item>
            <Menu.Item key="trainings" icon={<ReadOutlined />}>
              Trainings
            </Menu.Item>
          </Menu>

          <S.Footer collapsed={collapsed}>
            <img
              src={jnj}
              alt="JNJ logo"
              style={{ height: "1.5rem", marginRight: "0.5rem" }}
            />
            {/* <span>EMEA</span> */}
          </S.Footer>
        </Sider>

        <Layout>
          <Content>
            <ContentData selectedSession={selectedSession} />
          </Content>
        </Layout>
      </Layout>
    </S.Holder>
  );
};
