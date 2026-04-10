package com.agregateur.transporteurs.dtos.request;

import com.agregateur.transporteurs.models.enums.TypeRendezVous;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RendezVousRequest {

    @NotNull(message = "La commande est obligatoire")
    private Long commandeId;

    @NotNull(message = "Le type de rendez-vous est obligatoire")
    private TypeRendezVous typeRdv;

    @NotNull(message = "La date et heure sont obligatoires")
    @FutureOrPresent(message = "La date doit être présente ou future")
    private LocalDateTime dateHeure;

    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;

    @NotBlank(message = "La ville est obligatoire")
    private String ville;

    private String contactNom;
    private String contactTel;
    private String notes;
}
