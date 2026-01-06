import axios from "axios";

const TEST = false;
const API_BASE = TEST ? "http://localhost:5000" : "https://bandana-dance.ru";

// УБРАТЬ неправильные заголовки из axios конфигурации!
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// УБРАТЬ интерцептор с Origin!
// api.interceptors.request.use(config => {
//   if (!TEST) {
//     config.headers['Origin'] = 'https://bandana-dance.ru';
//   }
//   return config;
// });

class ApiService {
  async getEvents() {
    try {
      const response = await api.get("/api/events");
      return response.data;
    } catch (err) {
      console.warn("Ошибка загрузки событий:", err.message);
      return {
        success: false,
        data: [],
        message: "Сервер временно недоступен"
      };
    }
  }

  async getGalleryFilters() {
    try {
      const response = await api.get("/api/gallery/filters");
      return response.data;
    } catch (err) {
      console.warn("Ошибка фильтров:", err.message);
      return { success: true, data: ["Все"] };
    }
  }

  async getGallery(page = 1, limit = 24, filter = "Все") {
    try {
      const response = await api.get(`/api/gallery`, {
        params: { page, limit, filter }
      });
      return response.data;
    } catch (err) {
      console.warn("Ошибка галереи:", err.message);
      return { success: false, data: [] };
    }
  }

  async getTeams() {
    try {
      const response = await api.get("/api/teams");
      return response.data;
    } catch (err) {
      console.warn("Ошибка команд:", err.message);
      return { success: false, data: [] };
    }
  }

  async getVideo() {
    try {
      const response = await api.get("/api/video");
      return response.data;
    } catch (err) {
      console.warn("Ошибка видео:", err.message);
      return { success: false, data: [] };
    }
  }

  async postContact(data) {
    try {
      const response = await api.post("/api/contact", data);
      return response.data;
    } catch (err) {
      console.warn("Ошибка формы:", err.message);
      return { success: false };
    }
  }
}

export default new ApiService();