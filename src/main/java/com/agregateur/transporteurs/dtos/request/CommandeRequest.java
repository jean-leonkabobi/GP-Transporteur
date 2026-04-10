package com.agregateur.transporteurs.dtos.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CommandeRequest {

    @NotNull(message = "Le transporteur est obligatoire")
    private Long transporteurId;

    @NotNull(message = "Le type de marchandise est obligatoire")
    private Long typeMarchandiseId;

    private String descriptionColis;

    @NotNull(message = "Le poids est obligatoire")
    @DecimalMin(value = "0.001", message = "Le poids doit être positif")
    private BigDecimal poidsKg;

    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal volumeM3;

    @NotBlank(message = "L'adresse d'enlèvement est obligatoire")
    private String adresseEnlevement;

    @NotBlank(message = "La ville d'enlèvement est obligatoire")
    private String villeEnlevement;

    @NotBlank(message = "L'adresse de livraison est obligatoire")
    private String adresseLivraison;

    @NotBlank(message = "La ville de livraison est obligatoire")
    private String villeLivraison;

    private String notes;

    @Future(message = "La date souhaitée doit être dans le futur")
    private LocalDate dateSouhaitee;
}
