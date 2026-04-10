package com.agregateur.transporteurs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AgregateurTransporteursApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgregateurTransporteursApplication.class, args);
    }
}
