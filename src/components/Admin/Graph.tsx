'use client';
import { useState, useEffect } from 'react';

export default function EnrollmentChart() {
  // Sample dynamic data (to be replaced with real backend API call)
  const [data, setData] = useState({
    CSE: { active: 100, remaining: 20 },
    ECE: { active: 80, remaining: 40 },
    MECH: { active: 120, remaining: 30 },
    CIVIL: { active: 70, remaining: 50 },
    IT: { active: 90, remaining: 10 },
    TEST: { active: 60, remaining: 30 },
  });

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateTotal = (dept: keyof typeof data) => {
    return data[dept].active + data[dept].remaining;
  };

  const maxValue = Math.max(
    ...Object.keys(data).map((dept) =>
      Math.max(data[dept as keyof typeof data].active, data[dept as keyof typeof data].remaining)
    )
  );

  // Chart sizing based on data
  const numberOfDepartments = Object.keys(data).length;
  const barWidth = 20;
  const barGap = 10;
  const groupGap = 20;

  const chartHeight = 300;
  const scaleY = chartHeight / (maxValue * 1.2); // Add 20% headroom
  const chartWidth = numberOfDepartments * (barWidth * 2 + barGap + groupGap);

  return (
    <div className="w-full px-4 py-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Department Enrollment Statistics</h2>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          <svg width={chartWidth + 80} height={chartHeight + 80} className="mx-auto">
            {/* Y-axis */}
            <line
              x1={40}
              y1={10}
              x2={40}
              y2={chartHeight + 10}
              stroke="currentColor"
              className="text-gray-300 dark:text-gray-700"
              strokeWidth="2"
            />

            {/* X-axis */}
            <line
              x1={40}
              y1={chartHeight + 10}
              x2={chartWidth + 40}
              y2={chartHeight + 10}
              stroke="currentColor"
              className="text-gray-300 dark:text-gray-700"
              strokeWidth="2"
            />

            {/* Department Bars */}
            {Object.keys(data).map((dept, index) => {
              const department = dept as keyof typeof data;
              const x = 45 + index * (barWidth * 2 + barGap + groupGap);
              const activeHeight = data[department].active * scaleY;
              const remainingHeight = data[department].remaining * scaleY;
              const total = calculateTotal(department);

              return (
                <g key={dept}>
                  {/* Department Label */}
                  <text
                    x={x + barWidth}
                    y={chartHeight + 30}
                    textAnchor="middle"
                    className="text-sm font-medium fill-gray-700 dark:fill-gray-300"
                  >
                    {dept}
                  </text>

                  {/* Total Label */}
                  <text
                    x={x + barWidth}
                    y={chartHeight + 50}
                    textAnchor="middle"
                    className="text-xs fill-gray-500 dark:fill-gray-400"
                  >
                    Total: {total}
                  </text>

                  {/* Active Bar */}
                  <rect
                    x={x}
                    y={chartHeight + 10 - activeHeight}
                    width={barWidth}
                    height={activeHeight}
                    className="fill-indigo-600 dark:fill-indigo-600"
                    rx="2"
                  />

                  {/* Active Label */}
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 10 - activeHeight - 5}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700 dark:fill-gray-300"
                  >
                    {data[department].active}
                  </text>

                  {/* Remaining Bar */}
                  <rect
                    x={x + barWidth + barGap}
                    y={chartHeight + 10 - remainingHeight}
                    width={barWidth}
                    height={remainingHeight}
                    className="fill-gray-400 dark:fill-gray-400"
                    rx="2"
                  />

                  {/* Remaining Label */}
                  <text
                    x={x + barWidth + barGap + barWidth / 2}
                    y={chartHeight + 10 - remainingHeight - 5}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700 dark:fill-gray-300"
                  >
                    {data[department].remaining}
                  </text>
                </g>
              );
            })}

            {/* Y-axis markers */}
            {[0, maxValue / 4, maxValue / 2, (maxValue * 3) / 4, maxValue].map((value, index) => {
              const y = chartHeight + 10 - value * scaleY;
              return (
                <g key={`y-${index}`}>
                  <line
                    x1={38}
                    y1={y}
                    x2={42}
                    y2={y}
                    stroke="currentColor"
                    className="text-gray-300 dark:text-gray-700"
                    strokeWidth="1"
                  />
                  <text x={30} y={y + 4} textAnchor="end" className="text-xs fill-gray-500 dark:fill-gray-400">
                    {Math.round(value)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center mt-4 gap-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-indigo-600 dark:bg-indigo-600 rounded mr-2"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Enrolled</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-400 dark:bg-gray-400 rounded mr-2"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Not Enrolled</span>
        </div>
      </div>
    </div>
  );
}
