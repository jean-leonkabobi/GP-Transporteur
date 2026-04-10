package com.agregateur.transporteurs.services;

import com.agregateur.transporteurs.dtos.request.LoginRequest;
import com.agregateur.transporteurs.dtos.request.RegisterRequest;
import com.agregateur.transporteurs.dtos.response.AuthResponse;
import com.agregateur.transporteurs.exceptions.BusinessException;
import com.agregateur.transporteurs.exceptions.DuplicateResourceException;
import com.agregateur.transporteurs.models.Client;
import com.agregateur.transporteurs.models.Transporteur;
import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.models.enums.RoleUtilisateur;
import com.agregateur.transporteurs.repositories.ClientRepository;
import com.agregateur.transporteurs.repositories.TransporteurRepository;
import com.agregateur.transporteurs.repositories.UtilisateurRepository;
import com.agregateur.transporteurs.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final ClientRepository      clientRepository;
    private final TransporteurRepository transporteurRepository;
    private final PasswordEncoder       passwordEncoder;
    private final JwtService            jwtService;
    private final AuthenticationManager authenticationManager;

    // ─── Inscription ─────────────────────────────────────────────

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Un compte existe déjà avec cet email : " + request.getEmail());
        }

        Utilisateur utilisateur = Utilisateur.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .telephone(request.getTelephone())
                .role(request.getRole())
                .build();

        utilisateur = utilisateurRepository.save(utilisateur);

        // Création du profil selon le rôle
        if (RoleUtilisateur.CLIENT.equals(request.getRole())) {
            Client client = Client.builder()
                    .utilisateur(utilisateur)
                    .adresse(request.getAdresse())
                    .ville(request.getVille())
                    .entreprise(request.getEntreprise())
                    .build();
            clientRepository.save(client);

        } else if (RoleUtilisateur.TRANSPORTEUR.equals(request.getRole())) {
            if (request.getNumeroLicence() == null || request.getNumeroLicence().isBlank()) {
                throw new BusinessException("Le numéro de licence est obligatoire pour un transporteur");
            }
            if (transporteurRepository.existsByNumeroLicence(request.getNumeroLicence())) {
                throw new DuplicateResourceException("Ce numéro de licence est déjà utilisé");
            }
            Transporteur transporteur = Transporteur.builder()
                    .utilisateur(utilisateur)
                    .numeroLicence(request.getNumeroLicence())
                    .description(request.getDescription())
                    .villeDepart(request.getVilleDepart() != null ? request.getVilleDepart() : "Dakar")
                    .build();
            transporteurRepository.save(transporteur);
        }

        log.info("Nouvel utilisateur créé : {} ({})", utilisateur.getEmail(), utilisateur.getRole());

        String accessToken  = jwtService.generateToken(utilisateur);
        String refreshToken = jwtService.generateRefreshToken(utilisateur);

        return buildAuthResponse(utilisateur, accessToken, refreshToken);
    }

    // ─── Connexion ───────────────────────────────────────────────

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse())
        );

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));

        if (!Boolean.TRUE.equals(utilisateur.getActif())) {
            throw new BusinessException("Ce compte est désactivé. Contactez l'administrateur.");
        }

        String accessToken  = jwtService.generateToken(utilisateur);
        String refreshToken = jwtService.generateRefreshToken(utilisateur);

        log.info("Connexion réussie : {}", utilisateur.getEmail());
        return buildAuthResponse(utilisateur, accessToken, refreshToken);
    }

    // ─── Interne ─────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(Utilisateur u, String access, String refresh) {
        return AuthResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .expiresIn(jwtService.getExpirationMs())
                .utilisateurId(u.getId())
                .email(u.getEmail())
                .nomComplet(u.getNomComplet())
                .role(u.getRole())
                .build();
    }
}
