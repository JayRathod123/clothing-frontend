'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Tabs } from '@/components/ui/Tabs';
import { Ruler, Sparkles, CheckCircle2 } from 'lucide-react';

interface MeasurementRow {
  size: string;
  chestInches: string;
  chestCm: string;
  lengthInches: string;
  lengthCm: string;
  shoulderInches: string;
  shoulderCm: string;
  sleeveInches: string;
  sleeveCm: string;
}

const OVERSIZED_DATA: MeasurementRow[] = [
  { size: 'XS', chestInches: '42.0', chestCm: '106.7', lengthInches: '27.5', lengthCm: '69.8', shoulderInches: '20.5', shoulderCm: '52.0', sleeveInches: '8.5', sleeveCm: '21.5' },
  { size: 'S', chestInches: '44.0', chestCm: '111.8', lengthInches: '28.5', lengthCm: '72.4', shoulderInches: '21.5', shoulderCm: '54.6', sleeveInches: '9.0', sleeveCm: '22.8' },
  { size: 'M', chestInches: '46.0', chestCm: '116.8', lengthInches: '29.5', lengthCm: '74.9', shoulderInches: '22.5', shoulderCm: '57.1', sleeveInches: '9.5', sleeveCm: '24.1' },
  { size: 'L', chestInches: '48.0', chestCm: '121.9', lengthInches: '30.5', lengthCm: '77.5', shoulderInches: '23.5', shoulderCm: '59.7', sleeveInches: '10.0', sleeveCm: '25.4' },
  { size: 'XL', chestInches: '50.0', chestCm: '127.0', lengthInches: '31.5', lengthCm: '80.0', shoulderInches: '24.5', shoulderCm: '62.2', sleeveInches: '10.5', sleeveCm: '26.6' },
  { size: 'XXL', chestInches: '52.0', chestCm: '132.0', lengthInches: '32.0', lengthCm: '81.3', shoulderInches: '25.5', shoulderCm: '64.7', sleeveInches: '11.0', sleeveCm: '27.9' },
];

const REGULAR_DATA: MeasurementRow[] = [
  { size: 'S', chestInches: '38.0', chestCm: '96.5', lengthInches: '27.0', lengthCm: '68.5', shoulderInches: '17.5', shoulderCm: '44.5', sleeveInches: '8.0', sleeveCm: '20.3' },
  { size: 'M', chestInches: '40.0', chestCm: '101.6', lengthInches: '28.0', lengthCm: '71.1', shoulderInches: '18.5', shoulderCm: '47.0', sleeveInches: '8.5', sleeveCm: '21.5' },
  { size: 'L', chestInches: '42.0', chestCm: '106.7', lengthInches: '29.0', lengthCm: '73.6', shoulderInches: '19.5', shoulderCm: '49.5', sleeveInches: '9.0', sleeveCm: '22.8' },
  { size: 'XL', chestInches: '44.0', chestCm: '111.8', lengthInches: '30.0', lengthCm: '76.2', shoulderInches: '20.5', shoulderCm: '52.0', sleeveInches: '9.5', sleeveCm: '24.1' },
  { size: 'XXL', chestInches: '46.0', chestCm: '116.8', lengthInches: '31.0', lengthCm: '78.7', shoulderInches: '21.5', shoulderCm: '54.6', sleeveInches: '10.0', sleeveCm: '25.4' },
];

export default function SizeChartPage() {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [fitType, setFitType] = useState('oversized');

  const fitTabs = [
    { id: 'oversized', label: 'Oversized Fit (Boxy)' },
    { id: 'regular', label: 'Regular Classic Fit' },
  ];

  const currentData = fitType === 'oversized' ? OVERSIZED_DATA : REGULAR_DATA;

  return (
    <div className="py-8 min-h-screen bg-neutral-50/50">
      <Container size="md">
        <Breadcrumb items={[{ label: 'Size Chart' }]} />

        {/* Header */}
        <div className="pt-4 pb-8 border-b border-neutral-200 text-center space-y-3">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-red-600 block">
            PRECISION FIT GUIDE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-900">
            Size Chart & Fit Guide
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto font-normal leading-relaxed">
            All our garments are pre-shrunk to avoid post-wash alterations. Select your standard size for the intended drop.
          </p>
        </div>

        {/* Controls: Fit Switcher & Unit Toggle */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Tabs
            tabs={fitTabs}
            activeTab={fitType}
            onChange={setFitType}
            variant="pill"
          />

          {/* Unit Switcher */}
          <div className="flex items-center gap-1 bg-neutral-200 p-1 rounded-none border border-neutral-300">
            <button
              type="button"
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                unit === 'inches' ? 'bg-black text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              Inches (in)
            </button>
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                unit === 'cm' ? 'bg-black text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="bg-white border border-neutral-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900 text-white font-black uppercase tracking-widest text-[11px]">
                <th className="p-4 border-b border-neutral-800">Size</th>
                <th className="p-4 border-b border-neutral-800">Chest ({unit === 'inches' ? 'in' : 'cm'})</th>
                <th className="p-4 border-b border-neutral-800">Length ({unit === 'inches' ? 'in' : 'cm'})</th>
                <th className="p-4 border-b border-neutral-800">Shoulder ({unit === 'inches' ? 'in' : 'cm'})</th>
                <th className="p-4 border-b border-neutral-800">Sleeve ({unit === 'inches' ? 'in' : 'cm'})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {currentData.map((row) => (
                <tr key={row.size} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-4 font-black text-neutral-900">{row.size}</td>
                  <td className="p-4 font-medium text-neutral-700">
                    {unit === 'inches' ? `${row.chestInches}"` : `${row.chestCm} cm`}
                  </td>
                  <td className="p-4 font-medium text-neutral-700">
                    {unit === 'inches' ? `${row.lengthInches}"` : `${row.lengthCm} cm`}
                  </td>
                  <td className="p-4 font-medium text-neutral-700">
                    {unit === 'inches' ? `${row.shoulderInches}"` : `${row.shoulderCm} cm`}
                  </td>
                  <td className="p-4 font-medium text-neutral-700">
                    {unit === 'inches' ? `${row.sleeveInches}"` : `${row.sleeveCm} cm`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Measure Info */}
        <div className="mt-12 bg-white border border-neutral-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-1 pb-3 border-b border-neutral-200">
            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-red-600" />
              How to Measure For The Best Fit
            </h3>
            <p className="text-xs text-neutral-500">
              Measure a favorite t-shirt from your current wardrobe laying flat on a table.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs leading-relaxed text-neutral-600">
            <div className="space-y-1.5">
              <strong className="text-neutral-900 block uppercase font-bold">1. Chest Width</strong>
              <p>Measure 1 inch below the armholes across the fullest part of the chest from seam to seam, then double the measurement.</p>
            </div>
            <div className="space-y-1.5">
              <strong className="text-neutral-900 block uppercase font-bold">2. Body Length</strong>
              <p>Measure from the highest point of the shoulder seam straight down to the bottom hem of the t-shirt.</p>
            </div>
            <div className="space-y-1.5">
              <strong className="text-neutral-900 block uppercase font-bold">3. Shoulder Drop</strong>
              <p>Measure straight across from one shoulder seam to the opposite shoulder seam.</p>
            </div>
          </div>
        </div>

        {/* Model Reference Note */}
        <div className="mt-8 p-4 bg-black text-white flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Model in catalog is 6'1" (185 cm) wearing Size L for the intended boxy silhouette.</span>
          </div>
        </div>
      </Container>
    </div>
  );
}
