import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewView } from './components/views/OverviewView';
import { GridMonitoringView } from './components/views/GridMonitoringView';
import { EquipmentHealthView } from './components/views/EquipmentHealthView';
import { AIPredictionsView } from './components/views/AIPredictionsView';
import { LoadForecastView } from './components/views/LoadForecastView';
import { AlertsView } from './components/views/AlertsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { AICopilotView } from './components/views/AICopilotView';
import { SettingsView } from './components/views/SettingsView';
import { PredictiveMaintenanceView } from './components/views/PredictiveMaintenanceView';
import { AnomalyDetectionView } from './components/views/AnomalyDetectionView';
import { OutageRiskView } from './components/views/OutageRiskView';
import { WhatIfSimulatorView } from './components/views/WhatIfSimulatorView';
import { DigitalGridTwinView } from './components/views/DigitalGridTwinView';
import { AssetRiskRankingView } from './components/views/AssetRiskRankingView';
import { ExplainabilityModal } from './components/common/ExplainabilityModal';
import { AssetDetailModal } from './components/common/AssetDetailModal';

import {
  INITIAL_METRICS,
  INITIAL_ASSETS,
  INITIAL_PREDICTIONS,
  INITIAL_ALERTS,
} from './services/gridData';
import {
  GridMetrics,
  GridAsset,
  AIReliabilityPrediction,
  GridAlertItem,
  UserRole,
} from './types/grid';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<string>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // User state
  const [user, setUser] = useState<{ name: string; email: string; role: UserRole }>({
    name: 'Grid Operator Alex Vance',
    email: 'alex.vance@gridguard.ai',
    role: 'Operator',
  });

  // Smart Grid Data State
  const [metrics, setMetrics] = useState<GridMetrics>(INITIAL_METRICS);
  const [assets, setAssets] = useState<GridAsset[]>(INITIAL_ASSETS);
  const [predictions, setPredictions] = useState<AIReliabilityPrediction[]>(INITIAL_PREDICTIONS);
  const [alerts, setAlerts] = useState<GridAlertItem[]>(INITIAL_ALERTS);

  // Modals state
  const [selectedAsset, setSelectedAsset] = useState<GridAsset | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<AIReliabilityPrediction | null>(null);

  // Real-time simulated micro-variations
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) => {
        const vJitter = (Math.random() - 0.5) * 0.4;
        const fJitter = (Math.random() - 0.5) * 0.02;
        const lJitter = (Math.random() - 0.5) * 0.2;
        return {
          ...prev,
          voltage: Math.round(prev.voltage + vJitter),
          frequency: +(prev.frequency + fJitter).toFixed(2),
          currentLoadMW: +(prev.currentLoadMW + lJitter).toFixed(1),
          lastUpdated: 'Just now',
        };
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleLoginSuccess = (userData: { name: string; email: string; role: UserRole }) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('overview');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleRoleChange = (role: UserRole) => {
    setUser((prev) => ({ ...prev, role }));
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
  };

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'RESOLVED' } : a))
    );
  };

  const handleViewAlertAsset = (assetId: string) => {
    const target = assets.find((a) => a.id === assetId);
    if (target) setSelectedAsset(target);
  };

  // Breadcrumb mapping
  const breadcrumbMap: Record<string, { title: string; crumb: string }> = {
    overview: { title: 'Overview Dashboard', crumb: 'Grid Reliability Overview' },
    monitoring: { title: 'Grid Monitoring', crumb: 'Live Instrumentation & Waveforms' },
    equipment: { title: 'Equipment Health', crumb: 'Connected Grid Asset Condition' },
    predictions: { title: 'AI Predictions', crumb: 'Reliability Risk Forecasting' },
    forecast: { title: 'Load Forecast', crumb: 'Electricity Demand Horizon' },
    alerts: { title: 'Alerts & Incidents', crumb: 'Alarm Management' },
    analytics: { title: 'Analytics', crumb: 'Power Quality & Fuel Mix' },
    copilot: { title: 'AI Grid Copilot', crumb: 'Industrial Reliability Assistant' },
    settings: { title: 'Settings', crumb: 'Station Settings & Thresholds' },
    maintenance: { title: 'Predictive Maintenance', crumb: 'Asset Inspection Schedule' },
    anomalies: { title: 'Anomaly Detection', crumb: 'Isolation Forest Timeline' },
    'outage-risk': { title: 'Outage Risk', crumb: 'Contingency Probability' },
    simulator: { title: 'What-If Simulator', crumb: 'Contingency Stress Testing' },
    'digital-twin': { title: 'Digital Grid Twin', crumb: 'Virtual Cascade Topology' },
    'risk-ranking': { title: 'Asset Risk Ranking', crumb: 'Fleet Failure Leaderboard' },
  };

  const currentMeta = breadcrumbMap[currentView] || {
    title: 'Grid Reliability',
    crumb: 'Overview',
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] text-[#172033] flex">
      {/* Fixed Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        activeAlertsCount={alerts.filter((a) => a.status === 'ACTIVE').length}
      />

      {/* Main Content Layout with Left Padding for Fixed Desktop Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navigation Header */}
        <Header
          pageTitle={currentMeta.title}
          breadcrumb={currentMeta.crumb}
          gridStatus="STABLE"
          activeAlertsCount={alerts.filter((a) => a.status === 'ACTIVE').length}
          user={user}
          onRoleChange={handleRoleChange}
          onLogout={handleLogout}
          onOpenCopilot={() => setCurrentView('copilot')}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {currentView === 'overview' && (
            <OverviewView
              metrics={metrics}
              assets={assets}
              predictions={predictions}
              onSelectAsset={setSelectedAsset}
              onOpenPredictionAnalysis={setSelectedPrediction}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'monitoring' && <GridMonitoringView metrics={metrics} />}

          {currentView === 'equipment' && (
            <EquipmentHealthView assets={assets} onSelectAsset={setSelectedAsset} />
          )}

          {currentView === 'predictions' && (
            <AIPredictionsView
              predictions={predictions}
              onOpenAnalysis={setSelectedPrediction}
            />
          )}

          {currentView === 'forecast' && <LoadForecastView metrics={metrics} />}

          {currentView === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onAcknowledge={handleAcknowledgeAlert}
              onResolve={handleResolveAlert}
              onViewDetails={handleViewAlertAsset}
            />
          )}

          {currentView === 'analytics' && <AnalyticsView metrics={metrics} />}

          {currentView === 'copilot' && (
            <AICopilotView metrics={metrics} assets={assets} alerts={alerts} />
          )}

          {currentView === 'settings' && (
            <SettingsView userRole={user.role} onRoleChange={handleRoleChange} />
          )}

          {currentView === 'maintenance' && (
            <PredictiveMaintenanceView assets={assets} onSelectAsset={setSelectedAsset} />
          )}

          {currentView === 'anomalies' && <AnomalyDetectionView metrics={metrics} />}

          {currentView === 'outage-risk' && <OutageRiskView />}

          {currentView === 'simulator' && <WhatIfSimulatorView />}

          {currentView === 'digital-twin' && (
            <DigitalGridTwinView assets={assets} onSelectAsset={setSelectedAsset} />
          )}

          {currentView === 'risk-ranking' && (
            <AssetRiskRankingView assets={assets} onSelectAsset={setSelectedAsset} />
          )}
        </main>
      </div>

      {/* Explainability "Why?" Modal */}
      <ExplainabilityModal
        prediction={selectedPrediction}
        onClose={() => setSelectedPrediction(null)}
      />

      {/* Asset Inspection Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </div>
  );
}
