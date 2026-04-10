package com.agregateur.transporteurs.services;

import com.agregateur.transporteurs.dtos.request.AvisRequest;
import com.agregateur.transporteurs.dtos.response.AvisResponse;
import com.agregateur.transporteurs.exceptions.BusinessException;
import com.agregateur.transporteurs.exceptions.DuplicateResourceException;
import com.agregateur.transporteurs.exceptions.ResourceNotFoundException;
import com.agregateur.transporteurs.mappers.AvisMapper;
import com.agregateur.transporteurs.models.Avis;
import com.agregateur.transporteurs.models.Client;
import com.agregateur.transporteurs.models.Commande;
import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.models.enums.StatutCommande;
import com.agregateur.transporteurs.repositories.AvisRepository;
import com.agregateur.transporteurs.repositories.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AvisService {

    private final AvisRepository   avisRepository;
    private final ClientRepository clientRepository;
    private final CommandeService  commandeService;
    private final AvisMapper       avisMapper;

    @Transactional
    public AvisResponse laisserAvis(Utilisateur utilisateur, AvisRequest request) {
        Client client = clientRepository.findByUtilisateurId(utilisateur.getId())
                .orElseThrow(() -> new BusinessException("Profil client introuvable"));

        Commande commande = commandeService.getCommandeOuErreur(request.getCommandeId());

        // Vérifications métier
        if (!commande.getClient().getId().equals(client.getId())) {
            throw new com.agregateur.transporteurs.exceptions.UnauthorizedException(
                    "Vous ne pouvez noter que vos propres commandes");
        }
        if (!StatutCommande.LIVREE.equals(commande.getStatut())) {
            throw new BusinessException("Vous ne pouvez laisser un avis que pour une commande livrée");
        }
        if (avisRepository.existsByCommandeId(commande.getId())) {
            throw new DuplicateResourceException("Vous avez déjà laissé un avis pour cette commande");
        }

        Avis avis = Avis.builder()
                .commande(commande)
                .client(client)
                .transporteur(commande.getTransporteur())
                .note(request.getNote())
                .commentaire(request.getCommentaire())
                .build();

        avis = avisRepository.save(avis);
        log.info("Avis {} étoile(s) laissé par client {} pour transporteur {}",
                request.getNote(), client.getId(), commande.getTransporteur().getId());
        return avisMapper.toResponse(avis);
    }

    public Page<AvisResponse> avisParTransporteur(Long transporteurId, Pageable pageable) {
        return avisRepository.findByTransporteurId(transporteurId, pageable)
                .map(avisMapper::toResponse);
    }

    public Page<AvisResponse> mesAvis(Utilisateur utilisateur, Pageable pageable) {
        Client client = clientRepository.findByUtilisateurId(utilisateur.getId())
                .orElseThrow(() -> new BusinessException("Profil client introuvable"));
        return avisRepository.findByClientId(client.getId(), pageable)
                .map(avisMapper::toResponse);
    }

    public AvisResponse avisParCommande(Long commandeId) {
        return avisRepository.findByCommandeId(commandeId)
                .map(avisMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Aucun avis pour cette commande"));
    }
}
