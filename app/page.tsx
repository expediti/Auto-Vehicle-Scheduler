'use client';

import React, { useState } from 'react';
import { ServiceForm } from '@/components/ServiceForm';
import { ServiceSchedule } from '@/components/ServiceSchedule';
import { Car, Wrench } from 'lucide-react';

interface FormData {
  customerName: string;
  vehicleModel: string;
  registrationNumber: string;
  vehicleNumber: string;
  purchaseDate: string;
}

export default function Home() {
  const [scheduleData, setScheduleData] = useState<FormData | null>(null);

  const handleFormSubmit = (data: FormData) => {
    setScheduleData(data);
  };

  const handleReset = () => {
    setScheduleData(null);
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-tata-blue rounded-2xl flex items-center justify-center shadow-lg">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900">TATA MOTORS</h1>
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Wrench className="w-5 h-5 text-tata-blue" />
            <h2 className="text-2xl font-semibold text-gray-700">Vehicle Service Tracker</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Professional service schedule management system for Tata vehicle customers
          </p>
        </div>

        {!scheduleData ? (
          <ServiceForm onSubmit={handleFormSubmit} />
        ) : (
          <ServiceSchedule data={scheduleData} onReset={handleReset} />
        )}

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>© 2025 Tata Motors Service Tracker. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
