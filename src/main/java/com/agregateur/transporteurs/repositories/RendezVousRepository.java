package com.agregateur.transporteurs.repositories;

import com.agregateur.transporteurs.models.RendezVous;
import com.agregateur.transporteurs.models.enums.StatutRendezVous;
import com.agregateur.transporteurs.models.enums.TypeRendezVous;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {

    List<RendezVous> findByCommandeId(Long commandeId);

    List<RendezVous> findByCommandeIdAndTypeRdv(Long commandeId, TypeRendezVous typeRdv);

    @Query("""
        SELECT r FROM RendezVous r
        JOIN r.commande c
        WHERE c.transporteur.id = :transporteurId
          AND r.dateHeure BETWEEN :debut AND :fin
        ORDER BY r.dateHeure ASC
        """)
    List<RendezVous> findByTransporteurAndPeriode(
            @Param("transporteurId") Long transporteurId,
            @Param("debut") LocalDateTime debut,
            @Param("fin") LocalDateTime fin);

    @Query("""
        SELECT r FROM RendezVous r
        JOIN r.commande c
        WHERE c.client.id = :clientId
        ORDER BY r.dateHeure DESC
        """)
    Page<RendezVous> findByClientId(@Param("clientId") Long clientId, Pageable pageable);

    List<RendezVous> findByStatut(StatutRendezVous statut);

    @Query("""
        SELECT r FROM RendezVous r
        WHERE r.dateHeure BETWEEN :debut AND :fin
          AND r.statut IN ('PLANIFIE', 'CONFIRME')
        ORDER BY r.dateHeure ASC
        """)
    List<RendezVous> findUpcoming(
            @Param("debut") LocalDateTime debut,
            @Param("fin") LocalDateTime fin);
}
