import React from 'react';

interface DataDisplayProps {
  data: any;
  endpointLabel: string | null;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ data, endpointLabel }) => {
  if (!data) {
    // This message can be shown or App.tsx can handle overall placeholder logic
    // For now, returning null if no data, App.tsx will show "Select an endpoint..."
    return null;
  }

  if (!endpointLabel) {
    // Should not happen if data is present, but good for robustness
    return <div className="text-gray-500">Missing endpoint information.</div>;
  }

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 mt-8"> {/* Enhanced card style, increased top margin */}
      <h2 className="text-2xl font-semibold mb-4 text-blue-800"> {/* Increased font size, darker blue, more bottom margin */}
        Data for: {endpointLabel}
      </h2>
      <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-[32rem] custom-scrollbar"> {/* Darker bg, larger max-h, custom scrollbar class (if defined elsewhere) */}
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default DataDisplay;
