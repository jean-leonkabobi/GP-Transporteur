package com.agregateur.transporteurs.controllers;

import com.agregateur.transporteurs.dtos.response.ApiResponse;
import com.agregateur.transporteurs.dtos.response.TransporteurResponse;
import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.services.TransporteurService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transporteurs")
@RequiredArgsConstructor
@Tag(name = "Transporteurs", description = "Recherche et gestion des transporteurs")
public class TransporteurController {

    private final TransporteurService transporteurService;

    // ─── Endpoints publics ────────────────────────────────────────

    @GetMapping
    @Operation(summary = "Lister tous les transporteurs actifs (paginé)")
    public ResponseEntity<ApiResponse<Page<TransporteurResponse>>> listerTous(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("noteMoyenne").descending());
        return ResponseEntity.ok(ApiResponse.success(transporteurService.listerTous(pageable)));
    }

    @GetMapping("/recherche")
    @Operation(summary = "Rechercher des transporteurs par ville de destination")
    public ResponseEntity<ApiResponse<Page<TransporteurResponse>>> rechercher(
            @Parameter(description = "Ville de destination", required = true)
            @RequestParam @NotBlank String destination,
            @RequestParam(required = false) Long typeMarchandiseId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("noteMoyenne").descending());
        Page<TransporteurResponse> result = typeMarchandiseId != null
                ? transporteurService.rechercherParDestinationEtType(destination, typeMarchandiseId, pageable)
                : transporteurService.rechercherParDestination(destination, pageable);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir le détail d'un transporteur")
    public ResponseEntity<ApiResponse<TransporteurResponse>> trouverParId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(transporteurService.trouverParId(id)));
    }

    // ─── Endpoints TRANSPORTEUR connecté ─────────────────────────

    @GetMapping("/mon-profil")
    @PreAuthorize("hasRole('TRANSPORTEUR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Voir mon profil transporteur")
    public ResponseEntity<ApiResponse<TransporteurResponse>> monProfil(
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(ApiResponse.success(transporteurService.monProfil(utilisateur)));
    }

    @PostMapping("/zones-desserte")
    @PreAuthorize("hasRole('TRANSPORTEUR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Ajouter une zone de desserte")
    public ResponseEntity<ApiResponse<TransporteurResponse>> ajouterZone(
            @AuthenticationPrincipal Utilisateur utilisateur,
            @RequestParam @NotBlank String ville,
            @RequestParam(defaultValue = "Sénégal") String pays,
            @RequestParam(defaultValue = "1") int delaiJours) {
        return ResponseEntity.ok(ApiResponse.success(
                "Zone ajoutée",
                transporteurService.ajouterZoneDesserte(utilisateur, ville, pays, delaiJours)));
    }

    @DeleteMapping("/zones-desserte/{zoneId}")
    @PreAuthorize("hasRole('TRANSPORTEUR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Supprimer une zone de desserte")
    public ResponseEntity<ApiResponse<Void>> supprimerZone(
            @AuthenticationPrincipal Utilisateur utilisateur,
            @PathVariable Long zoneId) {
        transporteurService.supprimerZoneDesserte(utilisateur, zoneId);
        return ResponseEntity.ok(ApiResponse.success("Zone supprimée", null));
    }

    // ─── Admin ────────────────────────────────────────────────────

    @PatchMapping("/{id}/actif")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Activer / désactiver un transporteur (ADMIN)")
    public ResponseEntity<ApiResponse<Void>> toggleActif(
            @PathVariable Long id,
            @RequestParam boolean actif) {
        transporteurService.toggleActif(id, actif);
        return ResponseEntity.ok(ApiResponse.success(
                actif ? "Transporteur activé" : "Transporteur désactivé", null));
    }
}
