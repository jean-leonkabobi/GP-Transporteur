package com.agregateur.transporteurs.mappers;

import com.agregateur.transporteurs.dtos.response.TransporteurResponse;
import com.agregateur.transporteurs.models.Transporteur;
import com.agregateur.transporteurs.models.ZoneDesserte;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransporteurMapper {

    @Mapping(target = "nom",       source = "utilisateur.nom")
    @Mapping(target = "prenom",    source = "utilisateur.prenom")
    @Mapping(target = "email",     source = "utilisateur.email")
    @Mapping(target = "telephone", source = "utilisateur.telephone")
    TransporteurResponse toResponse(Transporteur transporteur);

    @Mapping(target = "delaiMoyenJours", source = "delaiMoyenJours")
    TransporteurResponse.ZoneDesserteResponse toZoneResponse(ZoneDesserte zone);
}
