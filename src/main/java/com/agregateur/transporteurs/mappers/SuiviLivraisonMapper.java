package com.agregateur.transporteurs.mappers;

import com.agregateur.transporteurs.dtos.response.SuiviLivraisonResponse;
import com.agregateur.transporteurs.models.SuiviLivraison;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SuiviLivraisonMapper {

    @Mapping(target = "commandeId",        source = "commande.id")
    @Mapping(target = "referenceCommande", source = "commande.reference")
    SuiviLivraisonResponse toResponse(SuiviLivraison suivi);
}
