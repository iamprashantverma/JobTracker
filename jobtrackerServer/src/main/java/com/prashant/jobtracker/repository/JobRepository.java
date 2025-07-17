package com.prashant.jobtracker.repository;

import com.prashant.jobtracker.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<JobApplication,Long> {


    List<JobApplication> findByAppliedDateBetween(LocalDate from, LocalDate to);
}
