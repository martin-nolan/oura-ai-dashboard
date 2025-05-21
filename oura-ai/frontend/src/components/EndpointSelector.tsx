import React, { useState, useEffect } from 'react';

interface Endpoint {
  label: string;
  endpoint: string; // This will be the actual API path like 'daily_activity'
  params: Record<string, any>;
}

interface EndpointSelectorProps {
  endpoints: Endpoint[];
  onFetchData: (endpointPath: string, params: Record<string, any>, endpointLabel: string) => void;
  isLoading: boolean;
}

const todayISO = new Date().toISOString().slice(0, 10);
const weekAgoISO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

const todayDatetimeISO = new Date().toISOString().slice(0, 16);
const weekAgoDatetimeISO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 16);

const EndpointSelector: React.FC<EndpointSelectorProps> = ({
  endpoints,
  onFetchData,
  isLoading,
}) => {
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>(weekAgoISO);
  const [endDate, setEndDate] = useState<string>(todayISO);
  const [startDatetime, setStartDatetime] = useState<string>(weekAgoDatetimeISO);
  const [endDatetime, setEndDatetime] = useState<string>(todayDatetimeISO);

  const selectedEndpoint = endpoints[selectedEndpointIndex];

  useEffect(() => {
    // Reset dates to defaults when endpoint changes, if applicable
    if (selectedEndpoint) {
        const hasDateParams = selectedEndpoint.params.hasOwnProperty('start_date') || selectedEndpoint.params.hasOwnProperty('end_date');
        const hasDatetimeParams = selectedEndpoint.params.hasOwnProperty('start_datetime') || selectedEndpoint.params.hasOwnProperty('end_datetime');

        if (hasDateParams) {
            setStartDate(selectedEndpoint.params.start_date || weekAgoISO);
            setEndDate(selectedEndpoint.params.end_date || todayISO);
        }
        if (hasDatetimeParams) {
            setStartDatetime(selectedEndpoint.params.start_datetime ? selectedEndpoint.params.start_datetime.slice(0,16) : weekAgoDatetimeISO);
            setEndDatetime(selectedEndpoint.params.end_datetime ? selectedEndpoint.params.end_datetime.slice(0,16) : todayDatetimeISO);
        }
    }
  }, [selectedEndpointIndex, endpoints]);


  const handleFetch = () => {
    if (!selectedEndpoint) return;

    const params: Record<string, any> = {};
    const endpointDefParams = selectedEndpoint.params;

    if (endpointDefParams.hasOwnProperty('start_date')) {
      params.start_date = startDate;
    }
    if (endpointDefParams.hasOwnProperty('end_date')) {
      params.end_date = endDate;
    }
    if (endpointDefParams.hasOwnProperty('start_datetime')) {
      params.start_datetime = startDatetime + ':00Z'; // Add seconds and Z for ISO format
    }
    if (endpointDefParams.hasOwnProperty('end_datetime')) {
      params.end_datetime = endDatetime + ':00Z'; // Add seconds and Z for ISO format
    }
    // Include other potential params like next_token if they were part of the definition
    Object.keys(endpointDefParams).forEach(key => {
        if (!['start_date', 'end_date', 'start_datetime', 'end_datetime'].includes(key) && endpointDefParams[key] !== undefined) {
            // This is a simple way to include fixed params from the definition if any, e.g. for personal_info
            // More robustly, we might not want to pass empty objects if no user input is expected for them.
            // For now, if a param is in the definition but not a date/datetime, we pass its defined value.
            // Or, if it's a param that *could* be user-defined but isn't one of the date/datetime ones (e.g. next_token),
            // we would need an input for it. For this iteration, we only focus on date/datetime.
            if (typeof endpointDefParams[key] !== 'object' || Object.keys(endpointDefParams[key]).length > 0) {
                 // params[key] = endpointDefParams[key]; // This line might add unnecessary empty objects.
            }
        }
    });


    onFetchData(selectedEndpoint.endpoint, params, selectedEndpoint.label);
  };

  const showStartDate = selectedEndpoint?.params.hasOwnProperty('start_date');
  const showEndDate = selectedEndpoint?.params.hasOwnProperty('end_date');
  const showStartDatetime = selectedEndpoint?.params.hasOwnProperty('start_datetime');
  const showEndDatetime = selectedEndpoint?.params.hasOwnProperty('end_datetime');

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl space-y-6"> {/* Enhanced card style */}
      <div>
        <label htmlFor="endpoint-select" className="block text-md font-medium text-gray-800 mb-1">
          Select API Endpoint:
        </label>
        <select
          id="endpoint-select"
          value={selectedEndpointIndex}
          onChange={(e) => setSelectedEndpointIndex(Number(e.target.value))}
          className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm"
        >
          {endpoints.map((ep, index) => (
            <option key={index} value={index}>
              {ep.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid for date/datetime inputs for better responsiveness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {showStartDate && (
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Start Date:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-3"
            />
          </div>
        )}
        {showEndDate && (
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">End Date:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-3"
            />
          </div>
        )}

        {showStartDatetime && (
          <div>
            <label htmlFor="start-datetime" className="block text-sm font-medium text-gray-700">Start Datetime:</label>
            <input
              type="datetime-local"
              id="start-datetime"
              value={startDatetime}
              onChange={(e) => setStartDatetime(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-3"
            />
          </div>
        )}
        {showEndDatetime && (
          <div>
            <label htmlFor="end-datetime" className="block text-sm font-medium text-gray-700">End Datetime:</label>
            <input
              type="datetime-local"
              id="end-datetime"
              value={endDatetime}
              onChange={(e) => setEndDatetime(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-3"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleFetch}
        disabled={isLoading || !selectedEndpoint}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
      >
        {isLoading ? 'Fetching Data...' : 'Fetch Data'}
      </button>
    </div>
  );
};

export default EndpointSelector;
