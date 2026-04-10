package com.agregateur.transporteurs.dtos.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AvisRequest {

    @NotNull(message = "La commande est obligatoire")
    private Long commandeId;

    @NotNull(message = "La note est obligatoire")
    @Min(value = 1, message = "La note minimale est 1")
    @Max(value = 5, message = "La note maximale est 5")
    private Short note;

    @Size(max = 1000, message = "Le commentaire ne peut pas dépasser 1000 caractères")
    private String commentaire;
}
