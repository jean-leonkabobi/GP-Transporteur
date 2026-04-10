package com.agregateur.transporteurs.controllers;

import com.agregateur.transporteurs.dtos.request.CommandeRequest;
import com.agregateur.transporteurs.dtos.response.ApiResponse;
import com.agregateur.transporteurs.dtos.response.CommandeResponse;
import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.models.enums.StatutCommande;
import com.agregateur.transporteurs.services.CommandeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/commandes")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Commandes", description = "Création et gestion des commandes de transport")
public class CommandeController {

    private final CommandeService commandeService;

    // ─── Création (CLIENT) ────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(summary = "Passer une nouvelle commande de transport")
    public ResponseEntity<ApiResponse<CommandeResponse>> creer(
            @AuthenticationPrincipal Utilisateur utilisateur,
            @Valid @RequestBody CommandeRequest request) {
        CommandeResponse response = commandeService.creerCommande(utilisateur, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Commande créée avec succès", response));
    }

    // ─── Consultation ─────────────────────────────────────────────

    @GetMapping("/{reference}")
    @Operation(summary = "Obtenir le détail d'une commande par référence")
    public ResponseEntity<ApiResponse<CommandeResponse>> trouverParReference(
            @PathVariable String reference,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(ApiResponse.success(
                commandeService.trouverParReference(reference, utilisateur)));
    }

    @GetMapping("/mes-commandes")
    @Operation(summary = "Lister mes commandes (client ou transporteur)")
    public ResponseEntity<ApiResponse<Page<CommandeResponse>>> mesCommandes(
            @AuthenticationPrincipal Utilisateur utilisateur,
            @RequestParam(required = false) StatutCommande statut,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success(
                commandeService.mesCommandes(utilisateur, statut, pageable)));
    }

    // ─── Transitions de statut (TRANSPORTEUR) ────────────────────

    @PatchMapping("/{id}/confirmer")
    @PreAuthorize("hasRole('TRANSPORTEUR')")
    @Operation(summary = "Confirmer une commande (TRANSPORTEUR)")
    public ResponseEntity<ApiResponse<CommandeResponse>> confirmer(
            @PathVariable Long id,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(ApiResponse.success(
                "Commande confirmée", commandeService.confirmerCommande(id, utilisateur)));
    }

    @PatchMapping("/{id}/demarrer")
    @PreAuthorize("hasRole('TRANSPORTEUR')")
    @Operation(summary = "Démarrer la livraison (TRANSPORTEUR)")
    public ResponseEntity<ApiResponse<CommandeResponse>> demarrer(
            @PathVariable Long id,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(ApiResponse.success(
                "Livraison démarrée", commandeService.demarrerLivraison(id, utilisateur)));
    }

    @PatchMapping("/{id}/livrer")
    @PreAuthorize("hasRole('TRANSPORTEUR')")
    @Operation(summary = "Marquer comme livrée (TRANSPORTEUR)")
    public ResponseEntity<ApiResponse<CommandeResponse>> marquerLivree(
            @PathVariable Long id,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(ApiResponse.success(
                "Commande marquée livrée", commandeService.marquerLivree(id, utilisateur)));
    }

    @PatchMapping("/{id}/annuler")
    @PreAuthorize("hasAnyRole('CLIENT','TRANSPORTEUR','ADMIN')")
    @Operation(summary = "Annuler une commande")
    public ResponseEntity<ApiResponse<CommandeResponse>> annuler(
            @PathVariable Long id,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(ApiResponse.success(
                "Commande annulée", commandeService.annulerCommande(id, utilisateur)));
    }
}
