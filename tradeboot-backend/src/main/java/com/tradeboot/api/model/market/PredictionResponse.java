package com.tradeboot.api.model.market;

import java.util.List;

public class PredictionResponse {
    private String symbol;
    private String name;
    private double currentPrice;
    private double targetPrice;
    private double change;
    private int confidence;
    private String trend;
    private String timeframe;
    private double stopLoss;
    private double support;
    private double resistance;
    private String risk;
    private List<Insight> insights;
    private List<Signal> signals;

    public PredictionResponse() {}

    // Getters and Setters omitted for brevity but they are standard
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(double currentPrice) { this.currentPrice = currentPrice; }

    public double getTargetPrice() { return targetPrice; }
    public void setTargetPrice(double targetPrice) { this.targetPrice = targetPrice; }

    public double getChange() { return change; }
    public void setChange(double change) { this.change = change; }

    public int getConfidence() { return confidence; }
    public void setConfidence(int confidence) { this.confidence = confidence; }

    public String getTrend() { return trend; }
    public void setTrend(String trend) { this.trend = trend; }

    public String getTimeframe() { return timeframe; }
    public void setTimeframe(String timeframe) { this.timeframe = timeframe; }

    public double getStopLoss() { return stopLoss; }
    public void setStopLoss(double stopLoss) { this.stopLoss = stopLoss; }

    public double getSupport() { return support; }
    public void setSupport(double support) { this.support = support; }

    public double getResistance() { return resistance; }
    public void setResistance(double resistance) { this.resistance = resistance; }

    public String getRisk() { return risk; }
    public void setRisk(String risk) { this.risk = risk; }

    public List<Insight> getInsights() { return insights; }
    public void setInsights(List<Insight> insights) { this.insights = insights; }

    public List<Signal> getSignals() { return signals; }
    public void setSignals(List<Signal> signals) { this.signals = signals; }
}
