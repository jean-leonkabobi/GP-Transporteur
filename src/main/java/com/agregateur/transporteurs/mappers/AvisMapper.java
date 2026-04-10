package com.agregateur.transporteurs.mappers;

import com.agregateur.transporteurs.dtos.response.AvisResponse;
import com.agregateur.transporteurs.models.Avis;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AvisMapper {

    @Mapping(target = "commandeId",        source = "commande.id")
    @Mapping(target = "referenceCommande", source = "commande.reference")
    @Mapping(target = "clientId",          source = "client.id")
    @Mapping(target = "nomClient",         expression = "java(avis.getClient().getUtilisateur().getNomComplet())")
    @Mapping(target = "transporteurId",    source = "transporteur.id")
    AvisResponse toResponse(Avis avis);
}
