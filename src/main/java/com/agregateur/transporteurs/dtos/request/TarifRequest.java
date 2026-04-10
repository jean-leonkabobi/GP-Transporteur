package com.agregateur.transporteurs.dtos.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TarifRequest {

    @NotNull(message = "Le type de marchandise est obligatoire")
    private Long typeMarchandiseId;

    @NotBlank(message = "La ville de départ est obligatoire")
    private String villeDepart;

    @NotBlank(message = "La ville destination est obligatoire")
    private String villeDestination;

    @NotNull(message = "Le prix par kg est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le prix doit être positif")
    private BigDecimal prixParKg;

    @NotNull(message = "Le prix minimum est obligatoire")
    @DecimalMin(value = "0.0", message = "Le prix minimum doit être positif ou nul")
    private BigDecimal prixMinimum;

    private BigDecimal prixParKm;

    @Min(value = 1, message = "Le délai doit être d'au moins 1 jour")
    private Integer delaiLivraisonJours = 1;

    private String devise = "XOF";
}
