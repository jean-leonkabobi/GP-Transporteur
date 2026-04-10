package com.agregateur.transporteurs.controllers;

import com.agregateur.transporteurs.dtos.request.AvisRequest;
import com.agregateur.transporteurs.dtos.response.ApiResponse;
import com.agregateur.transporteurs.dtos.response.AvisResponse;
import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.services.AvisService;
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
@RequestMapping("/avis")
@RequiredArgsConstructor
@Tag(name = "Avis", description = "Notation et avis sur les transporteurs")
public class AvisController {

    private final AvisService avisService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Laisser un avis pour une commande livrée (CLIENT)")
    public ResponseEntity<ApiResponse<AvisResponse>> laisserAvis(
            @AuthenticationPrincipal Utilisateur utilisateur,
            @Valid @RequestBody AvisRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Avis enregistré",
                        avisService.laisserAvis(utilisateur, request)));
    }

    @GetMapping("/transporteur/{transporteurId}")
    @Operation(summary = "Lister les avis d'un transporteur (public)")
    public ResponseEntity<ApiResponse<Page<AvisResponse>>> avisTransporteur(
            @PathVariable Long transporteurId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success(
                avisService.avisParTransporteur(transporteurId, pageable)));
    }

    @GetMapping("/mes-avis")
    @PreAuthorize("hasRole('CLIENT')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Lister mes avis (CLIENT)")
    public ResponseEntity<ApiResponse<Page<AvisResponse>>> mesAvis(
            @AuthenticationPrincipal Utilisateur utilisateur,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success(
                avisService.mesAvis(utilisateur, pageable)));
    }

    @GetMapping("/commande/{commandeId}")
    @Operation(summary = "Obtenir l'avis d'une commande spécifique")
    public ResponseEntity<ApiResponse<AvisResponse>> avisCommande(
            @PathVariable Long commandeId) {
        return ResponseEntity.ok(ApiResponse.success(
                avisService.avisParCommande(commandeId)));
    }
}
