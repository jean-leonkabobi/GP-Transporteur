package com.agregateur.transporteurs.repositories;

import com.agregateur.transporteurs.models.Transporteur;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransporteurRepository extends JpaRepository<Transporteur, Long> {

    Optional<Transporteur> findByUtilisateurId(Long utilisateurId);

    Optional<Transporteur> findByUtilisateurEmail(String email);

    boolean existsByNumeroLicence(String numeroLicence);

    /**
     * Recherche les transporteurs desservant une ville destination donnée.
     * Jointure sur zone_desserte et filtre sur actif.
     */
    @Query("""
        SELECT DISTINCT t FROM Transporteur t
        JOIN t.zonesDesserte z
        WHERE LOWER(z.ville) = LOWER(:villeDestination)
          AND z.actif = true
          AND t.actif = true
        ORDER BY t.noteMoyenne DESC
        """)
    Page<Transporteur> findByDestination(@Param("villeDestination") String villeDestination, Pageable pageable);

    /**
     * Recherche avancée : destination + type marchandise via tarif.
     */
    @Query("""
        SELECT DISTINCT t FROM Transporteur t
        JOIN t.tarifs tar
        WHERE LOWER(tar.villeDestination) = LOWER(:villeDestination)
          AND tar.typeMarchandise.id = :typeMarchandiseId
          AND tar.actif = true
          AND t.actif = true
        ORDER BY t.noteMoyenne DESC
        """)
    Page<Transporteur> findByDestinationAndTypeMarchandise(
            @Param("villeDestination") String villeDestination,
            @Param("typeMarchandiseId") Long typeMarchandiseId,
            Pageable pageable);

    @Query("""
        SELECT t FROM Transporteur t
        JOIN FETCH t.utilisateur
        WHERE t.id = :id
        """)
    Optional<Transporteur> findByIdWithUtilisateur(@Param("id") Long id);

    List<Transporteur> findByActifTrue();
}
