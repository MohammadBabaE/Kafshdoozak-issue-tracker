import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext/ThemeContext";
import React from "react";

function Icon({
  className,
  light,
  dark,
}: {
  className: string;
  light: string;
  dark: string;
}) {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme;
  return <img src={theme === "light" ? light : dark} className={className} />;
}

export default Icon;
