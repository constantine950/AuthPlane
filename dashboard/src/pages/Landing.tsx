import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const terminalRef = useRef<HTMLDivElement>(null);

  const lines = [
    { type: "cmd", prompt: "$", text: "curl -X POST /api/auth/login \\" },
    {
      type: "cmd",
      prompt: " ",
      text: '  -d \'{"email":"admin@authplane.com"}\'',
    },
    { type: "gap" },
    { type: "out", key: "status", val: "200 OK", cls: "text-green-400" },
    {
      type: "out",
      key: "accessToken",
      val: '"eyJhbGciOiJIUzI1NiJ9..."',
      cls: "text-blue-400",
    },
    {
      type: "out",
      key: "cookie",
      val: '"refreshToken=4ffd...; HttpOnly"',
      cls: "text-blue-400",
    },
    { type: "gap" },
    { type: "cmd", prompt: "$", text: "curl /api/sessions \\" },
    { type: "cmd", prompt: " ", text: '  -H "Authorization: Bearer eyJ..."' },
    { type: "gap" },
    { type: "out", key: "sessions", val: "[2 active]", cls: "text-yellow-400" },
    {
      type: "out",
      key: "device[0]",
      val: '"Chrome on Windows"',
      cls: "text-blue-400",
    },
    { type: "gap" },
    { type: "cmd", prompt: "$", text: "curl -X POST /api/auth/refresh" },
    { type: "gap" },
    { type: "out", key: "rotated", val: "true", cls: "text-green-400" },
    {
      type: "out",
      key: "newToken",
      val: '"eyJhbGciOiJIUzI1NiJ9.new..."',
      cls: "text-blue-400",
    },
    { type: "gap" },
    { type: "comment", text: "# old refresh token is now invalid" },
  ];

  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    const items = terminal.querySelectorAll(".term-line");
    let i = 0;

    const interval = setInterval(() => {
      if (i < items.length) {
        items[i]?.classList.remove("opacity-0", "translate-y-1");
        items[i]?.classList.add("opacity-100", "translate-y-0");
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "🔐",
      name: "JWT + Refresh Tokens",
      desc: "Short-lived access tokens with automatic rotation. Refresh tokens stored in DB and HttpOnly cookies.",
    },
    {
      icon: "🛡️",
      name: "RBAC",
      desc: "Role-based access control with admin, user, moderator, and service roles. Enforced at middleware level.",
    },
    {
      icon: "📡",
      name: "Session Tracking",
      desc: "Every login tracked by device and IP. View and revoke individual sessions or all at once.",
    },
    {
      icon: "🔑",
      name: "API Keys",
      desc: "SHA-256 hashed API keys for service-to-service calls. Generate, revoke, and scope per service.",
    },
    {
      icon: "📋",
      name: "Audit Logs",
      desc: "Every login, logout, and role change logged with IP, device, and timestamp.",
    },
    {
      icon: "⚡",
      name: "Rate Limiting",
      desc: "Brute force protection on login. Configurable per endpoint with standard rate limit headers.",
    },
  ];

  const stack = [
    "Bun",
    "Express",
    "TypeScript",
    "PostgreSQL",
    "jose (JWT)",
    "bcrypt",
    "React",
    "Vite",
    "Tailwind CSS",
    "Docker",
    "nginx",
    "Winston",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e2e2f0] font-sans">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0a0a0f]/85 backdrop-blur border-b border-[#2a2a3d]">
        <span className="font-mono text-sm font-semibold">
          auth<span className="text-[#7c6cfc]">plane</span>
        </span>
        <div className="hidden md:flex gap-8">
          {["Features", "How it works", "Stack"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(" ", "-")}`}
              className="text-[#6b6b8a] text-sm hover:text-white transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#7c6cfc] text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-85 transition-opacity"
        >
          Open Dashboard →
        </button>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-8 pt-32 pb-16 grid md:grid-cols-2 gap-16 items-center min-h-screen">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#7c6cfc] uppercase tracking-widest mb-6">
            <span className="w-6 h-px bg-[#7c6cfc]" />
            Auth Microservice
          </div>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight mb-6">
            One place for <span className="text-[#a78bfa]">every</span>{" "}
            identity.
          </h1>
          <p className="text-[#6b6b8a] text-lg leading-relaxed mb-10 max-w-md">
            Authplane is a production-ready central auth service. JWT access
            tokens, refresh token rotation, RBAC, session tracking — built once,
            used everywhere.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#7c6cfc] text-white px-6 py-3 rounded-lg text-sm font-medium hover:opacity-85 transition-all hover:-translate-y-px"
            >
              Open Dashboard →
            </button>
            <a
              href="#features"
              className="border border-[#2a2a3d] text-white px-6 py-3 rounded-lg text-sm font-medium hover:border-[#7c6cfc] transition-all hover:-translate-y-px"
            >
              See what's inside
            </a>
          </div>
          <div className="flex gap-10 mt-10 pt-8 border-t border-[#2a2a3d]">
            {[
              ["15m", "Access token lifetime"],
              ["7d", "Refresh token lifetime"],
              ["HS256", "JWT algorithm"],
            ].map(([val, label]) => (
              <div key={label}>
                <div className="font-mono text-2xl font-semibold">{val}</div>
                <div className="text-xs text-[#6b6b8a] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TERMINAL */}
        <div className="bg-[#11111a] border border-[#2a2a3d] rounded-xl overflow-hidden font-mono text-xs shadow-2xl shadow-[#7c6cfc]/10">
          <div className="bg-[#1a1a27] px-4 py-3 flex items-center gap-2 border-b border-[#2a2a3d]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="flex-1 text-center text-[#6b6b8a] text-xs">
              authplane — live demo
            </span>
          </div>
          <div className="p-5 min-h-[320px]" ref={terminalRef}>
            {lines.map((line, i) => (
              <div
                key={i}
                className="term-line flex gap-3 mb-1.5 opacity-0 translate-y-1 transition-all duration-300"
              >
                {line.type === "gap" && <span className="mb-1">&nbsp;</span>}
                {line.type === "cmd" && (
                  <>
                    <span className="text-[#7c6cfc]">{line.prompt}</span>
                    <span>{line.text}</span>
                  </>
                )}
                {line.type === "out" && (
                  <>
                    <span className="text-[#6b6b8a]">
                      &nbsp;&nbsp;{line.key}:
                    </span>
                    <span className={line.cls}>{line.val}</span>
                  </>
                )}
                {line.type === "comment" && (
                  <span className="text-[#6b6b8a] italic">{line.text}</span>
                )}
              </div>
            ))}
            <div className="term-line flex gap-3 mb-1.5 opacity-0 translate-y-1 transition-all duration-300">
              <span className="text-[#7c6cfc]">$</span>
              <span className="inline-block w-2 h-3.5 bg-[#7c6cfc] animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-8 py-24">
        <div className="font-mono text-xs text-[#7c6cfc] uppercase tracking-widest mb-3">
          What's inside
        </div>
        <h2 className="text-4xl font-semibold tracking-tight mb-4">
          Everything auth needs.
          <br />
          Nothing it doesn't.
        </h2>
        <p className="text-[#6b6b8a] mb-14 max-w-lg">
          Built for apps that need a dedicated identity layer without rolling
          their own security primitives.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.name}
              className="bg-[#11111a] border border-[#2a2a3d] rounded-xl p-6 hover:border-[#7c6cfc] hover:-translate-y-0.5 transition-all"
            >
              <div className="text-2xl mb-4">{f.icon}</div>
              <div className="font-semibold text-sm mb-2">{f.name}</div>
              <div className="text-[#6b6b8a] text-sm leading-relaxed">
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLOW */}
      <section
        id="how-it-works"
        className="bg-[#11111a] border-y border-[#2a2a3d] py-24"
      >
        <div className="max-w-6xl mx-auto px-8">
          <div className="font-mono text-xs text-[#7c6cfc] uppercase tracking-widest mb-3">
            How it works
          </div>
          <h2 className="text-4xl font-semibold tracking-tight mb-14">
            The auth flow, step by step.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              [
                "01",
                "Login",
                "User submits email and password. bcrypt compares against stored hash.",
              ],
              [
                "02",
                "Issue Tokens",
                "JWT access token returned in body. Refresh token set as HttpOnly cookie.",
              ],
              [
                "03",
                "Verify",
                "Middleware checks JWT signature locally. No DB lookup needed for access tokens.",
              ],
              [
                "04",
                "Rotate",
                "On refresh, old token is revoked and a new one issued. Reuse triggers theft detection.",
              ],
            ].map(([num, title, desc]) => (
              <div key={num} className="text-center">
                <div className="w-12 h-12 rounded-full border border-[#7c6cfc] flex items-center justify-center font-mono text-sm text-[#7c6cfc] mx-auto mb-5">
                  {num}
                </div>
                <div className="font-semibold text-sm mb-2">{title}</div>
                <div className="text-[#6b6b8a] text-sm leading-relaxed">
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section id="stack" className="max-w-6xl mx-auto px-8 py-24">
        <div className="font-mono text-xs text-[#7c6cfc] uppercase tracking-widest mb-3">
          Tech stack
        </div>
        <h2 className="text-4xl font-semibold tracking-tight mb-8">
          Built with the right tools.
        </h2>
        <div className="flex flex-wrap gap-3">
          {stack.map((s) => (
            <span
              key={s}
              className="font-mono text-xs text-[#a78bfa] bg-[#7c6cfc]/10 border border-[#7c6cfc]/20 px-4 py-1.5 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-24 border-t border-[#2a2a3d] bg-gradient-to-b from-[#0a0a0f] to-[#11111a]">
        <h2 className="text-5xl font-semibold tracking-tight mb-4">
          Your apps deserve
          <br />a real auth layer.
        </h2>
        <p className="text-[#6b6b8a] text-lg mb-10">
          Login to the dashboard to manage users, roles, and sessions.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#7c6cfc] text-white px-8 py-3 rounded-lg text-sm font-medium hover:opacity-85 transition-opacity"
        >
          Open Dashboard →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#2a2a3d] px-8 py-6 flex justify-between items-center">
        <span className="font-mono text-sm text-[#6b6b8a]">
          auth<span className="text-[#7c6cfc]">plane</span>
        </span>
        <span className="text-xs text-[#6b6b8a]">
          Authentication infrastructure for modern applications.
        </span>
      </footer>
    </div>
  );
}
