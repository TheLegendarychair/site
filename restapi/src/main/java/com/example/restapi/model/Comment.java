package com.example.restapi.model;

import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String userSignature;
    private String text;
    private LocalDateTime timeStamp;

    public Comment() {}

    public Comment(Long id, String userSignature, String text, LocalDateTime timeStamp) {
        this.id = id;
        this.userSignature = userSignature;
        this.text = text;
        this.timeStamp = LocalDateTime.now();
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserSignature() {
        return userSignature;
    }
    public void setUserSignature(String user) {
        this.userSignature = user;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }
    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = LocalDateTime.now();
    }

}


