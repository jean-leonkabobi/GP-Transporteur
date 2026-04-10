package com.agregateur.transporteurs.utils;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

/**
 * Calcul de distance entre villes par formule Haversine.
 * Les coordonnées des villes sénégalaises/africaines principales sont précâblées.
 * Pour une version production, utiliser une API géocodage (Google Maps, OpenStreetMap).
 */
@Component
public class DistanceCalculator {

    private static final double EARTH_RADIUS_KM = 6371.0;

    /** Coordonnées (lat, lng) des villes principales */
    private static final Map<String, double[]> COORDS = Map.ofEntries(
        Map.entry("dakar",        new double[]{14.6937, -17.4441}),
        Map.entry("thiès",        new double[]{14.7897, -16.9256}),
        Map.entry("saint-louis",  new double[]{16.0179, -16.4896}),
        Map.entry("ziguinchor",   new double[]{12.5573, -16.2714}),
        Map.entry("touba",        new double[]{14.8500, -15.8833}),
        Map.entry("kaolack",      new double[]{14.1518, -16.0726}),
        Map.entry("tambacounda",  new double[]{13.7707, -13.6673}),
        Map.entry("kolda",        new double[]{12.8989, -14.9411}),
        Map.entry("diourbel",     new double[]{14.6548, -16.2338}),
        Map.entry("fatick",       new double[]{14.3390, -16.4112}),
        Map.entry("louga",        new double[]{15.6175, -16.2248}),
        Map.entry("matam",        new double[]{15.6559, -13.2553}),
        Map.entry("kédougou",     new double[]{12.5566, -12.1749}),
        Map.entry("sédhiou",      new double[]{12.7084, -15.5572}),
        Map.entry("bambey",       new double[]{14.7044, -16.4533}),
        Map.entry("bamako",       new double[]{12.6392, -8.0029}),
        Map.entry("conakry",      new double[]{9.6412,  -13.5784}),
        Map.entry("abidjan",      new double[]{5.3364,  -4.0267}),
        Map.entry("banjul",       new double[]{13.4531, -16.5775}),
        Map.entry("bissau",       new double[]{11.8636, -15.5977})
    );

    /**
     * Calcule la distance en km entre deux villes.
     * Retourne null si l'une des villes est inconnue.
     */
    public BigDecimal calculerDistance(String villeDepart, String villeArrivee) {
        double[] coordDepart  = COORDS.get(normaliser(villeDepart));
        double[] coordArrivee = COORDS.get(normaliser(villeArrivee));

        if (coordDepart == null || coordArrivee == null) {
            return null; // Ville inconnue → distance non calculée
        }

        double distanceKm = haversine(
            coordDepart[0],  coordDepart[1],
            coordArrivee[0], coordArrivee[1]
        );

        return BigDecimal.valueOf(distanceKm).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Formule Haversine — distance orthodromique entre deux points GPS.
     */
    private double haversine(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    private String normaliser(String ville) {
        return ville == null ? "" : ville.toLowerCase().trim();
    }
}
