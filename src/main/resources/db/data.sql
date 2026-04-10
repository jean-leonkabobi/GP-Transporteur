-- Types de marchandises
INSERT INTO type_marchandise (code, libelle, description) VALUES
                                                              ('ALIMENTAIRE',    'Produits alimentaires',     'Denrées alimentaires, produits frais ou secs'),
                                                              ('ELECTRONIQUE',   'Électronique et high-tech', 'Appareils électroniques, informatique'),
                                                              ('TEXTILE',        'Textile et habillement',    'Vêtements, tissus, accessoires'),
                                                              ('MEUBLE',         'Meubles et équipements',    'Mobilier, équipements de maison'),
                                                              ('PHARMACEUTIQUE', 'Produits pharmaceutiques',  'Médicaments et produits de santé'),
                                                              ('INDUSTRIEL',     'Matériaux industriels',     'Matériaux de construction, industriels'),
                                                              ('VEHICULE',       'Véhicules et pièces',       'Automobiles, motos, pièces détachées'),
                                                              ('DIVERS',         'Marchandises diverses',     'Tout autre type de marchandise')
    ON CONFLICT (code) DO NOTHING;;

-- Utilisateur Admin
INSERT INTO utilisateur (email, mot_de_passe, nom, prenom, telephone, role) VALUES
    ('admin@agregateur.sn', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EHs', 'Admin', 'Système', '+221770000000', 'ADMIN')
    ON CONFLICT (email) DO NOTHING;;

-- Transporteurs (utilisateurs)
INSERT INTO utilisateur (email, mot_de_passe, nom, prenom, telephone, role) VALUES
                                                                                ('senegal.express@transport.sn',    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EHs', 'Express',    'Sénégal', '+221771234567', 'TRANSPORTEUR'),
                                                                                ('dakar.cargo@transport.sn',        '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EHs', 'Cargo',      'Dakar',   '+221772345678', 'TRANSPORTEUR'),
                                                                                ('afrique.logistique@transport.sn', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EHs', 'Logistique', 'Afrique', '+221773456789', 'TRANSPORTEUR')
    ON CONFLICT (email) DO NOTHING;;

-- Clients (utilisateurs)
INSERT INTO utilisateur (email, mot_de_passe, nom, prenom, telephone, role) VALUES
                                                                                ('client1@mail.sn', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EHs', 'Diallo', 'Mamadou',  '+221774567890', 'CLIENT'),
                                                                                ('client2@mail.sn', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EHs', 'Ndiaye', 'Fatou',    '+221775678901', 'CLIENT'),
                                                                                ('client3@mail.sn', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EHs', 'Sow',    'Ibrahima', '+221776789012', 'CLIENT')
    ON CONFLICT (email) DO NOTHING;;

-- Profils clients
INSERT INTO client (utilisateur_id, adresse, ville, code_postal, pays, entreprise)
SELECT u.id, 'Rue 10 x 23, Médina', 'Dakar', '10000', 'Sénégal', 'Diallo Commerce'
FROM utilisateur u WHERE u.email = 'client1@mail.sn'
    ON CONFLICT (utilisateur_id) DO NOTHING;;

INSERT INTO client (utilisateur_id, adresse, ville, code_postal, pays)
SELECT u.id, 'HLM Grand Yoff', 'Dakar', '10200', 'Sénégal'
FROM utilisateur u WHERE u.email = 'client2@mail.sn'
    ON CONFLICT (utilisateur_id) DO NOTHING;;

INSERT INTO client (utilisateur_id, adresse, ville, code_postal, pays, entreprise)
SELECT u.id, 'Zone industrielle', 'Thiès', '21000', 'Sénégal', 'Sow Industries'
FROM utilisateur u WHERE u.email = 'client3@mail.sn'
    ON CONFLICT (utilisateur_id) DO NOTHING;;

-- Profils transporteurs
INSERT INTO transporteur (utilisateur_id, numero_licence, description, ville_depart, actif)
SELECT u.id, 'LIC-SN-2024-001', 'Transport express toutes destinations au Sénégal. Spécialiste du fret rapide.', 'Dakar', TRUE
FROM utilisateur u WHERE u.email = 'senegal.express@transport.sn'
    ON CONFLICT (utilisateur_id) DO NOTHING;;

INSERT INTO transporteur (utilisateur_id, numero_licence, description, ville_depart, actif)
SELECT u.id, 'LIC-SN-2024-002', 'Cargo lourd et conteneurs. Liaisons régionales et internationales.', 'Dakar', TRUE
FROM utilisateur u WHERE u.email = 'dakar.cargo@transport.sn'
    ON CONFLICT (utilisateur_id) DO NOTHING;;

INSERT INTO transporteur (utilisateur_id, numero_licence, description, ville_depart, actif)
SELECT u.id, 'LIC-SN-2024-003', 'Logistique intégrée - entrepôt, transport, livraison last-mile.', 'Thiès', TRUE
FROM utilisateur u WHERE u.email = 'afrique.logistique@transport.sn'
    ON CONFLICT (utilisateur_id) DO NOTHING;;

-- Zones de desserte — Sénégal Express
INSERT INTO zone_desserte (transporteur_id, ville, pays, delai_moyen_jours)
SELECT t.id, z.ville, z.pays, z.delai
FROM transporteur t
         JOIN utilisateur u ON t.utilisateur_id = u.id,
     (VALUES
          ('Thiès',      'Sénégal', 1),
          ('Saint-Louis','Sénégal', 2),
          ('Ziguinchor', 'Sénégal', 2),
          ('Touba',      'Sénégal', 1),
          ('Kaolack',    'Sénégal', 1),
          ('Tambacounda','Sénégal', 3),
          ('Kolda',      'Sénégal', 3),
          ('Dakar',      'Sénégal', 1)
     ) AS z(ville, pays, delai)
WHERE u.email = 'senegal.express@transport.sn'
    ON CONFLICT (transporteur_id, ville, pays) DO NOTHING;;

-- Zones de desserte — Dakar Cargo
INSERT INTO zone_desserte (transporteur_id, ville, pays, delai_moyen_jours)
SELECT t.id, z.ville, z.pays, z.delai
FROM transporteur t
         JOIN utilisateur u ON t.utilisateur_id = u.id,
     (VALUES
          ('Dakar',   'Sénégal',        1),
          ('Thiès',   'Sénégal',        1),
          ('Bamako',  'Mali',           5),
          ('Conakry', 'Guinée',         6),
          ('Abidjan', 'Côte d''Ivoire', 7)
     ) AS z(ville, pays, delai)
WHERE u.email = 'dakar.cargo@transport.sn'
    ON CONFLICT (transporteur_id, ville, pays) DO NOTHING;;

-- Tarifs Sénégal Express
INSERT INTO tarif (transporteur_id, type_marchandise_id, ville_depart, ville_destination, prix_par_kg, prix_minimum, delai_livraison_jours, devise)
SELECT t.id, tm.id, 'Dakar', 'Thiès', 150.00, 2000.00, 1, 'XOF'
FROM transporteur t JOIN utilisateur u ON t.utilisateur_id = u.id, type_marchandise tm
WHERE u.email = 'senegal.express@transport.sn' AND tm.code = 'DIVERS'
    ON CONFLICT DO NOTHING;;

INSERT INTO tarif (transporteur_id, type_marchandise_id, ville_depart, ville_destination, prix_par_kg, prix_minimum, delai_livraison_jours, devise)
SELECT t.id, tm.id, 'Dakar', 'Saint-Louis', 200.00, 3000.00, 2, 'XOF'
FROM transporteur t JOIN utilisateur u ON t.utilisateur_id = u.id, type_marchandise tm
WHERE u.email = 'senegal.express@transport.sn' AND tm.code = 'DIVERS'
    ON CONFLICT DO NOTHING;;

INSERT INTO tarif (transporteur_id, type_marchandise_id, ville_depart, ville_destination, prix_par_kg, prix_minimum, delai_livraison_jours, devise)
SELECT t.id, tm.id, 'Dakar', 'Ziguinchor', 350.00, 5000.00, 2, 'XOF'
FROM transporteur t JOIN utilisateur u ON t.utilisateur_id = u.id, type_marchandise tm
WHERE u.email = 'senegal.express@transport.sn' AND tm.code = 'DIVERS'
    ON CONFLICT DO NOTHING;;

-- Tarifs Dakar Cargo
INSERT INTO tarif (transporteur_id, type_marchandise_id, ville_depart, ville_destination, prix_par_kg, prix_minimum, delai_livraison_jours, devise)
SELECT t.id, tm.id, 'Dakar', 'Bamako', 800.00, 50000.00, 5, 'XOF'
FROM transporteur t JOIN utilisateur u ON t.utilisateur_id = u.id, type_marchandise tm
WHERE u.email = 'dakar.cargo@transport.sn' AND tm.code = 'INDUSTRIEL'
    ON CONFLICT DO NOTHING;;