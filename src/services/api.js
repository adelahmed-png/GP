/**
 * API service for Help Culprit Recognition.
 * Handles search and configuration requests to the backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Search for suspects by text description.
 * When the API is unavailable, returns demo results using fallbackImages (e.g. investigation uploads).
 * @param {string} investigationId - Current investigation ID
 * @param {string} description - Culprit text description
 * @param {Object} options - Optional settings
 * @param {string} options.modelVersion - CLIP | OpenCLIP | Custom Model
 * @param {string} options.similarityMetric - Cosine | Dot Product | Euclidean
 * @param {string[]} options.fallbackImages - Image URLs to use as demo results when API fails (e.g. investigation.imageUrls)
 * @returns {Promise<Array<{image: string, score: number}>>} Ranked matches
 */
export async function searchByDescription(investigationId, description, options = {}) {
  const { modelVersion = 'CLIP', similarityMetric = 'Cosine', fallbackImages = [] } = options;

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
      throw new Error('Search failed');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (e) {
    const images = Array.isArray(fallbackImages)
      ? fallbackImages.map((img) => (typeof img === 'string' ? img : img?.url ?? ''))
      : [];
    const urls = images.filter(Boolean);

    if (urls.length > 0) {
      console.warn('API unavailable — using uploaded investigation images as demo results');
      return urls.map((image, index) => ({
        image,
        score: 0.95 - index * 0.05,
      }));
    }

    return [];
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
