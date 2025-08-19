const API_URL = "http://localhost:8080/api/v1";

// Helper function untuk handling response
async function handleResponse(res: Response) {
  const contentType = res.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `HTTP error! status: ${res.status}`);
    }
    return data;
  } else {
    // Handle non-JSON responses
    const text = await res.text();
    if (!res.ok) {
      throw new Error(text || `HTTP error! status: ${res.status}`);
    }
    return { success: true, message: text };
  }
}

// Helper function untuk mendapatkan token
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
}

// Auth functions
export async function login(email: string, password: string, isAdmin: boolean = false) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, is_admin: isAdmin }),
  });
  return handleResponse(res);
}

export async function register(fullName: string, email: string, password: string, confirmPassword: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name: fullName, email, password, confirm_password: confirmPassword }),
  });
  return handleResponse(res);
}

export async function getUserProfile() {
  const res = await fetch(`${API_URL}/users/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Password functions
export async function forgotPassword(email: string) {
  const res = await fetch(`${API_URL}/password/forgot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

export async function resetPassword(resetToken: string, newPassword: string, confirmPassword: string) {
  const res = await fetch(`${API_URL}/password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      reset_token: resetToken, 
      new_password: newPassword, 
      confirm_password: confirmPassword 
    }),
  });
  return handleResponse(res);
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const res = await fetch(`${API_URL}/password/change`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ 
      old_password: oldPassword, 
      new_password: newPassword 
    }),
  });
  return handleResponse(res);
}

// Testimoni functions
export async function getTestimoni() {
  const res = await fetch(`${API_URL}/testimoni`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(res);
}

export async function getAllTestimonis() {
  const res = await fetch(`${API_URL}/testimoni/all`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function createTestimoni(content: string, rating: number) {
  const res = await fetch(`${API_URL}/testimoni`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ content, rating }),
  });
  return handleResponse(res);
}

export async function updateTestimoni(id: string, updates: { is_approved?: boolean; content?: string; rating?: number }) {
  const res = await fetch(`${API_URL}/testimoni/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
}

export async function deleteTestimoni(id: string) {
  const res = await fetch(`${API_URL}/testimoni/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Savings functions
export async function createSavingsTarget(name: string, targetAmount: number, icon?: string, iconColor?: string, targetDate?: string) {
  const requestBody: any = { 
    name, 
    target_amount: targetAmount, 
    icon, 
    icon_color: iconColor
  };
  
  // Only include target_date if provided, and format it correctly
  if (targetDate) {
    requestBody.target_date = targetDate.split('T')[0]; // Extract just the date part (YYYY-MM-DD)
  }

  const res = await fetch(`${API_URL}/savings/targets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(requestBody),
  });
  return handleResponse(res);
}

export async function getSavingsTargets() {
  const res = await fetch(`${API_URL}/savings/targets`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getSavingsTarget(targetId: string) {
  const res = await fetch(`${API_URL}/savings/targets/${targetId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function updateSavingsTarget(targetId: string, updates: any) {
  const res = await fetch(`${API_URL}/savings/targets/${targetId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
}

export async function deleteSavingsTarget(targetId: string) {
  const res = await fetch(`${API_URL}/savings/targets/${targetId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function addDepositToTarget(targetId: string, amount: number) {
  const res = await fetch(`${API_URL}/savings/targets/${targetId}/deposit`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  });
  return handleResponse(res);
}

// Activities functions
export async function getUserActivities(limit?: number) {
  const url = limit ? `${API_URL}/activities?limit=${limit}` : `${API_URL}/activities`;
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function createActivity(activityData: any) {
  const res = await fetch(`${API_URL}/activities`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(activityData),
  });
  return handleResponse(res);
}

export async function getRecentActivities() {
  const res = await fetch(`${API_URL}/activities/recent`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Statistics functions
export async function getUserStatistics() {
  const res = await fetch(`${API_URL}/statistics`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getUserStreakData(days?: number) {
  const params = new URLSearchParams();
  if (days) params.append('days', days.toString());
  
  const url = `${API_URL}/statistics/streak?${params.toString()}`;
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getUserAchievements() {
  const res = await fetch(`${API_URL}/statistics/achievements`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Dashboard functions
export async function getDashboardStats() {
  const res = await fetch(`${API_URL}/dashboard/stats`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getUserAnalytics() {
  const res = await fetch(`${API_URL}/dashboard/analytics`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getTrendData(days: number = 30) {
  const res = await fetch(`${API_URL}/dashboard/trends?days=${days}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getRatingDistribution() {
  const res = await fetch(`${API_URL}/dashboard/ratings`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Reminders functions
export async function getUserReminders(limit?: number) {
  const url = limit ? `${API_URL}/reminders?limit=${limit}` : `${API_URL}/reminders`;
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getUpcomingReminders(days?: number) {
  const url = days ? `${API_URL}/reminders/upcoming?days=${days}` : `${API_URL}/reminders/upcoming`;
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getTodaysReminders() {
  const res = await fetch(`${API_URL}/reminders/today`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getCalendarEvents(month?: number, year?: number) {
  let url = `${API_URL}/reminders/calendar`;
  const params = new URLSearchParams();
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());
  if (params.toString()) url += `?${params.toString()}`;
  
  const headers = getAuthHeaders();
  console.log('🔐 Calendar API Headers:', headers);
  console.log('🔗 Calendar API URL:', url);
  
  const res = await fetch(url, {
    method: "GET",
    headers: headers,
  });
  
  console.log('📡 Calendar API Response Status:', res.status);
  console.log('📡 Calendar API Response Headers:', [...res.headers.entries()]);
  
  return handleResponse(res);
}

export async function markReminderCompleted(reminderId: string) {
  const res = await fetch(`${API_URL}/reminders/${reminderId}/complete`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}
