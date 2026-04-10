package com.agregateur.transporteurs.dtos.response;

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
public class TarifResponse {
    private Long id;
    private Long transporteurId;
    private String nomTransporteur;
    private String typeMarchandise;
    private String villeDepart;
    private String villeDestination;
    private BigDecimal prixParKg;
    private BigDecimal prixMinimum;
    private BigDecimal prixParKm;
    private Integer delaiLivraisonJours;
    private String devise;
    private Boolean actif;
    private LocalDateTime createdAt;
}
