package com.tradeboot.api.model.market;

import java.util.List;

public class NewsResponse {
    private int id;
    private String headline;
    private String summary;
    private String sentiment;
    private String timestamp;
    private List<String> tags;

    public NewsResponse() {}

    public NewsResponse(int id, String headline, String summary, String sentiment, String timestamp, List<String> tags) {
        this.id = id;
        this.headline = headline;
        this.summary = summary;
        this.sentiment = sentiment;
        this.timestamp = timestamp;
        this.tags = tags;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getSentiment() { return sentiment; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
