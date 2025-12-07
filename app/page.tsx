import { Button } from "@/components/ui/button";
import { Plus, Search, Car } from "lucide-react";

export default function HomePage() {
  // Assume these states and functions are defined elsewhere in your component
  const [currentView, setCurrentView] = useState<'home' | 'form' | 'schedule' | 'tracker'>('home');
  const [customerRecords, setCustomerRecords] = useState<any[]>([]);
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);

  // Assume these functions are defined elsewhere
  const handleFormSubmit = () => {};
  const loadCustomers = () => {};
  const handleViewRecord = () => {};
  const handleDeleteRecord = () => {};

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {currentView === 'home' && (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to AutoDate</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Professional vehicle service scheduling and tracking system for managing customer service records
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Add Customer</h3>
                <p className="text-gray-600 mb-4">Create new service schedules for customers</p>
                <Button onClick={() => setCurrentView('form')} className="w-full">
                  Get Started
                </Button>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Track Services</h3>
                <p className="text-gray-600 mb-4">Search and manage service completion</p>
                <Button onClick={() => setCurrentView('tracker')} variant="outline" className="w-full">
                  View Tracker
                </Button>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Car className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Total Records</h3>
                <p className="text-gray-600 mb-4">Manage all customer records</p>
                <div className="text-3xl font-bold text-blue-600">{customerRecords.length}</div>
              </div>
            </div>
          </div>
        )}
        {currentView === 'form' && (
          <div className="max-w-2xl mx-auto">
            <ServiceForm onSubmit={handleFormSubmit} />
          </div>
        )}
        {currentView === 'schedule' && scheduleData && (
          <div className="max-w-4xl mx-auto">
            <ServiceSchedule
              data={scheduleData}
              onReset={() => setCurrentView('home')}
              onReload={loadCustomers}
            />
          </div>
        )}
        {currentView === 'tracker' && (
          <ServiceTracker
            records={filteredRecords}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onView={handleViewRecord}
            onDelete={handleDeleteRecord}
            onReload={loadCustomers}
          />
        )}
      </div>
      <footer className="text-center py-8 text-sm text-gray-500 border-t border-gray-200 mt-12">
        <p className="mb-2">© 2025 AutoDate Service Manager. All rights reserved.</p>
        <p className="text-xs text-gray-400">
          Made with ❤️ by{' '}
          <a
            href="https://github.com/BroxGit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
          >
            BroxGit
          </a>
        </p>
      </footer>
    </main>
  );
}
