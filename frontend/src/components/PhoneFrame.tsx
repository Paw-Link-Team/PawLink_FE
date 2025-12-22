import React from "react";
import "./PhoneFrame.css";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function PhoneFrame({ children, className = "" }: Props) {
  return (
    <div className="pf-wrapper">
      <div className={`pf-screen ${className}`}>
        {children}
      </div>
    </div>
  );
}
