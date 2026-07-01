import axios from 'axios';

class ApiService {
  // Private static instance variable to hold Singleton
  static #instance = null;
  
  constructor() {
    if (ApiService.#instance) {
      throw new Error("Use ApiService.getInstance() instead of direct instantiation.");
    }

    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Automatically attach JWT Bearer token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Global error filtering & expired auth handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          window.location.href = "/signin";
        }
        return Promise.reject(this.#handleError(error));
      }
    );
  }

  // Global access point for the singleton instance
  static getInstance() {
    if (!ApiService.#instance) {
      ApiService.#instance = new ApiService();
    }
    return ApiService.#instance;
  }

  #handleError(error) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: 500,
      message: 'An unexpected deep sea engine telemetry error occurred'
    };
  }

  // Identity & personal endpoints

  async login(credentials) {
    const response = await this.api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  }

  async confirmPassword(data) {
    const response = await this.api.post('/auth/confirm', data);
    return response.data;
  }

  async inviteResearcher(data) {
    const response = await this.api.post('/users/invite', data);
    return response.data;
  }

  async getDashboard() {
    const response = await this.api.get('/dashboard');
    return response.data;
  }

  async fetchResearchers(page = 0, size = 6) {
    // Aligned with UserController mapping path: /api/v1/users/researchers
    const response = await this.api.get('/users/researchers', { params: { page, size } });
    return response.data;
  }

  async fetchUserProfile() {
    const response = await this.api.get(`/users/me`);
    return response.data;
  }

  async updateUserProfile(updateDto) {
    const response = await this.api.put('/users/me', updateDto);
    return response.data;
  }

  async deleteUser(id) {
    const response = await this.api.delete(`/users/${id}`);
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  // Missions endpoints

  async getMissions(page = 0, size = 10) {
    const response = await this.api.get('/missions', { params: { page, size } });
    return response.data;
  }

  async searchMissions(query, page = 0, size = 10) {
    // Standardizes query parsing fallback matching MissionController schema bindings
    const response = await this.api.get('/missions', { params: { search: query, page, size } });
    return response.data;
  }

  async getMission(id) {
    const response = await this.api.get(`/missions/${id}`);
    return response.data;
  }

  async createMission(mission) {
    const response = await this.api.post('/missions', mission);
    return response.data;
  }

  async updateMission(id, mission) {
    const response = await this.api.put(`/missions/${id}`, mission);
    return response.data;
  }

  // Samples endpoints

  async getSamples(page = 0, size = 15) {
    const response = await this.api.get('/samples', { params: { page, size } });
    return response.data;
  }

  async createSample(sample) {
    const response = await this.api.post('/samples', sample);
    return response.data;
  }

  async getSampleById(id) {
    const response = await this.api.get(`/samples/${id}`);
    return response.data;
  }

  // Species endpoints

  async getSpecies(page = 0, size = 10) {
    const response = await this.api.get('/species', { params: { page, size } });
    return response.data;
  }

  async createSpecies(species) {
    const response = await this.api.post('/species', species);
    return response.data;
  }

  async getSpeciesById(id) {
    const response = await this.api.get(`/species/${id}`);
    return response.data;
  }

  // Research area endpoints

  async getResearchAreas(page = 0, size = 12, query = '') {
    const response = await this.api.get(`/areas`, {
      params: { page, size, search: query }
    });
    return response.data; 
  }

  async createResearchArea(newPayload) {
    const response = await this.api.post(`/areas`, newPayload);
    return response.data;
  }

  async getResearchAreaById(id) {
    const response = await this.api.get(`/areas/${id}`);
    return response.data;
  }

  async getResearchAreasList() {
    const response = await this.api.get('/areas'); 
    return response.data;
  }

  // Media uploading endpoint

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.api.post("/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    // Returns string payload (URL) context derived directly from backend controller layer
    return response.data; 
  }
}

// Export a single pre-instantiated object of the class
export const apiService = ApiService.getInstance();