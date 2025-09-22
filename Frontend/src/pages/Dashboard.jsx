import { useState, useEffect } from 'react';
import { bookingsAPI } from '../api/bookings';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [futureApprovedCount, setFutureApprovedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [pending, futureApproved] = await Promise.all([
          bookingsAPI.getPendingCount(),
          bookingsAPI.getFutureApprovedCount()
        ]);
        setPendingCount(pending.count || 0);
        setFutureApprovedCount(futureApproved.count || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Pending Bookings',
      value: pendingCount,
      icon: ClockIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Future Approved Bookings',
      value: futureApprovedCount,
      icon: CalendarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your charging station operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className={`card ${stat.bgColor}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className={`text-3xl font-semibold ${stat.color}`}>
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/bookings"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Manage Bookings</div>
              <div className="text-sm text-gray-600">View and approve pending bookings</div>
            </a>
            <a
              href="/stations"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Manage Stations</div>
              <div className="text-sm text-gray-600">Add schedules and update station information</div>
            </a>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-sm text-gray-600">
            <p>Activity tracking coming soon...</p>
            <p className="mt-2">This section will show recent bookings, station updates, and other important events.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;