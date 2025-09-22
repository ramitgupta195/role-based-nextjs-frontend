const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/* ======================
   HELPERS
====================== */

// Generic JSON request handler
async function request(endpoint, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}

// Generic multipart/form-data request handler (for file uploads)
async function formRequest(endpoint, method = "POST", formData, token = null) {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: formData, // browser auto-sets Content-Type
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}

// Utility: build FormData with proper Rails-style keys
function buildFormData(updates) {
  const formData = new FormData();

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(`user[${key}]`, value);
    }
  });

  return formData;
}

/* ======================
   AUTH
====================== */
export const signup = (email, password, password_confirmation) =>
  request("/users", "POST", {
    user: { email, password, password_confirmation },
  });

export const login = (email, password) =>
  request("/users/sign_in", "POST", { user: { email, password } });

export const getProfile = (token) => request("/profile", "GET", null, token);

// Update profile (with optional file upload)
export const updateProfile = (updates, token) => {
  if (updates.profile_photo) {
    const formData = buildFormData(updates);

    // 🔍 Debug logging
    for (let pair of formData.entries()) {
      console.log("FormData →", pair[0], ":", pair[1]);
    }

    return formRequest("/profile", "PATCH", formData, token);
  } else {
    return request("/profile", "PATCH", { user: updates }, token);
  }
};

/* ======================
   ADMIN MANAGEMENT
====================== */
export const getAdmins = (token) => request("/admins", "GET", null, token);

export const createAdmin = (email, password, password_confirmation, token) =>
  request(
    "/admins",
    "POST",
    { user: { email, password, password_confirmation } },
    token
  );

export const updateAdmin = (id, updates, token) => {
  if (updates.profile_photo) {
    const formData = buildFormData(updates);
    return formRequest(`/admins/${id}`, "PATCH", formData, token);
  } else {
    return request(`/admins/${id}`, "PATCH", { user: updates }, token);
  }
};

export const deleteAdmin = (id, token) =>
  request(`/admins/${id}`, "DELETE", null, token);

/* ======================
   USER MANAGEMENT
====================== */
export const getUsers = (token) => request("/users", "GET", null, token);

export const createUser = (
  email,
  password,
  password_confirmation,
  role,
  token
) =>
  request(
    "/users",
    "POST",
    { user: { email, password, password_confirmation, role } },
    token
  );

// Update user (with optional file upload)
export const updateUser = (id, updates, token) => {
  if (updates.profile_photo) {
    const formData = buildFormData(updates);
    return formRequest(`/users/${id}`, "PATCH", formData, token);
  } else {
    return request(`/users/${id}`, "PATCH", { user: updates }, token);
  }
};

export const deleteUser = (id, token) =>
  request(`/users/${id}`, "DELETE", null, token);
