// types/transporteurTypes.ts
export interface Transporteur {
  id: string;
  nom: string;
  photo: string;
  note: number;
  nbAvis: number;
  prix: number;
  delai: string;
  zones: string[];
  disponible: boolean;
  vehicule: string;
  telephone: string;
  lat: number;
  lng: number;
}

export interface RechercheFilters {
  destination: string;
  date?: string;
  type?: string;
  poids?: string;
  volume?: string;
}