// @ts-nocheck
import { useState, useEffect, useRef } from "react";
const SUPABASE_URL = "https://xzozlqeyjsuvofhpesas.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6b3pscWV5anN1dm9maHBlc2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTAxNjgzNCwiZXhwIjoyMDk2NTkyODM0fQ.oozYIDX4LRGeW8ZJ6Y7IJY69-A7PWojseK8Uz8axHxw";

const NAV_LINKS = ["Features", "How It Works", "Pricing", "Contact"];

const FEATURES = [
  { icon: "🧬", title: "Patient Records", desc: "Unified digital health records accessible across every touchpoint — from admission to discharge." },
  { icon: "🔬", title: "Lab & Diagnostics", desc: "Integrated lab ordering, result tracking, and diagnostic history in one streamlined workflow." },
  { icon: "📡", title: "Telemedicine", desc: "Built-in video consultations so clinics can serve patients beyond physical walls." },
  { icon: "💊", title: "Prescriptions", desc: "Digital prescription writing with drug interaction checks and pharmacy routing." },
  { icon: "📊", title: "Analytics", desc: "Real-time clinical and operational dashboards that surface the metrics that matter." },
  { icon: "🤝", title: "Docifai Integration", desc: "AI-triaged patients routed directly into your clinic queue — zero friction from first contact." },
];

const STEPS = [
  { num: "01", title: "Onboard in Hours", desc: "No legacy migration headaches. Medionix deploys fast with minimal IT overhead." },
  { num: "02", title: "Staff Adapt Instantly", desc: "Designed for low-bandwidth environments and clinicians who aren't tech-first." },
  { num: "03", title: "Patients Flow In", desc: "Docifai routes AI-triaged patients directly to your registered clinic." },
  { num: "04", title: "Operate at Scale", desc: "Analytics and reporting grow with you — from single clinic to hospital network." },
];

const STATS = [
  { value: "2x", label: "Faster Patient Processing" },
  { value: "40+", label: "African Markets Targeted" },
  { value: "90%", label: "Reduction in Paperwork" },
  { value: "24/7", label: "Telemedicine Coverage" },
];

// ============================================================
// WAITLIST FORM — fully wired to Supabase
// ============================================================
function WaitlistForm({ dark = false }) {
  const [role, setRole] = useState("");
const [email, setEmail] = useState("");
const [status, setStatus] = useState("idle");
const [message, setMessage] = useState("");
  

  function isValidEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function handleSubmit() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    if (!isValidEmail(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ email: trimmed, source: "medionix-landing", role: role || null }),
      });

      if (res.status === 201) {
        setStatus("success");
        setMessage("You're on the waitlist! We'll be in touch within 48 hours.");
        setEmail("");
        return;
      }

      if (res.status === 409) {
        setStatus("duplicate");
        setMessage("You're already on the list — we haven't forgotten you.");
        return;
      }

      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setMessage(data?.message || "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  const inputBorder =
    status === "error" ? "1px solid #ff4d4d" :
    status === "duplicate" ? "1px solid #f0a500" :
    dark ? "1px solid #333" : "1px solid #d0cec8";

  if (status === "success") {
    return (
      <div style={formStyles.successBox}>
        <span style={formStyles.successIcon}>✓</span>
        <div>
          <div style={formStyles.successTitle}>You're on the waitlist!</div>
          <div style={formStyles.successSub}>We'll reach out within 48 hours.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={formStyles.row}>
        <input
          style={{
            ...formStyles.input,
            background: dark ? "#1a1f2b" : "#fff",
            color: dark ? "#fff" : "#0d1117",
            border: inputBorder,
          }}
          type="email"
          placeholder="Your clinic email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status !== "idle") setStatus("idle"); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={status === "loading"}
        />
        <select
  style={{
    ...formStyles.input,
    background: dark ? "#1a1f2b" : "#fff",
    color: dark ? (role ? "#fff" : "#888") : (role ? "#0d1117" : "#999"),
    border: dark ? "1px solid #333" : "1px solid #d0cec8",
    cursor: "pointer",
    width: "auto",
  }}
  value={role}
  onChange={(e) => setRole(e.target.value)}
  disabled={status === "loading"}
>
  <option value="">I am a...</option>
  <option value="clinic-owner">Clinic Owner / Manager</option>
  <option value="doctor">Doctor</option>
  <option value="receptionist">Receptionist / Admin Staff</option>
  <option value="other">Other</option>
</select>


        <button
          onClick={handleSubmit}
          disabled={status === "loading" || !email.trim()}
          style={{
            ...formStyles.btn,
            opacity: status === "loading" || !email.trim() ? 0.7 : 1,
            cursor: status === "loading" || !email.trim() ? "not-allowed" : "pointer",
          }}
        >
          {status === "loading" ? (
            <span style={formStyles.spinner}>⟳</span>
          ) : "Request Demo"}
        </button>
      </div>

      {(status === "error" || status === "duplicate") && (
        <p style={{
          ...formStyles.feedback,
          color: status === "error" ? "#ff6b6b" : "#f0a500",
        }}>
          {message}
        </p>
      )}

      {status === "idle" && (
        <p style={{ ...formStyles.note, color: dark ? "#555" : "#999" }}>
          No commitment. We'll reach out within 48 hours.
        </p>
      )}
    </div>
  );
}

const formStyles = {
  row: { display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" },
  input: {
    padding: "14px 20px", borderRadius: 100, fontSize: 15,
    width: 280, outline: "none", fontFamily: "inherit",
  },
  btn: {
    background: "#00c47a", color: "#0d1117", padding: "14px 28px",
    borderRadius: 100, fontWeight: 700, fontSize: 15, border: "none",
    fontFamily: "inherit", transition: "all 0.2s", minWidth: 140,
  },
  feedback: { fontSize: 13, marginTop: 12, textAlign: "center" },
  note: { fontSize: 13, marginTop: 16, textAlign: "center" },
  successBox: {
    display: "flex", alignItems: "center", gap: 16,
    background: "rgba(0,196,122,0.12)", border: "1px solid rgba(0,196,122,0.3)",
    borderRadius: 12, padding: "18px 24px", maxWidth: 420, margin: "0 auto",
  },
  successIcon: {
    width: 36, height: 36, background: "#00c47a", color: "#0d1117",
    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, fontSize: 16, flexShrink: 0,
  },
  successTitle: { color: "#00e5a0", fontWeight: 700, fontSize: 15, marginBottom: 4 },
  successSub: { color: "#888", fontSize: 13 },
  spinner: { display: "inline-block", animation: "spin 1s linear infinite" },
};

// ============================================================
// MAIN LANDING PAGE
// ============================================================
export default function MedionixLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <div style={styles.navInner}>
          <div style={styles.logo}>
            <span style={styles.logoMark}>M</span>
            <span style={styles.logoText}>Medionix</span>
          </div>
          <div style={styles.navLinks} className="nav-links">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} style={styles.navLink}>{l}</a>
            ))}
            <a href="#contact" style={styles.navCta}>Request Demo</a>
          </div>
          <button style={styles.menuBtn} className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <div style={styles.mobileMenu}>
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{l}</a>
            ))}
            <a href="#contact" style={styles.mobileCta} onClick={() => setMenuOpen(false)}>Request Demo</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={styles.hero} id="hero" className="hero-section">
        <div style={styles.heroBg}>
          <div style={styles.gridOverlay} />
          <div style={styles.orb1} />
          <div style={styles.orb2} />
        </div>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge} className="reveal">
            <span style={styles.badgeDot} />
            Built for African Healthcare
          </div>
          <h1 style={styles.heroH1} className="reveal reveal-delay-1">
            The Clinical OS<br />
            <span style={styles.heroAccent}>Africa Deserves.</span>
          </h1>
          <p style={styles.heroSub} className="reveal reveal-delay-2 hero-visual">
            Medionix is the lightweight clinical operating system powering patient records,
            diagnostics, telemedicine, and analytics — purpose-built for African clinics.
          </p>
          <div style={styles.heroCtas} className="reveal reveal-delay-3 hero-ctas">
            <a href="#contact" style={styles.primaryBtn}>Get Early Access</a>
            <a href="#how-it-works" style={styles.ghostBtn}>See How It Works →</a>
          </div>
          <div style={styles.heroStats} className="reveal reveal-delay-4 hero-stats">
            {STATS.map((s) => (
              <div key={s.label} style={styles.statItem}>
                <span style={styles.statValue}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.heroVisual} className="reveal reveal-delay-2">
          <div style={styles.dashMock}>
            <div style={styles.dashBar}>
              <div style={styles.dashDots}>
                <span style={{ ...styles.dot, background: "#ff5f56" }} />
                <span style={{ ...styles.dot, background: "#ffbd2e" }} />
                <span style={{ ...styles.dot, background: "#27c93f" }} />
              </div>
              <span style={styles.dashTitle}>Medionix — Patient Dashboard</span>
            </div>
            <div style={styles.dashBody}>
              <div style={styles.dashSidebar}>
                {["🏠 Home", "👥 Patients", "📋 Records", "🔬 Labs", "💊 Rx", "📡 Tele", "📊 Reports"].map(i => (
                  <div key={i} style={{ ...styles.sideItem, ...(i.startsWith("👥") ? styles.sideItemActive : {}) }}>{i}</div>
                ))}
              </div>
              <div style={styles.dashMain}>
                <div style={styles.dashCard}>
                  <div style={styles.cardLabel}>Active Patients</div>
                  <div style={styles.cardValue}>247</div>
                  <div style={styles.cardTag}>↑ 12% this week</div>
                </div>
                <div style={styles.dashCard}>
                  <div style={styles.cardLabel}>Labs Pending</div>
                  <div style={styles.cardValue}>18</div>
                  <div style={styles.cardTag}>3 urgent</div>
                </div>
                <div style={{ ...styles.dashCard, gridColumn: "1/-1" }}>
                  <div style={styles.cardLabel}>Today's Queue</div>
                  <div style={styles.patientList}>
                    {["Amara O. — Triage", "Kwame B. — Lab Results", "Fatima A. — Follow-up"].map(p => (
                      <div key={p} style={styles.patientRow}>
                        <div style={styles.patientAvatar} />
                        <span style={styles.patientName}>{p}</span>
                        <span style={styles.patientStatus}>In Queue</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHead} className="reveal">
            <span style={styles.sectionTag}>Features</span>
            <h2 style={styles.sectionH2}>Everything a Clinic Needs.<br />Nothing It Doesn't.</h2>
          </div>
          <div style={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                style={{ ...styles.featureCard, ...(activeFeature === i ? styles.featureCardActive : {}) }}
                className="reveal"
                onMouseEnter={() => setActiveFeature(i)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div style={styles.featureIcon}>{f.icon}</div>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureDesc}>{f.desc}</p>
                <div style={styles.featureArrow}>→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={styles.darkSection}>
        <div style={styles.container}>
          <div style={styles.sectionHead} className="reveal">
            <span style={{ ...styles.sectionTag, color: "#00e5a0" }}>How It Works</span>
            <h2 style={{ ...styles.sectionH2, color: "#fff" }}>From Zero to Operational<br />in One Day.</h2>
          </div>
          <div style={styles.stepsGrid}>
            {STEPS.map((s) => (
              <div key={s.num} style={styles.step} className="reveal">
                <div style={styles.stepNum}>{s.num}</div>
                <div style={styles.stepLine} />
                <h3 style={styles.stepTitle}>{s.title}</h3>
                <p style={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCIFAI CALLOUT */}
      <section style={styles.calloutSection}>
        <div style={styles.container}>
          <div style={styles.callout} className="reveal">
            <div style={styles.calloutLeft}>
              <span style={styles.sectionTag}>Powered by Docifai</span>
              <h2 style={styles.calloutH2}>AI Triage That Fills<br />Your Queue Automatically.</h2>
              <p style={styles.calloutDesc}>
                Docifai is our AI symptom triage assistant. When a patient uses Docifai, they're
                intelligently routed to the nearest Medionix-registered clinic — fully pre-triaged,
                reducing your intake workload before they even walk in.
              </p>
              <a href="#contact" style={styles.primaryBtn}>Learn About Docifai</a>
            </div>
            <div style={styles.calloutRight}>
              <div style={styles.triageCard}>
                <div style={styles.triageHeader}>Docifai Triage</div>
                <div style={styles.triageBody}>
                  <div style={styles.triageMsg}>Patient: "I have a fever and sore throat for 3 days"</div>
                  <div style={styles.triageReply}>
                    <span style={styles.aiTag}>AI</span>
                    Routing to Lagos Island Clinic — nearest Medionix partner. Est. wait: 12 min.
                  </div>
                  <div style={styles.triageAction}>
                    <span style={styles.actionDot} />
                    Patient added to queue in Medionix
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHead} className="reveal">
            <span style={styles.sectionTag}>Pricing</span>
            <h2 style={styles.sectionH2}>Simple, Clinic-Friendly<br />Pricing.</h2>
          </div>
          <div style={styles.pricingGrid}>
            {[
              { name: "Patients", price: "Free", desc: "For registration and bookings.", features: ["provided categories for easy access", "patient ID for quicker access", "Storing patients records", "Email support"] },
              { name: "Clinic", price: "N40k/mo", desc: "For growing clinics that need full power.", features: ["Unlimited patients", "Full diagnostics & labs", "Telemedicine built-in", "Analytics dashboard", "Priority support"], highlight: true },
              { name: "Network", price: "Custom", desc: "For hospital networks and health systems.", features: ["Multi-branch management", "Custom integrations", "Dedicated onboarding", "SLA & compliance", "24/7 support"] },
            ].map((p) => (
              <div key={p.name} style={{ ...styles.pricingCard, ...(p.highlight ? styles.pricingHighlight : {}) }} className="reveal">
                <div style={{ ...styles.pricingName, color: p.highlight ? "#00c47a" : "#999" }}>{p.name}</div>
                <div style={{ ...styles.pricingPrice, color: p.highlight ? "#fff" : "#0d1117" }}>{p.price}</div>
                <p style={styles.pricingDesc}>{p.desc}</p>
                <ul style={styles.pricingList}>
                  {p.features.map(f => (
                    <li key={f} style={{ ...styles.pricingItem, color: p.highlight ? "#ccc" : "#555" }}>
                      <span style={styles.check}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" style={p.highlight ? styles.primaryBtn : styles.outlineBtn}>
                  {p.price === "Custom" ? "Contact Us" : "Get Started"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / CONTACT — WaitlistForm integrated here */}
      <section id="contact" style={styles.ctaSection}>
        <div style={styles.ctaBg}>
          <div style={styles.ctaOrb} />
        </div>
        <div style={styles.container}>
          <div style={styles.ctaInner} className="reveal">
            <h2 style={styles.ctaH2}>Ready to Transform<br />Your Clinic?</h2>
            <p style={styles.ctaSub}>Join the waitlist for early access to Medionix.</p>
            <WaitlistForm dark={true} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.logo}>
            <span style={styles.logoMark}>M</span>
            <span style={{ ...styles.logoText, color: "#aaa" }}>Medionix</span>
          </div>
          <p style={styles.footerSub}>A MotionBridge Technologies product. Built for Africa.</p>
          <div style={styles.footerLinks}>
            {["Privacy", "Terms", "Contact"].map(l => <a key={l} href="#" style={styles.footerLink}>{l}</a>)}
          </div>
          <p style={styles.copyright}>© 2026 MotionBridge Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  root: { fontFamily: "'DM Sans', sans-serif", background: "#f5f4f0", color: "#0d1117", overflowX: "hidden" },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "20px 0", transition: "all 0.3s ease" },
  navScrolled: { background: "rgba(245,244,240,0.95)", backdropFilter: "blur(12px)", boxShadow: "0 1px 20px rgba(0,0,0,0.08)", padding: "12px 0" },
  navInner: { maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" },
  logoMark: { width: 36, height: 36, background: "#00c47a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18 },
  logoText: { fontWeight: 700, fontSize: 20, color: "#0d1117", letterSpacing: "-0.5px" },
  navLinks: { display: "flex", alignItems: "center", gap: 32 },
  navLink: { color: "#444", textDecoration: "none", fontSize: 15, fontWeight: 500 },
  navCta: { background: "#0d1117", color: "#fff", padding: "10px 22px", borderRadius: 100, fontSize: 14, fontWeight: 600, textDecoration: "none" },
  menuBtn: { background: "none", border: "none", fontSize: 22, cursor: "pointer", display: "none"},
  mobileMenu: { background: "#fff", padding: "16px 32px 24px", display: "flex", flexDirection: "column", gap: 16 },
  mobileLink: { color: "#0d1117", textDecoration: "none", fontSize: 16, fontWeight: 500 },
  mobileCta: { background: "#0d1117", color: "#fff", padding: "12px 24px", borderRadius: 100, textAlign: "center", textDecoration: "none", fontWeight: 600 },

  hero: { minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", padding: "120px 32px 80px", gap: 60, maxWidth: 1200, margin: "0 auto", flexWrap: "wrap" },
  heroBg: { position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" },
  gridOverlay: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(#e0dfd9 1px, transparent 1px), linear-gradient(90deg, #e0dfd9 1px, transparent 1px)", backgroundSize: "48px 48px", opacity: 0.6 },
  orb1: { position: "absolute", top: "10%", right: "5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(0,196,122,0.15) 0%, transparent 70%)", borderRadius: "50%" },
  orb2: { position: "absolute", bottom: "20%", left: "0%", width: 400, height: 400, background: "radial-gradient(circle, rgba(0,100,255,0.08) 0%, transparent 70%)", borderRadius: "50%" },
  heroContent: { flex: "1 1 480px", maxWidth: 600 },
  heroBadge: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,196,122,0.12)", border: "1px solid rgba(0,196,122,0.3)", padding: "6px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, color: "#00a864", marginBottom: 28 },
  badgeDot: { width: 6, height: 6, background: "#00c47a", borderRadius: "50%", display: "inline-block" },
  heroH1: { fontSize: "clamp(44px,6vw,80px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 24, color: "#0d1117" },
  heroAccent: { color: "#00c47a" },
  heroSub: { fontSize: 18, lineHeight: 1.7, color: "#555", marginBottom: 40, maxWidth: 480 },
  heroCtas: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 56 },
  primaryBtn: { background: "#00c47a", color: "#0d1117", padding: "14px 28px", borderRadius: 100, fontWeight: 700, fontSize: 15, textDecoration: "none", border: "none", cursor: "pointer", display: "inline-block", transition: "all 0.2s" },
  ghostBtn: { color: "#0d1117", fontSize: 15, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 },
  outlineBtn: { border: "2px solid #0d1117", color: "#0d1117", padding: "12px 26px", borderRadius: 100, fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-block", background: "transparent" },
  heroStats: { display: "flex", gap: 40, flexWrap: "wrap" },
  statItem: { display: "flex", flexDirection: "column" },
  statValue: { fontSize: 32, fontWeight: 800, color: "#0d1117", letterSpacing: "-1px" },
  statLabel: { fontSize: 13, color: "#777", marginTop: 2 },

  heroVisual: { flex: "1 1 440px", maxWidth: 540 },
  dashMock: { background: "#fff", borderRadius: 16, boxShadow: "0 32px 80px rgba(0,0,0,0.12)", overflow: "hidden", border: "1px solid #e8e6e0" },
  dashBar: { background: "#f0eeea", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #e8e6e0" },
  dashDots: { display: "flex", gap: 6 },
  dot: { width: 12, height: 12, borderRadius: "50%", display: "inline-block" },
  dashTitle: { fontSize: 12, color: "#888", fontWeight: 500 },
  dashBody: { display: "flex" },
  dashSidebar: { width: 130, padding: "16px 12px", borderRight: "1px solid #f0eeea", display: "flex", flexDirection: "column", gap: 4 },
  sideItem: { padding: "7px 10px", borderRadius: 8, fontSize: 11, color: "#888", cursor: "pointer", whiteSpace: "nowrap" },
  sideItemActive: { background: "#e8f9f3", color: "#00a864", fontWeight: 600 },
  dashMain: { flex: 1, padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  dashCard: { background: "#f8f7f4", borderRadius: 10, padding: "12px 14px", border: "1px solid #ede9e3" },
  cardLabel: { fontSize: 11, color: "#999", fontWeight: 500, marginBottom: 4 },
  cardValue: { fontSize: 28, fontWeight: 800, color: "#0d1117", letterSpacing: "-1px" },
  cardTag: { fontSize: 11, color: "#00a864", marginTop: 4, fontWeight: 600 },
  patientList: { display: "flex", flexDirection: "column", gap: 8, marginTop: 8 },
  patientRow: { display: "flex", alignItems: "center", gap: 8 },
  patientAvatar: { width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #00c47a, #0064ff)" },
  patientName: { fontSize: 11, color: "#444", flex: 1 },
  patientStatus: { fontSize: 10, background: "#e8f9f3", color: "#00a864", padding: "2px 8px", borderRadius: 100, fontWeight: 600 },

  section: { padding: "100px 32px" },
  darkSection: { padding: "100px 32px", background: "#0d1117" },
  container: { maxWidth: 1200, margin: "0 auto" },
  sectionHead: { textAlign: "center", marginBottom: 64 },
  sectionTag: { fontSize: 13, fontWeight: 700, color: "#00a864", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: 16 },
  sectionH2: { fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1 },

  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 },
  featureCard: { background: "#fff", border: "1px solid #e8e6e0", borderRadius: 16, padding: "32px 28px", cursor: "pointer", transition: "all 0.25s", position: "relative", overflow: "hidden" },
  featureCardActive: { border: "1px solid #00c47a", transform: "translateY(-4px)", boxShadow: "0 20px 48px rgba(0,196,122,0.12)" },
  featureIcon: { fontSize: 32, marginBottom: 16 },
  featureTitle: { fontSize: 19, fontWeight: 700, marginBottom: 10, color: "#0d1117" },
  featureDesc: { fontSize: 15, color: "#666", lineHeight: 1.65 },
  featureArrow: { position: "absolute", bottom: 24, right: 24, fontSize: 18, color: "#ccc" },

  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40 },
  step: { position: "relative" },
  stepNum: { fontSize: 48, fontWeight: 900, color: "#00c47a", letterSpacing: "-2px", lineHeight: 1, marginBottom: 16 },
  stepLine: { width: 40, height: 2, background: "#00c47a", marginBottom: 16 },
  stepTitle: { fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 12 },
  stepDesc: { fontSize: 15, color: "#888", lineHeight: 1.65 },

  calloutSection: { padding: "80px 32px", background: "#fff" },
  callout: { display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap" },
  calloutLeft: { flex: "1 1 420px" },
  calloutH2: { fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, margin: "16px 0 20px" },
  calloutDesc: { fontSize: 16, color: "#555", lineHeight: 1.7, marginBottom: 32 },
  calloutRight: { flex: "1 1 320px" },
  triageCard: { background: "#0d1117", borderRadius: 16, overflow: "hidden" },
  triageHeader: { background: "#1a1f2b", padding: "14px 20px", fontSize: 13, color: "#888", fontWeight: 600 },
  triageBody: { padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  triageMsg: { background: "#1a1f2b", color: "#ccc", padding: "12px 16px", borderRadius: 10, fontSize: 14, lineHeight: 1.5 },
  triageReply: { background: "rgba(0,196,122,0.12)", border: "1px solid rgba(0,196,122,0.2)", color: "#00e5a0", padding: "12px 16px", borderRadius: 10, fontSize: 14, lineHeight: 1.5, display: "flex", gap: 10, alignItems: "flex-start" },
  aiTag: { background: "#00c47a", color: "#0d1117", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 4, flexShrink: 0, marginTop: 2 },
  triageAction: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#666" },
  actionDot: { width: 8, height: 8, background: "#00c47a", borderRadius: "50%", flexShrink: 0 },

  pricingGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 },
  pricingCard: { background: "#fff", border: "1px solid #e8e6e0", borderRadius: 20, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 16 },
  pricingHighlight: { background: "#0d1117", border: "1px solid #00c47a", transform: "scale(1.03)" },
  pricingName: { fontSize: 13, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" },
  pricingPrice: { fontSize: 40, fontWeight: 900, letterSpacing: "-2px" },
  pricingDesc: { fontSize: 14, color: "#888", lineHeight: 1.6 },
  pricingList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, flex: 1 },
  pricingItem: { fontSize: 14, display: "flex", gap: 10, alignItems: "center" },
  check: { color: "#00c47a", fontWeight: 700 },

  ctaSection: { padding: "120px 32px", position: "relative", background: "#0d1117", textAlign: "center" },
  ctaBg: { position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" },
  ctaOrb: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(0,196,122,0.15) 0%, transparent 65%)", borderRadius: "50%" },
  ctaInner: { position: "relative", maxWidth: 560, margin: "0 auto" },
  ctaH2: { fontSize: "clamp(36px,5vw,64px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.05, color: "#fff", marginBottom: 20 },
  ctaSub: { fontSize: 18, color: "#888", marginBottom: 40 },

  footer: { background: "#0a0c10", padding: "48px 32px" },
  footerInner: { maxWidth: 1200, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  footerSub: { fontSize: 14, color: "#555" },
  footerLinks: { display: "flex", gap: 24 },
  footerLink: { fontSize: 14, color: "#555", textDecoration: "none" },
  copyright: { fontSize: 13, color: "#333", marginTop: 8 },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { -webkit-font-smoothing: antialiased; }
  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.5s; }
  a:hover { opacity: 0.85; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @media (max-width: 768px) {
    nav div[style*="gap:32px"] { display: none !important; }
    .hero { flex-direction: column; padding-top: 100px; }
  }
`;

