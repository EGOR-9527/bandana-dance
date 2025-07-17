import axios from "axios";

// Папка с изображениями
const IMG_PUBLIC_KEY = "https://disk.yandex.ru/d/FPF_X0qkRTzKxA";
// Папка с видео
const VIDEO_PUBLIC_KEY = "https://disk.yandex.ru/d/3NzyGruUbtNyiQ";

// Загрузка изображений через превью
export const fetchImg = async () => {
  try {
    const response = await axios.get(
      "https://cloud-api.yandex.net/v1/disk/public/resources",
      {
        params: {
          public_key: IMG_PUBLIC_KEY,
          path: "",
          preview_size: "XL", // можно менять на S, M, L
        },
      }
    );

    const files = response.data._embedded?.items || [];

    const imgs = files.filter(
      (file) => file.mime_type && file.mime_type.startsWith("image/")
    );

    // Берем превьюшки (без 403)
    const imageLinks = imgs.map((el) => el.preview);

    return imageLinks;
  } catch (err) {
    console.error("Ошибка загрузки изображений:", err.message);
    return [];
  }
};

// Загрузка видео через download API
export const fetchVideo = async () => {
  try {
    const response = await axios.get(
      "https://cloud-api.yandex.net/v1/disk/public/resources",
      {
        params: {
          public_key: VIDEO_PUBLIC_KEY,
          path: "",
        },
      }
    );

    const files = response.data._embedded?.items || [];

    const videos = files.filter(
      (file) => file.mime_type && file.mime_type.startsWith("video/")
    );

    // Для каждого видео получаем рабочую download ссылку
    const downloadLinks = await Promise.all(
      videos.map(async (video) => {
        try {
          const downloadRes = await axios.get(
            "https://cloud-api.yandex.net/v1/disk/public/resources/download",
            {
              params: {
                public_key: VIDEO_PUBLIC_KEY,
                path: video.path,
              },
            }
          );

          return downloadRes.data.href;
        } catch (err) {
          console.warn(`Не удалось получить видео "${video.name}":`, err.message);
          return null;
        }
      })
    );

    // Отфильтровываем null
    return downloadLinks.filter(Boolean);
  } catch (err) {
    console.error("Ошибка загрузки видео:", err.message);
    return [];
  }
};
