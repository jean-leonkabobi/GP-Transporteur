package com.agregateur.transporteurs.services;

import com.agregateur.transporteurs.dtos.request.SuiviLivraisonRequest;
import com.agregateur.transporteurs.dtos.response.SuiviLivraisonResponse;
import com.agregateur.transporteurs.exceptions.BusinessException;
import com.agregateur.transporteurs.exceptions.ResourceNotFoundException;
import com.agregateur.transporteurs.exceptions.UnauthorizedException;
import com.agregateur.transporteurs.mappers.SuiviLivraisonMapper;
import com.agregateur.transporteurs.models.Commande;
import com.agregateur.transporteurs.models.SuiviLivraison;
import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.models.enums.RoleUtilisateur;
import com.agregateur.transporteurs.models.enums.StatutCommande;
import com.agregateur.transporteurs.models.enums.StatutSuivi;
import com.agregateur.transporteurs.repositories.SuiviLivraisonRepository;
import com.agregateur.transporteurs.repositories.TransporteurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SuiviLivraisonService {

    private final SuiviLivraisonRepository suiviRepository;
    private final TransporteurRepository   transporteurRepository;
    private final CommandeService          commandeService;
    private final SuiviLivraisonMapper     suiviMapper;

    // ─── Ajout d'un événement de suivi (TRANSPORTEUR/ADMIN) ──────

    @Transactional
    public SuiviLivraisonResponse ajouterEvenement(Utilisateur utilisateur, SuiviLivraisonRequest request) {
        Commande commande = commandeService.getCommandeOuErreur(request.getCommandeId());

        // Vérification droits transporteur
        if (RoleUtilisateur.TRANSPORTEUR.equals(utilisateur.getRole())) {
            var t = transporteurRepository.findByUtilisateurId(utilisateur.getId())
                    .orElseThrow(() -> new BusinessException("Profil transporteur introuvable"));
            if (!commande.getTransporteur().getId().equals(t.getId())) {
                throw new UnauthorizedException("Vous n'êtes pas le transporteur de cette commande");
            }
        }

        // La commande doit être active
        if (StatutCommande.ANNULEE.equals(commande.getStatut())) {
            throw new BusinessException("Impossible d'ajouter un suivi à une commande annulée");
        }

        // Vérification cohérence du statut suivi vs commande
        validerCoherenceStatut(request.getStatut(), commande.getStatut());

        SuiviLivraison suivi = SuiviLivraison.builder()
                .commande(commande)
                .statut(request.getStatut())
                .localisation(request.getLocalisation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .description(request.getDescription())
                .build();

        suivi = suiviRepository.save(suivi);
        log.info("Suivi ajouté : commande {} → {}", commande.getReference(), request.getStatut());
        return suiviMapper.toResponse(suivi);
    }

    // ─── Consultation ─────────────────────────────────────────────

    /**
     * Consultation publique du suivi par référence de commande.
     * Accessible sans authentification (tracking public).
     */
    public List<SuiviLivraisonResponse> suivreParReference(String reference) {
        Commande commande = commandeService.getCommandeOuErreur(
            commandeService.getCommandeOuErreur(
                resolveIdParReference(reference)).getId()
        );
        return suiviRepository.findByCommandeIdOrderByCreatedAtDesc(commande.getId())
                .stream().map(suiviMapper::toResponse).toList();
    }

    public List<SuiviLivraisonResponse> listerParCommande(Long commandeId, Utilisateur utilisateur) {
        Commande commande = commandeService.getCommandeOuErreur(commandeId);
        // Admin et transporteur/client autorisés — on laisse CommandeService gérer l'accès
        return suiviRepository.findByCommandeIdOrderByCreatedAtDesc(commandeId)
                .stream().map(suiviMapper::toResponse).toList();
    }

    public SuiviLivraisonResponse dernierStatut(Long commandeId) {
        return suiviRepository.findDernierSuivi(commandeId)
                .map(suiviMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Aucun suivi trouvé pour la commande " + commandeId));
    }

    // ─── Helpers ─────────────────────────────────────────────────

    private void validerCoherenceStatut(StatutSuivi statutSuivi, StatutCommande statutCommande) {
        if (StatutSuivi.LIVRE.equals(statutSuivi) && !StatutCommande.EN_COURS.equals(statutCommande)) {
            throw new BusinessException(
                    "Une commande doit être EN_COURS pour être marquée LIVRÉE");
        }
    }

    private Long resolveIdParReference(String reference) {
        // Méthode utilitaire — délègue à CommandeRepository via CommandeService
        throw new UnsupportedOperationException("Utiliser /commandes/{reference}/suivis à la place");
    }
}
