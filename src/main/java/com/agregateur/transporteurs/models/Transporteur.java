package com.agregateur.transporteurs.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transporteur")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transporteur extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false, unique = true)
    private Utilisateur utilisateur;

    @Column(name = "numero_licence", nullable = false, unique = true, length = 100)
    private String numeroLicence;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @Column(name = "adresse_siege", length = 255)
    private String adresseSiege;

    @Column(name = "ville_depart", nullable = false, length = 100)
    private String villeDepart;

    @Column(name = "note_moyenne", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal noteMoyenne = BigDecimal.ZERO;

    @Column(name = "nombre_avis")
    @Builder.Default
    private Integer nombreAvis = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean actif = true;

    // ─── Relations ───────────────────────────────────────────────
    @OneToMany(mappedBy = "transporteur", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ZoneDesserte> zonesDesserte = new ArrayList<>();

    @OneToMany(mappedBy = "transporteur", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Tarif> tarifs = new ArrayList<>();

    @OneToMany(mappedBy = "transporteur", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Commande> commandes = new ArrayList<>();

    @OneToMany(mappedBy = "transporteur", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Avis> avis = new ArrayList<>();
}
