package com.agregateur.transporteurs.dtos.request;

import com.agregateur.transporteurs.models.enums.StatutSuivi;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SuiviLivraisonRequest {

    @NotNull(message = "La commande est obligatoire")
    private Long commandeId;

    @NotNull(message = "Le statut est obligatoire")
    private StatutSuivi statut;

    private String localisation;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String description;
}
