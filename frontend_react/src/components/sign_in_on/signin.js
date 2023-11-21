import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Snackbar from "../snack_bar/toast";
const csrftoken = Cookies.get("csrfToken");
function SignInForm() {
  const [state, setState] = React.useState({
    email: "",
    password: ""
  });
  const [notify, setNotify] = React.useState({
    open: false,
    message: "",
    severity: "success",
    handleClose: () => {
      setNotify((prev) => ({ ...prev, open: false }));
    },
  });
  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = evt => {
    evt.preventDefault();
    const { email, password } = state;
    // post request at /login with email and password

    axios.post("http://localhost:8000/login/",
      {
        "email": email,
        "password": password
      },
      {
        headers: {
          "X-CSRFToken": csrftoken,
        }
      }
    )
      .then((res) => {
        console.log(res);
        console.log(res.data);

        const message = res.data.message;
        if (res.data.status === 200 || res.data.status === 201) {
          setNotify({
            open: true,
            message: message,
            severity: "success",
            handleClose: () => {
              setNotify((prev) => ({ ...prev, open: false }));
            },
          });
          var cookie=res.data.cookie;
          Cookies.set('cookie', cookie);

          // redirect to home page
          window.location.href = "/home";
        }
        else {
          setNotify({
            open: true,
            message: message,
            severity: "error",
            handleClose: () => {
              setNotify((prev) => ({ ...prev, open: false }));
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        <Snackbar prop={notify} />
        setNotify({
          open: true,
          message: "Server is probably down",
          severity: "error",
          handleClose: () => {
            setNotify((prev) => ({ ...prev, open: false }));
          },
        });
      });


    for (const key in state) {
      setState({
        ...state,
        [key]: ""
      });
    }
  };

  return (
    <div>
      <div className="Signinoncss">
        <div className="form-container sign-in-container">
          <form onSubmit={handleOnSubmit}>
            <h1>Sign in</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={state.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={state.password}
              onChange={handleChange}
            />
            {/* <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} /> */}
            {/* <a href="#">Forgot your password?</a> */}
            <button>Sign In</button>
          </form>
        </div>
      </div>
      {
        <Snackbar prop={notify} />
      }
    </div>
  );
}

export default SignInForm;
