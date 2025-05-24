'use client';
import { useState, useEffect } from 'react';

type AnalyticsData = {
  [key: string]: {
    active: number;
    remaining: number;
  };
};

export default function EnrollmentChart() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/getAnalytics');
        const json = await res.json();
        setData(json.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateTotal = (dept: keyof AnalyticsData) => {
    return data![dept].active + data![dept].remaining;
  };

  const numberOfDepartments = data ? Object.keys(data).length : 0;
  const barWidth = 20;
  const barGap = 10;
  const groupGap = 20;
  const chartHeight = 300;

  const maxValue = data
    ? Math.max(...Object.keys(data).map((dept) => Math.max(data[dept].active, data[dept].remaining)))
    : 0;

  const scaleY = chartHeight / (maxValue * 1.2);
  const chartWidth = numberOfDepartments * (barWidth * 2 + barGap + groupGap);

  return (
    <div className="w-full px-4 py-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Enrollment Statistics</h2>

      <div className="overflow-x-auto">
        <div style={{ minWidth: chartWidth + 80 }}>
          {loading ? (
            <div className="w-full max-w-5xl animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-6 mx-auto" />
              <div className="flex justify-center gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="w-4 h-40 bg-gray-400 dark:bg-gray-600 rounded mx-auto" />
                    <div className="w-4 h-20 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
                    <div className="w-12 h-3 bg-gray-400 dark:bg-gray-600 rounded mx-auto" />
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <div className="w-20 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="w-20 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ) : (
            <svg width={chartWidth + 80} height={chartHeight + 80}>
              {/* Y-axis */}
              <line
                x1={40}
                y1={10}
                x2={40}
                y2={chartHeight + 10}
                stroke="currentColor"
                className="text-gray-400 dark:text-gray-700"
                strokeWidth="2"
              />
              {/* X-axis */}
              <line
                x1={40}
                y1={chartHeight + 10}
                x2={chartWidth + 40}
                y2={chartHeight + 10}
                stroke="currentColor"
                className="text-gray-400 dark:text-gray-700"
                strokeWidth="2"
              />

              {/* Department Bars */}
              {data &&
                Object.keys(data).map((dept, index) => {
                  const department = dept as keyof typeof data;
                  const x = 45 + index * (barWidth * 2 + barGap + groupGap);
                  const activeHeight = data[department].active * scaleY;
                  const remainingHeight = data[department].remaining * scaleY;
                  const total = calculateTotal(department);

                  return (
                    <g key={dept}>
                      {/* Dept Label */}
                      <text
                        x={x + barWidth}
                        y={chartHeight + 30}
                        textAnchor="middle"
                        className="text-sm font-medium fill-black dark:fill-gray-300"
                      >
                        {dept}
                      </text>

                      {/* Total Label */}
                      <text
                        x={x + barWidth}
                        y={chartHeight + 50}
                        textAnchor="middle"
                        className="text-xs fill-gray-600 dark:fill-gray-500"
                      >
                        Total: {total}
                      </text>

                      {/* Active Bar */}
                      <rect
                        x={x}
                        y={chartHeight + 10 - activeHeight}
                        width={barWidth}
                        height={activeHeight}
                        className="fill-indigo-400 dark:fill-indigo-500"
                        rx="2"
                      />
                      <text
                        x={x + barWidth / 2}
                        y={chartHeight + 10 - activeHeight - 5}
                        textAnchor="middle"
                        className="text-xs font-medium fill-black dark:fill-white"
                      >
                        {data[department].active}
                      </text>

                      {/* Remaining Bar */}
                      <rect
                        x={x + barWidth + barGap}
                        y={chartHeight + 10 - remainingHeight}
                        width={barWidth}
                        height={remainingHeight}
                        className="fill-slate-400 dark:fill-slate-500"
                        rx="2"
                      />
                      <text
                        x={x + barWidth + barGap + barWidth / 2}
                        y={chartHeight + 10 - remainingHeight - 5}
                        textAnchor="middle"
                        className="text-xs font-medium  fill-black dark:fill-white"
                      >
                        {data[department].remaining}
                      </text>
                    </g>
                  );
                })}

              {/* Y-axis Markers */}
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
                      className="text-gray-400 dark:text-gray-300"
                      strokeWidth="1"
                    />
                    <text x={30} y={y + 4} textAnchor="end" className="text-xs fill-gray-600 dark:fill-gray-500">
                      {Math.round(value)}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* Legend */}
      {!loading && (
        <div className="flex justify-center items-center mt-4 gap-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-indigo-500 rounded mr-2"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Enrolled</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-slate-400 rounded mr-2"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Not Enrolled</span>
          </div>
        </div>
      )}
    </div>
  );
}
