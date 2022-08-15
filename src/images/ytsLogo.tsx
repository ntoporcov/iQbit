import React from "react";

export interface YtsLogoProps {}

const YtsLogo = (props: YtsLogoProps) => {
  return (
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      viewBox="0 0 120.9 38"
      style={{
        width: "100px",
        height: "auto",
      }}
      xmlSpace="preserve"
      {...props}
    >
      <style>{".st0{fill:#6ac045}"}</style>
      <text
        transform="translate(87.687 30.5)"
        className="st0"
        style={{
          fontSize: "17.5px",
          fontFamily: "'Arial-BoldItalicMT'",
        }}
      >
        {".MX"}
      </text>
      <circle
        transform="rotate(-45.001 25.184 25.662)"
        className="st0"
        cx={25.2}
        cy={25.7}
        r={5}
      />
      <circle className="st0" cx={12.1} cy={22.2} r={5} />
      <circle className="st0" cx={14.2} cy={9.3} r={5} />
      <circle className="st0" cx={20.2} cy={17.2} r={1.9} />
      <path
        className="st0"
        d="m38.3 30.6 5.7-.9 2.1-10L53.8 9h8.5l-4 20.2 5.7.4L68 9h5.9c.5-2.7 4.2-4.9 4.2-4.9H50.7L44 14.3 41.2 4.1h-6l5.1 15.7-2 10.8z"
      />
      <path
        className="st0"
        d="M84.5 15c-2.2-1.3-3.8-2.2-3.8-3.7s1.4-2.8 4-2.8c2.2 0 4.1.7 4.9 1.2L91.4 5c-1.1-.6-3-1.3-6.2-1.3-5.8 0-10.4 3.3-10.4 8.6 0 3.5 2.7 5.5 5.5 7 2.4 1.3 3.6 2.2 3.6 3.7 0 2.1-2 3.1-4.2 3.1-2.4 0-4.7-.7-6.2-1.7L71.6 29c1.3.9 3.9 1.9 7.6 1.9 5.9 0 10.8-3 10.8-8.9-.2-3.1-2.3-5.3-5.5-7zM82.9 35.3s-26.6-8.4-51.3-1.1c4.6-3.3 7.7-8.6 8.2-14.6C38.1 28.4 30.4 35 21.2 35 10.8 35 2.4 26.6 2.4 16.2 2.4 9.3 6.1 3.3 11.7 0 4.8 3.1 0 10.1 0 18.1 0 29.1 8.9 38 19.9 38c.8 0 1.5-.1 2.3-.1 1.1.1 30.6-6.9 59.6.1 0 0-16.9-6.1-37.8-4.3 0 0 12.2-3.1 38.9 1.6z"
      />
    </svg>
  );
};

export default YtsLogo;
