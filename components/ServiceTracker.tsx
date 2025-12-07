'use client';

import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Trash2, Eye, Search, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { formatDate, calculateServiceDates } from '@/lib/utils';
import { saveCustomer } from '@/lib/db';

interface CustomerRecord {
  id: string;
  customerName: string;
  vehicleModel: string;
  registrationNumber: string;
  purchaseDate: string;
  createdAt: string;
  serviceStatus: {
    first: boolean;
    second: boolean;
    third: boolean;
  };
}

interface ServiceTrackerProps {
  records: CustomerRecord[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onView: (record: CustomerRecord) => void;
  onDelete: (id: string) => void;
  onReload: () => void;
}

export function ServiceTracker({ records, searchQuery, onSearchChange, onView, onDelete, onReload }: ServiceTrackerProps) {
  const handleStatusToggle = async (record: CustomerRecord, service: 'first' | 'second' | 'third') => {
    try {
      const updatedRecord = {
        ...record,
        serviceStatus: {
          ...record.serviceStatus,
          [service]: !record.serviceStatus[service],
        },
      };
      await saveCustomer(updatedRecord);
      onReload();
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Failed to update service status');
    }
  };

  const getServiceProgress = (record: CustomerRecord) => {
    const completed = Object.values(record.serviceStatus).filter(Boolean).length;
    return Math.round((completed / 3) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Services</h2>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by customer name, registration number, or vehicle model..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 text-lg"
          />
        </div>

        {records.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Found {records.length} record{records.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No customers found matching your search' : 'No customer records yet'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {searchQuery ? 'Try a different search term' : 'Create your first customer record to get started'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => {
            const serviceDates = calculateServiceDates(new Date(record.purchaseDate));
            const progress = getServiceProgress(record);
            
            return (
              <div
                key={record.id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{record.customerName}</h3>
                    <p className="text-gray-600">{record.vehicleModel} • {record.registrationNumber}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onView(record)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      onClick={() => onDelete(record.id)}
                      variant="secondary"
                      className="hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Service Completion</span>
                    <span className="text-sm font-bold text-blue-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Service Status Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* First Service */}
                  <div
                    className={`rounded-xl p-4 border-2 transition-all ${
                      record.serviceStatus.first
                        ? 'bg-green-50 border-green-500'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900">1st Service</h4>
                      <button
                        onClick={() => handleStatusToggle(record, 'first')}
                        className={`p-2 rounded-lg transition-all ${
                          record.serviceStatus.first
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      >
                        {record.serviceStatus.first ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(serviceDates.firstService)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">7 months</p>
                  </div>

                  {/* Second Service */}
                  <div
                    className={`rounded-xl p-4 border-2 transition-all ${
                      record.serviceStatus.second
                        ? 'bg-green-50 border-green-500'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900">2nd Service</h4>
                      <button
                        onClick={() => handleStatusToggle(record, 'second')}
                        className={`p-2 rounded-lg transition-all ${
                          record.serviceStatus.second
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      >
                        {record.serviceStatus.second ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(serviceDates.secondService)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">15 months</p>
                  </div>

                  {/* Third Service */}
                  <div
                    className={`rounded-xl p-4 border-2 transition-all ${
                      record.serviceStatus.third
                        ? 'bg-green-50 border-green-500'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900">3rd Service</h4>
                      <button
                        onClick={() => handleStatusToggle(record, 'third')}
                        className={`p-2 rounded-lg transition-all ${
                          record.serviceStatus.third
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      >
                        {record.serviceStatus.third ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(serviceDates.thirdService)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">23 months</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
