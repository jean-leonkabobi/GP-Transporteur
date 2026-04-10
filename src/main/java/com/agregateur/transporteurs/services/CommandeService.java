package com.agregateur.transporteurs.services;

import com.agregateur.transporteurs.dtos.request.CommandeRequest;
import com.agregateur.transporteurs.dtos.response.CommandeResponse;
import com.agregateur.transporteurs.exceptions.BusinessException;
import com.agregateur.transporteurs.exceptions.ResourceNotFoundException;
import com.agregateur.transporteurs.exceptions.UnauthorizedException;
import com.agregateur.transporteurs.mappers.CommandeMapper;
import com.agregateur.transporteurs.models.*;
import com.agregateur.transporteurs.models.enums.RoleUtilisateur;
import com.agregateur.transporteurs.models.enums.StatutCommande;
import com.agregateur.transporteurs.models.enums.StatutSuivi;
import com.agregateur.transporteurs.repositories.*;
import com.agregateur.transporteurs.utils.DistanceCalculator;
import com.agregateur.transporteurs.utils.ReferenceGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CommandeService {

    private final CommandeRepository        commandeRepository;
    private final ClientRepository          clientRepository;
    private final TransporteurRepository    transporteurRepository;
    private final TypeMarchandiseRepository typeMarchandiseRepository;
    private final TarifRepository           tarifRepository;
    private final SuiviLivraisonRepository  suiviRepository;
    private final CommandeMapper            commandeMapper;
    private final ReferenceGenerator        referenceGenerator;
    private final DistanceCalculator        distanceCalculator;
    private final TarifService              tarifService;

    // ─── Création de commande (CLIENT) ───────────────────────────

    @Transactional
    public CommandeResponse creerCommande(Utilisateur utilisateur, CommandeRequest request) {
        // 1. Résolution des entités liées
        Client client = clientRepository.findByUtilisateurId(utilisateur.getId())
                .orElseThrow(() -> new BusinessException("Profil client introuvable"));

        Transporteur transporteur = transporteurRepository.findById(request.getTransporteurId())
                .orElseThrow(() -> new ResourceNotFoundException("Transporteur", request.getTransporteurId()));

        if (!Boolean.TRUE.equals(transporteur.getActif())) {
            throw new BusinessException("Ce transporteur n'est pas disponible actuellement");
        }

        TypeMarchandise type = typeMarchandiseRepository.findById(request.getTypeMarchandiseId())
                .orElseThrow(() -> new ResourceNotFoundException("TypeMarchandise", request.getTypeMarchandiseId()));

        // 2. Recherche du tarif applicable
        Optional<Tarif> tarifOpt = tarifRepository
                .findByTransporteurIdAndVilleDepartAndVilleDestinationAndTypeMarchandiseIdAndActifTrue(
                        transporteur.getId(),
                        request.getVilleEnlevement(),
                        request.getVilleLivraison(),
                        type.getId()
                );

        // 3. Calcul du prix
        BigDecimal prixTotal;
        Tarif      tarifApplique = null;

        if (tarifOpt.isPresent()) {
            tarifApplique = tarifOpt.get();
            prixTotal     = tarifService.calculerPrix(tarifApplique, request.getPoidsKg());
        } else {
            // Tarif générique (DIVERS) comme fallback
            Optional<Tarif> tarifGenerique = tarifRepository
                    .findByTransporteurIdAndVilleDepartAndVilleDestinationAndTypeMarchandiseIdAndActifTrue(
                            transporteur.getId(),
                            request.getVilleEnlevement(),
                            request.getVilleLivraison(),
                            getIdTypeDivers()
                    );

            if (tarifGenerique.isPresent()) {
                tarifApplique = tarifGenerique.get();
                prixTotal     = tarifService.calculerPrix(tarifApplique, request.getPoidsKg());
            } else {
                throw new BusinessException(
                        "Aucun tarif disponible pour ce transporteur sur ce trajet. " +
                        "Veuillez contacter le transporteur directement.");
            }
        }

        // 4. Calcul distance
        BigDecimal distance = distanceCalculator.calculerDistance(
                request.getVilleEnlevement(), request.getVilleLivraison());

        // 5. Création commande
        String reference = referenceGenerator.genererReferenceCommande();
        while (commandeRepository.existsByReference(reference)) {
            reference = referenceGenerator.genererReferenceCommande();
        }

        Commande commande = Commande.builder()
                .reference(reference)
                .client(client)
                .transporteur(transporteur)
                .typeMarchandise(type)
                .tarif(tarifApplique)
                .descriptionColis(request.getDescriptionColis())
                .poidsKg(request.getPoidsKg())
                .volumeM3(request.getVolumeM3())
                .adresseEnlevement(request.getAdresseEnlevement())
                .villeEnlevement(request.getVilleEnlevement())
                .adresseLivraison(request.getAdresseLivraison())
                .villeLivraison(request.getVilleLivraison())
                .distanceKm(distance)
                .prixTotal(prixTotal)
                .notes(request.getNotes())
                .dateSouhaitee(request.getDateSouhaitee())
                .build();

        commande = commandeRepository.save(commande);

        // 6. Premier événement de suivi
        SuiviLivraison premiereEtape = SuiviLivraison.builder()
                .commande(commande)
                .statut(StatutSuivi.COLIS_PRIS_EN_CHARGE)
                .localisation(request.getVilleEnlevement())
                .description("Commande créée - en attente de confirmation du transporteur")
                .build();
        suiviRepository.save(premiereEtape);

        log.info("Commande créée : {} par client {}", commande.getReference(), client.getId());
        return commandeMapper.toResponse(commande);
    }

    // ─── Consultation ─────────────────────────────────────────────

    public CommandeResponse trouverParReference(String reference, Utilisateur utilisateur) {
        Commande commande = commandeRepository.findByReferenceWithDetails(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Commande", "référence", reference));
        verifierAccesCommande(commande, utilisateur);
        return commandeMapper.toResponse(commande);
    }

    public Page<CommandeResponse> mesCommandes(Utilisateur utilisateur, StatutCommande statut, Pageable pageable) {
        if (RoleUtilisateur.CLIENT.equals(utilisateur.getRole())) {
            Client client = clientRepository.findByUtilisateurId(utilisateur.getId())
                    .orElseThrow(() -> new BusinessException("Profil client introuvable"));
            if (statut != null) {
                return commandeRepository.findByClientIdAndStatut(client.getId(), statut, pageable)
                        .map(commandeMapper::toResponse);
            }
            return commandeRepository.findByClientId(client.getId(), pageable)
                    .map(commandeMapper::toResponse);

        } else if (RoleUtilisateur.TRANSPORTEUR.equals(utilisateur.getRole())) {
            Transporteur t = transporteurRepository.findByUtilisateurId(utilisateur.getId())
                    .orElseThrow(() -> new BusinessException("Profil transporteur introuvable"));
            if (statut != null) {
                return commandeRepository.findByTransporteurIdAndStatut(t.getId(), statut, pageable)
                        .map(commandeMapper::toResponse);
            }
            return commandeRepository.findByTransporteurId(t.getId(), pageable)
                    .map(commandeMapper::toResponse);
        }

        return commandeRepository.findAll(pageable).map(commandeMapper::toResponse);
    }

    // ─── Changements de statut ────────────────────────────────────

    @Transactional
    public CommandeResponse confirmerCommande(Long id, Utilisateur utilisateur) {
        Commande commande = getCommandeOuErreur(id);
        verifierTransporteurCommande(commande, utilisateur);

        if (!StatutCommande.EN_ATTENTE.equals(commande.getStatut())) {
            throw new BusinessException("Seules les commandes EN_ATTENTE peuvent être confirmées");
        }

        commande.setStatut(StatutCommande.CONFIRMEE);
        commande.setDateConfirmation(LocalDateTime.now());
        commandeRepository.save(commande);

        ajouterSuivi(commande, StatutSuivi.COLIS_PRIS_EN_CHARGE,
                commande.getVilleEnlevement(), "Commande confirmée par le transporteur");

        log.info("Commande {} confirmée par transporteur {}", commande.getReference(), utilisateur.getEmail());
        return commandeMapper.toResponse(commande);
    }

    @Transactional
    public CommandeResponse demarrerLivraison(Long id, Utilisateur utilisateur) {
        Commande commande = getCommandeOuErreur(id);
        verifierTransporteurCommande(commande, utilisateur);

        if (!StatutCommande.CONFIRMEE.equals(commande.getStatut())) {
            throw new BusinessException("Seules les commandes CONFIRMEES peuvent être démarrées");
        }

        commande.setStatut(StatutCommande.EN_COURS);
        commandeRepository.save(commande);

        ajouterSuivi(commande, StatutSuivi.EN_TRANSIT,
                commande.getVilleEnlevement(), "Colis en cours de transport");

        return commandeMapper.toResponse(commande);
    }

    @Transactional
    public CommandeResponse marquerLivree(Long id, Utilisateur utilisateur) {
        Commande commande = getCommandeOuErreur(id);
        verifierTransporteurCommande(commande, utilisateur);

        if (!StatutCommande.EN_COURS.equals(commande.getStatut())) {
            throw new BusinessException("Seules les commandes EN_COURS peuvent être marquées livrées");
        }

        commande.setStatut(StatutCommande.LIVREE);
        commande.setDateLivraisonReelle(LocalDateTime.now());
        commandeRepository.save(commande);

        ajouterSuivi(commande, StatutSuivi.LIVRE,
                commande.getVilleLivraison(), "Colis livré avec succès");

        log.info("Commande {} marquée LIVREE", commande.getReference());
        return commandeMapper.toResponse(commande);
    }

    @Transactional
    public CommandeResponse annulerCommande(Long id, Utilisateur utilisateur) {
        Commande commande = getCommandeOuErreur(id);

        // Client ou transporteur peut annuler selon le statut
        boolean estClient       = RoleUtilisateur.CLIENT.equals(utilisateur.getRole());
        boolean estTransporteur = RoleUtilisateur.TRANSPORTEUR.equals(utilisateur.getRole());

        if (estClient) {
            Client client = clientRepository.findByUtilisateurId(utilisateur.getId())
                    .orElseThrow(() -> new BusinessException("Profil client introuvable"));
            if (!commande.getClient().getId().equals(client.getId())) {
                throw new UnauthorizedException("Vous n'êtes pas autorisé à annuler cette commande");
            }
        } else if (estTransporteur) {
            verifierTransporteurCommande(commande, utilisateur);
        }

        if (StatutCommande.LIVREE.equals(commande.getStatut()) ||
            StatutCommande.ANNULEE.equals(commande.getStatut())) {
            throw new BusinessException("Cette commande ne peut plus être annulée (statut: " + commande.getStatut() + ")");
        }

        commande.setStatut(StatutCommande.ANNULEE);
        commandeRepository.save(commande);

        log.info("Commande {} annulée par {}", commande.getReference(), utilisateur.getEmail());
        return commandeMapper.toResponse(commande);
    }

    // ─── Helpers privés ──────────────────────────────────────────

    private void ajouterSuivi(Commande commande, StatutSuivi statut, String localisation, String description) {
        SuiviLivraison suivi = SuiviLivraison.builder()
                .commande(commande)
                .statut(statut)
                .localisation(localisation)
                .description(description)
                .build();
        suiviRepository.save(suivi);
    }

    private void verifierAccesCommande(Commande commande, Utilisateur utilisateur) {
        if (RoleUtilisateur.ADMIN.equals(utilisateur.getRole())) return;

        if (RoleUtilisateur.CLIENT.equals(utilisateur.getRole())) {
            Client client = clientRepository.findByUtilisateurId(utilisateur.getId()).orElse(null);
            if (client == null || !commande.getClient().getId().equals(client.getId())) {
                throw new UnauthorizedException("Accès refusé à cette commande");
            }
        } else if (RoleUtilisateur.TRANSPORTEUR.equals(utilisateur.getRole())) {
            Transporteur t = transporteurRepository.findByUtilisateurId(utilisateur.getId()).orElse(null);
            if (t == null || !commande.getTransporteur().getId().equals(t.getId())) {
                throw new UnauthorizedException("Accès refusé à cette commande");
            }
        }
    }

    private void verifierTransporteurCommande(Commande commande, Utilisateur utilisateur) {
        Transporteur t = transporteurRepository.findByUtilisateurId(utilisateur.getId())
                .orElseThrow(() -> new BusinessException("Profil transporteur introuvable"));
        if (!commande.getTransporteur().getId().equals(t.getId())) {
            throw new UnauthorizedException("Vous n'êtes pas le transporteur assigné à cette commande");
        }
    }

    public Commande getCommandeOuErreur(Long id) {
        return commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande", id));
    }

    private Long getIdTypeDivers() {
        return typeMarchandiseRepository.findByCode("DIVERS")
                .map(t -> t.getId())
                .orElse(1L);
    }
}
