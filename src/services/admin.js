import api from './api.js';

export async function fetchAllBookings() {
  const { data } = await api.get('/api/admin/bookings');
  return data;
}

export async function fetchAllUsers() {
  const { data } = await api.get('/api/admin/users');
  return data;
}

export async function fetchRevenue() {
  const { data } = await api.get('/api/admin/revenue');
  return data;
}
