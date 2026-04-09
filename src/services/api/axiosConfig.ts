// services/api/axiosConfig.ts
import { API_BASE_URL } from './apiRoutes';

// Types d'erreur API
export interface ApiErrorResponse {
  message: string;
  code?: string;
  field?: string;
  timestamp?: string;
}

// Configuration de base
const getHeaders = () => {
  const token = localStorage.getItem('gp_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Fonction pour gérer les erreurs
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('gp_auth_token');
      localStorage.removeItem('gp_auth_user');
      window.location.href = '/login';
    }
    
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Erreur ${response.status}: ${response.statusText}`;
    
    throw {
      message: errorMessage,
      status: response.status,
      field: errorData.field,
    };
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

// Helper pour les requêtes GET
export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const queryString = params 
    ? '?' + new URLSearchParams(params as Record<string, string>).toString()
    : '';
  const response = await fetch(`${API_BASE_URL}${url}${queryString}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
}

// Helper pour les requêtes POST
export async function post<T>(url: string, data?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  });
  return handleResponse(response);
}

// Helper pour les requêtes PUT
export async function put<T>(url: string, data?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  });
  return handleResponse(response);
}

// Helper pour les requêtes PATCH
export async function patch<T>(url: string, data?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  });
  return handleResponse(response);
}

// Helper pour les requêtes DELETE
export async function del<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(response);
}

// Export d'un client factice pour la compatibilité
export const apiClient = {
  get,
  post,
  put,
  patch,
  delete: del,
};