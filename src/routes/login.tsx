import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { errors } from "../msg/errors";
import {
  Wrapper,
  Title,
  Form,
  Input,
  Switcher,
  Error,
} from "../components/auto-components";
import GithubButton from "../components/github-btn";

export default function Login() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (isLoading || email === "" || password === "") return;

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.code);
        setError(errors[e.code]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Log in ✖️</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="이메일"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="비밀번호"
          type="password"
          required
        />
        <Input type="submit" value={isLoading ? "로딩중..." : "로그인"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        계정이 없으신가요? <Link to="/create-account">계정생성 &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
