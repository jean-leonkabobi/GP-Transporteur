package com.agregateur.transporteurs.services;

import com.agregateur.transporteurs.models.Tarif;
import com.agregateur.transporteurs.models.TypeMarchandise;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@DisplayName("TarifService - Tests calcul prix")
class TarifServiceTest {

    @Mock private com.agregateur.transporteurs.repositories.TarifRepository           tarifRepository;
    @Mock private com.agregateur.transporteurs.repositories.TypeMarchandiseRepository typeMarchandiseRepository;
    @Mock private TransporteurService       transporteurService;
    @Mock private com.agregateur.transporteurs.mappers.TarifMapper                    tarifMapper;

    @InjectMocks
    private TarifService tarifService;

    private Tarif buildTarif(BigDecimal prixKg, BigDecimal minimum) {
        TypeMarchandise type = TypeMarchandise.builder()
                .id(1L).code("DIVERS").libelle("Divers").build();
        return Tarif.builder()
                .id(1L)
                .typeMarchandise(type)
                .prixParKg(prixKg)
                .prixMinimum(minimum)
                .devise("XOF")
                .delaiLivraisonJours(1)
                .build();
    }

    @Test
    @DisplayName("calculerPrix() - prix calculé supérieur au minimum")
    void calculerPrix_shouldReturnCalculatedPrice() {
        Tarif tarif = buildTarif(new BigDecimal("150.00"), new BigDecimal("2000.00"));
        BigDecimal poids = new BigDecimal("20"); // 20 kg × 150 = 3000 > 2000

        BigDecimal result = tarifService.calculerPrix(tarif, poids);

        assertThat(result).isEqualByComparingTo("3000.00");
    }

    @Test
    @DisplayName("calculerPrix() - prix calculé inférieur au minimum → retourne minimum")
    void calculerPrix_shouldReturnMinimumWhenCalculatedIsLower() {
        Tarif tarif = buildTarif(new BigDecimal("150.00"), new BigDecimal("2000.00"));
        BigDecimal poids = new BigDecimal("5"); // 5 kg × 150 = 750 < 2000

        BigDecimal result = tarifService.calculerPrix(tarif, poids);

        assertThat(result).isEqualByComparingTo("2000.00");
    }

    @Test
    @DisplayName("calculerPrix() - prix calculé exactement égal au minimum")
    void calculerPrix_shouldReturnMinimumWhenEqual() {
        Tarif tarif = buildTarif(new BigDecimal("200.00"), new BigDecimal("2000.00"));
        BigDecimal poids = new BigDecimal("10"); // 10 kg × 200 = 2000 = minimum

        BigDecimal result = tarifService.calculerPrix(tarif, poids);

        assertThat(result).isEqualByComparingTo("2000.00");
    }

    @Test
    @DisplayName("calculerPrix() - poids fractionnaire avec arrondi")
    void calculerPrix_shouldRoundCorrectly() {
        Tarif tarif = buildTarif(new BigDecimal("150.00"), new BigDecimal("0.00"));
        BigDecimal poids = new BigDecimal("7.333"); // 7.333 × 150 = 1099.95

        BigDecimal result = tarifService.calculerPrix(tarif, poids);

        assertThat(result).isEqualByComparingTo("1099.95");
    }
}
