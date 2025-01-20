'use client';

import { useEffect, useState } from "react";

export default function Logout() {
  const [sessionID, setSessionID] = useState(0);

  useEffect(() => {
    setSessionID(Number(sessionStorage.getItem("userAuth")));

    if (!sessionID) {
      sessionStorage.removeItem("userAuth");
      window.location.href = "/login";
    } else {
      window.location.href = "/";
    }
  }, [sessionID]);
}
