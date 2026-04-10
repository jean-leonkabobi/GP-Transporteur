package com.agregateur.transporteurs.repositories;

import com.agregateur.transporteurs.models.Avis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AvisRepository extends JpaRepository<Avis, Long> {

    Optional<Avis> findByCommandeId(Long commandeId);

    boolean existsByCommandeId(Long commandeId);

    Page<Avis> findByTransporteurId(Long transporteurId, Pageable pageable);

    Page<Avis> findByClientId(Long clientId, Pageable pageable);

    @Query("SELECT AVG(a.note) FROM Avis a WHERE a.transporteur.id = :transporteurId")
    Optional<Double> calculerNoteMoyenne(@Param("transporteurId") Long transporteurId);
}
