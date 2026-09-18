/**
 * Utility functions for extracting device ID and user details from various API response shapes
 */

export const findDeviceId = (obj: any): string => {
  if (!obj || typeof obj !== 'object') return '';

  // 1. Direct key search (case-insensitive, ignoring underscores/hyphens)
  for (const key of Object.keys(obj)) {
    const normalized = key.toLowerCase().replace(/[-_]/g, '');
    if (normalized === 'deviceid') {
      const val = obj[key];
      if (val !== null && val !== undefined && String(val).trim() !== '' && String(val).trim().toUpperCase() !== 'N/A') {
        return String(val).trim();
      }
    }
  }

  // 2. Search common nested containers
  const containers = ['data', 'user', 'users_info', 'user_info', 'device', 'info', 'userData'];
  for (const container of containers) {
    if (obj[container] && typeof obj[container] === 'object') {
      const found = findDeviceId(obj[container]);
      if (found) return found;
    }
  }

  // 3. Fallback: Search all other child objects (excluding arrays)
  for (const key of Object.keys(obj)) {
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const found = findDeviceId(obj[key]);
      if (found) return found;
    }
  }

  return '';
};

export const findUserName = (obj: any): string => {
  if (!obj || typeof obj !== 'object') return '';

  for (const key of Object.keys(obj)) {
    const normalized = key.toLowerCase().replace(/[-_]/g, '');
    if (normalized === 'username' || normalized === 'name' || normalized === 'user') {
      const val = obj[key];
      if (val && typeof val === 'string' && val.trim() !== '') {
        return val.trim();
      }
    }
  }

  const containers = ['data', 'user', 'users_info', 'user_info'];
  for (const container of containers) {
    if (obj[container] && typeof obj[container] === 'object') {
      const found = findUserName(obj[container]);
      if (found) return found;
    }
  }

  return '';
};
