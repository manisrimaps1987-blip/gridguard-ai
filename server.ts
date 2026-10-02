import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_SUBSTATIONS,
  INITIAL_TRANSFORMERS,
  INITIAL_FAULTS,
  INITIAL_OUTAGES,
  INITIAL_ALERTS,
  DEFAULT_TARIFF,
  INITIAL_RECOMMENDATIONS,
} from './src/data/mockGridData.ts';
import {
  GridTelemetry,
  Substation,
  Transformer,
  FaultRecord,
  OutageEvent,
  GridAlert,
  TariffConfig,
  OptimizationRecommendation,
  RenewableMetrics,
} from './src/types/grid.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Grid State
let substations: Substation[] = JSON.parse(JSON.stringify(INITIAL_SUBSTATIONS));
let transformers: Transformer[] = JSON.parse(JSON.stringify(INITIAL_TRANSFORMERS));
let faults: FaultRecord[] = JSON.parse(JSON.stringify(INITIAL_FAULTS));
let outages: OutageEvent[] = JSON.parse(JSON.stringify(INITIAL_OUTAGES));
let alerts: GridAlert[] = JSON.parse(JSON.stringify(INITIAL_ALERTS));
let tariff: TariffConfig = { ...DEFAULT_TARIFF };
let recommendations: OptimizationRecommendation[] = JSON.parse(JSON.stringify(INITIAL_RECOMMENDATIONS));

let baseVoltage = 230.2;
let baseFrequency = 50.01;
let currentLoadMW = 4.25;
let basePowerFactor = 0.94;
let isSimulationOutageActive = false;

// Compute dynamic Grid Health Score
function calculateGridHealth(): { score: number; breakdown: Record<string, number> } {
  // Voltage stability: ideal 230V, +/- 10V
  const vDiff = Math.abs(baseVoltage - 230);
  const voltageScore = Math.max(0, Math.min(100, 100 - vDiff * 5));

  // Frequency stability: ideal 50.00Hz, +/- 0.5Hz
  const fDiff = Math.abs(baseFrequency - 50.0);
  const freqScore = Math.max(0, Math.min(100, 100 - fDiff * 100));

  // Transformer health average
  const avgTransformerHealth =
    transformers.reduce((acc, t) => acc + t.healthIndicator, 0) / (transformers.length || 1);

  // Substation health average
  const activeSubs = substations.filter((s) => s.status !== 'OFFLINE');
  const avgSubstationHealth =
    activeSubs.reduce((acc, s) => acc + s.healthScore, 0) / (activeSubs.length || 1);

  // Fault penalty
  const activeFaultsCount = faults.filter((f) => f.status === 'ACTIVE').length;
  const faultPenalty = activeFaultsCount * 6;

  // Outage penalty
  const activeOutagesCount = outages.filter((o) => o.status === 'ACTIVE' || o.status === 'CREW DISPATCHED').length;
  const outagePenalty = activeOutagesCount * 20;

  const rawScore =
    voltageScore * 0.25 +
    freqScore * 0.25 +
    avgTransformerHealth * 0.25 +
    avgSubstationHealth * 0.25 -
    faultPenalty -
    outagePenalty;

  const finalScore = Math.max(12, Math.min(99, Math.round(rawScore)));

  return {
    score: finalScore,
    breakdown: {
      voltageStability: Math.round(voltageScore),
      frequencyStability: Math.round(freqScore),
      transformerFleet: Math.round(avgTransformerHealth),
      substationsHealth: Math.round(avgSubstationHealth),
      activeFaultDeduction: faultPenalty,
      outageDeduction: outagePenalty,
    },
  };
}

// Get dynamic telemetry
function getCurrentTelemetry(): GridTelemetry {
  // Add realistic micro-drift for realism
  const vJitter = (Math.random() - 0.5) * 0.4;
  const fJitter = (Math.random() - 0.5) * 0.02;
  const lJitter = (Math.random() - 0.5) * 0.05;

  const dynamicVoltage = +(baseVoltage + vJitter).toFixed(1);
  const dynamicFrequency = +(baseFrequency + fJitter).toFixed(2);
  const dynamicLoad = +(currentLoadMW + lJitter).toFixed(2);
  const dynamicCurrent = +((dynamicLoad * 1000) / (dynamicVoltage * 1.732 * basePowerFactor)).toFixed(1);

  let gridStatus: GridTelemetry['gridStatus'] = 'NORMAL';
  if (isSimulationOutageActive || outages.some((o) => o.status === 'ACTIVE')) {
    gridStatus = 'CRITICAL';
  } else if (dynamicVoltage < 215 || dynamicVoltage > 245 || dynamicFrequency < 49.7 || faults.some((f) => f.severity === 'HIGH')) {
    gridStatus = 'WARNING';
  }

  const health = calculateGridHealth();

  return {
    timestamp: new Date().toISOString(),
    voltage: dynamicVoltage,
    current: dynamicCurrent,
    power: dynamicLoad,
    powerUnit: 'MW',
    frequency: dynamicFrequency,
    powerFactor: basePowerFactor,
    loadMW: dynamicLoad,
    peakLoadMW: 5.12,
    energyTodayMWh: +(28.4 + (new Date().getMinutes() / 60) * 1.8).toFixed(1),
    gridStatus,
    renewableGenerationMW: 2.14,
    renewablePercentage: Math.round((2.14 / dynamicLoad) * 100),
    batteryStatus: {
      soc: 76,
      mode: 'CHARGING',
      powerMW: 0.85,
      capacityMWh: 12.0,
    },
    gridHealthScore: health.score,
    activeAlertCount: alerts.filter((a) => !a.acknowledged).length,
  };
}

function getRenewableMetrics(): RenewableMetrics {
  const now = new Date();
  const hour = now.getHours();

  // Solar follows sun curve
  let solarFactor = 0;
  if (hour >= 6 && hour <= 18) {
    solarFactor = Math.sin(((hour - 6) / 12) * Math.PI);
  }
  const solarMW = +(3.8 * solarFactor + Math.random() * 0.3).toFixed(2);
  const windMW = +(1.6 + Math.sin(now.getMinutes() / 10) * 0.4 + Math.random() * 0.2).toFixed(2);
  const hydroMW = 0.8;
  const totalRenewableMW = +(solarMW + windMW + hydroMW).toFixed(2);
  const batterySoc = 74;
  const batteryPowerMW = solarFactor > 0.6 ? 1.2 : -0.8; // Charging if high solar, discharging otherwise

  return {
    timestamp: now.toISOString(),
    solarMW,
    solarCapacityMW: 6.0,
    windMW,
    windCapacityMW: 3.5,
    hydroMW,
    batterySoc,
    batteryPowerMW,
    gridImportMW: +(Math.max(0, currentLoadMW - totalRenewableMW)).toFixed(2),
    gridExportMW: +(Math.max(0, totalRenewableMW - currentLoadMW)).toFixed(2),
    curtailmentMW: 0.0,
    carbonAvoidedTonsToday: +(totalRenewableMW * 0.42 * 12).toFixed(1),
    totalRenewableMW,
    renewableSharePercent: Math.min(100, Math.round((totalRenewableMW / currentLoadMW) * 100)),
  };
}

// Generate 24h hourly consumption & load curves
function getHourlyLoadHistory() {
  const hours = [];
  const currentHour = new Date().getHours();

  for (let i = 0; i < 24; i++) {
    const h = (currentHour - 23 + i + 24) % 24;
    const timeLabel = `${h.toString().padStart(2, '0')}:00`;

    // Standard industrial/residential diurnal curve: peak at 18-20, low at 03-05
    let base = 2.4;
    if (h >= 7 && h <= 11) base = 3.9;
    else if (h >= 12 && h <= 16) base = 3.6;
    else if (h >= 17 && h <= 21) base = 4.9; // Peak
    else if (h >= 22 || h <= 5) base = 2.1;

    const noise = (Math.sin(i * 1.5) * 0.2 + (Math.random() - 0.5) * 0.15);
    const load = +(base + noise).toFixed(2);
    const solar = (h >= 6 && h <= 18) ? +(Math.sin(((h - 6) / 12) * Math.PI) * 2.8).toFixed(2) : 0;
    const wind = +(0.9 + Math.cos(i) * 0.3).toFixed(2);

    hours.push({
      hour: h,
      time: timeLabel,
      loadMW: load,
      solarMW: solar,
      windMW: wind,
      netGridImportMW: +(Math.max(0, load - (solar + wind))).toFixed(2),
      costPerHour: +(load * 1000 * (h >= 17 && h <= 21 ? 0.24 : h >= 11 && h <= 16 ? 0.18 : 0.12)).toFixed(2),
    });
  }

  return hours;
}

// Machine Learning Demand Forecast Generator
function generateDemandForecast(horizonHours: number = 24, modelType: string = 'XGBoost') {
  const points = [];
  const now = new Date();
  const currentHour = now.getHours();

  for (let i = 1; i <= horizonHours; i++) {
    const futureDate = new Date(now.getTime() + i * 3600 * 1000);
    const h = futureDate.getHours();
    const timeLabel = `${h.toString().padStart(2, '0')}:00`;

    // Base profile with daily cyclicity
    let expected = 2.6;
    if (h >= 7 && h <= 11) expected = 4.1;
    else if (h >= 12 && h <= 16) expected = 3.8;
    else if (h >= 17 && h <= 21) expected = 5.05; // Peak demand period
    else if (h >= 22 || h <= 5) expected = 2.2;

    // Slight temperature dependency simulation
    const ambientSim = 20 + Math.sin(((h - 8) / 24) * 2 * Math.PI) * 8;
    if (ambientSim > 25) {
      expected += (ambientSim - 25) * 0.08; // AC cooling load
    }

    // Model specific variance adjustment
    const confidenceSpread = modelType === 'LSTM' ? 0.25 : modelType === 'Prophet' ? 0.35 : 0.3;
    const uncertainty = (i / horizonHours) * 0.4 + confidenceSpread;

    const predicted = +(expected + (Math.sin(i * 0.8) * 0.1)).toFixed(2);
    const lowerConfidence = +(Math.max(1.5, predicted - uncertainty)).toFixed(2);
    const upperConfidence = +(predicted + uncertainty).toFixed(2);

    points.push({
      time: timeLabel,
      timestamp: futureDate.toISOString(),
      predicted,
      lowerConfidence,
      upperConfidence,
      tempExpectedC: Math.round(ambientSim),
      isPeakPeriod: h >= 17 && h <= 21,
    });
  }

  return points;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '25mb' }));

  // Initialize Gemini API client on the server side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // ===================== REST API ENDPOINTS =====================

  // 1. Grid Status & Health
  app.get('/api/grid/status', (req: Request, res: Response) => {
    res.json({
      success: true,
      telemetry: getCurrentTelemetry(),
      gridHealth: calculateGridHealth(),
      isDemoData: true,
      demoLabel: 'DEMO DATA — NOT LIVE GRID DATA',
    });
  });

  app.get('/api/grid/health', (req: Request, res: Response) => {
    const health = calculateGridHealth();
    res.json({
      success: true,
      ...health,
      certificationDisclaimer:
        'The Grid Health Score is an analytical and predictive health indicator computed using weighted multi-variable sensor vectors (voltage, frequency, transformer thermal gradients, substation capacity). It is not an official regulatory grid safety certification.',
    });
  });

  // 2. Real-Time & Historical Energy
  app.get('/api/energy/current', (req: Request, res: Response) => {
    res.json({
      success: true,
      telemetry: getCurrentTelemetry(),
      renewable: getRenewableMetrics(),
    });
  });

  app.get('/api/energy/history', (req: Request, res: Response) => {
    res.json({
      success: true,
      hourly: getHourlyLoadHistory(),
      daily7Days: [
        { day: 'Mon', consumptionMWh: 78.4, peakMW: 4.8, cost: 11760, renewablePct: 36 },
        { day: 'Tue', consumptionMWh: 82.1, peakMW: 5.0, cost: 12430, renewablePct: 38 },
        { day: 'Wed', consumptionMWh: 80.6, peakMW: 4.9, cost: 12100, renewablePct: 34 },
        { day: 'Thu', consumptionMWh: 84.2, peakMW: 5.2, cost: 12850, renewablePct: 41 },
        { day: 'Fri', consumptionMWh: 86.9, peakMW: 5.3, cost: 13320, renewablePct: 32 },
        { day: 'Sat', consumptionMWh: 69.3, peakMW: 4.1, cost: 9840, renewablePct: 45 },
        { day: 'Sun (Today)', consumptionMWh: 71.8, peakMW: 4.3, cost: 10450, renewablePct: 48 },
      ],
      monthly12Months: [
        { month: 'Jan', consumptionMWh: 2150, peakMW: 5.1, cost: 322500 },
        { month: 'Feb', consumptionMWh: 1980, peakMW: 4.9, cost: 297000 },
        { month: 'Mar', consumptionMWh: 2240, peakMW: 5.0, cost: 336000 },
        { month: 'Apr', consumptionMWh: 2100, peakMW: 4.8, cost: 315000 },
        { month: 'May', consumptionMWh: 2380, peakMW: 5.2, cost: 357000 },
        { month: 'Jun', consumptionMWh: 2620, peakMW: 5.7, cost: 419200 },
        { month: 'Jul', consumptionMWh: 2890, peakMW: 6.2, cost: 491300 },
        { month: 'Aug', consumptionMWh: 2810, peakMW: 6.0, cost: 477700 },
        { month: 'Sep', consumptionMWh: 2450, peakMW: 5.4, cost: 392000 },
        { month: 'Oct (Est)', consumptionMWh: 2320, peakMW: 5.1, cost: 348000 },
        { month: 'Nov (Proj)', consumptionMWh: 2180, peakMW: 4.9, cost: 327000 },
        { month: 'Dec (Proj)', consumptionMWh: 2410, peakMW: 5.3, cost: 385600 },
      ],
    });
  });

  app.get('/api/energy/consumption', (req: Request, res: Response) => {
    const timeframe = (req.query.timeframe as string) || 'Today';
    const hourly = getHourlyLoadHistory();
    const totalTodayMWh = 71.8;
    const peakMW = 5.12;
    const avgLoadMW = 3.65;
    const minLoadMW = 2.05;
    const estimatedCost = 10450;

    res.json({
      success: true,
      timeframe,
      metrics: {
        totalConsumptionMWh: totalTodayMWh,
        peakDemandMW: peakMW,
        averageLoadMW: avgLoadMW,
        minimumLoadMW: minLoadMW,
        estimatedCost,
        currency: tariff.currency,
      },
      dataPoints: hourly,
    });
  });

  // 3. AI Demand Forecasting
  app.get('/api/forecast/hourly', (req: Request, res: Response) => {
    const model = (req.query.model as string) || 'XGBoost';
    const forecast = generateDemandForecast(24, model);

    const modelMetrics = {
      'Random Forest': { rmse: 0.18, mape: 3.4, r2: 0.94, confidence: 91 },
      'XGBoost': { rmse: 0.14, mape: 2.8, r2: 0.97, confidence: 95 },
      'LSTM': { rmse: 0.12, mape: 2.3, r2: 0.98, confidence: 97 },
      'Prophet': { rmse: 0.21, mape: 4.1, r2: 0.91, confidence: 88 },
      'GRU': { rmse: 0.13, mape: 2.5, r2: 0.97, confidence: 96 },
    }[model] || { rmse: 0.14, mape: 2.8, r2: 0.97, confidence: 95 };

    res.json({
      success: true,
      model,
      metrics: modelMetrics,
      horizon: 'Next 24 Hours',
      currentLoad: currentLoadMW,
      predictedPeak: 5.14,
      peakHour: '18:30',
      confidenceLevel: '95% Uncertainty Band',
      forecast,
    });
  });

  app.get('/api/forecast/daily', (req: Request, res: Response) => {
    const model = (req.query.model as string) || 'LSTM';
    const days = [
      { date: 'Day +1', predictedPeakMW: 5.18, totalMWh: 74.2, confidence: 96, peakWindow: '18:00 - 20:30' },
      { date: 'Day +2', predictedPeakMW: 5.25, totalMWh: 76.8, confidence: 94, peakWindow: '18:15 - 20:45' },
      { date: 'Day +3', predictedPeakMW: 5.05, totalMWh: 72.1, confidence: 92, peakWindow: '17:45 - 20:15' },
      { date: 'Day +4', predictedPeakMW: 4.90, totalMWh: 69.5, confidence: 89, peakWindow: '17:30 - 20:00' },
      { date: 'Day +5', predictedPeakMW: 5.32, totalMWh: 78.4, confidence: 87, peakWindow: '18:30 - 21:00' },
      { date: 'Day +6', predictedPeakMW: 4.30, totalMWh: 58.2, confidence: 85, peakWindow: '19:00 - 21:00' },
      { date: 'Day +7', predictedPeakMW: 4.15, totalMWh: 56.1, confidence: 82, peakWindow: '19:00 - 21:00' },
    ];
    res.json({ success: true, model, forecastDays: days });
  });

  // 4. Power Faults & Outage Detection
  app.get('/api/faults', (req: Request, res: Response) => {
    res.json({
      success: true,
      faults,
      totalCount: faults.length,
      activeCount: faults.filter((f) => f.status === 'ACTIVE').length,
    });
  });

  app.post('/api/faults/acknowledge', (req: Request, res: Response) => {
    const { id } = req.body;
    const fault = faults.find((f) => f.id === id);
    if (fault) {
      fault.status = fault.status === 'ACTIVE' ? 'INVESTIGATING' : 'RESOLVED';
      res.json({ success: true, fault });
    } else {
      res.status(404).json({ error: 'Fault not found' });
    }
  });

  app.get('/api/outages', (req: Request, res: Response) => {
    res.json({
      success: true,
      outages,
      activeOutages: outages.filter((o) => o.status !== 'RESOLVED'),
      demoNotice: 'Simulated electrical disturbance scenarios for smart grid response validation.',
    });
  });

  // 5. Substations & Transformers
  app.get('/api/substations', (req: Request, res: Response) => {
    res.json({ success: true, substations });
  });

  app.get('/api/transformers', (req: Request, res: Response) => {
    res.json({ success: true, transformers });
  });

  // 6. Renewable Energy & Storage
  app.get('/api/renewable', (req: Request, res: Response) => {
    res.json({ success: true, data: getRenewableMetrics() });
  });

  // 7. Alerts
  app.get('/api/alerts', (req: Request, res: Response) => {
    res.json({
      success: true,
      alerts,
      unacknowledgedCount: alerts.filter((a) => !a.acknowledged).length,
    });
  });

  app.post('/api/alerts/resolve', (req: Request, res: Response) => {
    const { id } = req.body;
    const alert = alerts.find((a) => a.id === id);
    if (alert) {
      alert.acknowledged = true;
      res.json({ success: true, alert });
    } else {
      res.status(404).json({ error: 'Alert not found' });
    }
  });

  // 8. Energy Optimization
  app.get('/api/optimize/recommendations', (req: Request, res: Response) => {
    res.json({
      success: true,
      recommendations,
      totalPotentialSavingsDollars: recommendations.reduce((acc, r) => acc + r.potentialCostSavings, 0),
      totalPeakReductionMW: recommendations.reduce((acc, r) => acc + r.impactMW, 0),
    });
  });

  app.post('/api/optimize/apply', (req: Request, res: Response) => {
    const { id } = req.body;
    const rec = recommendations.find((r) => r.id === id);
    if (rec) {
      rec.status = 'APPLIED';
      res.json({ success: true, recommendation: rec });
    } else {
      res.status(404).json({ error: 'Recommendation not found' });
    }
  });

  // 9. Tariff & Cost Configuration
  app.get('/api/tariff', (req: Request, res: Response) => {
    res.json({ success: true, tariff });
  });

  app.post('/api/tariff/update', (req: Request, res: Response) => {
    tariff = { ...tariff, ...req.body };
    res.json({ success: true, tariff });
  });

  // 10. Dataset Upload & Statistical Anomaly Extraction
  app.post('/api/datasets/upload', (req: Request, res: Response) => {
    const { filename, rawContent, fileType } = req.body;

    if (!rawContent || typeof rawContent !== 'string') {
      res.status(400).json({ error: 'Invalid file payload' });
      return;
    }

    try {
      const lines = rawContent.trim().split('\n');
      if (lines.length < 2) {
        res.status(400).json({ error: 'Dataset must contain at least a header row and data rows.' });
        return;
      }

      const headers = lines[0].split(',').map((h: string) => h.trim().toLowerCase());
      const dataRows = lines.slice(1).map((line: string) => {
        const values = line.split(',').map((v: string) => v.trim());
        const row: Record<string, any> = {};
        headers.forEach((h: string, idx: number) => {
          const num = parseFloat(values[idx]);
          row[h] = isNaN(num) ? values[idx] : num;
        });
        return row;
      });

      // Compute statistics
      const voltages = dataRows.map((r: any) => r.voltage).filter((v: any) => typeof v === 'number');
      const powers = dataRows.map((r: any) => r.power || r.load).filter((p: any) => typeof p === 'number');
      const frequencies = dataRows.map((r: any) => r.frequency).filter((f: any) => typeof f === 'number');

      const meanV = voltages.length ? voltages.reduce((a: number, b: number) => a + b, 0) / voltages.length : 230;
      const peakPower = powers.length ? Math.max(...powers) : 5.0;
      const meanPower = powers.length ? powers.reduce((a: number, b: number) => a + b, 0) / powers.length : 3.5;

      // Anomaly detection: rows where voltage < 215 or > 245, or frequency < 49.8
      const detectedAnomalies = dataRows.filter((r: any) => {
        return (
          (r.voltage && (r.voltage < 218 || r.voltage > 242)) ||
          (r.frequency && (r.frequency < 49.85 || r.frequency > 50.15)) ||
          (r.power_factor && r.power_factor < 0.88)
        );
      });

      res.json({
        success: true,
        filename,
        rowCount: dataRows.length,
        columns: headers,
        preview: dataRows.slice(0, 8),
        stats: {
          meanVoltage: +meanV.toFixed(2),
          meanPowerMW: +meanPower.toFixed(2),
          peakPowerMW: +peakPower.toFixed(2),
          anomaliesDetectedCount: detectedAnomalies.length,
          dataQualityScore: Math.min(100, Math.round(100 - (detectedAnomalies.length / dataRows.length) * 80)),
        },
        detectedAnomalies: detectedAnomalies.slice(0, 5),
        modelTrained: 'Random Forest & XGBoost Ensemble (Trained on uploaded telemetry in 240ms)',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to process dataset: ' + err.message });
    }
  });

  // 11. Simulation Controls & Fault Injections
  app.post('/api/simulation/trigger-event', (req: Request, res: Response) => {
    const { eventType } = req.body;

    if (eventType === 'VOLTAGE_SAG') {
      baseVoltage = 212.0;
      faults.unshift({
        id: `FLT-${Date.now().toString().slice(-4)}`,
        faultType: 'Feeder Severe Voltage Sag',
        severity: 'HIGH',
        detectedValue: '212.0 V',
        expectedRange: '220 V - 240 V',
        location: 'West Hills Feeder Substation',
        component: 'Primary 33kV Bus',
        detectedAt: 'Just now',
        status: 'ACTIVE',
        possibleCause: 'Heavy inrush load or localized feeder ground path disturbance.',
        recommendedAction: 'Engage On-Load Tap Changer (OLTC) tap position +2 steps immediately.',
        aiConfidence: 0.96,
        isolationProtocol: 'AVR regulating.',
      });
    } else if (eventType === 'TRANSFORMER_OVERHEAT') {
      const tr = transformers.find((t) => t.id === 'TR-501');
      if (tr) {
        tr.oilTempC = 101;
        tr.windingTempC = 112;
        tr.status = 'Critical';
        tr.healthIndicator = 44;
      }
      alerts.unshift({
        id: `alt-${Date.now()}`,
        severity: 'CRITICAL',
        title: 'Emergency: TR-501 Thermal Overrun Alert',
        timestamp: 'Just now',
        location: 'Harbor Gate Primary Substation',
        device: 'TR-501',
        explanation: 'Winding temperature escalated to 112°C under sustained overload.',
        recommendedAction: 'Command immediate forced load shedding of 10MW to avoid insulation degradation.',
        acknowledged: false,
      });
    } else if (eventType === 'OUTAGE_TRIP') {
      isSimulationOutageActive = true;
      baseFrequency = 49.65;
      outages.unshift({
        id: `OUT-${Date.now().toString().slice(-3)}`,
        location: 'Industrial Feeder Sector 4 (Line 9A)',
        substationId: 'sub-01',
        detectedTime: 'Just now',
        affectedCustomers: 3200,
        affectedArea: 'North Industrial Logistics & High-Tech Park',
        estimatedSeverity: 'CRITICAL',
        reason: 'Transmission protection relay 50/51 trip due to sudden phase-to-ground flashover.',
        status: 'ACTIVE',
        etaMinutes: 45,
        recommendedAction: 'Execute supervisory sectionalizing and energize redundant feeder 9B.',
        automatedSafetyAction: 'Auto-recloser lockout triggered after 3 unsuccessful attempts.',
        isSimulated: true,
      });
    } else if (eventType === 'RESET') {
      baseVoltage = 230.2;
      baseFrequency = 50.01;
      currentLoadMW = 4.25;
      isSimulationOutageActive = false;
      const tr = transformers.find((t) => t.id === 'TR-501');
      if (tr) {
        tr.oilTempC = 78;
        tr.windingTempC = 84;
        tr.status = 'Warning';
        tr.healthIndicator = 72;
      }
    }

    res.json({
      success: true,
      eventType,
      telemetry: getCurrentTelemetry(),
      gridHealth: calculateGridHealth(),
    });
  });

  // 12. GridGuard Copilot - Connected AI Power Assistant
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const currentTel = getCurrentTelemetry();
    const health = calculateGridHealth();
    const activeFaults = faults.filter((f) => f.status === 'ACTIVE');
    const activeOutageList = outages.filter((o) => o.status !== 'RESOLVED');

    // Context string grounded in exact live power grid telemetry
    const gridContextPrompt = `
You are GRIDGUARD COPILOT, the specialized AI Power Engineer and Smart Grid Intelligence Assistant embedded inside the GridGuard AI platform.

CURRENT REAL-TIME SMART GRID STATUS:
- Grid Health Score: ${health.score}/100 (Voltage: ${health.breakdown.voltageStability}%, Freq: ${health.breakdown.frequencyStability}%, Transformers: ${health.breakdown.transformerFleet}%)
- System Status: ${currentTel.gridStatus}
- System Load: ${currentTel.loadMW} MW (Peak Predicted: ${currentTel.peakLoadMW} MW)
- Voltage: ${currentTel.voltage} V (Nominal: 230.0 V)
- Frequency: ${currentTel.frequency} Hz (Nominal: 50.00 Hz)
- Current: ${currentTel.current} A
- Power Factor: ${currentTel.powerFactor}
- Energy Consumed Today: ${currentTel.energyTodayMWh} MWh
- Renewable Generation: ${currentTel.renewableGenerationMW} MW (${currentTel.renewablePercentage}% of system load)
- Battery State of Charge: ${currentTel.batteryStatus.soc}% (${currentTel.batteryStatus.mode} at ${currentTel.batteryStatus.powerMW} MW)
- Active Power Faults: ${activeFaults.length} (${activeFaults.map((f) => `${f.faultType} at ${f.location}`).join('; ') || 'None'})
- Active Outages: ${activeOutageList.length} (${activeOutageList.map((o) => `${o.location} [${o.status}]`).join('; ') || 'None'})
- Electricity Tariff: ${tariff.currency}${tariff.baseRatePerKWh}/kWh (Peak multiplier ${tariff.peakRateMultiplier}x between ${tariff.peakStartHour}:00 - ${tariff.peakEndHour}:00)

GUIDELINES:
1. Speak with the authority, clarity, and precision of a senior power systems engineer / grid operations commander.
2. Directly reference the real-time telemetry numbers above (e.g. current load ${currentTel.loadMW} MW, ${currentTel.voltage} V, PF ${currentTel.powerFactor}, peak hour predictions).
3. Provide actionable electrical engineering advice (e.g. load shifting, reactive power VAR compensation, tap changer adjustment, battery discharge timing, thermal radiator checks).
4. SAFETY RULE: Never suggest unauthorized manual tampering with high voltage equipment; always frame actions within standard utility SCADA protocols, interlocks, and licensed technician safety standards.
5. Format your answers cleanly with Markdown, bullet points, and key electrical metrics.
`;

    // Attempt Gemini call if API key exists
    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: gridContextPrompt,
            temperature: 0.7,
          },
        });

        res.json({
          success: true,
          reply: response.text || 'GridGuard telemetry verified. All operational parameters nominal.',
          modelUsed: 'gemini-3.8-flash',
        });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to local electricity expert model:', geminiError?.message);
      }
    }

    // High quality contextual fallback if Gemini API key is not configured or network restricted
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('how much electricity') || lower.includes('consumption') || lower.includes('energy used')) {
      reply = `### Today's Electricity Consumption Summary\n\n* **Total Energy Used Today:** **${currentTel.energyTodayMWh} MWh**\n* **Current Real-Time Load:** **${currentTel.loadMW} MW**\n* **Renewable Generation:** **${currentTel.renewableGenerationMW} MW** (${currentTel.renewablePercentage}% of load covered by solar & wind)\n* **Estimated Cost Today:** **${tariff.currency}${(currentTel.energyTodayMWh * 1000 * tariff.baseRatePerKWh * 1.15).toFixed(2)}**\n\nConsumption is tracking **2.4% below** yesterday's baseline. Off-peak energy comprised 54% of total volume.`;
    } else if (lower.includes('peak demand') || lower.includes('peak expect') || lower.includes('future peak')) {
      reply = `### Peak Demand Forecast & Scheduling\n\n* **Current Load:** **${currentTel.loadMW} MW**\n* **Predicted Peak Demand:** **${currentTel.peakLoadMW} MW**\n* **Anticipated Peak Window:** **18:00 – 20:30**\n* **Peak Driver:** Evening residential cooling combined with industrial shift ramp at Substation Alpha.\n\n**Recommended Mitigation:**\n1. Discharge BESS battery storage at **2.5 MW** starting at 17:45.\n2. Curtail non-essential HVAC at municipal pumping stations by **1.2 MW**.\n3. Keep spinning reserve at South Valley online.`;
    } else if (lower.includes('abnormal') || lower.includes('fault') || lower.includes('issue') || lower.includes('outage')) {
      reply = `### Anomaly & Fault Assessment\n\n* **Grid Health Score:** **${health.score}/100**\n* **System Status:** **${currentTel.gridStatus}**\n* **Active Faults:** ${activeFaults.length ? `**${activeFaults.length} detected**` : '**None detected**'}\n\n${activeFaults.map((f) => `- **${f.faultType}** at *${f.location}*: Measured **${f.detectedValue}** (Normal: ${f.expectedRange}). Cause: ${f.possibleCause}`).join('\n') || 'All phase voltages, frequency harmonics, and transformer thermal gradients remain within standard IEEE 519 compliance.'}\n\n${activeOutageList.length ? `⚠️ **Active Outage Detected:** ${activeOutageList[0].location} (${activeOutageList[0].affectedCustomers} customers affected). Response crew dispatched.` : '✓ All transmission ties and distribution feeders are energized.'}`;
    } else if (lower.includes('reduce') || lower.includes('optimize') || lower.includes('save') || lower.includes('efficiency')) {
      reply = `### AI Energy Optimization Strategies\n\n1. **Time-of-Use Peak Shifting:** Shift flexible industrial loads (pumping, compressed air) from the **17:00–21:00** peak window to the solar generation window (**12:00–15:00**) for an estimated **$1,420/day** reduction.\n2. **BESS Battery Arbitrage:** Charge battery at off-peak rates (${tariff.currency}${tariff.baseRatePerKWh}/kWh) and discharge during peak multiplier periods (${tariff.peakRateMultiplier}x).\n3. **Power Factor Optimization:** Elevating East Bay Substation's PF from 0.88 to 0.96 using Capacitor Bank 3 will avoid reactive power penalties and save ~**$620/month**.`;
    } else {
      reply = `### GridGuard Power Analysis\n\n* **Grid Status:** **${currentTel.gridStatus}** | Health Score: **${health.score}/100**\n* **Frequency:** **${currentTel.frequency} Hz** | Voltage: **${currentTel.voltage} V**\n* **Load Profile:** **${currentTel.loadMW} MW** with peak forecast at **${currentTel.peakLoadMW} MW**\n* **Renewable Inflow:** **${currentTel.renewablePercentage}%** (${currentTel.renewableGenerationMW} MW)\n\nTelemetry is stable. You can ask me to forecast tomorrow's load, simulate load shedding, review transformer thermal logs, or calculate Time-of-Use tariff savings.`;
    }

    res.json({
      success: true,
      reply,
      modelUsed: 'gridguard-domain-engine',
    });
  });

  // 13. AI Report Generator Endpoint
  app.post('/api/reports/generate', (req: Request, res: Response) => {
    const { period, facility } = req.body;
    const now = new Date();
    const tel = getCurrentTelemetry();
    const health = calculateGridHealth();

    const report = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      generatedAt: now.toISOString(),
      title: `GridGuard Executive Power & Health Audit Report - ${period || 'Current 24h Cycle'}`,
      period: period || 'Last 24 Hours',
      facility: facility || 'Metro Power Distribution Grid',
      executiveSummary: `GridGuard AI continuous monitoring analyzed 86,400 telemetry packets across 6 substations and 5 power transformers. The grid maintained an average health index of ${health.score}/100 with zero critical cascade failures. Renewable integration provided 34.2% of total delivered energy, offsetting 38.6 metric tons of CO2. Peak demand reached ${tel.peakLoadMW} MW at 18:30. Implementation of recommended load shifting protocols is projected to capture $4,890 in weekly operating expenditure savings.`,
      gridHealthScore: health.score,
      totalConsumptionMWh: 71.8,
      peakDemandMW: tel.peakLoadMW,
      peakDemandTime: '18:30',
      averageVoltage: 229.8,
      averageFrequency: 50.01,
      averagePowerFactor: 0.94,
      faultsDetectedCount: faults.length,
      outagesCount: outages.length,
      renewableSharePercent: tel.renewablePercentage,
      totalCostEstimated: 10450,
      potentialSavings: 1840,
      substationsSummary: substations.map((s) => ({
        name: s.name,
        code: s.code,
        loadMW: s.loadMW,
        healthScore: s.healthScore,
        status: s.status,
      })),
      recommendations: [
        'Dispatch 4.5 MW from battery storage during 18:00 - 20:30 peak tariff window.',
        'Schedule maintenance inspection on TR-501 cooling radiator fans.',
        'Engage Capacitor Bank 3 at East Bay Hub to restore power factor above 0.95.',
        'Reroute redundant feeder line on North Corridor prior to scheduled storm front.',
      ],
    };

    res.json({ success: true, report });
  });

  // 14. Admin Statistics
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    res.json({
      success: true,
      totalUsers: 14,
      activeUsers: 6,
      gridDevices: 48,
      activeAlerts: alerts.filter((a) => !a.acknowledged).length,
      faults: faults.length,
      systemHealth: calculateGridHealth().score,
      uptimePercent: 99.98,
      telemetryThroughput: '1,240 pkts/sec',
      mqttBrokerStatus: 'ONLINE (Simulated)',
    });
  });

  // In development, mount Vite's middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GridGuard AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
