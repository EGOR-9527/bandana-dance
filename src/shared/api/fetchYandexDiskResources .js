import axios from "axios";

const baseURL = "https://cloud-api.yandex.net/v1/disk/public/resources";

const DEFAULT_HEADERS = {
  Referer: "https://bandana-dance.ru/",
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36",
  Accept: "*/*",
};

export const fetchFiles = async (publicKey) => {
  try {
    // Получаем список файлов из публичной папки
    const res = await axios.get(baseURL, {
      params: {
        public_key: publicKey,
        path: "",
      },
      headers: DEFAULT_HEADERS,
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
            headers: DEFAULT_HEADERS,
            responseType: "stream",
          }
        );

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

  return files
    .filter((f) => f.mime_type?.startsWith("image/"))
    .map((file) => file.download_url);
};

// Функция, возвращающая сразу только видео с download_url
export const fetchVideo = async () => {
  const publicKey = "https://disk.yandex.ru/d/3NzyGruUbtNyiQ";
  const files = await fetchFiles(publicKey);

  return files
    .filter((f) => f.mime_type?.startsWith("video/"))
    .map((file) => file.download_url);
};
