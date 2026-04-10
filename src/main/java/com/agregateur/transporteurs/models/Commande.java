package com.agregateur.transporteurs.models;

import com.agregateur.transporteurs.models.enums.StatutCommande;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "commande")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Commande extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String reference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transporteur_id", nullable = false)
    private Transporteur transporteur;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_marchandise_id", nullable = false)
    private TypeMarchandise typeMarchandise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarif_id")
    private Tarif tarif;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutCommande statut = StatutCommande.EN_ATTENTE;

    @Column(name = "description_colis", columnDefinition = "TEXT")
    private String descriptionColis;

    @Column(name = "poids_kg", nullable = false, precision = 10, scale = 3)
    private BigDecimal poidsKg;

    @Column(name = "volume_m3", precision = 10, scale = 3)
    private BigDecimal volumeM3;

    @Column(name = "adresse_enlevement", nullable = false, length = 255)
    private String adresseEnlevement;

    @Column(name = "ville_enlevement", nullable = false, length = 100)
    private String villeEnlevement;

    @Column(name = "adresse_livraison", nullable = false, length = 255)
    private String adresseLivraison;

    @Column(name = "ville_livraison", nullable = false, length = 100)
    private String villeLivraison;

    @Column(name = "distance_km", precision = 10, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "prix_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal prixTotal;

    @Column(length = 10)
    @Builder.Default
    private String devise = "XOF";

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "date_souhaitee")
    private LocalDate dateSouhaitee;

    @Column(name = "date_confirmation")
    private LocalDateTime dateConfirmation;

    @Column(name = "date_livraison_reelle")
    private LocalDateTime dateLivraisonReelle;

    // ─── Relations ───────────────────────────────────────────────
    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<RendezVous> rendezVous = new ArrayList<>();

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("createdAt DESC")
    @Builder.Default
    private List<SuiviLivraison> suivis = new ArrayList<>();

    @OneToOne(mappedBy = "commande", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Avis avis;
}
