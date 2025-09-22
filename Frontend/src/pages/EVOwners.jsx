import { useState } from 'react';
import { evOwnersAPI } from '../api/evowners';
import { bookingsAPI } from '../api/bookings';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';

const EVOwners = () => {
  const [searchNic, setSearchNic] = useState('');
  const [ownerHistory, setOwnerHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOwner, setNewOwner] = useState({
    NIC: '',
    FullName: '',
    Phone: '',
    Email: ''
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchNic) return;
    
    setLoading(true);
    try {
      const history = await bookingsAPI.getOwnerHistory(searchNic);
      setOwnerHistory(history || []);
    } catch (error) {
      console.error('Error fetching owner history:', error);
      setOwnerHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOwner = async (e) => {
    e.preventDefault();
    try {
      await evOwnersAPI.create(newOwner);
      setIsModalOpen(false);
      setNewOwner({ NIC: '', FullName: '', Phone: '', Email: '' });
      alert('EV Owner registered successfully!');
    } catch (error) {
      console.error('Error creating EV owner:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewOwner({
      ...newOwner,
      [e.target.name]: e.target.value
    });
  };

  const handleActivateOwner = async (nic) => {
    try {
      await evOwnersAPI.activate(nic);
      alert('EV Owner activated successfully!');
    } catch (error) {
      console.error('Error activating owner:', error);
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">EV Owners</h1>
          <p className="text-gray-600">Manage EV owners and view their booking history</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Register EV Owner
        </button>
      </div>

      {/* Search Section */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Search Owner History</h3>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter NIC number to search booking history"
              className="input-field"
              value={searchNic}
              onChange={(e) => setSearchNic(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn-primary flex items-center"
            disabled={loading}
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Search
          </button>
        </form>
      </div>

      {/* Owner History */}
      {searchNic && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Booking History for NIC: {searchNic}
            </h3>
            <button
              onClick={() => handleActivateOwner(searchNic)}
              className="btn-success text-sm"
            >
              Activate Owner
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : (
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ownerHistory.map((booking) => (
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
                    </tr>
                  ))}
                  {ownerHistory.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No booking history found for this NIC
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Register Owner Modal */}
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        title="Register New EV Owner"
      >
        <form onSubmit={handleCreateOwner} className="space-y-4">
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
              onChange={handleInputChange}
              placeholder="Enter NIC number"
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
              onChange={handleInputChange}
              placeholder="Enter full name"
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
              onChange={handleInputChange}
              placeholder="Enter phone number"
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
              onChange={handleInputChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Register Owner
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EVOwners;