package com.agregateur.transporteurs.dtos.response;

import com.agregateur.transporteurs.models.enums.StatutSuivi;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuiviLivraisonResponse {
    private Long id;
    private Long commandeId;
    private String referenceCommande;
    private StatutSuivi statut;
    private String localisation;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String description;
    private LocalDateTime createdAt;
}
