package com.agregateur.transporteurs.dtos.response;

import com.agregateur.transporteurs.models.enums.StatutCommande;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommandeResponse {
    private Long id;
    private String reference;
    private StatutCommande statut;

    // Client info
    private Long clientId;
    private String nomClient;

    // Transporteur info
    private Long transporteurId;
    private String nomTransporteur;

    // Marchandise
    private String typeMarchandise;
    private String descriptionColis;
    private BigDecimal poidsKg;
    private BigDecimal volumeM3;

    // Adresses
    private String adresseEnlevement;
    private String villeEnlevement;
    private String adresseLivraison;
    private String villeLivraison;
    private BigDecimal distanceKm;

    // Prix
    private BigDecimal prixTotal;
    private String devise;

    // Dates
    private LocalDate dateSouhaitee;
    private LocalDateTime dateConfirmation;
    private LocalDateTime dateLivraisonReelle;
    private LocalDateTime createdAt;

    private String notes;
}
