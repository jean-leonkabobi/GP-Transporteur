package com.agregateur.transporteurs.dtos.response;

import com.agregateur.transporteurs.models.enums.RoleUtilisateur;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private Long expiresIn;
    private Long utilisateurId;
    private String email;
    private String nomComplet;
    private RoleUtilisateur role;
}
