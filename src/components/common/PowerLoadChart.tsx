import React, { useState } from 'react';
import { Activity, TrendingUp, Calendar, Zap } from 'lucide-react';
import { HOURLY_LOAD_DATA } from '../../services/gridData';

interface PowerLoadChartProps {
  currentLoadMW: number;
  peakLoadMW: number;
  averageLoadMW: number;
}

export const PowerLoadChart: React.FC<PowerLoadChartProps> = ({
  currentLoadMW,
  peakLoadMW,
  averageLoadMW,
}) => {
  const [timeFilter, setTimeFilter] = useState<'24H' | '7D' | '30D'>('24H');
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  // SVG dimensions
  const width = 720;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxLoad = 22; // MW upper bound

  const points = HOURLY_LOAD_DATA;

  const getX = (idx: number) => paddingLeft + (idx / (points.length - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - (val / maxLoad) * chartHeight;

  // Build SVG path strings
  // 1. Historical previous curve
  const previousPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.previous)}`)
    .join(' ');

  // 2. Current load curve (up to 18:00)
  const currentPoints = points.filter((p) => p.current !== null);
  const currentPath = currentPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.current as number)}`)
    .join(' ');

  // Area under current curve
  const currentArea = `${currentPath} L ${getX(currentPoints.length - 1)} ${
    paddingTop + chartHeight
  } L ${getX(0)} ${paddingTop + chartHeight} Z`;

  // 3. Predicted curve (from 16:00 through end)
  const predictedPoints = points.slice(7); // starts around 14:00/16:00
  const predictedPath = predictedPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i + 7)} ${getY(p.predicted)}`)
    .join(' ');

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
      {/* Top Header & Highlights */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1976D2] animate-pulse"></span>
            <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch']">
              Power Load Monitoring
            </h3>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time demand vs machine learning predictive load projection
          </p>
        </div>

        {/* Highlights & Time Filter */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Key Load Stats */}
          <div className="flex items-center gap-3 text-xs font-mono bg-[#F6F9FC] px-3 py-1.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[#64748B]">Current: </span>
              <span className="font-bold text-[#0F3D91]">{currentLoadMW} MW</span>
            </div>
            <span className="text-slate-300">|</span>
            <div>
              <span className="text-[#64748B]">Peak: </span>
              <span className="font-bold text-[#1976D2]">{peakLoadMW} MW</span>
            </div>
            <span className="text-slate-300">|</span>
            <div>
              <span className="text-[#64748B]">Avg: </span>
              <span className="font-bold text-slate-700">{averageLoadMW} MW</span>
            </div>
          </div>

          {/* Time Filter Buttons */}
          <div className="flex items-center bg-[#F6F9FC] p-1 rounded-xl border border-slate-200/80 text-xs font-mono">
            {(['24H', '7D', '30D'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeFilter === filter
                    ? 'bg-white text-[#0F3D91] font-bold shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Load Curve Chart */}
      <div className="w-full relative overflow-visible">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 sm:h-64 overflow-visible font-mono"
        >
          {/* Horizontal Grid lines */}
          {[0, 5, 10, 15, 20].map((v) => {
            const y = getY(v);
            return (
              <g key={v}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  fill="#94A3B8"
                  fontSize="10"
                  textAnchor="end"
                >
                  {v}M
                </text>
              </g>
            );
          })}

          {/* Shaded Area for Current Load */}
          <defs>
            <linearGradient id="currentAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1976D2" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1976D2" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={currentArea} fill="url(#currentAreaGradient)" />

          {/* Historical Baseline Line (Dashed Slate) */}
          <path
            d={previousPath}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.8"
            strokeDasharray="4 3"
          />

          {/* Predicted Load Line (Lighter Blue #38BDF8 / #60A5FA Dashed) */}
          <path
            d={predictedPath}
            fill="none"
            stroke="#0284C7"
            strokeWidth="2.2"
            strokeDasharray="5 3"
          />

          {/* Current Load Line (Deep Blue #1976D2 Solid) */}
          <path
            d={currentPath}
            fill="none"
            stroke="#1976D2"
            strokeWidth="2.8"
          />

          {/* Peak annotation flag */}
          <g>
            <circle
              cx={getX(10)}
              cy={getY(18.7)}
              r="4"
              className="fill-[#1976D2] stroke-white stroke-2"
            />
            <rect
              x={getX(10) - 48}
              y={getY(18.7) - 24}
              width="96"
              height="18"
              rx="4"
              fill="#0F3D91"
            />
            <text
              x={getX(10)}
              y={getY(18.7) - 12}
              fill="#FFFFFF"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
            >
              PEAK 18.7 MW (19:00)
            </text>
          </g>

          {/* Interactive Data points */}
          {points.map((p, idx) => {
            const cx = getX(idx);
            const val = p.current !== null ? p.current : p.predicted;
            const cy = getY(val);

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  className={
                    p.current !== null
                      ? 'fill-[#1976D2] stroke-white stroke-2 hover:r-5'
                      : 'fill-[#0284C7] stroke-white stroke-2 hover:r-5'
                  }
                />
                {/* X axis labels */}
                <text
                  x={cx}
                  y={height - 12}
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {p.time}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Hover Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-white p-2.5 rounded-xl border border-slate-200 shadow-lg text-xs font-mono">
            <div className="font-bold text-[#172033]">{hoveredPoint.time} Time Interval</div>
            {hoveredPoint.current !== null && (
              <div className="text-[#1976D2]">Current: {hoveredPoint.current} MW</div>
            )}
            <div className="text-[#0284C7]">Predicted: {hoveredPoint.predicted} MW</div>
            <div className="text-[#64748B]">Previous Baseline: {hoveredPoint.previous} MW</div>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="mt-2 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-[#64748B] font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#1976D2]">
            <span className="w-3 h-0.5 bg-[#1976D2] inline-block"></span>
            <span>Current Load</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#0284C7]">
            <span className="w-3 h-0.5 bg-[#0284C7] border-dashed inline-block"></span>
            <span>AI Predicted Load</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-3 h-0.5 bg-slate-400 border-dashed inline-block"></span>
            <span>Historical Baseline</span>
          </div>
        </div>

        <span className="text-[11px] text-[#64748B]">
          AI demand forecasting is updated continuously from weather & SCADA feeds
        </span>
      </div>
    </div>
  );
};
