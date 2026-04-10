package com.agregateur.transporteurs.repositories;

import com.agregateur.transporteurs.models.Commande;
import com.agregateur.transporteurs.models.enums.StatutCommande;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {

    Optional<Commande> findByReference(String reference);

    boolean existsByReference(String reference);

    Page<Commande> findByClientId(Long clientId, Pageable pageable);

    Page<Commande> findByTransporteurId(Long transporteurId, Pageable pageable);

    Page<Commande> findByClientIdAndStatut(Long clientId, StatutCommande statut, Pageable pageable);

    Page<Commande> findByTransporteurIdAndStatut(Long transporteurId, StatutCommande statut, Pageable pageable);

    @Query("""
        SELECT c FROM Commande c
        JOIN FETCH c.client cl
        JOIN FETCH cl.utilisateur
        JOIN FETCH c.transporteur t
        JOIN FETCH t.utilisateur
        WHERE c.reference = :reference
        """)
    Optional<Commande> findByReferenceWithDetails(@Param("reference") String reference);

    long countByStatut(StatutCommande statut);

    long countByClientId(Long clientId);

    long countByTransporteurId(Long transporteurId);
}
