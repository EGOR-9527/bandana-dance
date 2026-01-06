import axios from "axios";

const TEST = false;
const API_BASE = TEST ? "http://localhost:5000" : "https://bandana-dance.ru";

// Конфигурация кэширования
const CACHE_CONFIG = {
  EVENTS_TTL: 5 * 60 * 1000, // 5 минут
  GALLERY_TTL: 5 * 60 * 1000,
  TEAMS_TTL: 10 * 60 * 1000, // 10 минут
  VIDEO_TTL: 5 * 60 * 1000,
};

// Хелпер для кэширования в localStorage
const cacheHelper = {
  get(key) {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Проверяем не устарели ли данные
      if (now - timestamp < CACHE_CONFIG[key.split(':')[0].toUpperCase() + '_TTL']) {
        return data;
      }
      
      // Удаляем устаревшие данные
      localStorage.removeItem(key);
      return null;
    } catch (err) {
      console.warn('Ошибка чтения кэша:', err);
      return null;
    }
  },
  
  set(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('Ошибка записи в кэш:', err);
    }
  },
  
  clear(pattern) {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(pattern)) {
        localStorage.removeItem(key);
      }
    });
  }
};

// Создаем экземпляр axios с улучшенными настройками
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000, // Увеличили таймаут для мобильных сетей
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    'Accept-Encoding': 'gzip, deflate, br' // Поддержка сжатия
  },
  validateStatus: (status) => status < 500,
  // Настройки для мобильных сетей
  maxRedirects: 3,
  maxContentLength: 50 * 1024 * 1024, // 50MB
});

// Интерцептор для добавления заголовка Origin
api.interceptors.request.use(config => {
  if (!TEST) {
    config.headers['Origin'] = 'https://bandana-dance.ru';
  }
  return config;
});

class ApiService {
  constructor() {
    this.cacheEnabled = !TEST && typeof localStorage !== 'undefined';
  }

  // Общая функция для GET запросов с кэшированием
  async getWithCache(endpoint, cacheKey, params = {}) {
    const fullCacheKey = `api:${cacheKey}:${JSON.stringify(params)}`;
    
    // Пробуем получить из кэша
    if (this.cacheEnabled) {
      const cached = cacheHelper.get(fullCacheKey);
      if (cached) {
        console.log(`📦 ${cacheKey} from cache`);
        return cached;
      }
    }

    try {
      const response = await api.get(endpoint, { params });
      
      if (response.data.success) {
        const result = {
          ...response.data,
          cached: false,
          timestamp: Date.now()
        };
        
        // Сохраняем в кэш
        if (this.cacheEnabled) {
          cacheHelper.set(fullCacheKey, result);
        }
        
        return result;
      }
      
      return response.data;
    } catch (err) {
      console.warn(`Ошибка запроса ${endpoint}:`, err.message);
      
      // Пробуем вернуть устаревшие данные из кэша если есть
      if (this.cacheEnabled) {
        const cached = cacheHelper.get(fullCacheKey);
        if (cached) {
          console.log(`⚠️ ${cacheKey} from stale cache`);
          return { ...cached, stale: true };
        }
      }
      
      return {
        success: false,
        data: [],
        message: "Сервер временно недоступен. Попробуйте позже.",
        error: err.message
      };
    }
  }

  async getEvents() {
    return this.getWithCache("/api/events", "events");
  }

  async getGalleryFilters() {
    return this.getWithCache("/api/gallery/filters", "gallery_filters");
  }

  async getGallery(page = 1, limit = 24, filter = "Все") {
    return this.getWithCache("/api/gallery", "gallery", {
      page,
      limit,
      filter
    });
  }

  async getTeams() {
    return this.getWithCache("/api/teams", "teams");
  }

  async getVideo() {
    return this.getWithCache("/api/video", "video");
  }

  async postContact(data) {
    try {
      const response = await api.post("/api/contact", data);
      return response.data;
    } catch (err) {
      console.warn("Ошибка отправки формы:", err.message);
      
      // Сохраняем форму локально если сервер недоступен
      if (this.cacheEnabled) {
        const pendingForms = JSON.parse(localStorage.getItem('pending_forms') || '[]');
        pendingForms.push({
          data,
          timestamp: Date.now(),
          attempts: 0
        });
        localStorage.setItem('pending_forms', JSON.stringify(pendingForms));
        
        return {
          success: false,
          message: "Форма сохранена локально. Попробуйте отправить позже.",
          savedLocally: true
        };
      }
      
      return { 
        success: false,
        message: "Ошибка отправки формы"
      };
    }
  }

  // Очистка кэша
  clearCache() {
    if (this.cacheEnabled) {
      cacheHelper.clear('api:');
      console.log('🗑️ Кэш очищен');
    }
  }

  // Очистка кэша по типу
  clearCacheByType(type) {
    if (this.cacheEnabled) {
      cacheHelper.clear(`api:${type}`);
    }
  }
}

// Создаем синглтон
const apiService = new ApiService();

// Периодическая очистка устаревшего кэша
if (typeof window !== 'undefined') {
  setInterval(() => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('api:')) {
        try {
          const cached = JSON.parse(localStorage.getItem(key));
          if (Date.now() - cached.timestamp > 24 * 60 * 60 * 1000) { // 24 часа
            localStorage.removeItem(key);
          }
        } catch (e) {}
      }
    });
  }, 60 * 60 * 1000); // Каждый час
}

export default apiService;