package com.farmacia.core.repository.wms;

import com.farmacia.core.model.wms.BinLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BinLocationRepository extends JpaRepository<BinLocation, UUID> {
    List<BinLocation> findByZoneId(UUID zoneId);
    Optional<BinLocation> findByCode(String code);
}
