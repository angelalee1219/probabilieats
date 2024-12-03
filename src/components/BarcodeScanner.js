// src/components/BarcodeScanner.js
import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';

const BarcodeScanner = ({ onScan, onClose }) => {
  const webcamRef = useRef(null);
  const [barcodeReader] = useState(new BrowserMultiFormatReader());
  const [scanning, setScanning] = useState(true);

  // Use useCallback to create a stable scanBarcode function
  const scanBarcode = useCallback(async () => {
    if (webcamRef.current) {
      try {
        // Capture image from webcam
        const imageSrc = webcamRef.current.getScreenshot();

        if (imageSrc) {
          // Attempt to decode the barcode from the image
          const result = await barcodeReader.decodeFromImage(undefined, imageSrc);

          if (result) {
            const sanitizedBarcode = result.text.trim(); // Sanitize the barcode
            setScanning(false); // Stop scanning
            onScan(sanitizedBarcode); // Pass the barcode to parent component
            setTimeout(onClose, 1000); // Close scanner after 1 second
          }
        }
      } catch (error) {
        // Ignore decoding errors and continue scanning
      }
    }
  }, [barcodeReader, onScan, onClose]);

  useEffect(() => {
    if (scanning) {
      // Perform barcode scanning every 500ms
      const interval = setInterval(() => scanBarcode(), 500);
      return () => clearInterval(interval); // Cleanup on component unmount or scanning state change
    }
  }, [scanning, scanBarcode]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 bg-white text-red-500 font-bold text-lg rounded-full z-50 hover:bg-gray-100"
        style={{ cursor: 'pointer' }}
      >
        Close
      </button>

      {/* Camera Feed */}
      <div className="relative bg-white rounded-lg p-6">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          videoConstraints={{ facingMode: "environment" }}
          className="rounded-lg"
        />
        <p className="text-center text-gray-700 mt-2">Align the barcode within the camera view</p>
      </div>
    </div>
  );
};

export default BarcodeScanner;
