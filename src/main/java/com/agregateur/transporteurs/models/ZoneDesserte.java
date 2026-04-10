package com.agregateur.transporteurs.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "zone_desserte",
       uniqueConstraints = @UniqueConstraint(columnNames = {"transporteur_id","ville","pays"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZoneDesserte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transporteur_id", nullable = false)
    private Transporteur transporteur;

    @Column(nullable = false, length = 100)
    private String ville;

    @Column(length = 100)
    @Builder.Default
    private String pays = "Sénégal";

    @Column(name = "delai_moyen_jours")
    @Builder.Default
    private Integer delaiMoyenJours = 1;

    @Builder.Default
    private Boolean actif = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
