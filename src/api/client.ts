
// API configuration file
const API_URL = "http://localhost:8000/api"; // Django API URL

// Generic API call function with fetch
export const fetchAPI = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem("authToken");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || `API error: ${response.status}`);
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  
  return {} as T;
};

// Auth related functions
export const authAPI = {
  login: async (email: string, password: string) => {
    return fetchAPI<{token: string; refresh: string; user: any}>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  register: async (userData: any) => {
    return fetchAPI<{message: string; tokens: {access: string, refresh: string}; user: any}>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  },
  
  refreshToken: async (refreshToken: string) => {
    return fetchAPI<{access: string}>('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken })
    });
  },
  
  getCurrentUser: async () => {
    return fetchAPI<any>('/auth/user/');
  },

  requestPasswordReset: async (email: string) => {
    return fetchAPI<{message: string}>('/auth/password-reset/', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },
  
  resetPassword: async (token: string, password: string) => {
    return fetchAPI<{message: string}>('/auth/password-reset/confirm/', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    });
  }
};

// Product related functions
export const productsAPI = {
  getAll: async () => {
    return fetchAPI<any[]>('/products/');
  },
  
  getById: async (id: string | number) => {
    return fetchAPI<any>(`/products/${id}/`);
  },
  
  create: async (productData: any) => {
    return fetchAPI<any>('/products/', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },
  
  update: async (id: string | number, productData: any) => {
    return fetchAPI<any>(`/products/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },
  
  delete: async (id: string | number) => {
    return fetchAPI<void>(`/products/${id}/`, {
      method: 'DELETE'
    });
  },

  createOrder: async (orderData: any) => {
    return fetchAPI<any>('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  getOrders: async () => {
    return fetchAPI<any[]>('/orders/');
  },
  
  getOrderById: async (id: string | number) => {
    return fetchAPI<any>(`/orders/${id}/`);
  }
};
