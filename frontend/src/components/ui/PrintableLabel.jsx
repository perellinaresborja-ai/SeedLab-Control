import React from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';

export function PrintableLabel({ batch }) {
  if (!batch) return null;

  return createPortal(
    <div id="print-root" className="hidden print:flex flex-col bg-white text-black overflow-hidden font-sans" style={{ width: '50mm', height: '25mm', padding: '2mm' }}>
      <div className="flex justify-between items-center h-full">
        <div className="flex flex-col justify-between h-full w-[60%]">
          <div>
            <h1 className="text-[9px] font-bold leading-tight truncate">{batch.variety}</h1>
            <p className="text-[7px] text-gray-700 font-mono mt-0.5">{batch.id}</p>
          </div>
          <div>
            <p className="text-[6px] text-gray-500">Exp: {batch.date}</p>
            <p className="text-[6px] font-bold mt-0.5">SeedLab GACP</p>
          </div>
        </div>
        <div className="w-[40%] flex items-center justify-center">
          <QRCodeSVG value={batch.id} size={50} level="H" />
        </div>
      </div>
    </div>,
    document.body
  );
}
