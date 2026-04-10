package com.agregateur.transporteurs.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvisResponse {
    private Long id;
    private Long commandeId;
    private String referenceCommande;
    private Long clientId;
    private String nomClient;
    private Long transporteurId;
    private Short note;
    private String commentaire;
    private LocalDateTime createdAt;
}
