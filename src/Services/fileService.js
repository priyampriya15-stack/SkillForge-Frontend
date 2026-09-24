import API from "./api";

// ===============================
// UPLOAD FILES
// ===============================

export const uploadFiles = async (files) => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await API.post(
      "/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;

  }catch (error) {
  console.log("FILE UPLOAD ERROR:", error);
  console.log("SERVER RESPONSE:", error.response?.data);

  throw (
    error.response?.data || {
      message: "File upload failed",
    }
  );
}
};