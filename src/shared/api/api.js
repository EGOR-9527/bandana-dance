// api.js
import axios from "axios";

const API_BASE = "https://bandana-dance.ru";
class ApiService {
  async getEvents() {
    try {
      const response = await axios.get(`${API_BASE}/api/events`);
      console.log(response);
      return response.data;
    } catch (err) {
      console.error("Ошибка при загрузке событий:", err.message);
      return {
        success: false,
        data: [],
        message: "Не удалось загрузить события",
      };
    }
  }

  async getGalleryFilters() {
    try {
      const response = await axios.get(`${API_BASE}/api/gallery-filters`);
      return response.data;
    } catch (err) {
      console.error("Ошибка загрузки фильтров галереи:", err.message);
      return { success: false, data: ["Все"] };
    }
  }

  async getGallery() {
    try {
      const response = await axios.get(`${API_BASE}/api/gallery`);
      return response.data;
    } catch (err) {
      console.error("Ошибка галереи:", err.message);
      return { success: false, data: [] };
    }
  }

  async getVideo() {
    try {
      const response = await axios.get(`${API_BASE}/api/video`);
      return response.data;
    } catch (err) {
      console.error("Ошибка видео:", err.message);
      return { success: false, data: [] };
    }
  }
}
export default new ApiService();
