package com.agregateur.transporteurs.mappers;

import com.agregateur.transporteurs.dtos.response.RendezVousResponse;
import com.agregateur.transporteurs.models.RendezVous;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RendezVousMapper {

    @Mapping(target = "commandeId",        source = "commande.id")
    @Mapping(target = "referenceCommande", source = "commande.reference")
    RendezVousResponse toResponse(RendezVous rendezVous);
}
