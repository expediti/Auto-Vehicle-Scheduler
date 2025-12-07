'use client';

import React, { useState, useEffect } from 'react';
import { ServiceForm } from '@/components/ServiceForm';
import { ServiceSchedule } from '@/components/ServiceSchedule';
import { ServiceTracker } from '@/components/ServiceTracker';
import { Car, Plus, Search as SearchIcon, Home as HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveCustomer, getAllCustomers, deleteCustomer } from '@/lib/db';

interface FormData {
  customerName: string;
  vehicleModel: string;
  registrationNumber: string;
  purchaseDate: string;
}

interface CustomerRecord extends FormData {
  id: string;
  createdAt: string;
  serviceStatus: {
    first: boolean;
    second: boolean;
    third: boolean;
  };
}

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'form' | 'schedule' | 'tracker'>('home');
  const [scheduleData, setScheduleData] = useState<CustomerRecord | null>(null);
  const [customerRecords, setCustomerRecords] = useState<CustomerRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const records = await getAllCustomers();
      setCustomerRecords(records as CustomerRecord[]);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      const newCustomer = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        serviceStatus: {
          first: false,
          second: false,
          third: false,
        },
      };
      await saveCustomer(newCustomer);
      setScheduleData(newCustomer);
      setCurrentView('schedule');
      await loadCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Error saving customer record. Please try again.');
    }
  };

  const handleViewRecord = (record: CustomerRecord) => {
    setScheduleData(record);
    setCurrentView('schedule');
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer record?')) {
      try {
        await deleteCustomer(id);
        await loadCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const filteredRecords = customerRecords.filter(record =>
    record.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile-Optimized Navigation Bar */}
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Logo Section */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Car className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-2xl font-bold text-gray-900">AutoDate</h1>
                <p className="text-xs text-gray-500 hidden lg:block">Service Manager</p>
              </div>
            </div>

            {/* Navigation Buttons - Icon only on mobile */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentView('home')}
                variant={currentView === 'home' ? 'default' : 'outline'}
                className="h-9 w-9 sm:w-auto sm:h-10 p-0 sm:px-4"
              >
                <HomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline sm:ml-2">Home</span>
              </Button>
              <Button
                onClick={() => setCurrentView('form')}
                variant={currentView === 'form' ? 'default' : 'outline'}
                className="h-9 w-9 sm:w-auto sm:h-10 p-0 sm:px-4"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline sm:ml-2">New</span>
              </Button>
              <Button
                onClick={() => setCurrentView('tracker')}
                variant={currentView === 'tracker' ? 'default' : 'outline'}
                className="h-9 w-9 sm:w-auto sm:h-10 p-0 sm:px-4"
              >
                <SearchIcon className="w-4 h-4" />
                <span className="hidden sm:inline sm:ml-2">Track</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {currentView === 'home' && (
          <div className="text-center py-12 sm:py-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-4 sm:mb-6">
              <Car className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Welcome to AutoDate</h2>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Professional vehicle service scheduling and tracking system for managing customer service records
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mt-8 sm:mt-12">
              <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Add Customer</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Create new service schedules for customers</p>
                <Button onClick={() => setCurrentView('form')} className="w-full">
                  Get Started
                </Button>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <SearchIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Track Services</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Search and manage service completion</p>
                <Button onClick={() => setCurrentView('tracker')} variant="outline" className="w-full">
                  View Tracker
                </Button>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Car className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Total Records</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Manage all customer records</p>
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

      <footer className="text-center py-6 sm:py-8 border-t border-gray-200 mt-8 sm:mt-12">
        <div className="space-y-2 sm:space-y-3 px-4">
          <p className="text-xs sm:text-sm text-gray-500">
            © 2025 AutoDate Service Manager. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>by</span>
            <a 
              href="https://github.com/BroxGit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold hover:underline transition-all"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              BroxGit
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
