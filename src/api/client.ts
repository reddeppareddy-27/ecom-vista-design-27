
// API configuration file
const API_URL = "http://localhost:8000/api"; // Change to your Django API URL

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
    throw new Error(error.message || `API error: ${response.status}`);
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
    return fetchAPI<{ token: string; user: any }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  register: async (userData: any) => {
    return fetchAPI<{ message: string }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
};

// Product related functions
export const productsAPI = {
  getAll: async () => {
    return fetchAPI<any[]>('/products/');
  },
  
  getById: async (id: string | number) => {
    return fetchAPI<any>(`/products/${id}/`);
  }
};
