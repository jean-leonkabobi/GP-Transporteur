package com.agregateur.transporteurs.dtos.request;

import com.agregateur.transporteurs.models.enums.RoleUtilisateur;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 100)
    private String prenom;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100)
    private String nom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    private String motDePasse;

    @Pattern(regexp = "^\\+?[0-9]{8,15}$", message = "Format téléphone invalide")
    private String telephone;

    @NotNull(message = "Le rôle est obligatoire")
    private RoleUtilisateur role;

    // Champs spécifiques client
    private String adresse;
    private String ville;
    private String entreprise;

    // Champs spécifiques transporteur
    private String numeroLicence;
    private String description;
    private String villeDepart;
}
