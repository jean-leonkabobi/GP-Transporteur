package com.agregateur.transporteurs.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DevisResponse {
    private String villeDepart;
    private String villeDestination;
    private BigDecimal poidsKg;
    private String typeMarchandise;
    private List<OptionTransport> options;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptionTransport {
        private Long transporteurId;
        private String nomTransporteur;
        private BigDecimal noteMoyenne;
        private Long tarifId;
        private BigDecimal prixParKg;
        private BigDecimal prixTotal;
        private BigDecimal prixMinimum;
        private Integer delaiLivraisonJours;
        private String devise;
    }
}
