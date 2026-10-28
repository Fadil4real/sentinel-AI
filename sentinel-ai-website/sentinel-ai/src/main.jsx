import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ShieldCheck, Activity, Wallet, Settings2, History, CircleHelp,
  Bell, Search, Plus, ArrowUpRight, ArrowDownLeft, Check, X,
  AlertTriangle, Clock3, ChevronDown, ExternalLink, Bot, SlidersHorizontal,
  CircleCheck, CircleX, Menu, LockKeyhole, Sparkles, Filter, RefreshCw
} from "lucide-react";
import "./styles.css";

const initialTransactions = [
  { id: "TX-1048", agent: "Treasury Assistant", initials: "TA", destination: "near.foundation", address: "near.foundation", amount: 2.4, status: "Allowed", time: "2 min ago", note: "Approved destination · Within spending limit", type: "transfer" },
  { id: "TX-1047", agent: "Research Agent", initials: "RA", destination: "unknown-wallet.near", address: "unknown-wallet.near", amount: 8, status: "Needs review", time: "11 min ago", note: "New destination · Human approval required", type: "transfer" },
  { id: "TX-1046", agent: "Treasury Assistant", initials: "TA", destination: "marketplace.near", address: "marketplace.near", amount: 32, status: "Blocked", time: "28 min ago", note: "Exceeds your 10 NEAR transaction limit", type: "transfer" },
  { id: "TX-1045", agent: "Ops Agent", initials: "OA", destination: "storage.near", address: "storage.near", amount: 0.6, status: "Allowed", time: "1 hr ago", note: "Approved destination · Within spending limit", type: "transfer" },
];

function App() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [activeNav, setActiveNav] = useState("Overview");
  const [limit, setLimit] = useState(10);
  const [allowlist, setAllowlist] = useState(["near.foundation", "storage.near", "marketplace.near"]);
  const [newDestination, setNewDestination] = useState("");
  const [amount, setAmount] = useState("3");
  const [destination, setDestination] = useState("near.foundation");
  const [agent, setAgent] = useState("Demo Agent");
  const [decision, setDecision] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  const allowedCount = transactions.filter(t => t.status === "Allowed").length;
  const blockedCount = transactions.filter(t => t.status === "Blocked").length;
  const reviewCount = transactions.filter(t => t.status === "Needs review").length;
  const filteredTransactions = useMemo(() => transactions.filter(t =>
    [t.id, t.agent, t.destination, t.status].join(" ").toLowerCase().includes(search.toLowerCase())
  ), [transactions, search]);

  function evaluateRequest(e) {
    e?.preventDefault();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || !destination.trim()) {
      setDecision({ status: "Invalid request", reasons: ["Enter a valid amount and destination."], amount: numericAmount || 0, destination });
      return;
    }
    const reasons = [];
    let status = "Allowed";
    if (numericAmount > limit) {
      status = "Blocked";
      reasons.push(`Request is ${numericAmount} NEAR, above your ${limit} NEAR per-transaction limit.`);
    }
    if (!allowlist.includes(destination.trim())) {
      if (status !== "Blocked") status = "Needs review";
      reasons.push("This destination is not on your approved list.");
    }
    if (!reasons.length) reasons.push("Amount is within your limit and the destination is approved.");
    setDecision({ status, reasons, amount: numericAmount, destination: destination.trim(), agent });
  }

  function recordDemoRequest() {
    if (!decision || decision.status === "Invalid request") return;
    const tx = {
      id: `TX-${1049 + transactions.length - initialTransactions.length}`,
      agent: decision.agent,
      initials: (decision.agent || "DA").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
      destination: decision.destination,
      address: decision.destination,
      amount: decision.amount,
      status: decision.status,
      time: "Just now",
      note: decision.reasons.join(" "),
      type: "transfer"
    };
    setTransactions(prev => [tx, ...prev]);
    setToast("Demo request added to the activity log.");
    setTimeout(() => setToast(""), 2600);
  }

  function updateStatus(id, status) {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status, note: status === "Allowed" ? "Approved by user · Demo only" : "Rejected by user · Demo only" } : t));
    setToast(status === "Allowed" ? "Request approved in demo." : "Request rejected in demo.");
    setTimeout(() => setToast(""), 2600);
  }

  function addDestination(e) {
    e.preventDefault();
    const value = newDestination.trim();
    if (value && !allowlist.includes(value)) setAllowlist(prev => [...prev, value]);
    setNewDestination("");
  }

  const navItems = [
    { label: "Overview", icon: Activity },
    { label: "Transactions", icon: Wallet },
    { label: "Policies", icon: SlidersHorizontal },
    { label: "Audit log", icon: History },
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><ShieldCheck size={25} strokeWidth={2.4} /></div>
          <div><div className="brand-name">sentinel<span>AI</span></div><div className="brand-sub">TRANSACTION GUARD</div></div>
          <button className="icon-btn close-nav" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <button className="workspace-switch"><div className="workspace-avatar">S</div><span><b>Solo workspace</b><small>Demo environment</small></span><ChevronDown size={16}/></button>
        <div className="nav-label">MENU</div>
        <nav className="nav-list">
          {navItems.map(item => <button key={item.label} className={`nav-item ${activeNav === item.label ? "active" : ""}`} onClick={() => { setActiveNav(item.label); setMobileNav(false); }}><item.icon size={18}/><span>{item.label}</span>{item.label === "Transactions" && <span className="nav-count">{transactions.length}</span>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="secure-card"><div className="secure-icon"><LockKeyhole size={17}/></div><b>You're in control</b><p>Requests are evaluated against your rules before action.</p><span className="secure-status"><i/> Policy engine active</span></div>
          <button className="nav-item" onClick={() => setActiveNav("Help & docs")}><CircleHelp size={18}/><span>Help & docs</span><ExternalLink size={14} className="nav-external"/></button>
          <div className="profile"><div className="profile-avatar">FA</div><div className="profile-info"><b>Demo Operator</b><small>Administrator</small></div><button className="icon-btn" aria-label="Profile options"><Settings2 size={17}/></button></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20}/></button>
          <div className="breadcrumb">Workspace <span>/</span> <b>{activeNav}</b></div>
          <div className="top-actions"><div className="environment"><i/> TEST ENVIRONMENT</div><button className="icon-btn notification-btn" aria-label="Notifications"><Bell size={18}/><i/></button><div className="top-avatar">FA</div></div>
        </header>

        <div className="page-wrap">
          <section className="welcome-row">
            <div><div className="eyebrow"><Sparkles size={14}/> AI AGENT SECURITY</div><h1>{activeNav === "Overview" ? "Good evening, Operator" : activeNav}</h1><p className="page-subtitle">Your AI agents can act. You decide what they're allowed to do.</p></div>
            <div className="date-chip"><Activity size={15}/> <span>Policy engine <b>Active</b></span></div>
          </section>

          {activeNav === "Policies" ? (
            <section className="panel policy-page">
              <div className="section-heading"><div><h2><SlidersHorizontal size={19}/> Security policies</h2><p>Set guardrails for every proposed transaction.</p></div><span className="status-pill status-allowed"><i/> Enforced in demo</span></div>
              <div className="policy-control"><div><b>Maximum transaction amount</b><p>Requests above this value are automatically blocked.</p></div><div className="limit-input"><input type="number" min="0.1" step="0.1" value={limit} onChange={e => setLimit(Math.max(0.1, Number(e.target.value) || 0.1))}/><span>NEAR</span></div></div>
              <div className="policy-control"><div><b>Approved destinations</b><p>Unknown destinations require human review.</p></div><span className="allow-count">{allowlist.length} destinations</span></div>
              <div className="allowlist">{allowlist.map(item => <div className="allow-item" key={item}><span className="allow-dot"><Check size={12}/></span><span>{item}</span><button className="icon-btn remove-btn" onClick={() => setAllowlist(prev => prev.filter(x => x !== item))} aria-label={`Remove ${item}`}><X size={15}/></button></div>)}</div>
              <form className="add-destination" onSubmit={addDestination}><input value={newDestination} onChange={e => setNewDestination(e.target.value)} placeholder="destination.near" aria-label="New approved destination"/><button className="btn btn-primary" type="submit"><Plus size={16}/> Add destination</button></form>
              <div className="info-banner"><LockKeyhole size={18}/><div><b>Policy-first design</b><p>Rules are deterministic. AI-generated text can explain a decision, but it cannot override a blocked request.</p></div></div>
            </section>
          ) : activeNav === "Help & docs" ? (
            <section className="panel docs-panel"><div className="section-heading"><div><h2><CircleHelp size={19}/> Help & documentation</h2><p>Explore the project resources and how the demo works.</p></div></div><div className="docs-grid"><a href="https://nearhackathon.com/" target="_blank" rel="noreferrer"><b>NEAR Hackathon</b><span>Official tracks and submission details <ExternalLink size={14}/></span></a><a href="https://docs.near.org/" target="_blank" rel="noreferrer"><b>NEAR Developer Docs</b><span>Build on NEAR <ExternalLink size={14}/></span></a><div><b>Demo safety note</b><span>This prototype simulates policy decisions. It does not send real transactions.</span></div></div></section>
          ) : (
            <>
              <section className="stats-grid">
                <StatCard label="Requests evaluated" value={transactions.length} change="All demo requests" icon={Activity} tone="teal" />
                <StatCard label="Allowed" value={allowedCount} change="Passed current checks" icon={CircleCheck} tone="green" />
                <StatCard label="Needs review" value={reviewCount} change="Waiting for a decision" icon={Clock3} tone="amber" />
                <StatCard label="Blocked" value={blockedCount} change="Policy violations" icon={CircleX} tone="red" />
              </section>

              {activeNav === "Overview" && <section className="content-grid">
                <div className="panel request-panel">
                  <div className="section-heading"><div><h2><ShieldCheck size={19}/> Test a transaction</h2><p>Submit a sample request to the policy engine.</p></div><span className="live-tag"><i/> LIVE DEMO</span></div>
                  <form className="request-form" onSubmit={evaluateRequest}>
                    <label>AI agent name<input value={agent} onChange={e => setAgent(e.target.value)} placeholder="e.g. Treasury Agent"/></label>
                    <div className="form-two"><label>Amount <span className="label-unit">(NEAR)</span><div className="input-with-icon"><Wallet size={16}/><input type="number" min="0.1" step="0.1" value={amount} onChange={e => setAmount(e.target.value)} required/><span>NEAR</span></div></label><label>Destination<input value={destination} onChange={e => setDestination(e.target.value)} placeholder="account.near" required/></label></div>
                    <div className="quick-examples"><span>Try example:</span><button type="button" onClick={() => {setAmount("2");setDestination("near.foundation");}}>Valid request</button><button type="button" onClick={() => {setAmount(String(Number(limit)+5));setDestination("near.foundation");}}>Over limit</button><button type="button" onClick={() => {setAmount("1");setDestination("new-wallet.near");}}>New destination</button></div>
                    <button className="btn btn-primary evaluate-btn" type="submit"><ShieldCheck size={17}/> Evaluate request <ArrowUpRight size={16}/></button>
                  </form>
                  {decision && <div className={`decision-card ${decision.status === "Allowed" ? "decision-good" : decision.status === "Blocked" ? "decision-bad" : "decision-warn"}`}>
                    <div className="decision-top"><div className="decision-icon">{decision.status === "Allowed" ? <Check size={18}/> : decision.status === "Blocked" ? <X size={18}/> : <AlertTriangle size={18}/>}</div><div><b>{decision.status}</b><small>Policy engine result · Simulation only</small></div><button className="icon-btn" onClick={() => setDecision(null)} aria-label="Dismiss result"><X size={16}/></button></div>
                    <ul>{decision.reasons.map((reason, i) => <li key={i}>{reason}</li>)}</ul>
                    {decision.status !== "Invalid request" && <button className="btn btn-secondary record-btn" onClick={recordDemoRequest}><Plus size={15}/> Add to activity log</button>}
                  </div>}
                </div>
                <div className="panel policy-summary">
                  <div className="section-heading"><div><h2><Settings2 size={19}/> Your guardrails</h2><p>Current policy configuration.</p></div><button className="text-link" onClick={() => setActiveNav("Policies")}>Edit rules <ArrowUpRight size={14}/></button></div>
                  <div className="guardrail"><div className="guardrail-icon icon-teal"><Wallet size={18}/></div><div className="guardrail-copy"><b>Transaction limit</b><span>Maximum per request</span></div><strong>{limit} <small>NEAR</small></strong></div>
                  <div className="guardrail"><div className="guardrail-icon icon-green"><ShieldCheck size={18}/></div><div className="guardrail-copy"><b>Destination allowlist</b><span>Approved accounts</span></div><strong>{allowlist.length} <small>accounts</small></strong></div>
                  <div className="guardrail"><div className="guardrail-icon icon-purple"><LockKeyhole size={18}/></div><div className="guardrail-copy"><b>Human approval</b><span>Required for unknown accounts</span></div><span className="mini-on">ON</span></div>
                  <div className="policy-note"><AlertTriangle size={16}/><p><b>Remember</b> — this demo evaluates requests using local rules. It does not connect to a wallet or execute transactions.</p></div>
                </div>
              </section>}

              <section className="panel transactions-panel">
                <div className="section-heading transaction-heading"><div><h2><History size={19}/>{activeNav === "Audit log" ? "Audit log" : "Recent transactions"}</h2><p>Review decisions made by your transaction guard.</p></div><div className="table-actions"><div className="search-box"><Search size={15}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activity…"/></div><button className="btn btn-secondary refresh-btn" onClick={() => {setTransactions(prev => [...prev]);setToast("Activity list refreshed.");setTimeout(() => setToast(""), 2000);}}><RefreshCw size={14}/> Refresh</button></div></div>
                <div className="table-wrap"><table><thead><tr><th>REQUEST / AGENT</th><th>DESTINATION</th><th>AMOUNT</th><th>DECISION</th><th>TIME</th><th></th></tr></thead><tbody>
                  {filteredTransactions.map(tx => <tr key={tx.id}><td><div className="request-cell"><div className="agent-avatar">{tx.initials}</div><div><b>{tx.id}</b><span>{tx.agent}</span></div></div></td><td><span className="destination-cell">{tx.destination}</span></td><td><b className="amount">{tx.amount} <small>NEAR</small></b></td><td><StatusPill status={tx.status}/></td><td className="time-cell">{tx.time}</td><td>{tx.status === "Needs review" ? <div className="row-actions"><button className="row-approve" title="Approve in demo" onClick={() => updateStatus(tx.id, "Allowed")}><Check size={15}/></button><button className="row-reject" title="Reject in demo" onClick={() => updateStatus(tx.id, "Blocked")}><X size={15}/></button></div> : <button className="icon-btn detail-btn" title={tx.note} onClick={() => {setDecision({status:tx.status,reasons:[tx.note],amount:tx.amount,destination:tx.destination});window.scrollTo({top:0,behavior:"smooth"});}}><ArrowUpRight size={16}/></button>}</td></tr>)}
                  {filteredTransactions.length === 0 && <tr><td colSpan="6" className="empty-state">No activity matches your search.</td></tr>}
                </tbody></table></div>
                <div className="table-footer"><span>Showing <b>{filteredTransactions.length}</b> of <b>{transactions.length}</b> requests</span><span><i/> Demo data · Local session</span></div>
              </section>
              <footer className="page-footer"><span>© 2026 Sentinel AI</span><span><ShieldCheck size={14}/> Human control. Verifiable rules. Safer agents.</span><span>Built for the NEAR Hackathon</span></footer>
            </>
          )}
        </div>
      </main>
      {toast && <div className="toast"><CircleCheck size={17}/>{toast}</div>}
    </div>
  );
}

function StatCard({ label, value, change, icon: Icon, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-change"><span className={`change-dot ${tone}`}/>{change}</div></div>;
}
function StatusPill({ status }) {
  const cls = status === "Allowed" ? "status-allowed" : status === "Blocked" ? "status-blocked" : "status-review";
  const Icon = status === "Allowed" ? Check : status === "Blocked" ? X : Clock3;
  return <span className={`status-pill ${cls}`}><Icon size={12}/>{status}</span>;
}
createRoot(document.getElementById("root")).render(<App />);