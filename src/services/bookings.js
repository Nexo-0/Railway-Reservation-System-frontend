import api from './api.js';

export async function createBooking(payload) {
  const { data } = await api.post('/api/bookings', payload);
  return data;
}

export async function fetchMyBookings() {
  const { data } = await api.get('/api/bookings/my');
  return data;
}

export async function cancelBooking(id) {
  const { data } = await api.put(`/api/bookings/${id}/cancel`);
  return data;
}
