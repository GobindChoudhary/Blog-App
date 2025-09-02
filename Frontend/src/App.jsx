import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserAuthForm from "./pages/UserAuthForm";
import { createContext, useContext, useEffect, useState } from "react";
import { lookInSession } from "./common/Session";

export const userContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    const handleSessionChange = () => {
      let userInSession = lookInSession("user");
      userInSession
        ? setUserAuth(JSON.parse(userInSession))
        : setUserAuth({ accessToken: null });
    };

    window.addEventListener("storage", handleSessionChange);
    window.addEventListener("sessionStorageChange", handleSessionChange);

    handleSessionChange(); // Initial check

    return () => {
      window.removeEventListener("storage", handleSessionChange);
      window.removeEventListener("sessionStorageChange", handleSessionChange);
    };
  }, []);

  return (
    <userContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
        </Route>
      </Routes>
    </userContext.Provider>
  );
};

export default App;
