import axios from "axios";

const API_BASE = "https://bandana-dance.ru";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  validateStatus: (status) => status < 500,
});

class ApiService {
  async getEvents() {
    try {
      const response = await api.get("/api/events");
      return response.data;
    } catch (err) {
      console.warn(
        "События недоступны (возможно, атака или лимит):",
        err.message
      );
      return {
        success: false,
        data: [],
        message: "Сервер временно недоступен. Попробуйте позже.",
      };
    }
  }

  async getGalleryFilters() {
    try {
      const response = await api.get("/api/gallery-filters");
      return response.data;
    } catch (err) {
      console.warn("Фильтры галереи не загрузились:", err.message);
      return { success: true, data: ["Все"] };
    }
  }

  async getGallery() {
    try {
      const response = await api.get("/api/gallery");
      return response.data;
    } catch (err) {
      if (err.response?.status === 429) {
        console.warn("Сработало ограничение запросов (rate limit)");
        return {
          success: false,
          data: [],
          message: "Слишком много запросов. Защита от DDoS сработала.",
          rateLimited: true,
        };
      }
      console.warn("Галерея недоступна:", err.message);
      return { success: false, data: [] };
    }
  }

  async getTeams() {
    try {
      const response = await api.get("/api/teams");
      return response.data;
    } catch (err) {
      console.warn("Видео недоступны:", err.message);
      return { success: false, data: [] };
    }
  }

  async getVideo() {
    try {
      const response = await api.get("/api/video");
      return response.data;
    } catch (err) {
      console.warn("Видео недоступны:", err.message);
      return { success: false, data: [] };
    }
  }

  async postContact(data) {
    try {
      const response = await api.post("/api/contact", data);
      return response.data;
    } catch (err) {
      console.warn("Ошибка отправки формы:", err.message);
      return { success: false };
    }
  }
}

export default new ApiService();
