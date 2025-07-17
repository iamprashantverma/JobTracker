package com.prashant.jobtracker.entity;

import com.prashant.jobtracker.entity.enums.JobStatus;
import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDate;

@Entity
@Table(name = "job_applications")
@Data
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;


    @Column(nullable = false)
    private String jobRole;


    @Column(nullable = false)
    private String resumeUsed;


    @Column(nullable = false)
    private LocalDate appliedDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user ;

    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private JobStatus status;




    @Override
    public String toString() {
        return "JobApplication{" +
                "id=" + id +
                ", companyName='" + companyName + '\'' +
                ", jobRole='" + jobRole + '\'' +
                ", resumeUsed='" + resumeUsed + '\'' +
                ", appliedDate=" + appliedDate +
                '}';
    }

}
