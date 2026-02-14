import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import React, { Suspense, useEffect } from "react";
import { setUser } from "./state/user/userSlice";

const SignUp = React.lazy(() => import("./views/SignUp/SignUp"));
const Login = React.lazy(() => import("./views/Login/Login"));
const Issues = React.lazy(() => import("./views/Issues/Issues"));
const Board = React.lazy(() => import("./views/Board/Board"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      dispatch(setUser(JSON.parse(userData)));
    }
  }, [dispatch]);
  return (
    <Suspense>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Issues />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/issues/new" element={<Issues />} />
        <Route path="/issues/:issueId" element={<Issues />} />
        <Route path="/issues/:issueId/edit" element={<Issues />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </Suspense>
  );
}

export default App;
