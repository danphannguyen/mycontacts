import { handleRequestErrors } from "../utils/HandleRequestErrors";

const API_URL = process.env.REACT_APP_API_URL;

export async function getContacts(token) {
  const res = await fetch(`${API_URL}/contact`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleRequestErrors(res);
}

export async function createContact(data, token) {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleRequestErrors(res);
}

export async function updateContact(id, data, token) {
  const res = await fetch(`${API_URL}/contact/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleRequestErrors(res);
}

export async function deleteContact(id, token) {
  const res = await fetch(`${API_URL}/contact/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleRequestErrors(res);
}
