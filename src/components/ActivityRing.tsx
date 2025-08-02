import React, { FC } from "react";

type Ring = {
  value: number; // percentage, e.g., 150 for 150%
  color: string;
};

type Props = {
  size?: number;
  strokeWidth?: number;
  rings: Ring[];
};

export const ActivityRing: FC<Props> = ({
  size = 200,
  strokeWidth = 20,
  rings,
}) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;

  const calcCircumference = (r: number) => 2 * Math.PI * r;

  return (
    <svg width={size} height={size}>
      {rings.map((ring, index) => {
        const ringRadius = radius - index * (strokeWidth + 4);
        const circumference = calcCircumference(ringRadius);
        const progress = ring.value / 100;
        const totalTurns = Math.min(progress, 1);
        const overflowTurns = Math.floor(progress);

        // SVG strokeDashoffset starts from top center, rotate -90 to match iOS style
        return (
          <g key={index} transform={`rotate(-90 ${center} ${center})`}>
            {/* Background track */}
            <circle
              cx={center}
              cy={center}
              r={ringRadius}
              fill="none"
              stroke="#e6e6e6"
              strokeWidth={strokeWidth}
              opacity={0.2}
            />
            {/* Base ring (up to 100%) */}
            <circle
              cx={center}
              cy={center}
              r={ringRadius}
              fill="none"
              stroke={ring.color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - Math.min(totalTurns, 1))}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
            {/* Overflow ring (wraps on top) */}
            {overflowTurns > 1 &&
              [...Array(overflowTurns - 1)].map((_, i) => (
                <circle
                  key={`overflow-${i}`}
                  cx={center}
                  cy={center}
                  r={ringRadius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={0}
                  strokeLinecap="round"
                  opacity={0.3}
                  style={{
                    filter: "box-shadow(0 0 10px rgba(0, 0, 0, 0.1))",
                  }}
                />
              ))}
          </g>
        );
      })}
    </svg>
  );
};

export default ActivityRing;
