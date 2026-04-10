package com.agregateur.transporteurs.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransporteurResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String numeroLicence;
    private String description;
    private String logoUrl;
    private String adresseSiege;
    private String villeDepart;
    private BigDecimal noteMoyenne;
    private Integer nombreAvis;
    private Boolean actif;
    private List<ZoneDesserteResponse> zonesDesserte;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ZoneDesserteResponse {
        private Long id;
        private String ville;
        private String pays;
        private Integer delaiMoyenJours;
    }
}
