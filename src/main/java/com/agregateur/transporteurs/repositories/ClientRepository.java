package com.agregateur.transporteurs.repositories;

import com.agregateur.transporteurs.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByUtilisateurId(Long utilisateurId);

    Optional<Client> findByUtilisateurEmail(String email);

    @Query("SELECT c FROM Client c JOIN FETCH c.utilisateur WHERE c.id = :id")
    Optional<Client> findByIdWithUtilisateur(@Param("id") Long id);

    boolean existsByUtilisateurId(Long utilisateurId);
}
