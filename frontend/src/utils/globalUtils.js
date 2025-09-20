/**
 * STUDY KARO - GLOBAL UTILITIES
 * Consolidated JavaScript utilities for entire application
 */

// ========================================
// DOM UTILITIES
// ========================================

/**
 * Smooth scroll to element
 * @param {string|HTMLElement} element - Element ID or HTMLElement
 * @param {Object} options - Scroll options
 */
export const smoothScrollTo = (element, options = {}) => {
  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  };
  
  const scrollOptions = { ...defaultOptions, ...options };
  
  if (typeof element === 'string') {
    const targetElement = document.getElementById(element);
    if (targetElement) {
      targetElement.scrollIntoView(scrollOptions);
    }
  } else if (element && element.scrollIntoView) {
    element.scrollIntoView(scrollOptions);
  }
};

/**
 * Get element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
export const getElementById = (id) => {
  return document.getElementById(id);
};

/**
 * Query selector
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (optional)
 * @returns {HTMLElement|null}
 */
export const querySelector = (selector, parent = document) => {
  return parent.querySelector(selector);
};

/**
 * Query selector all
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (optional)
 * @returns {NodeList}
 */
export const querySelectorAll = (selector, parent = document) => {
  return parent.querySelectorAll(selector);
};

/**
 * Add event listener
 * @param {HTMLElement} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 */
export const addEventListener = (element, event, handler, options = {}) => {
  if (element && typeof element.addEventListener === 'function') {
    element.addEventListener(event, handler, options);
  }
};

/**
 * Remove event listener
 * @param {HTMLElement} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 */
export const removeEventListener = (element, event, handler, options = {}) => {
  if (element && typeof element.removeEventListener === 'function') {
    element.removeEventListener(event, handler, options);
  }
};

// ========================================
// STORAGE UTILITIES
// ========================================

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} - Success status
 */
export const setStorageItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error setting storage item:', error);
    return false;
  }
};

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Retrieved value or default
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting storage item:', error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing storage item:', error);
    return false;
  }
};

/**
 * Clear all localStorage
 * @returns {boolean} - Success status
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

// ========================================
// VALIDATION UTILITIES
// ========================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    requireUppercase = false,
    requireLowercase = false,
    requireNumbers = false,
    requireSpecialChars = false
  } = options;

  const result = {
    isValid: true,
    errors: []
  };

  if (password.length < minLength) {
    result.isValid = false;
    result.errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one lowercase letter');
  }

  if (requireNumbers && !/\d/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one number');
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one special character');
  }

  return result;
};

/**
 * Validate API key format
 * @param {string} key - API key to validate
 * @param {string} provider - API provider
 * @returns {Object} - Validation result
 */
export const validateApiKey = (key, provider) => {
  if (!key) {
    return { valid: false, message: 'API key is required' };
  }

  switch (provider.toLowerCase()) {
    case 'openai':
      return key.startsWith('sk-') ? 
        { valid: true, message: 'Valid OpenAI key' } : 
        { valid: false, message: 'Invalid OpenAI key format' };
    
    case 'google':
      return key.startsWith('AIza') ? 
        { valid: true, message: 'Valid Google key' } : 
        { valid: false, message: 'Invalid Google key format' };
    
    case 'perplexity':
      return key.startsWith('pplx-') ? 
        { valid: true, message: 'Valid Perplexity key' } : 
        { valid: false, message: 'Invalid Perplexity key format' };
    
    default:
      return { valid: true, message: 'Key looks good' };
  }
};

// ========================================
// FORMATTING UTILITIES
// ========================================

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {Object} options - Format options
 * @returns {string} - Formatted date
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('en-IN', { ...defaultOptions, ...options });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date) => {
  try {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const diffInSeconds = Math.floor((now - targetDate) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
};

/**
 * Convert UTC to IST
 * @param {Date|string} utcDate - UTC date
 * @returns {string} - IST formatted date
 */
export const convertToIST = (utcDate) => {
  try {
    const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
    const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
    
    return istDate.toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Error converting to IST:', error);
    return '';
  }
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} - Truncated string
 */
export const truncate = (str, length, suffix = '...') => {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

// ========================================
// DEBOUNCE AND THROTTLE
// ========================================

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ========================================
// ARRAY UTILITIES
// ========================================

/**
 * Remove duplicates from array
 * @param {Array} array - Array to deduplicate
 * @param {string} key - Key to check for duplicates (optional)
 * @returns {Array} - Array without duplicates
 */
export const removeDuplicates = (array, key = null) => {
  if (!Array.isArray(array)) return [];
  
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }
  
  return [...new Set(array)];
};

/**
 * Shuffle array
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
export const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} - Grouped object
 */
export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// ========================================
// OBJECT UTILITIES
// ========================================

/**
 * Deep clone object
 * @param {any} obj - Object to clone
 * @returns {any} - Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * Merge objects deeply
 * @param {Object} target - Target object
 * @param {...Object} sources - Source objects
 * @returns {Object} - Merged object
 */
export const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
};

/**
 * Check if value is object
 * @param {any} item - Item to check
 * @returns {boolean} - Is object
 */
const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// ========================================
// ERROR HANDLING
// ========================================

/**
 * Safe JSON parse
 * @param {string} str - String to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} - Parsed value or default
 */
export const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
};

/**
 * Safe JSON stringify
 * @param {any} obj - Object to stringify
 * @param {any} defaultValue - Default value if stringifying fails
 * @returns {string} - Stringified value or default
 */
export const safeJsonStringify = (obj, defaultValue = '{}') => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error stringifying JSON:', error);
    return defaultValue;
  }
};

/**
 * Handle async errors
 * @param {Function} asyncFn - Async function to wrap
 * @returns {Function} - Wrapped function
 */
export const handleAsyncError = (asyncFn) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      console.error('Async error:', error);
      throw error;
    }
  };
};

// ========================================
// URL UTILITIES
// ========================================

/**
 * Get URL parameters
 * @param {string} url - URL to parse (optional, defaults to current URL)
 * @returns {Object} - URL parameters
 */
export const getUrlParams = (url = window.location.href) => {
  try {
    const urlObj = new URL(url);
    const params = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return {};
  }
};

/**
 * Build query string from object
 * @param {Object} params - Parameters object
 * @returns {string} - Query string
 */
export const buildQueryString = (params) => {
  if (!params || typeof params !== 'object') return '';
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, value);
    }
  });
  
  return searchParams.toString();
};

// ========================================
// ANIMATION UTILITIES
// ========================================

/**
 * Animate element
 * @param {HTMLElement} element - Element to animate
 * @param {Object} keyframes - Animation keyframes
 * @param {Object} options - Animation options
 * @returns {Promise} - Animation promise
 */
export const animateElement = (element, keyframes, options = {}) => {
  if (!element || typeof element.animate !== 'function') {
    return Promise.resolve();
  }

  const defaultOptions = {
    duration: 300,
    easing: 'ease-in-out',
    fill: 'forwards'
  };

  return element.animate(keyframes, { ...defaultOptions, ...options });
};

/**
 * Fade in element
 * @param {HTMLElement} element - Element to fade in
 * @param {number} duration - Animation duration
 * @returns {Promise} - Animation promise
 */
export const fadeIn = (element, duration = 300) => {
  if (!element) return Promise.resolve();
  
  element.style.opacity = '0';
  element.style.display = 'block';
  
  return animateElement(element, [
    { opacity: 0 },
    { opacity: 1 }
  ], { duration });
};

/**
 * Fade out element
 * @param {HTMLElement} element - Element to fade out
 * @param {number} duration - Animation duration
 * @returns {Promise} - Animation promise
 */
export const fadeOut = (element, duration = 300) => {
  if (!element) return Promise.resolve();
  
  return animateElement(element, [
    { opacity: 1 },
    { opacity: 0 }
  ], { duration }).then(() => {
    element.style.display = 'none';
  });
};

// ========================================
// EXPORT ALL UTILITIES
// ========================================

export default {
  // DOM utilities
  smoothScrollTo,
  getElementById,
  querySelector,
  querySelectorAll,
  addEventListener,
  removeEventListener,
  
  // Storage utilities
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  clearStorage,
  
  // Validation utilities
  isValidEmail,
  validatePassword,
  validateApiKey,
  
  // Formatting utilities
  formatDate,
  formatRelativeTime,
  convertToIST,
  capitalize,
  truncate,
  
  // Performance utilities
  debounce,
  throttle,
  
  // Array utilities
  removeDuplicates,
  shuffleArray,
  groupBy,
  
  // Object utilities
  deepClone,
  deepMerge,
  
  // Error handling
  safeJsonParse,
  safeJsonStringify,
  handleAsyncError,
  
  // URL utilities
  getUrlParams,
  buildQueryString,
  
  // Animation utilities
  animateElement,
  fadeIn,
  fadeOut
};
