import React from "react";
import "./TopBar.css";

type Props = {
  title: string;
  left?: React.ReactNode; // ex) X, back
  right?: React.ReactNode; // ex) call icon
  background?: "ivory" | "white";
};

export default function TopBar({
  title,
  left,
  right,
  background = "white",
}: Props) {
  return (
    <header className={`tb ${background}`}>
      <div className="tb-slot">{left}</div>
      <div className="tb-title">{title}</div>
      <div className="tb-slot right">{right}</div>
    </header>
  );
}
