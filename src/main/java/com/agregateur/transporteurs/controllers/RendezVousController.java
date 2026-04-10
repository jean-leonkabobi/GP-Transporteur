package com.agregateur.transporteurs.controllers;

import com.agregateur.transporteurs.dtos.request.RendezVousRequest;
import com.agregateur.transporteurs.dtos.response.ApiResponse;
import com.agregateur.transporteurs.dtos.response.RendezVousResponse;
import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.models.enums.StatutRendezVous;
import com.agregateur.transporteurs.services.RendezVousService;
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

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/rendez-vous")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Rendez-vous", description = "Planification et gestion des rendez-vous")
public class RendezVousController {

    private final RendezVousService rendezVousService;

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT','TRANSPORTEUR')")
    @Operation(summary = "Planifier un rendez-vous pour une commande")
    public ResponseEntity<ApiResponse<RendezVousResponse>> planifier(
            @AuthenticationPrincipal Utilisateur utilisateur,
            @Valid @RequestBody RendezVousRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Rendez-vous planifié",
                        rendezVousService.planifier(utilisateur, request)));
    }

    @GetMapping("/mes-rendez-vous")
    @Operation(summary = "Lister mes rendez-vous")
    public ResponseEntity<ApiResponse<Page<RendezVousResponse>>> mesRendezVous(
            @AuthenticationPrincipal Utilisateur utilisateur,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dateHeure").ascending());
        return ResponseEntity.ok(ApiResponse.success(
                rendezVousService.mesRendezVous(utilisateur, pageable)));
    }

    @GetMapping("/commande/{commandeId}")
    @Operation(summary = "Lister les rendez-vous d'une commande")
    public ResponseEntity<ApiResponse<List<RendezVousResponse>>> parCommande(
            @PathVariable Long commandeId,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(ApiResponse.success(
                rendezVousService.listerParCommande(commandeId, utilisateur)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Voir le détail d'un rendez-vous")
    public ResponseEntity<ApiResponse<RendezVousResponse>> trouverParId(
            @PathVariable Long id,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(ApiResponse.success(
                rendezVousService.trouverParId(id, utilisateur)));
    }

    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('TRANSPORTEUR','ADMIN')")
    @Operation(summary = "Changer le statut d'un rendez-vous (TRANSPORTEUR/ADMIN)")
    public ResponseEntity<ApiResponse<RendezVousResponse>> changerStatut(
            @PathVariable Long id,
            @RequestParam StatutRendezVous statut,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(ApiResponse.success(
                "Statut mis à jour",
                rendezVousService.changerStatut(id, statut, utilisateur)));
    }

    @PatchMapping("/{id}/reporter")
    @PreAuthorize("hasAnyRole('CLIENT','TRANSPORTEUR','ADMIN')")
    @Operation(summary = "Reporter un rendez-vous à une nouvelle date")
    public ResponseEntity<ApiResponse<RendezVousResponse>> reporter(
            @PathVariable Long id,
            @RequestParam LocalDateTime nouvelleDate,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(ApiResponse.success(
                "Rendez-vous reporté",
                rendezVousService.reporter(id, nouvelleDate, utilisateur)));
    }
}
