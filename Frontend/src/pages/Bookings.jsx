import { useState, useEffect } from 'react';
import { bookingsAPI } from '../api/bookings';
import { stationsAPI } from '../api/stations';
import { useAuth } from '../context/AuthContext';
import { CheckIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';

const Bookings = () => {
  const { isBackoffice, isOperator } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    EVNic: '',
    StationId: '',
    StartUtc: '',
    EndUtc: ''
  });

  useEffect(() => {
    fetchBookings();
    fetchStations();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingsAPI.getAll();
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStations = async () => {
    try {
      const data = await stationsAPI.getAll();
      setStations(data || []);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        ...newBooking,
        StartUtc: new Date(newBooking.StartUtc).toISOString(),
        EndUtc: new Date(newBooking.EndUtc).toISOString()
      };
      await bookingsAPI.create(bookingData);
      setIsModalOpen(false);
      setNewBooking({ EVNic: '', StationId: '', StartUtc: '', EndUtc: '' });
      fetchBookings();
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleApproveBooking = async (bookingId, approve) => {
    try {
      await bookingsAPI.approve(bookingId, { Approve: approve });
      fetchBookings();
    } catch (error) {
      console.error('Error approving booking:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsAPI.cancel(bookingId);
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewBooking({
      ...newBooking,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage EV charging bookings</p>
        </div>
        {(isBackoffice || isOperator) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center btn-primary"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Booking
          </button>
        )}
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  EV NIC
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Station
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Start Time
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  End Time
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {booking.EVNic}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {booking.StationName || 'Unknown Station'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatDateTime(booking.StartUtc)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatDateTime(booking.EndUtc)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.Status)}`}>
                      {booking.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                    {booking.Status === 'Pending' && (isBackoffice || isOperator) && (
                      <>
                        <button
                          onClick={() => handleApproveBooking(booking._id, true)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleApproveBooking(booking._id, false)}
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {(booking.Status === 'Pending' || booking.Status === 'Approved') && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-xs text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        title="Create New Booking"
      >
        <form onSubmit={handleCreateBooking} className="space-y-4">
          <div>
            <label htmlFor="EVNic" className="block text-sm font-medium text-gray-700">
              EV Owner NIC
            </label>
            <input
              type="text"
              name="EVNic"
              required
              className="input-field"
              value={newBooking.EVNic}
              onChange={handleInputChange}
              placeholder="Enter NIC number"
            />
          </div>

          <div>
            <label htmlFor="StationId" className="block text-sm font-medium text-gray-700">
              Station
            </label>
            <select
              name="StationId"
              required
              className="input-field"
              value={newBooking.StationId}
              onChange={handleInputChange}
            >
              <option value="">Select a station</option>
              {stations.map((station) => (
                console.log(station),
                <option key={station._id} value={station._id}>
                  {station.Name} - {station.Type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="StartUtc" className="block text-sm font-medium text-gray-700">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="StartUtc"
              required
              className="input-field"
              value={newBooking.StartUtc}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="EndUtc" className="block text-sm font-medium text-gray-700">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              name="EndUtc"
              required
              className="input-field"
              value={newBooking.EndUtc}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Booking
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Bookings;