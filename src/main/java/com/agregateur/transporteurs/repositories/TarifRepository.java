package com.agregateur.transporteurs.repositories;

import com.agregateur.transporteurs.models.Tarif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TarifRepository extends JpaRepository<Tarif, Long> {

    List<Tarif> findByTransporteurIdAndActifTrue(Long transporteurId);

    @Query("""
        SELECT tar FROM Tarif tar
        WHERE tar.transporteur.id = :transporteurId
          AND LOWER(tar.villeDestination) = LOWER(:villeDestination)
          AND tar.actif = true
        """)
    List<Tarif> findByTransporteurAndDestination(
            @Param("transporteurId") Long transporteurId,
            @Param("villeDestination") String villeDestination);

    @Query("""
        SELECT tar FROM Tarif tar
        WHERE LOWER(tar.villeDepart) = LOWER(:villeDepart)
          AND LOWER(tar.villeDestination) = LOWER(:villeDestination)
          AND tar.typeMarchandise.id = :typeMarchandiseId
          AND tar.actif = true
        ORDER BY tar.prixParKg ASC
        """)
    List<Tarif> findTarifsDisponibles(
            @Param("villeDepart") String villeDepart,
            @Param("villeDestination") String villeDestination,
            @Param("typeMarchandiseId") Long typeMarchandiseId);

    Optional<Tarif> findByTransporteurIdAndVilleDepartAndVilleDestinationAndTypeMarchandiseIdAndActifTrue(
            Long transporteurId, String villeDepart, String villeDestination, Long typeMarchandiseId);
}
