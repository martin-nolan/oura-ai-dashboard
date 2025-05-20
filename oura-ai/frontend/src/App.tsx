import { useEffect, useState } from "react";
import { api } from "./api/oura";
import Card from "./components/Card";

const today = new Date().toISOString().slice(0, 10);
const weekAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

const endpointCards = [
  {
    label: "Personal Info",
    endpoint: "/personal_info",
    params: {},
  },
  {
    label: "Daily Activity",
    endpoint: "/daily_activity",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Daily Sleep",
    endpoint: "/daily_sleep",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Daily Readiness",
    endpoint: "/daily_readiness",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Daily Cardiovascular Age",
    endpoint: "/daily_cardiovascular_age",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Daily Resilience",
    endpoint: "/daily_resilience",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Daily SpO2",
    endpoint: "/daily_spo2",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Daily Stress",
    endpoint: "/daily_stress",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Enhanced Tag",
    endpoint: "/enhanced_tag",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Heartrate",
    endpoint: "/heartrate",
    params: {
      start_datetime: weekAgo + "T00:00:00Z",
      end_datetime: today + "T23:59:59Z",
    },
  },
  {
    label: "Rest Mode Period",
    endpoint: "/rest_mode_period",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Ring Configuration",
    endpoint: "/ring_configuration",
    params: {},
  },
  {
    label: "Session",
    endpoint: "/session",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Sleep",
    endpoint: "/sleep",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Sleep Time",
    endpoint: "/sleep_time",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Tag",
    endpoint: "/tag",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "VO2max",
    endpoint: "/vo2max",
    params: { start_date: weekAgo, end_date: today },
  },
  {
    label: "Workout",
    endpoint: "/workout",
    params: { start_date: weekAgo, end_date: today },
  },
];

export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all(
      endpointCards.map((c) =>
        api
          .get(c.endpoint, { params: c.params })
          .then((res: any) => res.data)
          .catch(() => null)
      )
    ).then((results) => {
      setData(results);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8 flex flex-col gap-6 items-center">
      <h1 className="text-3xl font-bold mb-4 tracking-tight text-blue-900">
        Ōura Dashboard
      </h1>
      {loading && <div className="text-lg">Loading...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {endpointCards.map((card, i) => {
          let paramsInfo = "";
          if (card.params.start_date && card.params.end_date) {
            paramsInfo = `Date range: ${card.params.start_date} to ${card.params.end_date}`;
          } else if (card.params.start_datetime && card.params.end_datetime) {
            paramsInfo = `Datetime range: ${card.params.start_datetime} to ${card.params.end_datetime}`;
          } else if (Object.keys(card.params).length === 0) {
            paramsInfo = "Current";
          } else {
            paramsInfo = Object.entries(card.params)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ");
          }
          return (
            <Card
              key={card.label}
              label={card.label}
              paramsInfo={paramsInfo}
              data={data[i]}
            />
          );
        })}
      </div>
    </div>
  );
}
