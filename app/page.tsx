'use client';

import React, { useState, useEffect } from 'react';
import { ServiceForm } from '@/components/ServiceForm';
import { ServiceSchedule } from '@/components/ServiceSchedule';
import { ServiceTracker } from '@/components/ServiceTracker';
import { Car, Plus, Search as SearchIcon, Home as HomeIcon, Moon, Sun, Download } from 'lucide-react';
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
  const [darkMode, setDarkMode] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    loadCustomers();
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // PWA Install Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for iOS or when prompt is not available
      alert('To install:\n\n1. Tap Share button\n2. Select "Add to Home Screen"\n3. Tap "Add"');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    
    setDeferredPrompt(null);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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
      const newCustomer: CustomerRecord = {
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
    <main className={`min-h-screen transition-colors ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Install Button Banner */}
      {showInstallButton && (
        <div className={`sticky top-0 z-50 ${darkMode ? 'bg-blue-900' : 'bg-blue-600'} text-white px-4 py-3 shadow-lg`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              <span className="text-sm font-semibold">Install AutoDate App</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="bg-white text-blue-600 px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallButton(false)}
                className="text-white hover:text-blue-200 text-sm px-2"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`shadow-md border-b sticky top-0 z-40 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>AutoDate</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('home')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  currentView === 'home'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <HomeIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setCurrentView('form')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  currentView === 'form'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Plus className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setCurrentView('tracker')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  currentView === 'tracker'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              <button
                onClick={toggleDarkMode}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ml-2 ${
                  darkMode
                    ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                    : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Rest of your content stays the same... */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {currentView === 'home' && (
          <div className="text-center py-12 sm:py-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-4 sm:mb-6">
              <Car className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h2 className={`text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Welcome to AutoDate</h2>
            <p className={`text-base sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Professional vehicle service scheduling and tracking system for managing customer service records
            </p>
            
            {/* Show install button on home page too */}
            {showInstallButton && (
              <Button onClick={handleInstallClick} className="mb-8 bg-green-600 hover:bg-green-700">
                <Download className="w-5 h-5 mr-2" />
                Install App for Offline Use
              </Button>
            )}
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mt-8 sm:mt-12">
              {/* Rest of home content... */}
            </div>
          </div>
        )}

        {/* Other views remain the same */}
      </div>
    </main>
  );
}
