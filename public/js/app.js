// API Base URL
const API_URL = window.location.origin + '/api';

// Auth token management
const AuthService = {
  setToken(token) {
    localStorage.setItem('authToken', token);
  },
  
  getToken() {
    return localStorage.getItem('authToken');
  },
  
  removeToken() {
    localStorage.removeItem('authToken');
  },
  
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  removeUser() {
    localStorage.removeItem('user');
  },
  
  isAuthenticated() {
    return !!this.getToken();
  },
  
  logout() {
    this.removeToken();
    this.removeUser();
    window.location.href = '/';
  }
};

// API Request Helper
async function apiRequest(endpoint, options = {}) {
  const token = AuthService.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Show toast notification using Toastify
function showToast(message, type = 'success') {
  const bgColors = {
    success: 'linear-gradient(to right, #28a745, #20c997)',
    error: 'linear-gradient(to right, #dc3545, #c82333)',
    info: 'linear-gradient(to right, #17a2b8, #138496)',
    warning: 'linear-gradient(to right, #ffc107, #e0a800)'
  };
  
  if (typeof Toastify !== 'undefined') {
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top',
      position: 'right',
      backgroundColor: bgColors[type] || bgColors.info,
      stopOnFocus: true
    }).showToast();
  } else {
    alert(message);
  }
}

// Show loading spinner
function showLoading(element) {
  if (element) {
    element.innerHTML = '<div class="spinner"></div>';
  }
}

// Hide loading spinner
function hideLoading(element, content = '') {
  if (element) {
    element.innerHTML = content;
  }
}

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Form validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = 'var(--status-danger)';
      isValid = false;
    } else {
      input.style.borderColor = 'var(--secondary-light)';
    }
    
    if (input.type === 'email' && input.value && !validateEmail(input.value)) {
      input.style.borderColor = 'var(--status-danger)';
      isValid = false;
    }
  });
  
  return isValid;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Campus data loading
async function loadCampuses(selectId) {
  try {
    const data = await apiRequest('/campuses');
    const select = document.getElementById(selectId);
    
    if (select && data.campuses) {
      select.innerHTML = '<option value="">Select Campus</option>';
      data.campuses.forEach(campus => {
        const option = document.createElement('option');
        option.value = campus.id;
        option.textContent = campus.name;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading campuses:', error);
  }
}

// Program data loading
async function loadPrograms(campusId, selectId) {
  try {
    const data = await apiRequest(`/campuses/${campusId}/programs`);
    const select = document.getElementById(selectId);
    
    if (select && data.programs) {
      select.innerHTML = '<option value="">Select Program</option>';
      data.programs.forEach(program => {
        const option = document.createElement('option');
        option.value = program.id;
        option.textContent = program.name;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading programs:', error);
  }
}

// Check if submissions are enabled
async function checkSubmissionStatus() {
  try {
    const data = await apiRequest('/settings/check-submissions');
    return data.enabled;
  } catch (error) {
    console.error('Error checking submission status:', error);
    return true;
  }
}

// Upload file to Cloudinary through backend
async function uploadFile(file, formData) {
  const token = AuthService.getToken();
  const headers = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Initialize tooltips and other UI elements
function initializeUI() {
  // Close modal when clicking outside
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Handle form input focus
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', () => {
      input.style.borderColor = 'var(--primary-orange)';
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.style.borderColor = 'var(--secondary-light)';
      }
    });
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeUI();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    API_URL,
    AuthService,
    apiRequest,
    showToast,
    showLoading,
    hideLoading,
    openModal,
    closeModal,
    validateEmail,
    validateForm,
    formatDate,
    loadCampuses,
    loadPrograms,
    checkSubmissionStatus
  };
}
