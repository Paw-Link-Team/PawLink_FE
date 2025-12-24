import api from "./api";

export const uploadProfileImage = async (file: File) => {
  const fd = new FormData();
  fd.append("image", file); // ⭐ @RequestPart("image")와 정확히 일치

  const res = await api.patch("/image/update", fd);
  return res.data;
};

export const deleteProfileImage = async () => {
  const res = await api.delete("/image/delete");
  return res.data;
};
