package com.agregateur.transporteurs.dtos.response;

import com.agregateur.transporteurs.models.enums.StatutRendezVous;
import com.agregateur.transporteurs.models.enums.TypeRendezVous;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RendezVousResponse {
    private Long id;
    private Long commandeId;
    private String referenceCommande;
    private TypeRendezVous typeRdv;
    private StatutRendezVous statut;
    private LocalDateTime dateHeure;
    private String adresse;
    private String ville;
    private String contactNom;
    private String contactTel;
    private String notes;
    private LocalDateTime createdAt;
}
