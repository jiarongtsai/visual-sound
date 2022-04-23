import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Firebase } from "../utils/firebase";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputs, setInputs] = useState({});

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {}, []);

  function handleInputs(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }
  function loginFirebase() {
    Firebase.login(inputs.email, inputs.password).then((data) => {
      console.log(data);
      navigate(from, { replace: true });
    });
  }

  function registerFirebase() {
    Firebase.register(inputs.username, inputs.email, inputs.password).then(
      (data) => {
        console.log(data);
        navigate(from, { replace: true });
      }
    );
  }

  function loginFB() {
    Firebase.SignInWithFB().then((result) => {
      console.log(result);
      navigate(from, { replace: true });
    });
  }

  return (
    <>
      <br />
      <div>Login</div>
      <div>
        <label>email</label>
        <input
          name="email"
          value={inputs.email || ""}
          onChange={(e) => handleInputs(e)}
        />
      </div>
      <div>
        <label>password</label>
        <input
          type="password"
          name="password"
          value={inputs.password || ""}
          onChange={(e) => handleInputs(e)}
        ></input>
      </div>
      <button onClick={loginFirebase}>Login</button>
      <button onClick={loginFB}>Login with FB</button>
      <hr />
      <br />
      <div>Register</div>
      <div>
        <label>username</label>
        <input
          name="username"
          value={inputs.username || ""}
          onChange={(e) => handleInputs(e)}
        ></input>
      </div>
      <div>
        <label>email</label>
        <input
          name="email"
          value={inputs.email || ""}
          onChange={(e) => handleInputs(e)}
        ></input>
      </div>
      <div>
        <label>password</label>
        <input
          type="password"
          name="password"
          value={inputs.password || ""}
          onChange={(e) => handleInputs(e)}
        ></input>
      </div>
      <div>
        <input
          type="checkbox"
          name="checkbox"
          value={inputs.checkbox || false}
          onChange={(e) => handleInputs(e)}
        ></input>
        <label>I agree with ...</label>
      </div>
      <button onClick={registerFirebase}>Register</button>
    </>
  );
}
