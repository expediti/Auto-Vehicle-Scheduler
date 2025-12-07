'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Car, Calendar, FileText, User } from 'lucide-react';

interface FormData {
  customerName: string;
  vehicleModel: string;
  registrationNumber: string;
  purchaseDate: string;
}

interface ServiceFormProps {
  onSubmit: (data: FormData) => void;
}

export function ServiceForm({ onSubmit }: ServiceFormProps) {
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    vehicleModel: '',
    registrationNumber: '',
    purchaseDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <User className="w-4 h-4 text-tata-blue" />
          Customer Name
        </label>
        <Input
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="Enter customer full name"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Car className="w-4 h-4 text-tata-blue" />
          Vehicle Model
        </label>
        <Input
          name="vehicleModel"
          value={formData.vehicleModel}
          onChange={handleChange}
          placeholder="e.g., Tata Nexon, Tata Harrier"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <FileText className="w-4 h-4 text-tata-blue" />
          Registration Number
        </label>
        <Input
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleChange}
          placeholder="e.g., DL-01-AB-1234"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Calendar className="w-4 h-4 text-tata-blue" />
          Purchase Date
        </label>
        <Input
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full text-lg py-4">
        Generate Service Schedule
      </Button>
    </form>
  );
}
