'use client';

import React from 'react';
import { Button } from './ui/button';
import { Download, Printer, Calendar, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { calculateServiceDates, formatDate } from '@/lib/utils';
import jsPDF from 'jspdf';

interface ScheduleData {
  customerName: string;
  vehicleModel: string;
  registrationNumber: string;
  purchaseDate: string;
  serviceStatus?: {
    first: boolean;
    second: boolean;
    third: boolean;
  };
}

interface ServiceScheduleProps {
  data: ScheduleData;
  onReset: () => void;
  onReload: () => void;
}

export function ServiceSchedule({ data, onReset, onReload }: ServiceScheduleProps) {
  const purchaseDate = new Date(data.purchaseDate);
  const serviceDates = calculateServiceDates(purchaseDate);

  const handleDownloadPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Modern gradient header
    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    // Add subtle pattern overlay
    pdf.setFillColor(59, 130, 246);
    for (let i = 0; i < 10; i++) {
      pdf.circle(pageWidth - 20 + i * 5, 10 + i * 3, 15, 'F');
    }
    
    // Header text
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AutoDate', pageWidth / 2, 22, { align: 'center' });
    
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Service Schedule Report', pageWidth / 2, 35, { align: 'center' });
    
    pdf.setFontSize(9);
    pdf.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, pageWidth / 2, 42, { align: 'center' });
    
    // Customer Details Section
    let y = 65;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Customer Information', 20, y);
    
    y += 3;
    pdf.setDrawColor(37, 99, 235);
    pdf.setLineWidth(0.5);
    pdf.line(20, y, 80, y);
    
    y += 10;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    // Customer details
    const details = [
      ['Customer Name', data.customerName],
      ['Vehicle Model', data.vehicleModel],
      ['Registration No.', data.registrationNumber],
      ['Purchase Date', formatDate(purchaseDate)],
    ];
    
    details.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.text(label + ':', 25, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text(value, 75, y);
      y += 8;
    });
    
    // Service Schedule Section
    y += 10;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Service Schedule', 20, y);
    
    y += 3;
    pdf.setDrawColor(37, 99, 235);
    pdf.line(20, y, 75, y);
    
    y += 12;
    
    // Service cards
    const services = [
      { 
        title: '1st Service', 
        period: '7 months after purchase',
        date: serviceDates.firstService,
        color: [59, 130, 246] as [number, number, number],
        status: data.serviceStatus?.first
      },
      { 
        title: '2nd Service', 
        period: '15 months after purchase',
        date: serviceDates.secondService,
        color: [99, 102, 241] as [number, number, number],
        status: data.serviceStatus?.second
      },
      { 
        title: '3rd Service', 
        period: '23 months after purchase',
        date: serviceDates.thirdService,
        color: [168, 85, 247] as [number, number, number],
        status: data.serviceStatus?.third
      },
    ];
    
    services.forEach((service) => {
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(20, y, pageWidth - 40, 28, 3, 3, 'F');
      
      const [r, g, b] = service.color;
      pdf.setFillColor(r, g, b);
      pdf.rect(20, y, 4, 28, 'F');
      
      if (service.status !== undefined) {
        if (service.status) {
          pdf.setFillColor(34, 197, 94);
          pdf.circle(pageWidth - 30, y + 14, 4, 'F');
          pdf.setTextColor(34, 197, 94);
          pdf.setFontSize(8);
          pdf.text('✓', pageWidth - 31, y + 15);
        } else {
          pdf.setFillColor(239, 68, 68);
          pdf.circle(pageWidth - 30, y + 14, 4, 'F');
          pdf.setTextColor(239, 68, 68);
          pdf.setFontSize(8);
          pdf.text('✗', pageWidth - 31, y + 15);
        }
      }
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.text(service.title, 30, y + 10);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(service.period, 30, y + 16);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(r, g, b);
      pdf.text(formatDate(service.date), 30, y + 23);
      
      y += 33;
    });
    
    // Footer
    pdf.setDrawColor(229, 231, 235);
    pdf.setLineWidth(0.3);
    pdf.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(156, 163, 175);
    pdf.text('AutoDate Service Manager', pageWidth / 2, pageHeight - 18, { align: 'center' });
    pdf.text('Professional Vehicle Service Scheduling System', pageWidth / 2, pageHeight - 13, { align: 'center' });
    
    const fileName = `${data.customerName.replace(/\s+/g, '_')}_Service_Schedule.pdf`;
    pdf.save(fileName);
  };

  const handlePrint = () => {
    window.print();
  };

  const today = new Date();
  const getServiceStatus = (serviceDate: Date) => {
    if (serviceDate < today) return 'overdue';
    if (serviceDate.getTime() - today.getTime() < 30 * 24 * 60 * 60 * 1000) return 'upcoming';
    return 'scheduled';
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      overdue: 'bg-red-100 text-red-700 border-red-300',
      upcoming: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      scheduled: 'bg-green-100 text-green-700 border-green-300',
    };
    
    const icons = {
      overdue: <AlertCircle className="w-4 h-4" />,
      upcoming: <Calendar className="w-4 h-4" />,
      scheduled: <CheckCircle className="w-4 h-4" />,
    };
    
    const labels = {
      overdue: 'Overdue',
      upcoming: 'Due Soon',
      scheduled: 'Scheduled',
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <Button onClick={onReset} variant="outline" className="flex items-center gap-2 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Button>

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Service Schedule</h2>
              <p className="text-sm text-gray-600">Generated on {formatDate(new Date())}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer Name</p>
              <p className="text-lg font-semibold text-gray-900">{data.customerName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vehicle Model</p>
              <p className="text-lg font-semibold text-gray-900">{data.vehicleModel}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Registration Number</p>
              <p className="text-lg font-semibold text-gray-900">{data.registrationNumber}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Purchase Date</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(purchaseDate)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Scheduled Service Dates</h3>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-gray-900">1st Service</h4>
              <div className="flex items-center gap-2">
                {data.serviceStatus?.first && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                )}
                <StatusBadge status={getServiceStatus(serviceDates.firstService)} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">After 7 months from purchase</p>
            <p className="text-2xl font-bold text-blue-600">{formatDate(serviceDates.firstService)}</p>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-l-4 border-indigo-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-gray-900">2nd Service</h4>
              <div className="flex items-center gap-2">
                {data.serviceStatus?.second && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                )}
                <StatusBadge status={getServiceStatus(serviceDates.secondService)} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">After 15 months from purchase</p>
            <p className="text-2xl font-bold text-indigo-600">{formatDate(serviceDates.secondService)}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-gray-900">3rd Service</h4>
              <div className="flex items-center gap-2">
                {data.serviceStatus?.third && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                )}
                <StatusBadge status={getServiceStatus(serviceDates.thirdService)} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">After 23 months from purchase</p>
            <p className="text-2xl font-bold text-purple-600">{formatDate(serviceDates.thirdService)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 no-print">
        <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
          <Printer className="w-5 h-5" />
          Print Schedule
        </Button>
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
