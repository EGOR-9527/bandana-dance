import axios from "axios";

const baseURL = "https://cloud-api.yandex.net/v1/disk/public/resources";

export const fetchFiles = async (publicKey) => {
  try {
    // Получаем список файлов из публичной папки
    const res = await axios.get(baseURL, {
      params: {
        public_key: publicKey,
        path: "",
      },
    });

    const items = res.data._embedded?.items || [];

    // Запрашиваем ссылку на скачивание для каждого файла
    const filesWithDownloadLinks = await Promise.all(
      items.map(async (item) => {
        const downloadRes = await axios.get(
          "https://cloud-api.yandex.net/v1/disk/public/resources/download",
          {
            params: {
              public_key: publicKey,
              path: item.path,
            },
          }
        );

        // Возвращаем объект с ключами, включая строку download_url
        return {
          ...item,
          download_url: downloadRes.data.href,
        };
      })
    );

    return filesWithDownloadLinks;
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
};

// Функция, возвращающая сразу только изображения с download_url
export const fetchImg = async () => {
  const publicKey = "https://disk.yandex.ru/d/FPF_X0qkRTzKxA";
  const files = await fetchFiles(publicKey);

  const urls = files
    .filter((f) => f.mime_type?.startsWith("image/"))
    .map((file) => file.download_url);
  return urls;
};

// Функция, возвращающая сразу только видео с download_url
export const fetchVideo = async () => {
  const publicKey = "https://disk.yandex.ru/d/3NzyGruUbtNyiQ";
  const files = await fetchFiles(publicKey);
  const urls = files
    .filter((f) => f.mime_type?.startsWith("video/"))
    .map((file) => file.download_url);
  return urls;
};
