// src/pages/AdminDashboard.tsx

import React, { useEffect, useState } from 'react'; // Ensure React is imported
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, DollarSign, Bell, Package, MessageSquare, FileText, Settings
} from 'lucide-react';
// REMOVE Profile as UserProfile import - it's unused
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Interfaces ---
interface CampPackage { id: string; name: string; description: string; price: number; capacity: number; startDate: string | Date; endDate: string | Date; activities: string[]; isActive?: boolean; }
interface Booking { id: string; camperId: string; camperName?: string; camperEmail?: string; packageId: string; packageName?: string; status: 'pending' | 'approved' | 'denied'; paymentStatus: 'pending' | 'completed' | 'failed'; amount: number; createdAt: string | Date; }
interface CamperProfile { _id: string; firebaseUid: string; role: 'camper'; fullName: string; email: string | null; dateOfBirth?: string | Date | null; }
interface StatCardProps { title: string; value: string | number; icon: React.ElementType; color: 'blue' | 'green' | 'yellow' | 'purple'; }
interface BookingStatusBadgeProps { status: Booking['status']; }
interface PaymentStatusBadgeProps { status: Booking['paymentStatus']; }
interface StatusBadgeBaseProps extends React.HTMLAttributes<HTMLSpanElement> { status: string; styles: Record<string, string>; }


// --- Helper Components ---
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
    const colorClasses = { blue: { bg: 'bg-blue-100', text: 'text-blue-600' }, green: { bg: 'bg-green-100', text: 'text-green-600' }, yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' }, purple: { bg: 'bg-purple-100', text: 'text-purple-600' }, };
    return (
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
                </div>
                <div className={`${colorClasses[color].bg} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${colorClasses[color].text}`} aria-hidden="true" />
                </div>
            </div>
        </div> // Ensure this div closes correctly
    );
};
const StatusBadgeBase: React.FC<StatusBadgeBaseProps> = ({ status, styles, className = '', ...props }) => ( <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${styles[status] ?? 'bg-gray-100 text-gray-800'} ${className}`} {...props}> {status} </span> );
const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => { const styles = { pending: 'bg-yellow-100 text-yellow-800', approved: 'bg-green-100 text-green-800', denied: 'bg-red-100 text-red-800', }; return <StatusBadgeBase status={status} styles={styles} />; }
const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => { const styles = { pending: 'bg-yellow-100 text-yellow-800', completed: 'bg-green-100 text-green-800', failed: 'bg-orange-100 text-orange-800', }; return <StatusBadgeBase status={status} styles={styles} />; }
// --- End Helper Components ---


// --- Main Component ---
const AdminDashboardComponent = () => {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [campers, setCampers] = useState<CamperProfile[]>([]);
  const [packages, setPackages] = useState<CampPackage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [revenueData, setRevenueData] = useState<{month: string, revenue: number}[]>([]);

  useEffect(() => {
    if (!authLoading) { if (!profile || profile.role !== 'admin') { navigate('/login'); return; } loadDashboardData(); }
  }, [profile, authLoading, navigate]);

  const loadDashboardData = () => { /* ... Mock data loading logic ... */
    setLoadingData(true); setTimeout(() => { const mockCampers: CamperProfile[] = [ { _id: 'camper1', firebaseUid: 'fbUid1', role: 'camper', fullName: 'Alice Wonderland', email: 'alice@example.com', dateOfBirth: '2012-05-10'}, { _id: 'camper2', firebaseUid: 'fbUid2', role: 'camper', fullName: 'Bob Builder', email: 'bob@example.com', dateOfBirth: '2011-11-20'}, ]; const mockPackages: CampPackage[] = [ { id: 'pkg1', name: 'Forest Fun', description: 'Explore woods!', price: 950, capacity: 25, startDate: '2024-07-10', endDate: '2024-07-17', activities: ['Hiking', 'Crafts'], isActive: true }, { id: 'pkg2', name: 'Lake Life', description: 'Water activities.', price: 1100, capacity: 30, startDate: '2024-07-18', endDate: '2024-07-25', activities: ['Swimming', 'Canoeing'], isActive: true }, ]; const mockBookings: Booking[] = [ { id: 'book1', camperId: 'fbUid1', packageId: 'pkg1', status: 'approved', paymentStatus: 'completed', amount: 950, createdAt: '2024-05-01T10:00:00Z' }, { id: 'book2', camperId: 'fbUid2', packageId: 'pkg2', status: 'pending', paymentStatus: 'pending', amount: 1100, createdAt: '2024-05-15T11:30:00Z' }, ]; mockBookings.forEach(b => { const camper = mockCampers.find(c => c.firebaseUid === b.camperId); const pkg = mockPackages.find(p => p.id === b.packageId); b.camperName = camper?.fullName; b.camperEmail = camper?.email ?? undefined; b.packageName = pkg?.name; }); setCampers(mockCampers); setPackages(mockPackages.filter(p => p.isActive)); setBookings(mockBookings); setRevenueData([{ month: 'May', revenue: 950 }, { month: 'Jun', revenue: 2500 }]); setLoadingData(false); console.log("AdminDashboard: Mock data loaded."); }, 500);
  };
  const getTotalRevenue = () => bookings.filter(b => b.paymentStatus === 'completed').reduce((sum, b) => sum + b.amount, 0);

  // --- Render Functions ---
  const renderLoading = () => ( <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm"><div className="text-gray-500">Loading dashboard data...</div></div> );

  const renderOverview = () => (
    <div className="space-y-6">
        {/* Stats Grid - Check closing tags carefully */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Campers" value={campers.length} icon={Users} color="blue" />
            <StatCard title="Active Packages" value={packages.length} icon={Package} color="green" />
            <StatCard title="Pending Bookings" value={bookings.filter(b => b.status === 'pending').length} icon={Calendar} color="yellow" />
            <StatCard title="Completed Revenue" value={`$${getTotalRevenue().toLocaleString()}`} icon={DollarSign} color="purple" />
        </div>
         {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Revenue</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div> // Closing div for renderOverview
  );
  // ... other render functions (renderCampersTable, renderPackages, renderBookingsTable, renderPlaceholder) remain the same ...
  const renderCampersTable = () => ( <div className="bg-white rounded-lg shadow overflow-hidden"> <div className="p-4 sm:p-6 border-b border-gray-200"><h2 className="text-xl font-semibold text-gray-800">Manage Campers</h2></div> <div className="overflow-x-auto"> <table className="min-w-full divide-y divide-gray-200"> <thead className="bg-gray-50"><tr> <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th> <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th> <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th> <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead> <tbody className="bg-white divide-y divide-gray-200"> {campers.length > 0 ? campers.map((camper) => ( <tr key={camper._id}> <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{camper.fullName}</div></td> <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{camper.email || 'N/A'}</div></td> <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{camper.dateOfBirth ? new Date(camper.dateOfBirth).toLocaleDateString() : 'N/A'}</div></td> <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"> <button className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-150 ease-in-out">View</button> <button className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out">Remove</button> </td> </tr> )) : (<tr><td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">No campers found.</td></tr>)}</tbody></table></div></div>);
  const renderPackages = () => ( <div className="space-y-6"> <div className="flex justify-between items-center"><h2 className="text-xl font-semibold text-gray-800">Camp Packages</h2><button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium shadow-sm transition duration-150 ease-in-out">Add New Package</button></div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {packages.length > 0 ? packages.map((pkg) => ( <div key={pkg.id} className="bg-white rounded-lg shadow p-4 md:p-6 hover:shadow-md transition-shadow duration-200 flex flex-col"> <div><h3 className="text-lg font-semibold mb-2 text-gray-900">{pkg.name}</h3><p className="text-sm text-gray-600 mb-3">{pkg.description}</p><div className="space-y-1 text-xs mb-3 text-gray-700"><p><strong>Price:</strong> ${pkg.price.toLocaleString()}</p><p><strong>Capacity:</strong> {pkg.capacity}</p><p><strong>Dates:</strong> {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}</p><p><strong>Activities:</strong> {pkg.activities.join(', ')}</p></div></div> <div className="mt-auto flex space-x-2 border-t pt-3 border-gray-100"><button className="text-xs text-blue-600 hover:text-blue-800 font-medium transition duration-150 ease-in-out">Edit</button><button className="text-xs text-red-600 hover:text-red-800 font-medium transition duration-150 ease-in-out">Delete</button></div></div> )) : (<p className="text-center text-gray-500 col-span-full py-12">No active packages found.</p>)}</div></div>);
  const renderBookingsTable = () => ( <div className="bg-white rounded-lg shadow overflow-hidden"> <div className="p-4 sm:p-6 border-b border-gray-200"><h2 className="text-xl font-semibold text-gray-800">Manage Bookings</h2></div> <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Camper</th><th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th><th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th><th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th><th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{bookings.length > 0 ? bookings.map((booking) => (<tr key={booking.id}><td className="px-4 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{booking.camperName || 'N/A'}</div><div className="text-xs text-gray-500">{booking.camperEmail || 'N/A'}</div></td><td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{booking.packageName || 'N/A'}</td><td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${booking.amount.toLocaleString()}</td><td className="px-4 py-4 whitespace-nowrap text-center"><BookingStatusBadge status={booking.status} /></td><td className="px-4 py-4 whitespace-nowrap text-center"><PaymentStatusBadge status={booking.paymentStatus} /></td><td className="px-4 py-4 whitespace-nowrap text-xs font-medium">{booking.status === 'pending' && (<><button className="text-green-600 hover:text-green-900 mr-2 transition duration-150 ease-in-out">Approve</button><button className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out">Deny</button></>)}{booking.status !== 'pending' && (<button className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out">View</button>)}</td></tr>)) : (<tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">No bookings found.</td></tr>)}</tbody></table></div></div>);
  const renderPlaceholder = (tabName: string) => ( <div className="bg-white rounded-lg shadow p-12 text-center"><h2 className="text-xl font-semibold text-gray-700 mb-4 capitalize">{tabName}</h2><p className="text-gray-500">This section is under construction.</p></div> );


  const renderTabContent = () => {
    if (loadingData) return renderLoading();
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'campers': return renderCampersTable();
      case 'packages': return renderPackages();
      case 'bookings': return renderBookingsTable();
      case 'payments':
      case 'notifications':
      case 'feedback':
      case 'reports':
        return renderPlaceholder(activeTab);
      default: return <p>Unknown tab selected.</p>;
    }
  };

  // --- Sidebar Items ---
  const sidebarItems = [ { key: 'overview', label: 'Overview', icon: Settings }, { key: 'campers', label: 'Campers', icon: Users }, { key: 'packages', label: 'Packages', icon: Package }, { key: 'bookings', label: 'Bookings', icon: Calendar }, { key: 'payments', label: 'Payments', icon: DollarSign }, { key: 'notifications', label: 'Notifications', icon: Bell }, { key: 'feedback', label: 'Feedback', icon: MessageSquare }, { key: 'reports', label: 'Reports', icon: FileText }, ];

  // --- Component Return ---
  if (authLoading) { return ( <div className="flex items-center justify-center h-screen"><div className="text-lg font-medium text-gray-600">Loading Admin Access...</div></div> ); }

  return ( <div className="min-h-screen bg-gray-100"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1> <div className="flex flex-col lg:flex-row gap-6 lg:gap-8"> <aside className="w-full lg:w-64 flex-shrink-0"> <div className="space-y-1 bg-white rounded-lg shadow p-4 sticky top-20"> {sidebarItems.map(item => ( <button key={item.key} onClick={() => setActiveTab(item.key)} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition duration-150 ease-in-out ${ activeTab === item.key ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' }`} > <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" /> <span className="truncate">{item.label}</span> </button> ))} </div> </aside> <div className="flex-1 min-w-0">{renderTabContent()}</div> </div> </div> </div> );
};

// Use named export
export { AdminDashboardComponent as AdminDashboard };