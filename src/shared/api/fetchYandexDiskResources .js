import axios from "axios";

// Конфигурация API Яндекс.Диска
const YANDEX_DISK_API = {
  baseURL: "https://cloud-api.yandex.net/v1/disk/public/resources",
  timeout: 10000, // 10 секунд таймаут
};

// Создаем экземпляр axios с настройками
const api = axios.create(YANDEX_DISK_API);

/**
 * Получает список файлов из публичной папки Яндекс.Диска
 * @param {string} publicKey - Публичная ссылка на папку
 * @returns {Promise<Array>} - Массив файлов с метаданными и ссылками для скачивания
 */
export const fetchFiles = async (publicKey) => {
  try {
    // 1. Получаем список файлов
    const { data } = await api.get("", {
      params: {
        public_key: publicKey,
        path: "",
      },
    });

    const items = data._embedded?.items || [];

    // 2. Параллельно получаем ссылки для скачивания
    const filesWithLinks = await Promise.all(
      items.map(async (item) => {
        try {
          const { data: downloadData } = await api.get("/download", {
            params: {
              public_key: publicKey,
              path: item.path,
            },
          });
          
          return {
            ...item,
            download_url: downloadData.href,
          };
        } catch (error) {
          console.error(`Error getting download link for ${item.name}:`, error);
          return {
            ...item,
            download_url: null,
            error: "Failed to get download link"
          };
        }
      })
    );

    return filesWithLinks.filter(file => file.download_url); // Фильтруем файлы с ошибками

  } catch (error) {
    console.error("Error fetching files from Yandex.Disk:", {
      message: error.message,
      response: error.response?.data,
    });
    return [];
  }
};

/**
 * Получает ссылки только на изображения из публичной папки
 * @returns {Promise<string[]>} - Массив URL изображений
 */
export const fetchImg = async () => {
  const publicKey = "https://disk.yandex.ru/d/FPF_X0qkRTzKxA";
  const files = await fetchFiles(publicKey);
  
  return files
    .filter(file => file.mime_type?.startsWith("image/"))
    .map(file => file.download_url)
    .filter(Boolean); // Удаляем возможные null/undefined
};

/**
 * Получает ссылки только на видео из публичной папки
 * @returns {Promise<string[]>} - Массив URL видео
 */
export const fetchVideo = async () => {
  const publicKey = "https://disk.yandex.ru/d/3NzyGruUbtNyiQ";
  const files = await fetchFiles(publicKey);
  
  return files
    .filter(file => file.mime_type?.startsWith("video/"))
    .map(file => file.download_url)
    .filter(Boolean);
};

// Дополнительные утилиты
export const YandexDiskAPI = {
  fetchFiles,
  fetchImg,
  fetchVideo,
};