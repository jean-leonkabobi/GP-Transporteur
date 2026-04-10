package com.agregateur.transporteurs.utils;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Générateur de références uniques pour les commandes.
 * Format : CMD-YYYYMMDD-HHMMSS-XXXX
 * Exemple : CMD-20240415-143022-0042
 */
@Component
public class ReferenceGenerator {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");
    private static final AtomicInteger COUNTER = new AtomicInteger(1);

    public String genererReferenceCommande() {
        LocalDateTime now     = LocalDateTime.now();
        String        horodat = now.format(FORMATTER);
        int           seq     = COUNTER.getAndIncrement() % 10000;
        return String.format("CMD-%s-%04d", horodat, seq);
    }

    public String genererCodeSuivi() {
        LocalDateTime now  = LocalDateTime.now();
        String        date = now.format(DateTimeFormatter.ofPattern("yyMMddHHmm"));
        int           rand = (int) (Math.random() * 9000) + 1000;
        return "TRK-" + date + "-" + rand;
    }
}
