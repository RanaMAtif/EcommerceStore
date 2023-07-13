import React, { useState } from "react";
import { auth, fs } from "../Config/Config";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import SignupA from "../Images/SignupA.png";

export const Signup = () => {
  const history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    // console.log(firstName, email, password);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((credentials) => {
        console.log(credentials);
        fs.collection("users")
          .doc(credentials.user.uid)
          .set({
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Password: password,
          })
          .then(() => {
            setSuccessMsg(
              "Signup Successfull. You will now automatically get redirected to Login"
            );
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setErrorMsg("");
            setTimeout(() => {
              setSuccessMsg("");
              history.push("/login");
            }, 3000);
          })
          .catch((error) => setErrorMsg(error.message));
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", maxWidth: "800px" }}>
        <div style={{ flex: 1 }}>
          <img src={SignupA} alt="Signup" style={{ maxWidth: "100%" }} />
        </div>
        <div style={{ flex: 1, paddingLeft: "20px" }}>
          <h1>Sign Up</h1>
          <hr />
          {successMsg && (
            <>
              <div className="success-msg">{successMsg}</div>
              <br />
            </>
          )}
          <form
            className="form-group"
            autoComplete="off"
            onSubmit={handleSignup}
          >
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            ></input>
            <br />
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            ></input>
            <br />
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            ></input>
            <br />
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            ></input>
            <br />
            <div className="btn-box">
              <span>
                Already have an account Login
                <Link to="login" className="link">
                  Here
                </Link>
              </span>
              <button type="submit" className="btn btn-success btn-md">
                SIGN UP
              </button>
            </div>
          </form>
          {errorMsg && (
            <>
              <br />
              <div className="error-msg">{errorMsg}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
