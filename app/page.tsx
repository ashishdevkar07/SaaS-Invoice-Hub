import Link from "next/link";
 
export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#020817", color: "#f1f5f9", minHeight: "100vh", overflowX: "hidden" }}>
 
      {/* NAV */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 40px", borderBottom: "1px solid #1e293b",
        background: "rgba(2,8,23,0.85)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 18 }}>
          <div style={{
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            padding: 8, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          InvoiceHub
        </div>
 
        <div style={{ display: "flex", gap: 32 }}>
          {["Features", "How it works", "Preview"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
              style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
              {item}
            </a>
          ))}
        </div>
 
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login" style={{
            background: "transparent", border: "1px solid #334155",
            color: "#f1f5f9", padding: "8px 18px", borderRadius: 10,
            fontSize: 13, fontWeight: 600, textDecoration: "none"
          }}>Sign In</Link>
          <Link href="/signup" style={{
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            border: "none", color: "white", padding: "8px 18px", borderRadius: 10,
            fontSize: 13, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 4px 15px rgba(59,130,246,0.3)"
          }}>Get Started Free</Link>
        </div>
      </nav>
 
      {/* HERO */}
      <section style={{ textAlign: "center", padding: "100px 40px 80px", position: "relative" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
          color: "#93c5fd", padding: "6px 14px", borderRadius: 99,
          fontSize: 12, fontWeight: 600, marginBottom: 28, letterSpacing: "0.3px"
        }}>
          ⚡ GST-Ready · UPI Payments · Cloud Powered
        </div>
 
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 20 }}>
          Professional Invoicing<br />
          <span style={{
            background: "linear-gradient(135deg, #60a5fa, #818cf8, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            Built for Indian Businesses
          </span>
        </h1>
 
        <p style={{ color: "#94a3b8", fontSize: "clamp(15px, 2vw, 18px)", maxWidth: 560, margin: "0 auto 40px" }}>
          Create GST-compliant invoices in seconds. Accept UPI payments with auto-generated QR codes.
          Track every rupee — all in one dashboard.
        </p>
 
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" style={{
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "white", padding: "14px 32px", borderRadius: 12,
            fontSize: 15, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 8px 25px rgba(59,130,246,0.35)", display: "inline-flex", alignItems: "center", gap: 8
          }}>🚀 Start for Free</Link>
          <a href="#preview" style={{
            background: "transparent", border: "1px solid #334155",
            color: "#f1f5f9", padding: "14px 32px", borderRadius: 12,
            fontSize: 15, fontWeight: 700, textDecoration: "none"
          }}>👀 See Demo</a>
        </div>
      </section>
 
      {/* STATS BAR */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 60, flexWrap: "wrap",
        padding: 40, borderTop: "1px solid #1e293b", borderBottom: "1px solid #1e293b",
        background: "#0f172a"
      }}>
        {[
          { number: "₹0", label: "Cost to start" },
          { number: "30s", label: "To create an invoice" },
          { number: "5", label: "GST rate options" },
          { number: "100%", label: "Cloud-synced & secure" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#3b82f6" }}>{s.number}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
 
      {/* DASHBOARD PREVIEW */}
      <section id="preview" style={{ padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Everything you need, nothing you don't</h2>
        <p style={{ color: "#94a3b8", marginBottom: 40 }}>A clean, powerful dashboard built for speed and clarity</p>
 
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b", borderRadius: 20,
          padding: 24, maxWidth: 900, margin: "0 auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)"
        }}>
          {/* Window dots */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
            ))}
          </div>
 
          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Total Volume", value: "₹9,249", color: "#3b82f6", sub: "3 total records" },
              { label: "Paid Revenue", value: "₹3,500", color: "#10b981", sub: "1 fully settled" },
              { label: "Pending Dues", value: "₹5,749", color: "#f59e0b", sub: "2 awaiting payment" },
              { label: "Overdue", value: "₹0.00", color: "#ef4444", sub: "0 overdue bills" },
            ].map((c) => (
              <div key={c.label} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>{c.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: c.color, marginTop: 6 }}>{c.value}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>{c.sub}</div>
              </div>
            ))}
          </div>
 
          {/* Bottom: Form + Table */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 12 }}>
            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>➕ Create New Invoice</div>
              {["Client Name — e.g. Acme Corp", "Product / Service Description", "Qty: 1", "Rate: ₹1,000"].map((p) => (
                <input key={p} readOnly placeholder={p} style={{
                  background: "#020817", border: "1px solid #334155", borderRadius: 8,
                  padding: "8px 12px", width: "100%", marginBottom: 8,
                  color: "#64748b", fontSize: 11, fontFamily: "Inter, sans-serif"
                }} />
              ))}
              <div style={{
                background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                borderRadius: 8, padding: 8, textAlign: "center",
                fontSize: 12, fontWeight: 700, color: "white"
              }}>✨ Generate Invoice</div>
            </div>
 
            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Invoice Records</div>
              {[
                { name: "Ashish", amount: "₹750", status: "Pending", statusColor: "#f59e0b", statusBg: "rgba(245,158,11,0.15)" },
                { name: "Ramesh", amount: "₹4,999", status: "Pending", statusColor: "#f59e0b", statusBg: "rgba(245,158,11,0.15)" },
                { name: "Gau Mata Dairy", amount: "₹3,500", status: "Paid", statusColor: "#10b981", statusBg: "rgba(16,185,129,0.15)" },
              ].map((row) => (
                <div key={row.name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0", borderBottom: "1px solid #0f172a", fontSize: 11
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{row.name}</div>
                    <div style={{ color: "#94a3b8", fontSize: 10 }}>Professional Services (Qty: 1)</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{row.amount}</div>
                  <span style={{
                    padding: "3px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700,
                    background: row.statusBg, color: row.statusColor,
                    border: `1px solid ${row.statusColor}40`
                  }}>{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      {/* FEATURES */}
      <section id="features" style={{ padding: "80px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Everything built for India</h2>
          <p style={{ color: "#94a3b8", fontSize: 16 }}>GST, UPI, HSN codes — we handle the complexity so you don't have to</p>
        </div>
 
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
          {[
            { icon: "🧾", title: "GST-Compliant Invoices", desc: "Auto-calculate GST at 0%, 5%, 12%, 18%, or 28%. GSTIN, HSN/SAC codes included in every invoice.", color: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
            { icon: "📱", title: "UPI QR Code Payments", desc: "Every invoice generates a dynamic UPI QR code. Clients scan and pay instantly via GPay or PhonePe.", color: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
            { icon: "📥", title: "One-Click PDF Download", desc: "Download professional invoice PDFs instantly. Share via WhatsApp or email with your clients.", color: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
            { icon: "☁️", title: "Cloud-Synced Storage", desc: "All invoices stored securely on AWS DynamoDB. Access your billing history from any device, anytime.", color: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)" },
            { icon: "📊", title: "Real-Time Analytics", desc: "Track total revenue, paid amounts, pending dues and overdue bills at a glance from your dashboard.", color: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.2)" },
            { icon: "🏢", title: "Company Branding", desc: "Add your company name, address, bank details and UPI ID. Every invoice reflects your business identity.", color: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
          ].map((f) => (
            <div key={f.title} style={{
              background: "#0f172a", border: "1px solid #1e293b",
              borderRadius: 16, padding: 28,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, fontSize: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: f.color, border: `1px solid ${f.border}`, marginBottom: 16
              }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "80px 40px", background: "#0f172a" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Up and running in 3 steps</h2>
          <p style={{ color: "#94a3b8" }}>No setup headaches. No accountant needed.</p>
        </div>
 
        <div style={{ display: "flex", gap: 0, maxWidth: 900, margin: "0 auto" }}>
          {[
            { num: "1", title: "Create Account", desc: "Sign up free. Add your company name and billing details once." },
            { num: "2", title: "Fill Invoice Details", desc: "Enter client name, product, quantity, rate and GST rate. Takes under 30 seconds." },
            { num: "3", title: "Share & Get Paid", desc: "Download PDF with UPI QR code. Share with client. Get paid instantly." },
          ].map((s) => (
            <div key={s.num} style={{ flex: 1, textAlign: "center", padding: "0 20px" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white", fontSize: 20, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 4px 15px rgba(59,130,246,0.4)"
              }}>{s.num}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* CTA */}
      <section style={{ padding: "100px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: 42, fontWeight: 900, marginBottom: 16, letterSpacing: "-1px" }}>Start billing smarter today</h2>
        <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 40 }}>Join businesses already using InvoiceHub to manage their billing</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" style={{
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "white", padding: "14px 32px", borderRadius: 12,
            fontSize: 15, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 8px 25px rgba(59,130,246,0.35)"
          }}>🚀 Create Free Account</Link>
          <Link href="/login" style={{
            background: "transparent", border: "1px solid #334155",
            color: "#f1f5f9", padding: "14px 32px", borderRadius: 12,
            fontSize: 15, fontWeight: 700, textDecoration: "none"
          }}>Sign In →</Link>
        </div>
      </section>
 
      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid #1e293b", padding: "32px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        color: "#94a3b8", fontSize: 13
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "#f1f5f9" }}>
          <div style={{
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            padding: 6, borderRadius: 7, display: "flex"
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          InvoiceHub
        </div>
        <div>© 2026 InvoiceHub. Built for Indian businesses.</div>
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/login" style={{ color: "#94a3b8", textDecoration: "none" }}>Login</Link>
          <Link href="/signup" style={{ color: "#94a3b8", textDecoration: "none" }}>Sign Up</Link>
        </div>
      </footer>
 
    </div>
  );
}