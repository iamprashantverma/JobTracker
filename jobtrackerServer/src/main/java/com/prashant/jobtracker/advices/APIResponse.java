package com.prashant.jobtracker.advices;



import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data

public class APIResponse<T> {

    private LocalDateTime timeStamp;
    private T data;
    private APIError error;

    public APIResponse() {
        this.timeStamp = LocalDateTime.now();
    }

    public APIResponse(T data) {
        this();
        this.data = data;
    }

    public APIResponse(APIError error) {
        this();
        this.error = error;
    }

    @Override
    public String toString() {
        return "APIResponse{" +
                "timeStamp=" + timeStamp +
                ", data=" + data +
                ", error=" + error +
                '}';
    }


}
