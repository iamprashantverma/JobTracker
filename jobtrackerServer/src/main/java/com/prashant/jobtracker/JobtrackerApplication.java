package com.prashant.jobtracker;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;

@SpringBootApplication
@Slf4j
public class JobtrackerApplication {
	public static void main(String[] args) {
		SpringApplication.run(JobtrackerApplication.class, args);
		System.out.println("Job Tracker Application is Running");
	}
}
