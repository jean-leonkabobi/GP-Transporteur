package com.agregateur.transporteurs.repositories;

import com.agregateur.transporteurs.models.TypeMarchandise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TypeMarchandiseRepository extends JpaRepository<TypeMarchandise, Long> {

    Optional<TypeMarchandise> findByCode(String code);

    List<TypeMarchandise> findByActifTrue();
}
