import { useEffect, useState } from "react";
import api from "../lib/api";
import Sidebar from "../components/Sidebar";

interface Session {
  id: string;
  user_id: string;
  device: string;
  ip_address: string;
  last_active: string;
  is_active: boolean;
  created_at: string;
}

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSessions = async () => {
    try {
      const res = await api.get("/sessions");
      setSessions(res.data.sessions);
    } catch {
      setError("Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    if (!confirm("Revoke this session?")) return;
    setError("");
    setSuccess("");
    try {
      await api.delete(`/sessions/${sessionId}`);
      setSuccess("Session revoked");
      setSessions(sessions.filter((s) => s.id !== sessionId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to revoke session");
    }
  };

  const revokeAll = async () => {
    if (!confirm("Revoke all sessions? You will be logged out.")) return;
    setError("");
    try {
      await api.delete("/sessions");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to revoke all sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Active Sessions</h1>
          <button
            onClick={revokeAll}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
          >
            Revoke All
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : sessions.length === 0 ? (
          <p className="text-gray-500">No active sessions</p>
        ) : (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4">Device</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Last Active</th>
                  <th className="p-4">Created</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-t">
                    <td className="p-4 max-w-xs truncate">{session.device}</td>
                    <td className="p-4">{session.ip_address}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(session.last_active).toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(session.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => revokeSession(session.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Revoke
                      </button>
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
