import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  Gavel,
  Shield,
  Users,
} from "lucide-react";

/* Slowed orbit dot — calm, institutional motion */
const OrbitDot = ({ delay }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 14, ease: "linear", delay }}
    className="absolute inset-0"
  >
    <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-sm" />
  </motion.div>
);

export default function LandingPage() {
  const navigate = useNavigate();

  const principles = [
    "Every complaint deserves a traceable outcome.",
    "Transparency must be structural, not optional.",
    "Authority flows from accountability.",
    "Systems earn trust through transparency. Silence destroys it.",
  ];

  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const i = setInterval(
      () => setIndex((p) => (p + 1) % principles.length),
      4800
    );
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-200 overflow-hidden">

      {/* TOP NAVIGATION */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white flex items-center justify-center font-extrabold shadow">
              CMS
            </div>
            <span className="font-semibold text-slate-800">
              Complaint Matrix
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-1.5 rounded-full text-slate-700 hover:bg-white/60 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium shadow hover:shadow-lg transition"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* AMBIENT PARTICLES */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[5px] w-[5px] rounded-full bg-sky-400/30"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 7 + i }}
          style={{
            top: `${(i * 19) % 85}%`,
            left: `${(i * 27) % 95}%`,
          }}
        />
      ))}

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div className="space-y-7">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900"
          >
            A Transparent Complaint{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
              Resolution System
            </span>
          </motion.h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-sm sm:text-base font-medium text-slate-700 min-h-[44px]"
            >
              {principles[index]}
            </motion.p>
          </AnimatePresence>

          {/* FEATURE CHIPS */}
          <div className="flex flex-wrap gap-3 text-sm">
            {[
              { icon: ShieldCheck, text: "Secure & confidential reporting" },
              { icon: Clock, text: "Structured escalation workflow" },
              { icon: CheckCircle2, text: "Fully auditable resolution trail" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-slate-200 shadow-sm"
              >
                <item.icon className="w-4 h-4 text-sky-600" />
                <span className="font-medium text-slate-800">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* ROLE EXPLANATION */}
          <div className="flex gap-3 flex-wrap text-xs">
            <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700">
              Users → Raise & track complaints
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700">
              Admins → Review, update & resolve
            </span>
          </div>

          {/* CTA — ONLY ONE */}
          <div className="pt-4">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold shadow-xl hover:-translate-y-1 transition"
            >
              Get Started
            </button>
          </div>

          <p className="text-sm text-slate-500">
            Built for organizations, institutions, and communities that value accountability.
          </p>
        </div>

        {/* RIGHT — ORBIT */}
        <div className="relative flex justify-center">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative h-[320px] w-[320px] rounded-full flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-200 to-indigo-200 blur-2xl opacity-60" />

            <div className="relative z-10 h-[190px] w-[190px] rounded-full bg-white border border-slate-200 shadow-xl flex flex-col items-center justify-center text-center px-6">
              <p className="uppercase tracking-widest text-[10px] text-slate-400">
                System loop
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Raise → Route → Resolve
              </p>
              <p className="mt-1 text-xs text-slate-500">
                End-to-end accountability at every stage
              </p>
            </div>

            <div className="absolute h-[250px] w-[250px] rounded-full border border-sky-200/80" />
            <div className="absolute h-[290px] w-[290px] rounded-full border border-indigo-200/60" />
            <OrbitDot delay={0} />
            <OrbitDot delay={1.6} />

            <div className="absolute -top-3 text-xs bg-white px-3 py-1 rounded-full border shadow-sm flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-sky-600" /> Users
            </div>
            <div className="absolute left-[-2.8rem] text-xs bg-white px-3 py-1 rounded-full border shadow-sm flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-500" /> Admins
            </div>
            <div className="absolute -bottom-3 text-xs bg-white px-3 py-1 rounded-full border shadow-sm flex items-center gap-1">
              <Gavel className="w-3.5 h-3.5 text-emerald-500" /> Integrity
            </div>
          </motion.div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pb-6 text-center text-xs text-slate-500">
        © Complaint Matrix · Designed for clarity, fairness, and institutional accountability
      </footer>
    </div>
  );
}
