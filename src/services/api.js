export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Helper to get authorization header
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('apexvault_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

/* ==========================================================================
   Authentication Endpoints
   ========================================================================== */

/**
 * Register a new customer
 */
export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  } catch (error) {
    console.error('registerUser error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Login customer or admin
 */
export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  } catch (error) {
    console.error('loginUser error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get current logged in user
 */
export const getMe = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (error) {
    console.error('getMe error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Request password reset link / email
 */
export const forgotPasswordApi = async (email) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await res.json();
  } catch (error) {
    console.error('forgotPasswordApi error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Reset password using token
 */
export const resetPasswordApi = async (token, newPassword) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    return await res.json();
  } catch (error) {
    console.error('resetPasswordApi error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch all registered users (Admin only)
 */
export const fetchUsersFromDB = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/users`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.users || [];
  } catch (error) {
    console.error('fetchUsersFromDB error:', error);
    return [];
  }
};

/* ==========================================================================
   Product Management Endpoints
   ========================================================================== */

/**
 * Fetch products from MongoDB with filters & search
 */
export const fetchProductsFromDB = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.condition && params.condition.length > 0) query.append('condition', params.condition.join(','));
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.priceMax) query.append('priceMax', params.priceMax);
    if (params.inStockOnly) query.append('inStockOnly', 'true');

    const url = `${API_BASE_URL}/products?${query.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('fetchProductsFromDB error:', error);
    return { success: false, data: [], stats: {} };
  }
};

/**
 * Create single product in MongoDB (Admin)
 */
export const createProductInDB = async (productData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return await res.json();
  } catch (error) {
    console.error('createProductInDB error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update single product in MongoDB (Admin)
 */
export const updateProductInDB = async (id, productData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return await res.json();
  } catch (error) {
    console.error('updateProductInDB error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete product from MongoDB (Admin)
 */
export const deleteProductInDB = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (error) {
    console.error('deleteProductInDB error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Bulk upload manifest products into MongoDB
 */
export const bulkUploadProductsToDB = async (products) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ products })
    });
    return await res.json();
  } catch (error) {
    console.error('bulkUploadProductsToDB error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Clear entire product catalog from MongoDB
 */
export const clearCatalogInDB = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (error) {
    console.error('clearCatalogInDB error:', error);
    return { success: false, error: error.message };
  }
};

/* ==========================================================================
   Order Management Endpoints
   ========================================================================== */

/**
 * Create and persist order in MongoDB
 */
export const createOrderInDB = async (orderData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await res.json();
  } catch (error) {
    console.error('createOrderInDB error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch all orders from MongoDB
 */
export const fetchOrdersFromDB = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('fetchOrdersFromDB error:', error);
    return [];
  }
};

/**
 * Look up order by barcode / Order ID / customer in MongoDB
 */
export const lookupOrderFromDB = async (query) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/lookup?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('lookupOrderFromDB error:', error);
    return null;
  }
};

/**
 * Mark order as released in MongoDB
 */
export const markOrderReleasedInDB = async (orderId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/release`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (error) {
    console.error('markOrderReleasedInDB error:', error);
    return { success: false, error: error.message };
  }
};

/* ==========================================================================
   Settings Endpoints
   ========================================================================== */

export const fetchSettingsFromDB = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`);
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error('fetchSettingsFromDB error:', error);
    return null;
  }
};

export const saveSettingsToDB = async (settings) => {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return await res.json();
  } catch (error) {
    console.error('saveSettingsToDB error:', error);
    return { success: false, error: error.message };
  }
};

/* ==========================================================================
   Subscriber & Drop Alert Endpoints
   ========================================================================== */

export const subscribeDropAlerts = async (subscriberData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriberData)
    });
    return await res.json();
  } catch (error) {
    console.error('subscribeDropAlerts error:', error);
    return { success: false, error: error.message };
  }
};

export const fetchSubscribersFromDB = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/subscribers`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.subscribers || [];
  } catch (error) {
    console.error('fetchSubscribersFromDB error:', error);
    return [];
  }
};

/* ==========================================================================
   Make an Offer & Negotiation Endpoints
   ========================================================================== */

export const createOfferInDB = async (offerData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData)
    });
    return await res.json();
  } catch (error) {
    console.error('createOfferInDB error:', error);
    return { success: false, error: error.message };
  }
};

export const fetchOffersFromDB = async (email = null) => {
  try {
    const url = email ? `${API_BASE_URL}/offers?email=${encodeURIComponent(email)}` : `${API_BASE_URL}/offers`;
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.offers || [];
  } catch (error) {
    console.error('fetchOffersFromDB error:', error);
    return [];
  }
};

export const updateOfferStatusInDB = async (offerId, updateData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/offers/${encodeURIComponent(offerId)}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return await res.json();
  } catch (error) {
    console.error('updateOfferStatusInDB error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteOfferFromDB = async (offerId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/offers/${encodeURIComponent(offerId)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (error) {
    console.error('deleteOfferFromDB error:', error);
    return { success: false, error: error.message };
  }
};

/* ==========================================================================
   Product Hold (Flash Lock) Endpoint
   ========================================================================== */

export const holdProductInDB = async (productId, durationMinutes = 120, user = null) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(productId)}/hold`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ durationMinutes, user })
    });
    return await res.json();
  } catch (error) {
    console.error('holdProductInDB error:', error);
    return { success: false, error: error.message };
  }
};

