import { useEffect, useState } from "react";
import api from "../lib/api";
import Sidebar from "../components/Sidebar";

interface Stats {
  totalUsers: number;
  activeSessions: number;
  recentLogins: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeSessions: 0,
    recentLogins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, sessionsRes, auditRes] = await Promise.all([
          api.get("/users"),
          api.get("/sessions"),
          api.get("/audit?limit=50"),
        ]);

        const recentLogins = auditRes.data.logs.filter(
          (log: { action: string }) => log.action === "login",
        ).length;

        setStats({
          totalUsers: usersRes.data.users.length,
          activeSessions: sessionsRes.data.sessions.length,
          recentLogins,
        });
      } catch {
        // fail silently — stats are non-critical
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Active Sessions",
      value: stats.activeSessions,
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Recent Logins",
      value: stats.recentLogins,
      color: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">
          Welcome to Authplane — your central auth service.
        </p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div key={card.label} className={`rounded-lg p-6 ${card.color}`}>
                <p className="text-sm font-medium opacity-75">{card.label}</p>
                <p className="text-4xl font-bold mt-2">{card.value}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
