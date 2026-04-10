package com.agregateur.transporteurs.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "type_marchandise")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TypeMarchandise extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String libelle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private Boolean actif = true;
}
