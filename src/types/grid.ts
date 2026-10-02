export type GridStatus = 'STABLE' | 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
export type AssetHealthStatus = 'Healthy' | 'Warning' | 'Critical';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type UserRole = 'Admin' | 'Operator' | 'Grid Operator' | 'Energy Analyst' | 'Viewer';

export interface GridMetrics {
  voltage: number; // 229 V
  frequency: number; // 49.98 Hz
  current: number; // 82 A
  powerFactor: number; // 0.96
  systemLoadPct: number; // 76%
  currentLoadMW: number; // 15.2 MW
  peakLoadMW: number; // 18.7 MW
  averageLoadMW: number; // 13.8 MW
  reliabilityScore: number; // 94%
  activeAlertsCount: number; // 3
  faultRiskPct: number; // 8%
  connectedAssetsCount: number; // 128
  renewableContributionPct: number; // 34%
  lastUpdated: string;
}

export interface GridTelemetry {
  timestamp: string;
  voltage: number; // Volts, e.g. 229
  current: number; // Amperes, e.g. 82
  power: number; // MW, e.g. 15.2
  powerUnit: 'kW' | 'MW';
  frequency: number; // Hz, e.g. 49.98
  powerFactor: number; // 0 to 1, e.g. 0.96
  loadMW: number;
  peakLoadMW: number;
  energyTodayMWh: number;
  gridStatus: GridStatus;
  renewableGenerationMW: number;
  renewablePercentage: number;
  batteryStatus: {
    soc: number;
    mode: 'CHARGING' | 'DISCHARGING' | 'IDLE';
    powerMW: number;
    capacityMWh: number;
  };
  gridHealthScore: number;
  activeAlertCount: number;
}

export interface GridAsset {
  id: string;
  name: string;
  type: 'Transformer' | 'Substation' | 'Transmission Line' | 'Distribution Node' | 'Solar Farm' | 'BESS Storage';
  location: string;
  temperatureC: number;
  loadPct: number;
  healthPct: number;
  status: AssetHealthStatus;
  risk: RiskLevel;
  lastUpdate: string;
  coordinates: { x: number; y: number };
  specifications?: {
    voltageLevel: string;
    ratedCapacity: string;
    coolingType: string;
    oilQualityIndex?: number;
    vibrationHarmonics?: number;
  };
  predictiveData?: {
    failureRiskPct: number;
    temperatureTrend: 'Increasing' | 'Stable' | 'Decreasing';
    loadTrend: 'Increasing' | 'Stable' | 'Decreasing';
    lastMaintenance: string;
    nextRecommendedInspection: string;
    contributingFactors: { factor: string; impactPct: number }[];
  };
}

export interface Substation {
  id: string;
  name: string;
  code: string;
  location: string;
  lat: number;
  lng: number;
  type: 'Transmission' | 'Distribution' | 'Collector' | 'Industrial';
  voltageLevelKV: number;
  currentAmps: number;
  loadMW: number;
  capacityMW: number;
  loadPercentage: number;
  frequencyHz: number;
  powerFactor: number;
  temperatureC: number;
  status: GridStatus;
  healthScore: number;
  transformerCount: number;
  lastInspection: string;
}

export interface Transformer {
  id: string;
  name: string;
  substationId: string;
  substationName: string;
  ratedMVA: number;
  windingTempC: number;
  oilTempC: number;
  ambientTempC: number;
  loadPercentage: number;
  voltagePrimaryKV: number;
  voltageSecondaryKV: number;
  currentAmps: number;
  powerFactor: number;
  healthIndicator: number;
  status: 'Healthy' | 'Warning' | 'Critical';
  oilQualityIndex: number;
  coolingStatus: 'Fans Active' | 'Natural' | 'Emergency Pumps';
  dgaStatus: 'Normal' | 'Trace Gases' | 'Thermal Fault Warning';
}

export interface FaultRecord {
  id: string;
  faultType: string;
  severity: AlertSeverity;
  detectedValue: string;
  expectedRange: string;
  location: string;
  component: string;
  detectedAt: string;
  status: 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED';
  possibleCause: string;
  recommendedAction: string;
  aiConfidence: number;
  isolationProtocol: string;
}

export interface OutageEvent {
  id: string;
  location: string;
  substationId: string;
  detectedTime: string;
  affectedCustomers: number;
  affectedArea: string;
  estimatedSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  reason: string;
  status: 'ACTIVE' | 'CREW DISPATCHED' | 'RESTORING' | 'RESOLVED';
  etaMinutes: number;
  recommendedAction: string;
  automatedSafetyAction: string;
  isSimulated: boolean;
}

export interface GridAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  timestamp: string;
  location: string;
  device: string;
  explanation: string;
  recommendedAction: string;
  acknowledged: boolean;
}

export interface GridAlertItem {
  id: string;
  severity: AlertSeverity;
  assetId: string;
  assetName: string;
  time: string;
  description: string;
  suggestedAction: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
}

export interface AIReliabilityPrediction {
  id: string;
  category: string;
  probabilityPct: number;
  trend: 'up' | 'down' | 'stable';
  status: 'LOW' | 'MODERATE' | 'HIGH';
  shortExplanation: string;
  recommendedAction: string;
  contributingFactors: {
    factor: string;
    impactPct: number;
  }[];
}

export interface AnomalyEvent {
  id: string;
  time: string;
  status: 'Normal' | 'Warning' | 'Anomaly';
  dimension: 'Voltage' | 'Current' | 'Frequency' | 'Temperature' | 'Power Factor' | 'Load' | 'System';
  whatChanged: string;
  assetAffected: string;
  contributingFactors: string[];
}

export interface RenewableMetrics {
  timestamp: string;
  solarMW: number;
  solarCapacityMW: number;
  windMW: number;
  windCapacityMW: number;
  hydroMW: number;
  batterySoc: number;
  batteryPowerMW: number;
  gridImportMW: number;
  gridExportMW: number;
  curtailmentMW: number;
  carbonAvoidedTonsToday: number;
  totalRenewableMW: number;
  renewableSharePercent: number;
}

export interface LoadForecastPoint {
  time: string;
  actual?: number;
  predicted: number;
  lowerConfidence: number;
  upperConfidence: number;
  tempExpectedC?: number;
}

export interface ForecastModelInfo {
  id: string;
  name: string;
  type: 'Random Forest' | 'XGBoost' | 'LSTM' | 'Prophet' | 'GRU';
  rmse: number;
  mape: number;
  r2: number;
  confidence: number;
  description: string;
}

export interface TariffConfig {
  currency: string;
  baseRatePerKWh: number;
  peakRateMultiplier: number;
  peakStartHour: number;
  peakEndHour: number;
  shoulderRateMultiplier: number;
  shoulderStartHour: number;
  shoulderEndHour: number;
  demandChargePerKW: number;
  carbonOffsetCredit: number;
}

export interface OptimizationRecommendation {
  id: string;
  title: string;
  category: 'Load Shifting' | 'Peak Shaving' | 'Renewable Storage' | 'Power Factor Correction' | 'Cooling Schedule';
  impactMW: number;
  potentialCostSavings: number;
  currentSchedule: string;
  recommendedSchedule: string;
  confidence: number;
  actionRequired: string;
  status: 'PENDING' | 'APPLIED' | 'SCHEDULED';
}

export interface GridReportData {
  id: string;
  generatedAt: string;
  title: string;
  period: string;
  executiveSummary: string;
  gridHealthScore: number;
  totalConsumptionMWh: number;
  peakDemandMW: number;
  peakDemandTime: string;
  faultsDetectedCount: number;
  outagesCount: number;
  renewableSharePercent: number;
  totalCostEstimated: number;
  potentialSavings: number;
  recommendations: string[];
}

export interface UserSession {
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}
