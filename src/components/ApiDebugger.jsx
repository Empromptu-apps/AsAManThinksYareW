import React, { useState } from 'react';

const ApiDebugger = ({ apiCalls, createdObjects, onClose }) => {
  const [selectedCall, setSelectedCall] = useState(null);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            API Debug Console
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close debug console"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* API Calls List */}
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                API Calls ({apiCalls.length})
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Created Objects: {createdObjects.join(', ') || 'None'}
              </div>
            </div>
            
            <div className="space-y-2 p-4">
              {apiCalls.map((call) => (
                <div
                  key={call.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCall?.id === call.id
                      ? 'bg-primary-100 dark:bg-primary-900/20 border border-primary-300'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedCall(call)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-800 dark:text-white">
                      {call.method} {call.endpoint}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      call.status === 'success' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {call.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(call.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              
              {apiCalls.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No API calls yet
                </div>
              )}
            </div>
          </div>

          {/* Call Details */}
          <div className="w-1/2 overflow-y-auto">
            {selectedCall ? (
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Request Details
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Endpoint:</span>
                        <span className="ml-2 text-gray-800 dark:text-white">{selectedCall.endpoint}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Method:</span>
                        <span className="ml-2 text-gray-800 dark:text-white">{selectedCall.method}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Timestamp:</span>
                        <span className="ml-2 text-gray-800 dark:text-white">
                          {new Date(selectedCall.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Request Payload
                  </h4>
                  <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs overflow-x-auto text-gray-800 dark:text-white">
                    {JSON.stringify(selectedCall.payload, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Response
                  </h4>
                  <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs overflow-x-auto text-gray-800 dark:text-white">
                    {JSON.stringify(selectedCall.response, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                Select an API call to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDebugger;
