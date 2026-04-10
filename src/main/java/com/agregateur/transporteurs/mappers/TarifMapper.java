package com.agregateur.transporteurs.mappers;

import com.agregateur.transporteurs.dtos.response.TarifResponse;
import com.agregateur.transporteurs.models.Tarif;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TarifMapper {

    @Mapping(target = "transporteurId",   source = "transporteur.id")
    @Mapping(target = "nomTransporteur",  source = "transporteur.utilisateur.nom")
    @Mapping(target = "typeMarchandise",  source = "typeMarchandise.libelle")
    TarifResponse toResponse(Tarif tarif);
}
