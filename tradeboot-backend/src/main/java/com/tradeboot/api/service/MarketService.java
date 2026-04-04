package com.tradeboot.api.service;

import com.tradeboot.api.model.market.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MarketService {

    private final List<StockResponse> mockStocks = Arrays.asList(
            new StockResponse("TCS", "Tata Consultancy Services", 3842.50, 42.30, 1.11, 2145000, "IT"),
            new StockResponse("RELIANCE", "Reliance Industries Ltd", 2956.75, -18.20, -0.61, 4328000, "Energy"),
            new StockResponse("INFY", "Infosys Ltd", 1523.40, 15.60, 1.03, 3215000, "IT"),
            new StockResponse("HDFC", "HDFC Bank Ltd", 1687.20, -5.40, -0.32, 1987000, "Banking"),
            new StockResponse("WIPRO", "Wipro Ltd", 458.90, 6.70, 1.48, 1654000, "IT"),
            new StockResponse("ICICIBANK", "ICICI Bank Ltd", 1023.60, 12.30, 1.22, 2876000, "Banking"),
            new StockResponse("LT", "Larsen & Toubro", 3210.80, -22.10, -0.68, 876000, "Infra"),
            new StockResponse("BAJFINANCE", "Bajaj Finance Ltd", 6985.30, 89.50, 1.30, 654000, "NBFC")
    );

    public List<StockResponse> searchStocks(String query) {
        if (query == null || query.trim().isEmpty()) {
            return mockStocks;
        }
        String q = query.toLowerCase();
        return mockStocks.stream()
                .filter(s -> s.getSymbol().toLowerCase().contains(q) || s.getName().toLowerCase().contains(q))
                .collect(Collectors.toList());
    }

    public PredictionResponse getPrediction(String symbol) {
        StockResponse stock = mockStocks.stream()
                .filter(s -> s.getSymbol().equalsIgnoreCase(symbol))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        String trend = stock.getChange() >= 0 ? "bullish" : "bearish";
        double multiplier = trend.equals("bullish") ? 1 + Math.random() * 0.05 : 1 - Math.random() * 0.04;
        double targetPrice = stock.getPrice() * multiplier;
        int confidence = (int) (60 + Math.random() * 30);

        List<Insight> insights = new ArrayList<>();
        if ("TCS".equalsIgnoreCase(symbol)) {
            insights.add(new Insight("bullish", "Stock likely to rise due to extreme bullish momentum."));
            insights.add(new Insight("neutral", "RSI indicates it is nearing the overbought zone."));
        } else if ("RELIANCE".equalsIgnoreCase(symbol)) {
            insights.add(new Insight("bearish", "Downside risk detected due to global oil supply chain pressure."));
            insights.add(new Insight("neutral", "Consolidating near major support levels (₹2900)."));
        } else {
            insights.add(new Insight(trend, "AI detects strong " + trend + " momentum with high institutional interest."));
            insights.add(new Insight("neutral", "Volatility index remains slightly elevated."));
        }

        List<Signal> signals = Arrays.asList(
                new Signal("RSI", 45 + Math.random() * 30, trend),
                new Signal("MACD", String.format("%.2f", (Math.random() - 0.5)), trend),
                new Signal("Bollinger", "0.6σ", trend),
                new Signal("Volume", "+12%", "bullish")
        );

        PredictionResponse response = new PredictionResponse();
        response.setSymbol(stock.getSymbol());
        response.setName(stock.getName());
        response.setCurrentPrice(stock.getPrice());
        response.setTargetPrice(Math.round(targetPrice * 100.0) / 100.0);
        response.setChange(Math.round(((targetPrice - stock.getPrice()) / stock.getPrice() * 100) * 100.0) / 100.0);
        response.setConfidence(confidence);
        response.setTrend(trend);
        response.setTimeframe("7d");
        response.setStopLoss(Math.round(stock.getPrice() * (trend.equals("bullish") ? 0.96 : 1.04) * 100.0) / 100.0);
        response.setSupport(Math.round(stock.getPrice() * 0.97 * 100.0) / 100.0);
        response.setResistance(Math.round(stock.getPrice() * 1.03 * 100.0) / 100.0);
        response.setRisk(confidence > 80 ? "Low" : confidence > 65 ? "Medium" : "High");
        response.setInsights(insights);
        response.setSignals(signals);

        return response;
    }

    public List<NewsResponse> getMarketNews() {
        return Arrays.asList(
                new NewsResponse(1, "IT Index surges after impressive Q3 results from Infosys & TCS", "Major gains seen across all top-tier tech firms following strong earnings guidance for the next quarter.", "positive", Instant.now().minusSeconds(3600).toString(), Arrays.asList("IT", "Earnings")),
                new NewsResponse(2, "RBI holds interest rates steady in latest Monetary Policy", "In a largely expected move, the central bank maintains status quo, citing inflation concerns.", "neutral", Instant.now().minusSeconds(7200).toString(), Arrays.asList("Banking", "Policy")),
                new NewsResponse(3, "Global oil prices jump 3% amid supply chain disruptions", "Rising crude prices are putting pressure on Indian oil marketing companies.", "negative", Instant.now().minusSeconds(14400).toString(), Arrays.asList("Energy", "Global")),
                new NewsResponse(4, "Reliance announces major aggressive expansion in green energy", "New multibillion-dollar investments planned over the next five years.", "positive", Instant.now().minusSeconds(86400).toString(), Arrays.asList("Energy", "Corporate"))
        );
    }

    public List<ChartDataPoint> getChartData(String symbol, int days) {
        StockResponse stock = mockStocks.stream()
                .filter(s -> s.getSymbol().equalsIgnoreCase(symbol))
                .findFirst()
                .orElse(null);
                
        if (stock == null) return new ArrayList<>();

        String trend = stock.getChange() >= 0 ? "up" : "down";
        List<ChartDataPoint> data = new ArrayList<>();
        double price = stock.getPrice();
        long now = System.currentTimeMillis();
        long dayMs = 86400000L;

        for (int i = days; i >= 0; i--) {
            long time = now - (long) i * dayMs;
            // Simple date format simulation
            String dateStr = new java.text.SimpleDateFormat("dd MMM").format(new java.util.Date(time));

            double drift = trend.equals("up") ? 0.3 : trend.equals("down") ? -0.3 : 0;
            double change = price * (drift / 100 + (Math.random() - 0.5) * 0.025);
            price = Math.max(stock.getPrice() * 0.5, price + change);

            double open = price;
            double close = price + price * (Math.random() - 0.5) * 0.01;
            double high = Math.max(open, close) * (1 + Math.random() * 0.01);
            double low = Math.min(open, close) * (1 - Math.random() * 0.01);
            long volume = (long) (Math.random() * 5000000 + 1000000);

            data.add(new ChartDataPoint(
                    dateStr,
                    Math.round(open * 100.0) / 100.0,
                    Math.round(close * 100.0) / 100.0,
                    Math.round(high * 100.0) / 100.0,
                    Math.round(low * 100.0) / 100.0,
                    volume
            ));
        }
        return data;
    }
}
