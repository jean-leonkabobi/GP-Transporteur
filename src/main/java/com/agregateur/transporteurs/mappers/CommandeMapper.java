package com.agregateur.transporteurs.mappers;

import com.agregateur.transporteurs.dtos.response.CommandeResponse;
import com.agregateur.transporteurs.models.Commande;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommandeMapper {

    @Mapping(target = "clientId",         source = "client.id")
    @Mapping(target = "nomClient",        expression = "java(commande.getClient().getUtilisateur().getNomComplet())")
    @Mapping(target = "transporteurId",   source = "transporteur.id")
    @Mapping(target = "nomTransporteur",  expression = "java(commande.getTransporteur().getUtilisateur().getNomComplet())")
    @Mapping(target = "typeMarchandise",  source = "typeMarchandise.libelle")
    CommandeResponse toResponse(Commande commande);
}
