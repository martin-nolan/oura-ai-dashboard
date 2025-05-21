import { useState } from "react";
import { api } from "./api/oura";
import EndpointSelector from "./components/EndpointSelector";
import DataDisplay from "./components/DataDisplay"; // Import DataDisplay

const today = new Date().toISOString().slice(0, 10);
const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Use 7 days for a full week
  .toISOString()
  .slice(0, 10);

// Updated endpointCards:
// - 'endpoint' values now directly match Oura API endpoint names (no leading slash)
// - 'params' keys match what Oura API expects (e.g. start_date, start_datetime)
// - For endpoints requiring datetime, providing a default structure for params.
// - For endpoints without date/datetime params, params is an empty object or specific required param.
const endpointCards = [
  {
    label: "Personal Info",
    endpoint: "personal_info",
    params: {},
  },
  {
    label: "Daily Activity",
    endpoint: "daily_activity",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Daily Sleep",
    endpoint: "daily_sleep",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Daily Readiness",
    endpoint: "daily_readiness",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Daily Cardiovascular Age",
    endpoint: "daily_cardiovascular_age",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Daily Resilience",
    endpoint: "daily_resilience",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Daily SpO2",
    endpoint: "daily_spo2",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Daily Stress",
    endpoint: "daily_stress",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Enhanced Tag",
    endpoint: "enhanced_tag",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Heartrate",
    endpoint: "heartrate",
    params: {
      start_datetime: weekAgo + "T00:00:00Z", // Keep Z for full ISO8601 if needed by API or selector
      end_datetime: today + "T23:59:59Z",
    },
  },
  {
    label: "Rest Mode Period",
    endpoint: "rest_mode_period",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Ring Configuration",
    endpoint: "ring_configuration",
    params: { /* next_token: undefined */ }, // Example if it took non-date params
  },
  {
    label: "Session",
    endpoint: "session",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Sleep", // This is likely distinct from Daily Sleep, refers to sleep periods
    endpoint: "sleep",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Sleep Time",
    endpoint: "sleep_time",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Tag",
    endpoint: "tag",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "VO2max",
    endpoint: "vo2max",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Workout",
    endpoint: "workout",
    params: { start_date: weekAgo, end_date: today },
  },
];

export default function App() {
  const [currentData, setCurrentData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null); // State for the selected endpoint's label

  const handleFetchData = async (
    endpointPath: string,
    params: Record<string, any>,
    endpointLabel: string // Added endpointLabel parameter
  ) => {
    setLoading(true);
    setCurrentData(null);
    setError(null);
    setSelectedLabel(endpointLabel); // Set the selected label
    try {
      const response = await api.get(`/oura_data/${endpointPath}`, { params });
      setCurrentData(response.data);
    } catch (err: any) {
      console.error(`Failed to fetch data for ${endpointLabel}:`, err);
      setError(
        `Failed to fetch data for ${endpointLabel}: ${ // Use endpointLabel in error message
          err.response?.data?.detail || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-blue-100 flex flex-col">
      <header className="bg-blue-700 text-white p-5 shadow-lg"> {/* Increased padding, darker blue, stronger shadow */}
        <h1 className="text-3xl font-bold tracking-tight text-center"> {/* Increased font size */}
          Ōura Dashboard
        </h1>
      </header>
      <main className="flex-grow p-4 md:p-8 space-y-8"> {/* Responsive padding, increased space */}
        <EndpointSelector
          endpoints={endpointCards}
          onFetchData={handleFetchData}
          isLoading={loading}
        />
        {loading && (
          <div className="text-xl text-center text-blue-600 mt-6 py-4"> {/* Styled loading message */}
            Loading data...
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6" role="alert"> {/* Enhanced error styling */}
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        {currentData && !loading && (
          <DataDisplay data={currentData} endpointLabel={selectedLabel} />
        )}
        {!loading && !currentData && !error && (
          <div className="text-xl text-center text-gray-500 mt-6 py-4"> {/* Styled placeholder message */}
            Select an endpoint and parameters to fetch and view data.
          </div>
        )}
      </main>
    </div>
  );
}
