package com.tradeboot.api.model.market;

public class Signal {
    private String name;
    private Object value; // Can be string or number
    private String status;

    public Signal() {}

    public Signal(String name, Object value, String status) {
        this.name = name;
        this.value = value;
        this.status = status;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Object getValue() { return value; }
    public void setValue(Object value) { this.value = value; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
