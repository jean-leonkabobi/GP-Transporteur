-- ============================================================
-- AGRÉGATEUR DE TRANSPORTEURS - SCHEMA SQL
-- PostgreSQL 15+ — séparateur ;;
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";;
CREATE EXTENSION IF NOT EXISTS "pg_trgm";;

-- ============================================================
-- ENUMS
-- ============================================================

DO $$ BEGIN
CREATE TYPE statut_commande AS ENUM (
        'EN_ATTENTE', 'CONFIRMEE', 'EN_COURS', 'LIVREE', 'ANNULEE', 'LITIGE'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;;

DO $$ BEGIN
CREATE TYPE statut_rendez_vous AS ENUM (
        'PLANIFIE', 'CONFIRME', 'EN_COURS', 'TERMINE', 'ANNULE', 'REPORTE'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;;

DO $$ BEGIN
CREATE TYPE type_rendez_vous AS ENUM (
        'ENLEVEMENT', 'LIVRAISON', 'INSPECTION', 'RETOUR'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;;

DO $$ BEGIN
CREATE TYPE role_utilisateur AS ENUM (
        'CLIENT', 'TRANSPORTEUR', 'ADMIN'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;;

DO $$ BEGIN
CREATE TYPE statut_suivi AS ENUM (
        'COLIS_PRIS_EN_CHARGE', 'EN_TRANSIT', 'EN_COURS_DE_LIVRAISON', 'LIVRE',
        'ECHEC_LIVRAISON', 'RETOUR_EN_COURS', 'RETOURNE'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS type_marchandise (
                                                id          BIGSERIAL    PRIMARY KEY,
                                                code        VARCHAR(50)  NOT NULL UNIQUE,
    libelle     VARCHAR(100) NOT NULL,
    description TEXT,
    actif       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
    );;

CREATE TABLE IF NOT EXISTS utilisateur (
                                           id           BIGSERIAL        PRIMARY KEY,
                                           email        VARCHAR(150)     NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255)     NOT NULL,
    nom          VARCHAR(100)     NOT NULL,
    prenom       VARCHAR(100)     NOT NULL,
    telephone    VARCHAR(20),
    role         role_utilisateur NOT NULL DEFAULT 'CLIENT',
    actif        BOOLEAN          NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP        NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP        NOT NULL DEFAULT NOW()
    );;

CREATE INDEX IF NOT EXISTS idx_utilisateur_email ON utilisateur(email);;
CREATE INDEX IF NOT EXISTS idx_utilisateur_role  ON utilisateur(role);;

CREATE TABLE IF NOT EXISTS client (
                                      id             BIGSERIAL    PRIMARY KEY,
                                      utilisateur_id BIGINT       NOT NULL UNIQUE REFERENCES utilisateur(id) ON DELETE CASCADE,
    adresse        VARCHAR(255),
    ville          VARCHAR(100),
    code_postal    VARCHAR(10),
    pays           VARCHAR(100) NOT NULL DEFAULT 'Sénégal',
    entreprise     VARCHAR(150),
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT NOW()
    );;

CREATE TABLE IF NOT EXISTS transporteur (
                                            id             BIGSERIAL    PRIMARY KEY,
                                            utilisateur_id BIGINT       NOT NULL UNIQUE REFERENCES utilisateur(id) ON DELETE CASCADE,
    numero_licence VARCHAR(100) NOT NULL UNIQUE,
    description    TEXT,
    logo_url       VARCHAR(255),
    adresse_siege  VARCHAR(255),
    ville_depart   VARCHAR(100) NOT NULL,
    note_moyenne   DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    nombre_avis    INT          NOT NULL DEFAULT 0,
    actif          BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT NOW()
    );;

CREATE INDEX IF NOT EXISTS idx_transporteur_ville_depart ON transporteur(ville_depart);;
CREATE INDEX IF NOT EXISTS idx_transporteur_actif        ON transporteur(actif);;

CREATE TABLE IF NOT EXISTS zone_desserte (
                                             id                BIGSERIAL    PRIMARY KEY,
                                             transporteur_id   BIGINT       NOT NULL REFERENCES transporteur(id) ON DELETE CASCADE,
    ville             VARCHAR(100) NOT NULL,
    pays              VARCHAR(100) NOT NULL DEFAULT 'Sénégal',
    delai_moyen_jours INT          NOT NULL DEFAULT 1,
    actif             BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE(transporteur_id, ville, pays)
    );;

CREATE INDEX IF NOT EXISTS idx_zone_desserte_ville        ON zone_desserte(ville);;
CREATE INDEX IF NOT EXISTS idx_zone_desserte_transporteur ON zone_desserte(transporteur_id);;

CREATE TABLE IF NOT EXISTS tarif (
                                     id                    BIGSERIAL     PRIMARY KEY,
                                     transporteur_id       BIGINT        NOT NULL REFERENCES transporteur(id) ON DELETE CASCADE,
    type_marchandise_id   BIGINT        NOT NULL REFERENCES type_marchandise(id),
    ville_depart          VARCHAR(100)  NOT NULL,
    ville_destination     VARCHAR(100)  NOT NULL,
    prix_par_kg           DECIMAL(10,2) NOT NULL,
    prix_minimum          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    prix_par_km           DECIMAL(10,2),
    delai_livraison_jours INT           NOT NULL DEFAULT 1,
    devise                VARCHAR(10)   NOT NULL DEFAULT 'XOF',
    actif                 BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at            TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMP     NOT NULL DEFAULT NOW()
    );;

CREATE INDEX IF NOT EXISTS idx_tarif_transporteur      ON tarif(transporteur_id);;
CREATE INDEX IF NOT EXISTS idx_tarif_ville_destination ON tarif(ville_destination);;
CREATE INDEX IF NOT EXISTS idx_tarif_type_marchandise  ON tarif(type_marchandise_id);;

CREATE TABLE IF NOT EXISTS commande (
                                        id                    BIGSERIAL       PRIMARY KEY,
                                        reference             VARCHAR(50)     NOT NULL UNIQUE,
    client_id             BIGINT          NOT NULL REFERENCES client(id),
    transporteur_id       BIGINT          NOT NULL REFERENCES transporteur(id),
    type_marchandise_id   BIGINT          NOT NULL REFERENCES type_marchandise(id),
    tarif_id              BIGINT          REFERENCES tarif(id),
    statut                statut_commande NOT NULL DEFAULT 'EN_ATTENTE',
    description_colis     TEXT,
    poids_kg              DECIMAL(10,3)   NOT NULL,
    volume_m3             DECIMAL(10,3),
    adresse_enlevement    VARCHAR(255)    NOT NULL,
    ville_enlevement      VARCHAR(100)    NOT NULL,
    adresse_livraison     VARCHAR(255)    NOT NULL,
    ville_livraison       VARCHAR(100)    NOT NULL,
    distance_km           DECIMAL(10,2),
    prix_total            DECIMAL(12,2)   NOT NULL,
    devise                VARCHAR(10)     NOT NULL DEFAULT 'XOF',
    notes                 TEXT,
    date_souhaitee        DATE,
    date_confirmation     TIMESTAMP,
    date_livraison_reelle TIMESTAMP,
    created_at            TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMP       NOT NULL DEFAULT NOW()
    );;

CREATE INDEX IF NOT EXISTS idx_commande_client       ON commande(client_id);;
CREATE INDEX IF NOT EXISTS idx_commande_transporteur ON commande(transporteur_id);;
CREATE INDEX IF NOT EXISTS idx_commande_statut       ON commande(statut);;
CREATE INDEX IF NOT EXISTS idx_commande_reference    ON commande(reference);;

CREATE TABLE IF NOT EXISTS rendez_vous (
                                           id          BIGSERIAL          PRIMARY KEY,
                                           commande_id BIGINT             NOT NULL REFERENCES commande(id) ON DELETE CASCADE,
    type_rdv    type_rendez_vous   NOT NULL,
    statut      statut_rendez_vous NOT NULL DEFAULT 'PLANIFIE',
    date_heure  TIMESTAMP          NOT NULL,
    adresse     VARCHAR(255)       NOT NULL,
    ville       VARCHAR(100)       NOT NULL,
    contact_nom VARCHAR(150),
    contact_tel VARCHAR(20),
    notes       TEXT,
    created_at  TIMESTAMP          NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP          NOT NULL DEFAULT NOW()
    );;

CREATE INDEX IF NOT EXISTS idx_rdv_commande ON rendez_vous(commande_id);;
CREATE INDEX IF NOT EXISTS idx_rdv_date     ON rendez_vous(date_heure);;
CREATE INDEX IF NOT EXISTS idx_rdv_statut   ON rendez_vous(statut);;

CREATE TABLE IF NOT EXISTS suivi_livraison (
                                               id           BIGSERIAL    PRIMARY KEY,
                                               commande_id  BIGINT       NOT NULL REFERENCES commande(id) ON DELETE CASCADE,
    statut       statut_suivi NOT NULL,
    localisation VARCHAR(255),
    latitude     DECIMAL(10,7),
    longitude    DECIMAL(10,7),
    description  TEXT,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
    );;

CREATE INDEX IF NOT EXISTS idx_suivi_commande ON suivi_livraison(commande_id);;
CREATE INDEX IF NOT EXISTS idx_suivi_statut   ON suivi_livraison(statut);;

CREATE TABLE IF NOT EXISTS avis (
                                    id              BIGSERIAL PRIMARY KEY,
                                    commande_id     BIGINT    NOT NULL UNIQUE REFERENCES commande(id),
    client_id       BIGINT    NOT NULL REFERENCES client(id),
    transporteur_id BIGINT    NOT NULL REFERENCES transporteur(id),
    note            SMALLINT  NOT NULL CHECK (note BETWEEN 1 AND 5),
    commentaire     TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
    );;

CREATE INDEX IF NOT EXISTS idx_avis_transporteur ON avis(transporteur_id);;
CREATE INDEX IF NOT EXISTS idx_avis_client        ON avis(client_id);;

-- ============================================================
-- FONCTIONS ET TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;;

DO $$
DECLARE
t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['utilisateur','client','transporteur','tarif','commande','rendez_vous','type_marchandise']
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS trg_update_%I ON %I;
            CREATE TRIGGER trg_update_%I
            BEFORE UPDATE ON %I
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
END LOOP;
END $$;;

CREATE OR REPLACE FUNCTION recalcul_note_transporteur()
RETURNS TRIGGER AS $$
BEGIN
UPDATE transporteur
SET note_moyenne = COALESCE((SELECT AVG(note)   FROM avis WHERE transporteur_id = NEW.transporteur_id), 0),
    nombre_avis  =         (SELECT COUNT(*)     FROM avis WHERE transporteur_id = NEW.transporteur_id)
WHERE id = NEW.transporteur_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;;

DROP TRIGGER IF EXISTS trg_note_transporteur ON avis;;
CREATE TRIGGER trg_note_transporteur
    AFTER INSERT OR UPDATE ON avis
                        FOR EACH ROW EXECUTE FUNCTION recalcul_note_transporteur();;