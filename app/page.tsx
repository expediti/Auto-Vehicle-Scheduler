'use client';

import React, { useState, useEffect } from 'react';
import { ServiceForm } from '@/components/ServiceForm';
import { ServiceSchedule } from '@/components/ServiceSchedule';
import { ServiceTracker } from '@/components/ServiceTracker';
import { Car, Plus, Search, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveCustomer, getAllCustomers, deleteCustomer } from '@/lib/db';

interface FormData {
  customerName: string;
  vehicleModel: string;
  registrationNumber: string;
  vehicleNumber: string;
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
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AutoDate</h1>
                <p className="text-xs text-gray-500">Service Schedule Manager</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setCurrentView('home')}
                variant={currentView === 'home' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              <Button
                onClick={() => setCurrentView('form')}
                variant={currentView === 'form' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Customer
              </Button>
              <Button
                onClick={() => setCurrentView('tracker')}
                variant={currentView === 'tracker' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Track Services
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'home' && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6">
              <Car className="w-12 h-12 text-white" />
            </div>
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

      <footer className="text-center py-8 text-sm text-gray-500">
        <p>© 2025 AutoDate Service Manager. All rights reserved.</p>
      </footer>
    </main>
  );
}
