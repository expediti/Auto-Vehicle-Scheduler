'use client';

import React from 'react';
import { Button } from './ui/button';
import { Trash2, FileText, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CustomerRecord {
  id: string;
  customerName: string;
  vehicleModel: string;
  registrationNumber: string;
  vehicleNumber: string;
  purchaseDate: string;
  createdAt: string;
}

interface CustomerHistoryProps {
  records: CustomerRecord[];
  onView: (record: CustomerRecord) => void;
  onDelete: (id: string) => void;
}

export function CustomerHistory({ records, onView, onDelete }: CustomerHistoryProps) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No customer records yet</p>
        <p className="text-gray-400 text-sm">Create your first service schedule to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Records ({records.length})</h2>
      
      {records.map((record) => (
        <div
          key={record.id}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{record.customerName}</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Vehicle Model</p>
                  <p className="font-semibold text-gray-900">{record.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-gray-500">Registration No</p>
                  <p className="font-semibold text-gray-900">{record.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Purchase Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(new Date(record.purchaseDate))}</p>
                </div>
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-semibold text-gray-900">{formatDate(new Date(record.createdAt))}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 ml-4">
              <Button
                onClick={() => onView(record)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                View
              </Button>
              <Button
                onClick={() => onDelete(record.id)}
                variant="secondary"
                className="flex items-center gap-2 hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
