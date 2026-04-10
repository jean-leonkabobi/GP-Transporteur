package com.agregateur.transporteurs.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("Agrégateur de Transporteurs API")
                        .description("""
                            ## Plateforme de mise en relation clients-transporteurs
                            
                            ### Fonctionnalités
                            - 🔐 Authentification JWT (login / register)
                            - 🚚 Recherche de transporteurs par destination
                            - 💰 Consultation et calcul des tarifs
                            - 📦 Gestion des commandes
                            - 📅 Prise et gestion des rendez-vous
                            - 📍 Suivi en temps réel des livraisons
                            - ⭐ Système d'avis et notation
                            
                            ### Rôles
                            - **CLIENT** : passer des commandes, suivre les livraisons
                            - **TRANSPORTEUR** : gérer tarifs, rendez-vous, livraisons
                            - **ADMIN** : gestion globale de la plateforme
                            """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Équipe Agrégateur")
                                .email("support@agregateur.sn"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Entrez votre token JWT : Bearer {token}")));
    }
}
