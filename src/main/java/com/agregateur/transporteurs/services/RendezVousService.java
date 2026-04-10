package com.agregateur.transporteurs.services;

import com.agregateur.transporteurs.dtos.request.RendezVousRequest;
import com.agregateur.transporteurs.dtos.response.RendezVousResponse;
import com.agregateur.transporteurs.exceptions.BusinessException;
import com.agregateur.transporteurs.exceptions.ResourceNotFoundException;
import com.agregateur.transporteurs.exceptions.UnauthorizedException;
import com.agregateur.transporteurs.mappers.RendezVousMapper;
import com.agregateur.transporteurs.models.Commande;
import com.agregateur.transporteurs.models.RendezVous;
import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.models.enums.RoleUtilisateur;
import com.agregateur.transporteurs.models.enums.StatutCommande;
import com.agregateur.transporteurs.models.enums.StatutRendezVous;
import com.agregateur.transporteurs.repositories.ClientRepository;
import com.agregateur.transporteurs.repositories.RendezVousRepository;
import com.agregateur.transporteurs.repositories.TransporteurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RendezVousService {

    private final RendezVousRepository   rendezVousRepository;
    private final ClientRepository       clientRepository;
    private final TransporteurRepository transporteurRepository;
    private final CommandeService        commandeService;
    private final RendezVousMapper       rendezVousMapper;

    // ─── Création ────────────────────────────────────────────────

    @Transactional
    public RendezVousResponse planifier(Utilisateur utilisateur, RendezVousRequest request) {
        Commande commande = commandeService.getCommandeOuErreur(request.getCommandeId());

        // Vérifier que la commande est dans un état permettant un RDV
        if (StatutCommande.ANNULEE.equals(commande.getStatut()) ||
            StatutCommande.LIVREE.equals(commande.getStatut())) {
            throw new BusinessException("Impossible de planifier un RDV pour une commande " + commande.getStatut());
        }

        // Seul le transporteur assigné ou le client de la commande peut créer un RDV
        verifierDroitSurCommande(commande, utilisateur);

        RendezVous rdv = RendezVous.builder()
                .commande(commande)
                .typeRdv(request.getTypeRdv())
                .dateHeure(request.getDateHeure())
                .adresse(request.getAdresse())
                .ville(request.getVille())
                .contactNom(request.getContactNom())
                .contactTel(request.getContactTel())
                .notes(request.getNotes())
                .build();

        rdv = rendezVousRepository.save(rdv);
        log.info("RDV {} planifié pour commande {}", rdv.getTypeRdv(), commande.getReference());
        return rendezVousMapper.toResponse(rdv);
    }

    // ─── Consultation ─────────────────────────────────────────────

    public List<RendezVousResponse> listerParCommande(Long commandeId, Utilisateur utilisateur) {
        Commande commande = commandeService.getCommandeOuErreur(commandeId);
        verifierDroitSurCommande(commande, utilisateur);
        return rendezVousRepository.findByCommandeId(commandeId)
                .stream().map(rendezVousMapper::toResponse).toList();
    }

    public Page<RendezVousResponse> mesRendezVous(Utilisateur utilisateur, Pageable pageable) {
        if (RoleUtilisateur.CLIENT.equals(utilisateur.getRole())) {
            var client = clientRepository.findByUtilisateurId(utilisateur.getId())
                    .orElseThrow(() -> new BusinessException("Profil client introuvable"));
            return rendezVousRepository.findByClientId(client.getId(), pageable)
                    .map(rendezVousMapper::toResponse);
        }

        if (RoleUtilisateur.TRANSPORTEUR.equals(utilisateur.getRole())) {
            var transporteur = transporteurRepository.findByUtilisateurId(utilisateur.getId())
                    .orElseThrow(() -> new BusinessException("Profil transporteur introuvable"));
            LocalDateTime debut = LocalDateTime.now();
            LocalDateTime fin   = debut.plusDays(30);
            return rendezVousRepository.findByTransporteurAndPeriode(transporteur.getId(), debut, fin)
                    .stream().map(rendezVousMapper::toResponse)
                    .collect(java.util.stream.Collectors.collectingAndThen(
                            java.util.stream.Collectors.toList(),
                            list -> new org.springframework.data.domain.PageImpl<>(list, pageable, list.size())
                    ));
        }

        throw new UnauthorizedException("Rôle non autorisé pour cette opération");
    }

    public RendezVousResponse trouverParId(Long id, Utilisateur utilisateur) {
        RendezVous rdv = getRendezVousOuErreur(id);
        verifierDroitSurCommande(rdv.getCommande(), utilisateur);
        return rendezVousMapper.toResponse(rdv);
    }

    // ─── Changements de statut (transporteur) ────────────────────

    @Transactional
    public RendezVousResponse changerStatut(Long id, StatutRendezVous nouveauStatut, Utilisateur utilisateur) {
        RendezVous rdv = getRendezVousOuErreur(id);

        if (RoleUtilisateur.TRANSPORTEUR.equals(utilisateur.getRole())) {
            verifierTransporteurSurCommande(rdv.getCommande(), utilisateur);
        } else if (!RoleUtilisateur.ADMIN.equals(utilisateur.getRole())) {
            throw new UnauthorizedException("Seul le transporteur ou un admin peut modifier le statut d'un RDV");
        }

        validerTransitionStatut(rdv.getStatut(), nouveauStatut);

        rdv.setStatut(nouveauStatut);
        rdv = rendezVousRepository.save(rdv);
        log.info("Statut RDV {} → {}", id, nouveauStatut);
        return rendezVousMapper.toResponse(rdv);
    }

    @Transactional
    public RendezVousResponse reporter(Long id, LocalDateTime nouvelleDate, Utilisateur utilisateur) {
        RendezVous rdv = getRendezVousOuErreur(id);
        verifierDroitSurCommande(rdv.getCommande(), utilisateur);

        if (StatutRendezVous.TERMINE.equals(rdv.getStatut()) ||
            StatutRendezVous.ANNULE.equals(rdv.getStatut())) {
            throw new BusinessException("Ce rendez-vous ne peut pas être reporté (statut: " + rdv.getStatut() + ")");
        }

        rdv.setDateHeure(nouvelleDate);
        rdv.setStatut(StatutRendezVous.REPORTE);
        rdv = rendezVousRepository.save(rdv);
        return rendezVousMapper.toResponse(rdv);
    }

    // ─── Helpers privés ──────────────────────────────────────────

    private void verifierDroitSurCommande(Commande commande, Utilisateur utilisateur) {
        if (RoleUtilisateur.ADMIN.equals(utilisateur.getRole())) return;

        if (RoleUtilisateur.CLIENT.equals(utilisateur.getRole())) {
            var client = clientRepository.findByUtilisateurId(utilisateur.getId()).orElse(null);
            if (client == null || !commande.getClient().getId().equals(client.getId())) {
                throw new UnauthorizedException("Accès refusé");
            }
        } else {
            verifierTransporteurSurCommande(commande, utilisateur);
        }
    }

    private void verifierTransporteurSurCommande(Commande commande, Utilisateur utilisateur) {
        var t = transporteurRepository.findByUtilisateurId(utilisateur.getId()).orElse(null);
        if (t == null || !commande.getTransporteur().getId().equals(t.getId())) {
            throw new UnauthorizedException("Vous n'êtes pas le transporteur de cette commande");
        }
    }

    private void validerTransitionStatut(StatutRendezVous actuel, StatutRendezVous cible) {
        boolean valide = switch (actuel) {
            case PLANIFIE  -> cible == StatutRendezVous.CONFIRME  || cible == StatutRendezVous.ANNULE;
            case CONFIRME  -> cible == StatutRendezVous.EN_COURS  || cible == StatutRendezVous.ANNULE || cible == StatutRendezVous.REPORTE;
            case EN_COURS  -> cible == StatutRendezVous.TERMINE;
            case REPORTE   -> cible == StatutRendezVous.CONFIRME  || cible == StatutRendezVous.ANNULE;
            default        -> false;
        };
        if (!valide) {
            throw new BusinessException("Transition de statut invalide : " + actuel + " → " + cible);
        }
    }

    private RendezVous getRendezVousOuErreur(Long id) {
        return rendezVousRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RendezVous", id));
    }
}
