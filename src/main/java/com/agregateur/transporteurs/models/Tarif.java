package com.agregateur.transporteurs.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "tarif")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tarif extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transporteur_id", nullable = false)
    private Transporteur transporteur;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_marchandise_id", nullable = false)
    private TypeMarchandise typeMarchandise;

    @Column(name = "ville_depart", nullable = false, length = 100)
    private String villeDepart;

    @Column(name = "ville_destination", nullable = false, length = 100)
    private String villeDestination;

    @Column(name = "prix_par_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixParKg;

    @Column(name = "prix_minimum", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal prixMinimum = BigDecimal.ZERO;

    @Column(name = "prix_par_km", precision = 10, scale = 2)
    private BigDecimal prixParKm;

    @Column(name = "delai_livraison_jours")
    @Builder.Default
    private Integer delaiLivraisonJours = 1;

    @Column(length = 10)
    @Builder.Default
    private String devise = "XOF";

    @Builder.Default
    private Boolean actif = true;
}
