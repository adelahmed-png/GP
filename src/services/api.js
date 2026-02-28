/**
 * API service for Help Culprit Recognition.
 * Handles search and configuration requests to the backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/** Demo placeholder images when backend is unavailable */
const DEMO_IMAGES = [
  'https://placehold.co/128x128/1e3a5f/fff?text=1',
  'https://placehold.co/128x128/1e3a5f/fff?text=2',
  'https://placehold.co/128x128/1e3a5f/fff?text=3',
];

/**
 * Search for suspects by text description.
 * @param {string} investigationId - Current investigation ID
 * @param {string} description - Culprit text description
 * @param {Object} options - Optional settings
 * @param {string} options.modelVersion - CLIP | OpenCLIP | Custom Model
 * @param {string} options.similarityMetric - Cosine | Dot Product | Euclidean
 * @returns {Promise<Array<{image: string, score: number}>>} Ranked matches
 */
export async function searchByDescription(investigationId, description, options = {}) {
  const { modelVersion = 'CLIP', similarityMetric = 'Cosine' } = options;

  try {
    const response = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        investigationId,
        description: description.trim(),
        modelVersion,
        similarityMetric,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || 'Search failed');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (e) {
    if (import.meta.env.DEV) {
      return DEMO_IMAGES.map((image, i) => ({
        image,
        score: 0.95 - i * 0.04 - Math.random() * 0.02,
      })).sort((a, b) => b.score - a.score);
    }
    throw e;
  }
}

/**
 * Upload suspect images for an investigation (if backend supports it).
 * @param {string} investigationId - Investigation ID
 * @param {FileList|File[]} files - Image files to upload
 * @returns {Promise<Object>}
 */
export async function uploadImages(investigationId, files) {
  const formData = new FormData();
  formData.append('investigationId', investigationId);
  Array.from(files || []).forEach((file, i) => {
    formData.append(`images`, file);
  });

  const response = await fetch(`${API_BASE}/investigations/${investigationId}/images`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(err.message || 'Upload failed');
  }

  return response.json();
}
