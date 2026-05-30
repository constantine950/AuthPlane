import { NavLink } from "react-router-dom";
import { AuthLib } from "../lib/auth";
import { useNavigate } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/users", label: "Users" },
  { to: "/roles", label: "Roles" },
  { to: "/sessions", label: "Sessions" },
  { to: "/audit", label: "Audit Logs" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await AuthLib.logout();
    navigate("/login");
  };

  return (
    <aside className="w-56 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 font-bold text-lg border-b border-gray-700">
        Authplane
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-gray-400 hover:text-white px-3 py-2"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
