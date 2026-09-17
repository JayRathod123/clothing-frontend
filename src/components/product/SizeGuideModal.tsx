'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const chartData = [
    { size: 'S', chestIn: '42', chestCm: '107', lengthIn: '28', lengthCm: '71', shoulderIn: '20.5', shoulderCm: '52' },
    { size: 'M', chestIn: '44', chestCm: '112', lengthIn: '29', lengthCm: '74', shoulderIn: '21.5', shoulderCm: '55' },
    { size: 'L', chestIn: '47', chestCm: '119', lengthIn: '30', lengthCm: '76', shoulderIn: '22.5', shoulderCm: '57' },
    { size: 'XL', chestIn: '50', chestCm: '127', lengthIn: '31', lengthCm: '79', shoulderIn: '23.5', shoulderCm: '60' },
    { size: 'XXL', chestIn: '53', chestCm: '135', lengthIn: '32', lengthCm: '81', shoulderIn: '24.5', shoulderCm: '62' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Garment Size & Dimensions" maxWidth="lg">
      <div className="space-y-6">
        {/* Toggle Units */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#686868]">
            Measurements taken laid flat. Intentionally boxy drop-shoulder cut.
          </p>
          <div className="inline-flex border border-[#E6E3DD] p-0.5 bg-[#EFEEE9]">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 text-[10px] font-semibold tracking-wider uppercase transition-colors ${
                unit === 'in' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#686868]'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-[10px] font-semibold tracking-wider uppercase transition-colors ${
                unit === 'cm' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#686868]'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto border border-[#E6E3DD]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EFEEE9] text-[10px] font-semibold uppercase tracking-widest text-[#171717] border-b border-[#E6E3DD]">
              <tr>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Chest</th>
                <th className="py-3 px-4">Length</th>
                <th className="py-3 px-4">Shoulder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E3DD]">
              {chartData.map((row) => (
                <tr key={row.size} className="hover:bg-[#F7F6F2]">
                  <td className="py-3 px-4 font-semibold text-[#171717]">{row.size}</td>
                  <td className="py-3 px-4 text-[#686868]">
                    {unit === 'in' ? `${row.chestIn}"` : `${row.chestCm} cm`}
                  </td>
                  <td className="py-3 px-4 text-[#686868]">
                    {unit === 'in' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}
                  </td>
                  <td className="py-3 px-4 text-[#686868]">
                    {unit === 'in' ? `${row.shoulderIn}"` : `${row.shoulderCm} cm`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sizing Advisory */}
        <div className="bg-[#EFEEE9]/60 p-4 border border-[#E6E3DD] text-xs text-[#686868] space-y-1">
          <p className="font-semibold text-[#171717] uppercase tracking-wider text-[10px]">
            Fitting Recommendation
          </p>
          <p>
            Our silhouettes are engineered with relaxed drop-shoulders and a generous chest.
            Take your standard size for the intended modern streetwear aesthetic, or size down one
            for a more traditional slim profile.
          </p>
        </div>
      </div>
    </Modal>
  );
}
