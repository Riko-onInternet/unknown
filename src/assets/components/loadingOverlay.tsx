"use client";

import React, { useState, useEffect } from "react";
import { Spinner } from "@nextui-org/react";

function LoadingOverlay() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.classList.add("fade-out-loading");
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 200); // 200ms per far fare il fade out
  }, []);

  if (!isLoading) return null;

  return (
    <div className="loading-screen" id="loading-screen">
      <Spinner label="Loading..." size="lg" id="loading-spinner" />
    </div>
  );
}

export default LoadingOverlay;
