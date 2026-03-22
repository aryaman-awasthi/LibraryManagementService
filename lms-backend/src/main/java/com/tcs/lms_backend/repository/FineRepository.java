package com.tcs.lms_backend.repository;

import com.tcs.lms_backend.model.Fine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FineRepository extends JpaRepository<Fine, Integer> {
}
