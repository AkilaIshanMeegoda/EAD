import { useState, useEffect } from 'react';
import { stationsAPI } from '../api/stations';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';

const Stations = () => {
  const { isBackoffice, isOperator } = useAuth();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [newStation, setNewStation] = useState({
    Name: '',
    Location: '',
    Type: 'DC'
  });
  const [newSchedule, setNewSchedule] = useState({
    Date: '',
    TotalSlots: 1,
    StartTimes: ['08:00']
  });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const data = await stationsAPI.getAll();
      setStations(data || []);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStation = async (e) => {
    e.preventDefault();
    try {
      await stationsAPI.create(newStation);
      setIsStationModalOpen(false);
      setNewStation({ Name: '', Location: '', Type: 'DC' });
      fetchStations();
    } catch (error) {
      console.error('Error creating station:', error);
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      const scheduleData = {
        ...newSchedule,
        Date: new Date(newSchedule.Date).toISOString()
      };
      await stationsAPI.addSchedule(selectedStation._id, scheduleData);
      setIsScheduleModalOpen(false);
      setNewSchedule({ Date: '', TotalSlots: 1, StartTimes: ['08:00'] });
      setSelectedStation(null);
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleStationInputChange = (e) => {
    setNewStation({
      ...newStation,
      [e.target.name]: e.target.value
    });
  };

  const handleScheduleInputChange = (e) => {
    if (e.target.name === 'StartTimes') {
      const times = e.target.value.split(',').map(time => time.trim());
      setNewSchedule({
        ...newSchedule,
        StartTimes: times
      });
    } else {
      setNewSchedule({
        ...newSchedule,
        [e.target.name]: e.target.value
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Stations</h1>
          <p className="text-gray-600">Manage charging stations and schedules</p>
        </div>
        {isBackoffice && (
          <button
            onClick={() => setIsStationModalOpen(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Station
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => (
          <div key={station._id} className="card">
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
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Location:</strong> {station.Location}</p>
              <p><strong>Status:</strong> <span className="text-green-600">Active</span></p>
            </div>

            {(isOperator || isBackoffice) && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedStation(station);
                    setIsScheduleModalOpen(true);
                  }}
                  className="btn-primary w-full flex items-center justify-center text-sm"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Add Schedule
                </button>
              </div>
            )}
          </div>
        ))}

        {stations.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No stations found</p>
          </div>
        )}
      </div>

      {/* Create Station Modal */}
      <Modal
        isOpen={isStationModalOpen}
        closeModal={() => setIsStationModalOpen(false)}
        title="Create New Station"
      >
        <form onSubmit={handleCreateStation} className="space-y-4">
          <div>
            <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
              Station Name
            </label>
            <input
              type="text"
              name="Name"
              required
              className="input-field"
              value={newStation.Name}
              onChange={handleStationInputChange}
              placeholder="Enter station name"
            />
          </div>

          <div>
            <label htmlFor="Location" className="block text-sm font-medium text-gray-700">
              Location (Coordinates)
            </label>
            <input
              type="text"
              name="Location"
              required
              className="input-field"
              value={newStation.Location}
              onChange={handleStationInputChange}
              placeholder="e.g., 6.9271,79.8612"
            />
          </div>

          <div>
            <label htmlFor="Type" className="block text-sm font-medium text-gray-700">
              Station Type
            </label>
            <select
              name="Type"
              className="input-field"
              value={newStation.Type}
              onChange={handleStationInputChange}
            >
              <option value="DC">DC Fast Charging</option>
              <option value="AC">AC Charging</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsStationModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Station
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        closeModal={() => {
          setIsScheduleModalOpen(false);
          setSelectedStation(null);
        }}
        title={`Add Schedule - ${selectedStation?.Name}`}
      >
        <form onSubmit={handleAddSchedule} className="space-y-4">
          <div>
            <label htmlFor="Date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="Date"
              required
              className="input-field"
              value={newSchedule.Date}
              onChange={handleScheduleInputChange}
            />
          </div>

          <div>
            <label htmlFor="TotalSlots" className="block text-sm font-medium text-gray-700">
              Total Slots
            </label>
            <input
              type="number"
              name="TotalSlots"
              min="1"
              required
              className="input-field"
              value={newSchedule.TotalSlots}
              onChange={handleScheduleInputChange}
            />
          </div>

          <div>
            <label htmlFor="StartTimes" className="block text-sm font-medium text-gray-700">
              Start Times (comma-separated, e.g., 08:00,09:00,10:00)
            </label>
            <input
              type="text"
              name="StartTimes"
              required
              className="input-field"
              value={newSchedule.StartTimes.join(',')}
              onChange={handleScheduleInputChange}
              placeholder="08:00,09:00,10:00"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsScheduleModalOpen(false);
                setSelectedStation(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Stations;