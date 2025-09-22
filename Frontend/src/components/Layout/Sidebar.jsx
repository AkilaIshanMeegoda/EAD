import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  DocumentTextIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, isBackoffice, isOperator } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['Backoffice', 'StationOperator'] },
    { name: 'Users', href: '/users', icon: UsersIcon, roles: ['Backoffice'] },
    { name: 'Stations', href: '/stations', icon: BuildingOfficeIcon, roles: ['Backoffice', 'StationOperator'] },
    { name: 'Bookings', href: '/bookings', icon: CalendarIcon, roles: ['Backoffice', 'StationOperator'] },
    { name: 'EV Owners', href: '/ev-owners', icon: DocumentTextIcon, roles: ['Backoffice'] },
    { name: 'Operator Tools', href: '/operator', icon: QrCodeIcon, roles: ['StationOperator'] }
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-center">EV Charging</h2>
        <p className="text-sm text-gray-300 text-center mt-1">Management System</p>
      </div>
      
      <nav className="space-y-2">
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;