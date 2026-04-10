package com.agregateur.transporteurs.controllers;

import com.agregateur.transporteurs.dtos.request.TarifRequest;
import com.agregateur.transporteurs.dtos.response.ApiResponse;
import com.agregateur.transporteurs.dtos.response.DevisResponse;
import com.agregateur.transporteurs.dtos.response.TarifResponse;
import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.services.TarifService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/tarifs")
@RequiredArgsConstructor
@Tag(name = "Tarifs", description = "Consultation et gestion des tarifs de transport")
public class TarifController {

    private final TarifService tarifService;

    // ─── Endpoints publics ────────────────────────────────────────

    @GetMapping("/transporteur/{transporteurId}")
    @Operation(summary = "Lister les tarifs d'un transporteur")
    public ResponseEntity<ApiResponse<List<TarifResponse>>> tarifsParTransporteur(
            @PathVariable Long transporteurId) {
        return ResponseEntity.ok(ApiResponse.success(
                tarifService.listerParTransporteur(transporteurId)));
    }

    @GetMapping("/recherche")
    @Operation(summary = "Rechercher les tarifs disponibles pour un trajet")
    public ResponseEntity<ApiResponse<List<TarifResponse>>> rechercherTarifs(
            @RequestParam @NotBlank String villeDepart,
            @RequestParam @NotBlank String villeDestination,
            @RequestParam Long typeMarchandiseId) {
        return ResponseEntity.ok(ApiResponse.success(
                tarifService.rechercherTarifs(villeDepart, villeDestination, typeMarchandiseId)));
    }

    @GetMapping("/devis")
    @Operation(summary = "Obtenir un devis comparatif pour un trajet")
    public ResponseEntity<ApiResponse<DevisResponse>> calculerDevis(
            @RequestParam @NotBlank String villeDepart,
            @RequestParam @NotBlank String villeDestination,
            @RequestParam Long typeMarchandiseId,
            @RequestParam @DecimalMin("0.001") BigDecimal poidsKg) {
        return ResponseEntity.ok(ApiResponse.success(
                tarifService.calculerDevis(villeDepart, villeDestination, typeMarchandiseId, poidsKg)));
    }

    // ─── Endpoints TRANSPORTEUR ───────────────────────────────────

    @PostMapping
    @PreAuthorize("hasRole('TRANSPORTEUR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Créer un nouveau tarif")
    public ResponseEntity<ApiResponse<TarifResponse>> creerTarif(
            @AuthenticationPrincipal Utilisateur utilisateur,
            @Valid @RequestBody TarifRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tarif créé", tarifService.creerTarif(utilisateur, request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TRANSPORTEUR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Mettre à jour un tarif existant")
    public ResponseEntity<ApiResponse<TarifResponse>> mettreAJour(
            @AuthenticationPrincipal Utilisateur utilisateur,
            @PathVariable Long id,
            @Valid @RequestBody TarifRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Tarif mis à jour", tarifService.mettreAJourTarif(utilisateur, id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TRANSPORTEUR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Désactiver un tarif")
    public ResponseEntity<ApiResponse<Void>> desactiver(
            @AuthenticationPrincipal Utilisateur utilisateur,
            @PathVariable Long id) {
        tarifService.desactiverTarif(utilisateur, id);
        return ResponseEntity.ok(ApiResponse.success("Tarif désactivé", null));
    }
}
