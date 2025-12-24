import api from "./api";

export type UserProfileUpdateValue = {
  nickname: string;
};

export const updateUserProfile = async (
  value: UserProfileUpdateValue,
  imageFile: File | null
) => {
  const formData = new FormData();

  // JSON → Blob (⭐ 필수)
  formData.append(
    "data",
    new Blob([JSON.stringify(value)], {
      type: "application/json",
    })
  );

  if (imageFile) {
    formData.append("image", imageFile);
  }

  await api.put("/api/user/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
