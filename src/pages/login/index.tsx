import { Form, Input, Button } from "antd";
import * as S from "./styles";
import { Footer } from "../../components/footer";
import single from "../../assets/single.png";
import main from "../../assets/main.png";
import jnj from "../../assets/jnj.svg";

interface LoginFormValues {
  username: string;
  password: string;
}

export const Login = () => {
  const onFinish = (values: LoginFormValues) => {
    console.log("Form values:", values);
  };

  return (
    <S.Holder>
      <img
        src={main}
        style={{
          width: "6rem",
          marginLeft: "1rem",
          position: "fixed",
          top: "1.5rem",
          left: "1rem",
        }}
      />
      <S.LogoWrapper>
        <img src={single} alt="Logo" />
      </S.LogoWrapper>
      <Form
        name="loginForm"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
        style={{
          width: "450px",
          padding: "24px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h2>Login</h2>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <img src={jnj} style={{ width: "9rem" }} />
            {/* <img src={main} style={{ width: "5rem", marginLeft: "1rem" }} /> */}
          </div>
        </div>
        <Form.Item
          label="User"
          name="username"
          rules={[{ required: true, message: "Please, enter with your user." }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please, enter with your passowrd." },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            style={{ backgroundColor: "#009688" }}
            htmlType="submit"
            block
          >
            <span style={{ color: "white" }}>Enter</span>
          </Button>
        </Form.Item>
      </Form>
      <div
        style={{
          width: "100%",
          position: "fixed",
          bottom: "1rem",
        }}
      >
        <Footer />
      </div>
    </S.Holder>
  );
};
