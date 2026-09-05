import React, { useCallback, useEffect } from "react";
import "./App.css";
import { Button } from "./ui/button";

type Theme = "CNN" | "decathlon" | "figma";

function App() {
  const [theme, setTheme] = React.useState<Theme>("CNN");

  const handleClick = useCallback(() => {
    setTheme((prevTheme) =>
      prevTheme === "CNN"
        ? "decathlon"
        : prevTheme === "decathlon"
          ? "figma"
          : "CNN",
    );
    const root = document.documentElement;
    root.setAttribute(
      "data-theme",
      theme === "CNN" ? "decathlon" : theme === "decathlon" ? "figma" : "CNN",
    );
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute(
      "data-theme",
      theme === "CNN" ? "CNN" : theme === "decathlon" ? "decathlon" : "figma",
    );
  }, [theme]);

  return (
    <div className="app">
      <Button className="default" onClick={handleClick}>
        {theme}
      </Button>
      <div className="content">
        <Button className="brand">botón marca</Button>
        <Button className="neutral">botón neutral</Button>
      </div>
    </div>
  );
}

export default App;
