package com.tradeboot.api.controller;

import com.tradeboot.api.model.market.ChartDataPoint;
import com.tradeboot.api.model.market.NewsResponse;
import com.tradeboot.api.model.market.PredictionResponse;
import com.tradeboot.api.model.market.StockResponse;
import com.tradeboot.api.service.MarketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MarketController {

    private final MarketService marketService;

    public MarketController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping("/stocks/search")
    public ResponseEntity<List<StockResponse>> searchStocks(@RequestParam(defaultValue = "") String query) {
        return ResponseEntity.ok(marketService.searchStocks(query));
    }

    @GetMapping("/predict/{symbol}")
    public ResponseEntity<PredictionResponse> getPrediction(@PathVariable String symbol) {
        try {
            return ResponseEntity.ok(marketService.getPrediction(symbol));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/news")
    public ResponseEntity<List<NewsResponse>> getMarketNews() {
        return ResponseEntity.ok(marketService.getMarketNews());
    }

    @GetMapping("/indicators/{symbol}")
    public ResponseEntity<List<ChartDataPoint>> getChartData(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(marketService.getChartData(symbol, days));
    }
}
