import { useState } from 'react';
import { evOwnersAPI } from '../api/evowners';
import { bookingsAPI } from '../api/bookings';
import { stationsAPI } from '../api/stations';
import { PlusIcon, MagnifyingGlassIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';

const EVOwnerPortal = () => {
  const [currentNic, setCurrentNic] = useState('');
  const [ownerData, setOwnerData] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [newOwner, setNewOwner] = useState({
    NIC: '',
    FullName: '',
    Phone: '',
    Email: ''
  });
  const [newBooking, setNewBooking] = useState({
    StationId: '',
    StartUtc: '',
    EndUtc: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!currentNic) return;

    setLoading(true);
    try {
      const [history, stationsData] = await Promise.all([
        bookingsAPI.getOwnerHistory(currentNic),
        stationsAPI.getAll()
      ]);
      setBookingHistory(history || []);
      setStations(stationsData || []);
    } catch (error) {
      console.error('Error fetching owner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await evOwnersAPI.create(newOwner);
      setIsRegisterModalOpen(false);
      setNewOwner({ NIC: '', FullName: '', Phone: '', Email: '' });
      alert('Registration successful! You can now use your NIC to access your account.');
    } catch (error) {
      console.error('Error registering owner:', error);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        EVNic: currentNic,
        StationId: newBooking.StationId,
        StartUtc: new Date(newBooking.StartUtc).toISOString(),
        EndUtc: new Date(newBooking.EndUtc).toISOString()
      };
      await bookingsAPI.create(bookingData);
      setIsBookingModalOpen(false);
      setNewBooking({ StationId: '', StartUtc: '', EndUtc: '' });
      // Refresh booking history
      const history = await bookingsAPI.getOwnerHistory(currentNic);
      setBookingHistory(history || []);
      alert('Booking created successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsAPI.cancel(bookingId);
      // Refresh booking history
      const history = await bookingsAPI.getOwnerHistory(currentNic);
      setBookingHistory(history || []);
      alert('Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const handleOwnerInputChange = (e) => {
    setNewOwner({
      ...newOwner,
      [e.target.name]: e.target.value
    });
  };

  const handleBookingInputChange = (e) => {
    setNewBooking({
      ...newBooking,
      [e.target.name]: e.target.value
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
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

  const canCancelBooking = (booking) => {
    const startTime = new Date(booking.StartUtc);
    const now = new Date();
    const hoursUntilStart = (startTime - now) / (1000 * 60 * 60);
    return hoursUntilStart >= 12 && (booking.Status === 'Pending' || booking.Status === 'Approved');
  };

  if (!currentNic) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">EV Owner Portal</h1>
            <p className="text-gray-600 mt-2">Access your charging bookings and manage your account</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Access Your Account</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="nic" className="block text-sm font-medium text-gray-700">
                  NIC Number
                </label>
                <input
                  type="text"
                  id="nic"
                  className="input-field"
                  value={currentNic}
                  onChange={(e) => setCurrentNic(e.target.value)}
                  placeholder="Enter your NIC number"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Access Account'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">New User?</h2>
            <p className="text-gray-600 mb-4">Register as an EV owner to start booking charging sessions</p>
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="w-full btn-secondary"
            >
              Register Now
            </button>
          </div>
        </div>

        {/* Registration Modal */}
        <Modal
          isOpen={isRegisterModalOpen}
          closeModal={() => setIsRegisterModalOpen(false)}
          title="Register as EV Owner"
        >
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="NIC" className="block text-sm font-medium text-gray-700">
                NIC Number
              </label>
              <input
                type="text"
                name="NIC"
                required
                className="input-field"
                value={newOwner.NIC}
                onChange={handleOwnerInputChange}
                placeholder="Enter your NIC number"
              />
            </div>

            <div>
              <label htmlFor="FullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="FullName"
                required
                className="input-field"
                value={newOwner.FullName}
                onChange={handleOwnerInputChange}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="Phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="Phone"
                required
                className="input-field"
                value={newOwner.Phone}
                onChange={handleOwnerInputChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="Email"
                required
                className="input-field"
                value={newOwner.Email}
                onChange={handleOwnerInputChange}
                placeholder="Enter your email address"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Register
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600">NIC: {currentNic}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Booking
            </button>
            <button
              onClick={() => setCurrentNic('')}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Available Stations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Charging Stations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stations.map((station) => (
              <div key={station._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{station.Name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    station.Type === 'DC' 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {station.Type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Location: {station.Location}</p>
                <button
                  onClick={() => {
                    setNewBooking({ ...newBooking, StationId: station._id });
                    setIsBookingModalOpen(true);
                  }}
                  className="w-full btn-primary text-sm"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Booking History */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Booking History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Station
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookingHistory.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.StationName || 'Unknown Station'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(booking.StartUtc)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(booking.EndUtc)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.Status)}`}>
                        {booking.Status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {canCancelBooking(booking) && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {bookingHistory.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No bookings found. Create your first booking!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Booking Modal */}
        <Modal
          isOpen={isBookingModalOpen}
          closeModal={() => setIsBookingModalOpen(false)}
          title="Create New Booking"
        >
          <form onSubmit={handleCreateBooking} className="space-y-4">
            <div>
              <label htmlFor="StationId" className="block text-sm font-medium text-gray-700">
                Charging Station
              </label>
              <select
                name="StationId"
                required
                className="input-field"
                value={newBooking.StationId}
                onChange={handleBookingInputChange}
              >
                <option value="">Select a station</option>
                {stations.map((station) => (
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
                onChange={handleBookingInputChange}
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
                onChange={handleBookingInputChange}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Bookings can be cancelled up to 12 hours before the start time. 
                You'll receive a QR code for approved bookings that you\'ll need to show at the charging station.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
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
    </div>
  );
};

export default EVOwnerPortal;