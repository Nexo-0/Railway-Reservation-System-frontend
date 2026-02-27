import { useEffect, useState } from 'react';

export default function AdminTrainForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    trainName: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    totalSeats: '',
  });

  useEffect(() => {
    if (initial) {
      setForm({
        trainName: initial.trainName || '',
        source: initial.source || '',
        destination: initial.destination || '',
        departureTime: initial.departureTime ? initial.departureTime.slice(0, 16) : '',
        arrivalTime: initial.arrivalTime ? initial.arrivalTime.slice(0, 16) : '',
        price: initial.price || '',
        totalSeats: initial.totalSeats || '',
      });
    } else {
      setForm({ trainName:'', source:'', destination:'', departureTime:'', arrivalTime:'', price:'', totalSeats:'' });
    }
  }, [initial]);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Append :00 seconds if missing (datetime-local returns HH:mm without seconds)
    const dep = form.departureTime.length === 16 ? form.departureTime + ':00' : form.departureTime;
    const arr = form.arrivalTime.length === 16 ? form.arrivalTime + ':00' : form.arrivalTime;
    if (new Date(dep) >= new Date(arr)) {
      alert('Arrival time must be after departure time.');
      return;
    }
    onSubmit({
      ...form,
      departureTime: dep,
      arrivalTime: arr,
      price: Number(form.price),
      totalSeats: Number(form.totalSeats),
    });
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <h6 className="fw-bold mb-3">{initial ? '✏️ Edit Train' : '➕ Add New Train'}</h6>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Train Name</label>
            <input
              className="form-control"
              placeholder="e.g. Shatabdi Express"
              value={form.trainName}
              onChange={handleChange('trainName')}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold">Price (₹)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="form-control"
              placeholder="e.g. 2500"
              value={form.price}
              onChange={handleChange('price')}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold">Total Seats</label>
            <input
              type="number"
              min="1"
              className="form-control"
              placeholder="e.g. 240"
              value={form.totalSeats}
              onChange={handleChange('totalSeats')}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Source Station</label>
            <input
              className="form-control"
              placeholder="e.g. Delhi"
              value={form.source}
              onChange={handleChange('source')}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Destination Station</label>
            <input
              className="form-control"
              placeholder="e.g. Mumbai"
              value={form.destination}
              onChange={handleChange('destination')}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Departure Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={form.departureTime}
              onChange={handleChange('departureTime')}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Arrival Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={form.arrivalTime}
              onChange={handleChange('arrivalTime')}
              required
            />
          </div>
        </div>
        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary px-4">
            {initial ? 'Update Train' : 'Add Train'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
