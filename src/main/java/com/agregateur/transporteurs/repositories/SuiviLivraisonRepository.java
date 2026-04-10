package com.agregateur.transporteurs.repositories;

import com.agregateur.transporteurs.models.SuiviLivraison;
import com.agregateur.transporteurs.models.enums.StatutSuivi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SuiviLivraisonRepository extends JpaRepository<SuiviLivraison, Long> {

    List<SuiviLivraison> findByCommandeIdOrderByCreatedAtDesc(Long commandeId);

    @Query("""
        SELECT s FROM SuiviLivraison s
        WHERE s.commande.id = :commandeId
        ORDER BY s.createdAt DESC
        LIMIT 1
        """)
    Optional<SuiviLivraison> findDernierSuivi(@Param("commandeId") Long commandeId);

    boolean existsByCommandeIdAndStatut(Long commandeId, StatutSuivi statut);

    long countByCommandeId(Long commandeId);
}
