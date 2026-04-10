package com.agregateur.transporteurs.models;

import com.agregateur.transporteurs.models.enums.StatutRendezVous;
import com.agregateur.transporteurs.models.enums.TypeRendezVous;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rendez_vous")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVous extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    private Commande commande;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_rdv", nullable = false)
    private TypeRendezVous typeRdv;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutRendezVous statut = StatutRendezVous.PLANIFIE;

    @Column(name = "date_heure", nullable = false)
    private LocalDateTime dateHeure;

    @Column(nullable = false, length = 255)
    private String adresse;

    @Column(nullable = false, length = 100)
    private String ville;

    @Column(name = "contact_nom", length = 150)
    private String contactNom;

    @Column(name = "contact_tel", length = 20)
    private String contactTel;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
