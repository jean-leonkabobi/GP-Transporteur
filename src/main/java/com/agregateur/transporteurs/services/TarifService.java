package com.agregateur.transporteurs.services;

import com.agregateur.transporteurs.dtos.request.TarifRequest;
import com.agregateur.transporteurs.dtos.response.DevisResponse;
import com.agregateur.transporteurs.dtos.response.TarifResponse;
import com.agregateur.transporteurs.exceptions.BusinessException;
import com.agregateur.transporteurs.exceptions.ResourceNotFoundException;
import com.agregateur.transporteurs.mappers.TarifMapper;
import com.agregateur.transporteurs.models.Tarif;
import com.agregateur.transporteurs.models.Transporteur;
import com.agregateur.transporteurs.models.TypeMarchandise;
import com.agregateur.transporteurs.models.Utilisateur;
import com.agregateur.transporteurs.repositories.TarifRepository;
import com.agregateur.transporteurs.repositories.TypeMarchandiseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TarifService {

    private final TarifRepository           tarifRepository;
    private final TypeMarchandiseRepository typeMarchandiseRepository;
    private final TransporteurService       transporteurService;
    private final TarifMapper               tarifMapper;

    // ─── Consultation publique ────────────────────────────────────

    public List<TarifResponse> listerParTransporteur(Long transporteurId) {
        return tarifRepository.findByTransporteurIdAndActifTrue(transporteurId)
                .stream().map(tarifMapper::toResponse).toList();
    }

    public List<TarifResponse> rechercherTarifs(String villeDepart, String villeDestination, Long typeMarchandiseId) {
        return tarifRepository.findTarifsDisponibles(villeDepart, villeDestination, typeMarchandiseId)
                .stream().map(tarifMapper::toResponse).toList();
    }

    /**
     * Calcule un devis comparatif pour tous les transporteurs sur un trajet donné.
     */
    public DevisResponse calculerDevis(String villeDepart, String villeDestination,
                                       Long typeMarchandiseId, BigDecimal poidsKg) {
        TypeMarchandise type = typeMarchandiseRepository.findById(typeMarchandiseId)
                .orElseThrow(() -> new ResourceNotFoundException("TypeMarchandise", typeMarchandiseId));

        List<Tarif> tarifs = tarifRepository.findTarifsDisponibles(villeDepart, villeDestination, typeMarchandiseId);

        List<DevisResponse.OptionTransport> options = tarifs.stream()
                .map(t -> {
                    BigDecimal prix = calculerPrix(t, poidsKg);
                    return DevisResponse.OptionTransport.builder()
                            .transporteurId(t.getTransporteur().getId())
                            .nomTransporteur(t.getTransporteur().getUtilisateur().getNomComplet())
                            .noteMoyenne(t.getTransporteur().getNoteMoyenne())
                            .tarifId(t.getId())
                            .prixParKg(t.getPrixParKg())
                            .prixTotal(prix)
                            .prixMinimum(t.getPrixMinimum())
                            .delaiLivraisonJours(t.getDelaiLivraisonJours())
                            .devise(t.getDevise())
                            .build();
                })
                .sorted((a, b) -> a.getPrixTotal().compareTo(b.getPrixTotal()))
                .toList();

        return DevisResponse.builder()
                .villeDepart(villeDepart)
                .villeDestination(villeDestination)
                .poidsKg(poidsKg)
                .typeMarchandise(type.getLibelle())
                .options(options)
                .build();
    }

    // ─── Gestion transporteur ─────────────────────────────────────

    @Transactional
    public TarifResponse creerTarif(Utilisateur utilisateur, TarifRequest request) {
        Transporteur transporteur = transporteurService.getTransporteurParUtilisateur(utilisateur);
        TypeMarchandise type = typeMarchandiseRepository.findById(request.getTypeMarchandiseId())
                .orElseThrow(() -> new ResourceNotFoundException("TypeMarchandise", request.getTypeMarchandiseId()));

        Tarif tarif = Tarif.builder()
                .transporteur(transporteur)
                .typeMarchandise(type)
                .villeDepart(request.getVilleDepart())
                .villeDestination(request.getVilleDestination())
                .prixParKg(request.getPrixParKg())
                .prixMinimum(request.getPrixMinimum())
                .prixParKm(request.getPrixParKm())
                .delaiLivraisonJours(request.getDelaiLivraisonJours())
                .devise(request.getDevise())
                .build();

        return tarifMapper.toResponse(tarifRepository.save(tarif));
    }

    @Transactional
    public TarifResponse mettreAJourTarif(Utilisateur utilisateur, Long tarifId, TarifRequest request) {
        Tarif tarif = getTarifOuErreur(tarifId);
        Transporteur transporteur = transporteurService.getTransporteurParUtilisateur(utilisateur);

        if (!tarif.getTransporteur().getId().equals(transporteur.getId())) {
            throw new com.agregateur.transporteurs.exceptions.UnauthorizedException(
                    "Vous ne pouvez modifier que vos propres tarifs");
        }

        TypeMarchandise type = typeMarchandiseRepository.findById(request.getTypeMarchandiseId())
                .orElseThrow(() -> new ResourceNotFoundException("TypeMarchandise", request.getTypeMarchandiseId()));

        tarif.setTypeMarchandise(type);
        tarif.setVilleDepart(request.getVilleDepart());
        tarif.setVilleDestination(request.getVilleDestination());
        tarif.setPrixParKg(request.getPrixParKg());
        tarif.setPrixMinimum(request.getPrixMinimum());
        tarif.setPrixParKm(request.getPrixParKm());
        tarif.setDelaiLivraisonJours(request.getDelaiLivraisonJours());
        tarif.setDevise(request.getDevise());

        return tarifMapper.toResponse(tarifRepository.save(tarif));
    }

    @Transactional
    public void desactiverTarif(Utilisateur utilisateur, Long tarifId) {
        Tarif tarif = getTarifOuErreur(tarifId);
        Transporteur transporteur = transporteurService.getTransporteurParUtilisateur(utilisateur);

        if (!tarif.getTransporteur().getId().equals(transporteur.getId())) {
            throw new com.agregateur.transporteurs.exceptions.UnauthorizedException(
                    "Vous ne pouvez modifier que vos propres tarifs");
        }
        tarif.setActif(false);
        tarifRepository.save(tarif);
    }

    // ─── Utilitaire interne ───────────────────────────────────────

    /**
     * Calcule le prix total d'un transport selon le poids.
     * Applique le minimum si le prix calculé est inférieur.
     */
    public BigDecimal calculerPrix(Tarif tarif, BigDecimal poidsKg) {
        BigDecimal prixCalcule = tarif.getPrixParKg()
                .multiply(poidsKg)
                .setScale(2, RoundingMode.HALF_UP);

        return prixCalcule.compareTo(tarif.getPrixMinimum()) < 0
                ? tarif.getPrixMinimum()
                : prixCalcule;
    }

    public Tarif getTarifOuErreur(Long id) {
        return tarifRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarif", id));
    }
}
