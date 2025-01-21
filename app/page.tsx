'use client';

import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import { useEffect, useState } from "react";

function App() {
  const [admin, setAdmin] = useState(0);

  useEffect(() => {
    if (!sessionStorage.getItem("userAuth")) {
      window.location.href = "/login";
    } else {
      setAdmin(Number(sessionStorage.getItem("userAuth")));
    }
  }, [admin]);

  return (
    <>
      <div className="App p-[30px] w-full h-[100vh] bg-blue-600 flex justify-between">
        <Sidebar />
        {/* <Dashboard /> */}
      </div>
    </>
  );
}

export default App;
