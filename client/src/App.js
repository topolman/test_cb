import React from "react";
import axios from "axios";
import { get } from "lodash";
import "./App.scss";

import Layout from "./pages/layout";
import Login from "./pages/login";
import Valutes from "./pages/valutes";

function App() {
  const [state, setState] = React.useState({
    apiResponse: "",
    isAuth: false,
    token: "",
    valutesData: []
  });

  React.useEffect(() => {
    if (state.isAuth) {
      fetchValutes();
    }
  }, [state.isAuth]);

  const fetchValutes = (from, to) => {
    const params =
      typeof from !== undefined && typeof to !== undefined
        ? {
            from: encodeURIComponent(from),
            to: encodeURIComponent(to)
          }
        : {};
    axios({
      method: "get",
      url: "http://localhost:8080/api/valutes",
      headers: { Authorization: `Bearer ${state.token}` },
      params: params
    }).then(res => {
      const data = get(res, "data.data");
      setState({
        ...state,
        valutesData: data
      });
    });
  };

  const authenticate = (username = "", password = "") => {
    const data = {
      username: encodeURIComponent(username),
      password: encodeURIComponent(password)
    };
    axios({
      method: "post",
      url: "http://localhost:8080/api/auth/login",
      data
    }).then(res => {
      const data = get(res, "data");
      const success = get(data, "message") === "success";
      const token = get(data, "data.accessToken", false);
      if (success && token && token.length > 0) {
        setState({
          ...state,
          isAuth: true,
          token
        });
      } else {
        console.error(data, success, token);
      }
    });
  };

  /*
  const callAPI = () => {
    fetch("http://localhost:8080/api/valutes")
      .then(res => res.text())
      .then(res => setState({ apiResponse: res }));
  };

  React.useEffect(() => {
    callAPI();
  }, []);
  */

  return (
    <div className="App">
      <Layout>
        {state.isAuth && (
          <Valutes data={state.valutesData} fetchValutes={fetchValutes} />
        )}
        {!state.isAuth && <Login authenticate={authenticate} />}
      </Layout>
    </div>
  );
}

export default App;
