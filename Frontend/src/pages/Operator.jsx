import { useState } from 'react';
import { operatorAPI } from '../api/operator';
import { QrCodeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Operator = () => {
  const [qrPayload, setQrPayload] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finalizingBooking, setFinalizingBooking] = useState(null);

  const handleScanQR = async (e) => {
    e.preventDefault();
    if (!qrPayload) return;

    setLoading(true);
    try {
      const result = await operatorAPI.scanQR(qrPayload);
      setScanResult(result);
    } catch (error) {
      console.error('Error scanning QR:', error);
      setScanResult({ error: 'Failed to scan QR code' });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeBooking = async (bookingId) => {
    setFinalizingBooking(bookingId);
    try {
      await operatorAPI.finalizeBooking(bookingId);
      alert('Booking finalized successfully!');
      setScanResult(null);
      setQrPayload('');
    } catch (error) {
      console.error('Error finalizing booking:', error);
      alert('Failed to finalize booking');
    } finally {
      setFinalizingBooking(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Operator Tools</h1>
        <p className="text-gray-600">Scan QR codes and manage charging sessions</p>
      </div>

      {/* QR Scanner Section */}
      <div className="card">
        <div className="flex items-center mb-4">
          <QrCodeIcon className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">QR Code Scanner</h3>
        </div>
        
        <form onSubmit={handleScanQR} className="space-y-4">
          <div>
            <label htmlFor="qrPayload" className="block text-sm font-medium text-gray-700">
              QR Code Payload
            </label>
            <input
              type="text"
              id="qrPayload"
              className="input-field"
              value={qrPayload}
              onChange={(e) => setQrPayload(e.target.value)}
              placeholder="Enter QR code content (e.g., BOOKING:<bookingId>)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Expected format: BOOKING:&lt;bookingId&gt;
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !qrPayload}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Scanning...' : 'Scan QR Code'}
          </button>
        </form>
      </div>

      {/* Scan Result */}
      {scanResult && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Scan Result</h3>
          
          {scanResult.error ? (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error</p>
              <p>{scanResult.error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded">
                <p className="font-medium">QR Code Scanned Successfully</p>
              </div>

              {scanResult.booking && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Booking ID:</strong> {scanResult.booking._id}</p>
                    <p><strong>EV Owner NIC:</strong> {scanResult.booking.EVNic}</p>
                    <p><strong>Station:</strong> {scanResult.booking.StationName}</p>
                    <p><strong>Start Time:</strong> {new Date(scanResult.booking.StartUtc).toLocaleString()}</p>
                    <p><strong>End Time:</strong> {new Date(scanResult.booking.EndUtc).toLocaleString()}</p>
                    <p>
                      <strong>Status:</strong> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        scanResult.booking.Status === 'Approved' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {scanResult.booking.Status}
                      </span>
                    </p>
                  </div>

                  {scanResult.booking.Status === 'Approved' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleFinalizeBooking(scanResult.booking._id)}
                        disabled={finalizingBooking === scanResult.booking._id}
                        className="btn-success flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        {finalizingBooking === scanResult.booking._id ? 'Finalizing...' : 'Finalize Booking'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="card bg-blue-50">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Instructions</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>1. When an EV owner arrives, ask them to show their booking QR code</li>
          <li>2. Scan or manually enter the QR code content in the format: BOOKING:&lt;bookingId&gt;</li>
          <li>3. Verify the booking details match the customer's information</li>
          <li>4. If the booking is approved and the customer is ready, click "Finalize Booking"</li>
          <li>5. The charging session can now begin</li>
        </ul>
      </div>
    </div>
  );
};

export default Operator;