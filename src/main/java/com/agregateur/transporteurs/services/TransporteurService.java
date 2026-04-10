package com.agregateur.transporteurs.services;

import com.agregateur.transporteurs.dtos.response.TransporteurResponse;
import com.agregateur.transporteurs.exceptions.ResourceNotFoundException;
import com.agregateur.transporteurs.exceptions.UnauthorizedException;
import com.agregateur.transporteurs.mappers.TransporteurMapper;
import com.agregateur.transporteurs.models.Transporteur;
import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.models.ZoneDesserte;
import com.agregateur.transporteurs.repositories.TransporteurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TransporteurService {

    private final TransporteurRepository transporteurRepository;
    private final TransporteurMapper     transporteurMapper;

    // ─── Recherche publique ───────────────────────────────────────

    public Page<TransporteurResponse> rechercherParDestination(String ville, Pageable pageable) {
        return transporteurRepository
                .findByDestination(ville, pageable)
                .map(transporteurMapper::toResponse);
    }

    public Page<TransporteurResponse> rechercherParDestinationEtType(
            String ville, Long typeMarchandiseId, Pageable pageable) {
        return transporteurRepository
                .findByDestinationAndTypeMarchandise(ville, typeMarchandiseId, pageable)
                .map(transporteurMapper::toResponse);
    }

    public Page<TransporteurResponse> listerTous(Pageable pageable) {
        return transporteurRepository.findAll(pageable).map(transporteurMapper::toResponse);
    }

    public TransporteurResponse trouverParId(Long id) {
        return transporteurMapper.toResponse(getTransporteurOuErreur(id));
    }

    // ─── Gestion du profil (transporteur connecté) ────────────────

    public TransporteurResponse monProfil(Utilisateur utilisateur) {
        Transporteur t = transporteurRepository.findByUtilisateurId(utilisateur.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profil transporteur introuvable"));
        return transporteurMapper.toResponse(t);
    }

    @Transactional
    public TransporteurResponse ajouterZoneDesserte(Utilisateur utilisateur, String ville, String pays, int delai) {
        Transporteur transporteur = transporteurRepository.findByUtilisateurId(utilisateur.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profil transporteur introuvable"));

        boolean existe = transporteur.getZonesDesserte().stream()
                .anyMatch(z -> z.getVille().equalsIgnoreCase(ville) && z.getPays().equalsIgnoreCase(pays));
        if (existe) {
            throw new com.agregateur.transporteurs.exceptions.BusinessException(
                    "Cette destination est déjà configurée : " + ville);
        }

        ZoneDesserte zone = ZoneDesserte.builder()
                .transporteur(transporteur)
                .ville(ville)
                .pays(pays)
                .delaiMoyenJours(delai)
                .build();
        transporteur.getZonesDesserte().add(zone);
        transporteurRepository.save(transporteur);
        return transporteurMapper.toResponse(transporteur);
    }

    @Transactional
    public void supprimerZoneDesserte(Utilisateur utilisateur, Long zoneId) {
        Transporteur transporteur = transporteurRepository.findByUtilisateurId(utilisateur.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profil transporteur introuvable"));

        boolean removed = transporteur.getZonesDesserte()
                .removeIf(z -> z.getId().equals(zoneId));
        if (!removed) {
            throw new ResourceNotFoundException("Zone de desserte introuvable : " + zoneId);
        }
        transporteurRepository.save(transporteur);
    }

    // ─── Admin ────────────────────────────────────────────────────

    @Transactional
    public void toggleActif(Long id, boolean actif) {
        Transporteur t = getTransporteurOuErreur(id);
        t.setActif(actif);
        transporteurRepository.save(t);
    }

    // ─── Interne ─────────────────────────────────────────────────

    public Transporteur getTransporteurOuErreur(Long id) {
        return transporteurRepository.findByIdWithUtilisateur(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transporteur", id));
    }

    public Transporteur getTransporteurParUtilisateur(Utilisateur utilisateur) {
        return transporteurRepository.findByUtilisateurId(utilisateur.getId())
                .orElseThrow(() -> new UnauthorizedException("Profil transporteur introuvable pour cet utilisateur"));
    }
}
