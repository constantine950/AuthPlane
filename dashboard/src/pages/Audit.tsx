import { useEffect, useState } from "react";
import api from "../lib/api";
import Sidebar from "../components/Sidebar";

interface AuditLog {
  id: string;
  user_id: string;
  email: string | null;
  action: string;
  ip_address: string;
  metadata: Record<string, string> | null;
  created_at: string;
}

const actionColors: Record<string, string> = {
  login: "bg-green-100 text-green-700",
  logout: "bg-gray-100 text-gray-700",
  role_assigned: "bg-blue-100 text-blue-700",
  role_removed: "bg-red-100 text-red-700",
};

export default function Audit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/audit");
        setLogs(res.data.logs);
      } catch {
        setError("Failed to fetch audit logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500">No audit logs yet</p>
        ) : (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="p-4">{log.email || "deleted user"}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${actionColors[log.action] || "bg-gray-100"}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{log.ip_address}</td>
                    <td className="p-4 text-gray-500 text-xs">
                      {log.metadata ? JSON.stringify(log.metadata) : "—"}
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
