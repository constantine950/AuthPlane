import { useEffect, useState } from "react";
import api from "../lib/api";
import Sidebar from "../components/Sidebar";

interface User {
  id: string;
  email: string;
  roles: string[];
}

interface Role {
  id: string;
  name: string;
}

export default function Roles() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        api.get("/users"),
        api.get("/roles"),
      ]);
      setUsers(usersRes.data.users);
      setRoles(rolesRes.data.roles);
    } catch {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserId = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]!));
    return payload.userId;
  };

  const assignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    setError("");
    setSuccess("");
    try {
      await api.post(`/roles/user/${selectedUser.id}`, { role: selectedRole });
      setSuccess(`Role '${selectedRole}' assigned to ${selectedUser.email}`);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to assign role");
    }
  };

  const removeRole = async (userId: string, roleName: string) => {
    setError("");
    setSuccess("");
    try {
      await api.delete(`/roles/user/${userId}`, { data: { role: roleName } });
      setSuccess(`Role '${roleName}' removed`);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to remove role");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Roles</h1>

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

        {/* Assign Role */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="font-semibold mb-4">Assign Role</h2>
          <div className="flex gap-3 flex-wrap">
            <select
              className="border rounded px-3 py-2 text-sm"
              onChange={(e) =>
                setSelectedUser(
                  users.find((u) => u.id === e.target.value) || null,
                )
              }
              defaultValue=""
            >
              <option value="" disabled>
                Select user
              </option>
              {users
                .filter((user) => user.id !== getCurrentUserId())
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
            </select>

            <select
              className="border rounded px-3 py-2 text-sm"
              onChange={(e) => setSelectedRole(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>

            <button
              onClick={assignRole}
              className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
            >
              Assign
            </button>
          </div>
        </div>

        {/* Users and their roles */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Roles</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((user) => user.id !== getCurrentUserId())
                  .map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {user.roles.map((role) => (
                            <span
                              key={role}
                              className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                            >
                              {role}
                              <button
                                onClick={() => removeRole(user.id, role)}
                                className="text-blue-400 hover:text-red-600 ml-1 font-bold"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
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
