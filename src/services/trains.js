import api from './api.js';

export async function fetchTrains() {
  const { data } = await api.get('/api/trains');
  return data;
}

export async function searchTrains(source, destination) {
  const { data } = await api.get('/api/trains/search', {
    params: { source, destination }
  });
  return data;
}

export async function fetchTrainById(id) {
  const { data } = await api.get(`/api/trains/${id}`);
  return data;
}

export async function createTrain(payload) {
  const { data } = await api.post('/api/admin/trains', payload);
  return data;
}

export async function updateTrain(id, payload) {
  const { data } = await api.put(`/api/admin/trains/${id}`, payload);
  return data;
}

export async function deleteTrain(id) {
  const { data } = await api.delete(`/api/admin/trains/${id}`);
  return data;
}
