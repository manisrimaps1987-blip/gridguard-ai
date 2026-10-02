# GRIDGUARD AI

> **“AI-Powered Intelligence for a Safer, Smarter Power Grid”**

GridGuard AI is an enterprise-grade Smart Grid and Electricity Intelligence platform engineered to monitor, analyze, predict, and optimize electricity distribution, power-grid assets, and renewable microgrids in real-time.

---

## ⚡ Problem Statement & Solution

### The Challenge
Modern power grids are stressed by unpredictable renewable intermittency (solar/wind ramps), aging transformer infrastructure, volatile electric vehicle (EV) charging spikes, and catastrophic cascading blackouts caused by unnoticed voltage sags and harmonic distortion.

### The Solution
GridGuard AI converts raw electrical telemetry into high-confidence actionable intelligence:
```
Electricity Data (IoT/PMUs)
         ↓
Data Processing & Kalman Filtering
         ↓
AI / Machine Learning (XGBoost, LSTM, Isolation Forest)
         ↓
Fault & Outage Detection (Sub-cycle tripping & diagnostics)
         ↓
AI Demand & Peak Forecasting (95% uncertainty confidence intervals)
         ↓
Multi-Vector Grid Health Scoring
         ↓
Autonomous AI Recommendations & Load Shifting
         ↓
Real-Time SCADA Operations & GridGuard Copilot
```

---

## 🚀 Key Features

1. **Real-Time Grid Monitoring**
   - Live telemetry: Voltage (230 V), Current (12.4 A), Active Power (MW), Frequency (50.00 Hz), Power Factor ($\cos \phi$), Energy (MWh), and Battery State of Charge (SoC).
   - Oscilloscope displaying animated 3-phase sine waves (120° phase separation, Phase A/B/C) with real-time harmonic distortion index (THD).
   - Dynamic Grid Status indicators: `NORMAL`, `WARNING`, `CRITICAL`, and `OFFLINE`.

2. **Electricity Consumption Analytics & Multi-Tier Tariff**
   - Diurnal load duration curves with timeframe toggles: Today, 7 Days, 30 Days, 3 Months, and 1 Year.
   - User-configurable Multi-Tier Time-of-Use (TOU) tariff: Currency symbol, base energy rate, peak multiplier, peak window hours, and capacity charges.

3. **AI Demand Forecasting**
   - Multi-model load prediction engine: **XGBoost**, **LSTM**, **GRU**, **Random Forest**, and **Prophet**.
   - Shaded 95% uncertainty confidence bands for 24-hour hourly projections and 7-day multi-horizon peak tables.
   - Comprehensive model validation metrics: RMSE, MAPE (%), $R^2$, and peak hour prediction.

4. **Power Outage & Fault Detection**
   - Automated detection of sudden loss-of-power, voltage collapse, phase frequency deviation, and sensor communication dropouts.
   - Prominent `OUTAGE DETECTED` alarm showing exact location, affected customers, estimated severity, root cause diagnosis, and emergency crew dispatch status.
   - Isolation Forest anomaly detection for overvoltage, undervoltage, transformer thermal excursions, and harmonic distortion.

5. **Transformer & Substation Fleet Intelligence**
   - Transformer thermal diagnostics: Winding temperature, oil top temperature, ambient gradient, DGA dissolved gas analysis, and health index (0–100%).
   - Substation monitoring: 132kV, 66kV, and 33kV transmission hubs with active load percentage and status filtering.

6. **Renewable Energy & Battery Storage (BESS)**
   - Solar park generation, wind turbine output, battery charging/discharging rates, and grid import/export balance.
   - Carbon emissions avoided calculation (Metric tons of $CO_2$ mitigated today).
   - Dynamic SVG system power flow animation.

7. **AI Energy Optimization (Demand Response)**
   - Algorithmic peak shaving and load shifting recommendations with before-and-after load profile simulation.
   - Direct dollar savings calculations ($/day and $/month).
   - Enforced hardware safety protocol disclaimer.

8. **Interactive Grid Topology Map**
   - SVG spatial map displaying transmission lines, substations, wind/solar farms, battery storage sites, and live alert hotspots with interactive inspection drawer.

9. **Dataset Upload & ML Pipeline**
   - Drag & drop or 1-click test datasets (`Industrial Feeder B-12 Overload.csv`, `Renewable Microgrid 24h.csv`, `Summer Heatwave Peak Load.csv`).
   - 8-step pipeline: Validate → Preview → Clean Missing Values → Detect Anomalies → Generate Analytics → Retrain Model → Sync Dashboard → Generate Audit.

10. **GridGuard Copilot (Connected AI Power Assistant)**
    - Connected directly to live grid context via server-side Google Gemini API (`gemini-3.8-flash`) with full engineering reasoning fallback.
    - Quick questions for operators:
      - *“How much electricity did I use today?”*
      - *“When is peak demand expected?”*
      - *“Why did consumption increase?”*
      - *“Is there an abnormal load?”*
      - *“How can I reduce peak demand?”*

11. **AI Automated Report Generator**
    - Certified electricity audit report with Executive Summary, Grid Status, Fault Logs, and Optimization Roadmap.
    - Export options: Print/PDF document formatting, CSV download, and JSON payload.

12. **Historical Comparison**
    - Comparative analysis across Yesterday vs Today, Week vs Week, Month vs Month, and Year vs Year with percentage change indicators.

13. **Role-Based Access Control (RBAC)**
    - Support for `Admin`, `Grid Operator`, `Energy Analyst`, and `Viewer`.

---

## 🛠 Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express 4, tsx.
- **AI / LLM**: `@google/genai` TypeScript SDK (`gemini-3.8-flash`) running securely on the server-side.
- **Machine Learning Algorithms**: XGBoost regression, LSTM cyclicity modeling, Isolation Forest anomaly clustering, and multi-factor harmonic scoring.

---

## 🔌 API Documentation

| Endpoint | Method | Description |
|---|---|---|
| `/api/grid/status` | `GET` | Current telemetry, grid health breakdown, and demo mode indicator |
| `/api/grid/health` | `GET` | Weighted grid health score & analytical certification disclaimer |
| `/api/energy/current` | `GET` | Real-time electrical readings & renewable mix |
| `/api/energy/history` | `GET` | Diurnal hourly, 7-day, and 12-month historical consumption data |
| `/api/forecast/hourly` | `GET` | 24-hour ML load forecast with 95% uncertainty interval |
| `/api/faults` | `GET` | Active and historical power faults diagnosed by anomaly engine |
| `/api/faults/acknowledge` | `POST` | Triage and investigate a detected fault |
| `/api/outages` | `GET` | Active power outages and safety interlock state |
| `/api/transformers` | `GET` | Thermal diagnostics and health scores for transformers |
| `/api/substations` | `GET` | High-voltage transmission and distribution substation nodes |
| `/api/optimize/recommendations` | `GET` | Load shifting and peak shaving opportunities |
| `/api/tariff` | `GET` | Configurable multi-tier tariff rates |
| `/api/tariff/update` | `POST` | Update base rates, multipliers, and peak hours |
| `/api/datasets/upload` | `POST` | Ingest CSV/JSON datasets, clean missing data, and run ML pipeline |
| `/api/ai/chat` | `POST` | GridGuard Copilot contextual query with Gemini API |
| `/api/reports/generate` | `POST` | Generate official electricity audit report |
| `/api/simulation/trigger-event` | `POST` | Inject electrical disturbance (Voltage sag, overheat, outage) |

---

## 🧪 Simulation & Electrical Drills

GridGuard AI features a built-in simulation control panel for scenario validation:
- **Voltage Sag**: Drops phase voltage to 212 V to test tap-changer response.
- **Thermal Spike**: Drives Transformer TR-501 winding temperature to 112°C.
- **Outage Trip**: Simulates line breaker trip on Feeder Line 9A affecting 3,200 customers.
- **Reset**: Restores nominal 230 V / 50.00 Hz operations.

*All simulated data is clearly designated with the **DEMO DATA — NOT LIVE GRID DATA** badge.*
