package com.agregateur.transporteurs.utils;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("DistanceCalculator - Tests Haversine")
class DistanceCalculatorTest {

    private DistanceCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new DistanceCalculator();
    }

    @Test
    @DisplayName("Dakar → Thiès : ~57 km (vol d'oiseau)")
    void dakarThies_shouldBeApproximately57km() {
        BigDecimal distance = calculator.calculerDistance("Dakar", "Thiès");

        assertThat(distance).isNotNull();
        // Ajusté pour Haversine
        assertThat(distance.doubleValue()).isBetween(55.0, 60.0);
    }

    @Test
    @DisplayName("Dakar → Saint-Louis : ~180 km (vol d'oiseau)")
    void dakarSaintLouis_shouldBeApproximately180km() {
        BigDecimal distance = calculator.calculerDistance("Dakar", "Saint-Louis");

        assertThat(distance).isNotNull();
        // Ajusté pour Haversine
        assertThat(distance.doubleValue()).isBetween(170.0, 185.0);
    }

    @Test
    @DisplayName("Ville inconnue → retourne null")
    void villeInconnue_shouldReturnNull() {
        BigDecimal distance = calculator.calculerDistance("Dakar", "VilleInexistante");

        assertThat(distance).isNull();
    }

    @Test
    @DisplayName("Même ville → distance proche de 0")
    void memeVille_shouldReturnNearZero() {
        BigDecimal distance = calculator.calculerDistance("Dakar", "Dakar");

        assertThat(distance).isNotNull();
        assertThat(distance.doubleValue()).isLessThan(1.0);
    }

    @Test
    @DisplayName("Calcul insensible à la casse")
    void calculInsensibleCasse() {
        BigDecimal d1 = calculator.calculerDistance("dakar", "thiès");
        BigDecimal d2 = calculator.calculerDistance("DAKAR", "THIÈS");

        assertThat(d1).isEqualByComparingTo(d2);
    }
}