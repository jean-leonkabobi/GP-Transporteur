package com.agregateur.transporteurs.repositories;

import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.models.enums.RoleUtilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(RoleUtilisateur role);
}
