package com.agregateur.transporteurs.controllers;

import com.agregateur.transporteurs.dtos.response.ApiResponse;
import com.agregateur.transporteurs.models.TypeMarchandise;
import com.agregateur.transporteurs.repositories.TypeMarchandiseRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/types-marchandise")
@RequiredArgsConstructor
@Tag(name = "Types de Marchandise", description = "Référentiel des types de marchandises")
public class TypeMarchandiseController {

    private final TypeMarchandiseRepository typeMarchandiseRepository;

    @GetMapping
    @Operation(summary = "Lister tous les types de marchandises actifs (public)")
    public ResponseEntity<ApiResponse<List<TypeMarchandise>>> listerTous() {
        List<TypeMarchandise> types = typeMarchandiseRepository.findByActifTrue();
        return ResponseEntity.ok(ApiResponse.success(types));
    }
}
