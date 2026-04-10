package com.agregateur.transporteurs.controllers;

import com.agregateur.transporteurs.dtos.request.SuiviLivraisonRequest;
import com.agregateur.transporteurs.dtos.response.ApiResponse;
import com.agregateur.transporteurs.dtos.response.SuiviLivraisonResponse;
import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.services.SuiviLivraisonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suivis")
@RequiredArgsConstructor
@Tag(name = "Suivi Livraisons", description = "Ajout d'événements et consultation du suivi")
public class SuiviLivraisonController {

    private final SuiviLivraisonService suiviService;

    @PostMapping
    @PreAuthorize("hasAnyRole('TRANSPORTEUR','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Ajouter un événement de suivi (TRANSPORTEUR/ADMIN)")
    public ResponseEntity<ApiResponse<SuiviLivraisonResponse>> ajouterEvenement(
            @AuthenticationPrincipal Utilisateur utilisateur,
            @Valid @RequestBody SuiviLivraisonRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Événement de suivi enregistré",
                        suiviService.ajouterEvenement(utilisateur, request)));
    }

    @GetMapping("/commande/{commandeId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Lister tous les événements de suivi d'une commande")
    public ResponseEntity<ApiResponse<List<SuiviLivraisonResponse>>> listerParCommande(
            @PathVariable Long commandeId,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(ApiResponse.success(
                suiviService.listerParCommande(commandeId, utilisateur)));
    }

    @GetMapping("/commande/{commandeId}/dernier")
    @Operation(summary = "Obtenir le dernier statut d'une commande (public)")
    public ResponseEntity<ApiResponse<SuiviLivraisonResponse>> dernierStatut(
            @PathVariable Long commandeId) {
        return ResponseEntity.ok(ApiResponse.success(
                suiviService.dernierStatut(commandeId)));
    }
}
