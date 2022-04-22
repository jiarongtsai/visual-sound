import React, { useEffect, useState } from "react";
import { Firebase } from "../utils/firebase";
// import { UserContext } from "../context/UserContext";

export default function Login() {
  //   const userContext = useContext(UserContext);
  const [inputs, setInputs] = useState({});

  useEffect(() => {}, []);

  function handleInputs(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }
  function loginFirebase() {
    Firebase.login(inputs.email, inputs.password).then((data) => {
      console.log(data);
    });
  }

  function registerFirebase() {
    Firebase.register(inputs.username, inputs.email, inputs.password).then(
      (data) => {
        console.log(data);
      }
    );
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
