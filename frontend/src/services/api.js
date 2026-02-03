import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =========================
   Gallery APIs
========================= */

export const getGallery = async (type) => {
  const params = type ? { type } : {};
  const res = await API.get("/generate/gallery", { params });
  return res.data;
};

export const deleteGeneration = async (id) => {
  const res = await API.delete(`/generate/gallery/${id}`);
  return res.data;
};

/* =========================
   Image Generation APIs
========================= */

export const generateImage = async (prompt, style, aspectRatio) => {
  const res = await API.post("/generate/image", { prompt, style, aspect_ratio: aspectRatio });
  return res.data;
};

/* =========================
   Video Generation APIs
========================= */

export const generateVideo = async (formData) => {
  const res = await API.post("/generate/video", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export default API;
