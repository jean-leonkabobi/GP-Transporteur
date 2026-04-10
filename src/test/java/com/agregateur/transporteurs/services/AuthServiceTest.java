package com.agregateur.transporteurs.services;

import com.agregateur.transporteurs.dtos.request.LoginRequest;
import com.agregateur.transporteurs.dtos.request.RegisterRequest;
import com.agregateur.transporteurs.dtos.response.AuthResponse;
import com.agregateur.transporteurs.exceptions.DuplicateResourceException;
import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.models.enums.RoleUtilisateur;
import com.agregateur.transporteurs.repositories.ClientRepository;
import com.agregateur.transporteurs.repositories.TransporteurRepository;
import com.agregateur.transporteurs.repositories.UtilisateurRepository;
import com.agregateur.transporteurs.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService - Tests unitaires")
class AuthServiceTest {

    @Mock private UtilisateurRepository   utilisateurRepository;
    @Mock private ClientRepository        clientRepository;
    @Mock private TransporteurRepository  transporteurRepository;
    @Mock private PasswordEncoder         passwordEncoder;
    @Mock private JwtService              jwtService;
    @Mock private AuthenticationManager   authenticationManager;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private Utilisateur     utilisateur;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setNom("Diallo");
        registerRequest.setPrenom("Mamadou");
        registerRequest.setEmail("mamadou@test.sn");
        registerRequest.setMotDePasse("password123");
        registerRequest.setRole(RoleUtilisateur.CLIENT);

        utilisateur = Utilisateur.builder()
                .id(1L)
                .nom("Diallo")
                .prenom("Mamadou")
                .email("mamadou@test.sn")
                .motDePasse("encoded_password")
                .role(RoleUtilisateur.CLIENT)
                .actif(true)
                .build();
    }

    @Test
    @DisplayName("register() - succès création client")
    void register_shouldCreateClientSuccessfully() {
        when(utilisateurRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(utilisateurRepository.save(any())).thenReturn(utilisateur);
        when(clientRepository.save(any())).thenReturn(null);
        when(jwtService.generateToken(any())).thenReturn("access_token");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh_token");
        when(jwtService.getExpirationMs()).thenReturn(86400000L);

        AuthResponse response = authService.register(registerRequest);

        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo("mamadou@test.sn");
        assertThat(response.getRole()).isEqualTo(RoleUtilisateur.CLIENT);
        assertThat(response.getAccessToken()).isEqualTo("access_token");

        verify(utilisateurRepository).save(any(Utilisateur.class));
        verify(clientRepository).save(any());
    }

    @Test
    @DisplayName("register() - email déjà utilisé → DuplicateResourceException")
    void register_shouldThrowWhenEmailExists() {
        when(utilisateurRepository.existsByEmail("mamadou@test.sn")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("mamadou@test.sn");

        verify(utilisateurRepository, never()).save(any());
    }

    @Test
    @DisplayName("login() - succès connexion")
    void login_shouldReturnTokensOnSuccess() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("mamadou@test.sn");
        loginRequest.setMotDePasse("password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(utilisateurRepository.findByEmail("mamadou@test.sn"))
                .thenReturn(Optional.of(utilisateur));
        when(jwtService.generateToken(any())).thenReturn("access_token");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh_token");
        when(jwtService.getExpirationMs()).thenReturn(86400000L);

        AuthResponse response = authService.login(loginRequest);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isNotBlank();
        assertThat(response.getNomComplet()).isEqualTo("Mamadou Diallo");
    }

    @Test
    @DisplayName("login() - compte désactivé → BusinessException")
    void login_shouldThrowWhenAccountDisabled() {
        utilisateur.setActif(false);
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("mamadou@test.sn");
        loginRequest.setMotDePasse("password123");

        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(utilisateurRepository.findByEmail(anyString())).thenReturn(Optional.of(utilisateur));

        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(com.agregateur.transporteurs.exceptions.BusinessException.class)
                .hasMessageContaining("désactivé");
    }
}
