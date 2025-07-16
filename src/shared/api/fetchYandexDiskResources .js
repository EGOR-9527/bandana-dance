import axios from "axios";

export const fetchImg = async () => {
  try {
    const response = await axios.get(
      "https://cloud-api.yandex.net/v1/disk/public/resources",
      {
        params: {
          public_key: "https://disk.yandex.ru/d/FPF_X0qkRTzKxA",
          path: "",
        },
      }
    );

    const files = response.data._embedded?.items || [];

    const imgs = files.filter(
      (file) => file.mime_type && file.mime_type.startsWith("image/")
    );

    const imageLinks = imgs.map((el) => el.file);

    return imageLinks;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchVideo = async () => {
  try {
    const response = await axios.get(
      "https://cloud-api.yandex.net/v1/disk/public/resources",
      {
        params: {
          public_key: "https://disk.yandex.ru/d/3NzyGruUbtNyiQ",
          path: "",
        },
      }
    );

    const files = response.data._embedded?.items || [];

    const vids = files.filter(
      (file) => file.mime_type && file.mime_type.startsWith("video/")
    );

    const videoLinks = vids.map((el) => el.file);

    return videoLinks;
  } catch (err) {
    console.error(err);
    return null;
  }
};
