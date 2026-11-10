import { formatPhone, site } from "./config";
import ReceptionistWidget, { openReceptionist } from "./ReceptionistWidget";

const STATS = [
  { value: "62%", label: "of calls to small businesses go unanswered." },
  { value: "85%", label: "of callers who reach voicemail never call back." },
  { value: "62%", label: "of unanswered callers call a competitor instead." },
  { value: "$126K", label: "lost per year, on average, to missed calls." },
];

const INDUSTRIES = ["Hair salons", "Barbershops", "Pet groomers", "Spas", "Clinics", "Home services"];

const STEPS = [
  {
    title: "Tell us about your business",
    body: "A five-step profile: your services, prices, hours and policies. We turn it into your receptionist.",
  },
  {
    title: "We attach it to your number",
    body: "Your business phone number never changes. Calls you can't pick up forward straight to your receptionist.",
  },
  {
    title: "You never miss a call again",
    body: "It checks your real openings and books the appointment, or takes a callback request. You see everything in your dashboard.",
  },
];

const REASONS = [
  {
    title: `Local to ${site.serviceArea}`,
    body: "We set you up ourselves and stay reachable. No call centers, no ticket queues.",
  },
  {
    title: "Made for appointment businesses",
    body: "It learns your services, prices and booking rules. It answers like someone who works there.",
  },
  {
    title: "Up to 5x return",
    body: "Our average clients see up to 5x ROI. It never double-books and reads every booking back first.",
  },
  {
    title: "Free trial if it fits",
    body: "If your business is a good fit, try it on real calls first. Decide after you've heard it work.",
  },
];

// The live demo answers for a sample grooming salon, so these match what it knows.
const TRY_PROMPTS = [
  "How much is a full groom for a medium dog?",
  "What do you have open next Tuesday?",
  "Can someone call me back tomorrow?",
];

function PrimaryButton({
  short = false,
  label,
  className = "btn btn-primary",
}: {
  short?: boolean;
  label?: string;
  className?: string;
}) {
  const cta = site.primaryCta;
  const text = label ?? (short ? cta.short : cta.label);
  if (cta.kind === "receptionist") {
    return (
      <button type="button" className={className} onClick={openReceptionist}>
        {text}
      </button>
    );
  }
  return (
    <a className={className} href={cta.href} {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {text}
    </a>
  );
}

function TalkButton({ className = "btn btn-ghost" }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={openReceptionist}>
      <span className="pulse" aria-hidden="true" />
      Talk to our AI receptionist
    </button>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        fill="#10302d"
        d="M9 9.5A2.5 2.5 0 0 1 11.5 7h11A2.5 2.5 0 0 1 25 9.5v8a2.5 2.5 0 0 1-2.5 2.5H16l-4.6 4.1c-.6.5-1.4.1-1.4-.6V20h-.5A2.5 2.5 0 0 1 7 17.5Z"
      />
      <path fill="currentColor" d="M13 11h1.8v2.6h3.4V11H20v7h-1.8v-2.8h-3.4V18H13Z" />
    </svg>
  );
}

function Header() {
  return (
    <header className="ag-header">
      <div className="ag-container ag-header-inner">
        <a className="ag-logo" href="#top" aria-label={`${site.name} home`}>
          <span className="ag-logo-mark">
            <LogoMark />
          </span>
          HelloRoster <span className="ag-logo-ai">AI</span>
        </a>
        <nav aria-label="Main" className="ag-nav">
          <a href="#problem">The problem</a>
          <a href="#try-it">Try it</a>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <PrimaryButton short className="btn btn-primary btn-small" />
      </div>
    </header>
  );
}

function CallCard() {
  return (
    <figure className="call-card" aria-label="Example of a call your receptionist handles after hours">
      <div className="call-card-top">
        <span className="call-live">Answered · 8:47 PM</span>
        <span className="call-tag">Example call</span>
      </div>
      <p className="call-line call-them">“Hi, do you have anything Saturday morning?”</p>
      <p className="call-line call-us">“We do. I have 10:30 with Maria. Want me to book it for you?”</p>
      <p className="call-line call-them">“Yes please.”</p>
      <figcaption className="call-result">
        <span className="call-check" aria-hidden="true">✓</span> Booked while you were closed
      </figcaption>
    </figure>
  );
}

export default function AgencyApp() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section className="hero" id="top">
          <div className="ag-container hero-grid">
            <div>
              <p className="eyebrow">For local businesses in {site.serviceArea}</p>
              <h1>Never miss a customer call again.</h1>
              <p className="hero-sub">
                HelloRoster AI answers every call, 24/7, and books the appointment while you're busy with a customer.
                Serving local businesses across {site.serviceArea}.
              </p>
              <div className="cta-row">
                <PrimaryButton />
                <TalkButton />
              </div>
              <p className="hero-note">Same phone number. Live in days, not months.</p>
            </div>
            <CallCard />
          </div>
          <div className="ag-container industries" aria-label="Businesses we answer for">
            {INDUSTRIES.map((industry) => (
              <span key={industry}>{industry}</span>
            ))}
          </div>
        </section>

        <section className="section problem" id="problem" aria-labelledby="problem-title">
          <div className="ag-container">
            <p className="eyebrow eyebrow-dark">The problem</p>
            <h2 id="problem-title">Every missed call walks next door.</h2>
            <p className="section-lead">
              You can't answer the phone mid-appointment. Your callers won't wait for you to finish.
            </p>
            <ul className="stats">
              {STATS.map((stat) => (
                <li className="stat" key={stat.label}>
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </li>
              ))}
            </ul>
            <p className="stats-close">That's money your business already earned the call for.</p>
          </div>
        </section>

        <section className="section try" id="try-it" aria-labelledby="try-title">
          <div className="ag-container try-grid">
            <div>
              <p className="eyebrow">Try it live</p>
              <h2 id="try-title">Don't take our word. Talk to it.</h2>
              <p className="section-lead">
                This is the exact receptionist we build for local businesses. Right now it's answering for our sample
                grooming salon.
              </p>
              <TalkButton className="btn btn-primary btn-large" />
              <p className="try-note">Works in your browser. Nothing is booked until you press Confirm.</p>
            </div>
            <div className="try-card">
              <p className="try-card-title">Try asking</p>
              <ul className="try-prompts">
                {TRY_PROMPTS.map((prompt) => (
                  <li key={prompt}>“{prompt}”</li>
                ))}
              </ul>
              <p className="try-arrow" aria-hidden="true">
                Your receptionist is waiting in the corner <span>↘</span>
              </p>
            </div>
          </div>
        </section>

        <section className="section how" id="how-it-works" aria-labelledby="how-title">
          <div className="ag-container">
            <p className="eyebrow eyebrow-dark">How it works</p>
            <h2 id="how-title">Three steps. Zero new phone numbers.</h2>
            <ol className="steps">
              {STEPS.map((step, index) => (
                <li className="step" key={step.title}>
                  <span className="step-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section pricing" id="pricing" aria-labelledby="pricing-title">
          <div className="ag-container">
            <p className="eyebrow eyebrow-dark">Pricing</p>
            <h2 id="pricing-title">Priced against doing nothing.</h2>
            <div className="price-grid">
              <div className="price-card price-cost">
                <p className="price-kicker">Doing nothing</p>
                <p className="price-figure">$126,000</p>
                <p className="price-unit">a year, on average, lost to missed calls</p>
                <p>That's the average small business. It never shows up as an invoice.</p>
              </div>
              <div className="price-card price-plan">
                <p className="price-kicker">HelloRoster AI</p>
                <p className="price-figure price-figure-small">Book a call for pricing</p>
                <p className="price-unit">One simple monthly plan, sized to your call volume</p>
                <ul className="price-list">
                  <li>Answers 24/7, including holidays</li>
                  <li>Keeps your existing number</li>
                  <li>Never double-books a slot</li>
                  <li>Free trial if it's a good fit</li>
                </ul>
                <PrimaryButton label="Get my price" className="btn btn-primary btn-block" />
              </div>
            </div>
          </div>
        </section>

        <section className="section why" id="why-us" aria-labelledby="why-title">
          <div className="ag-container">
            <p className="eyebrow eyebrow-dark">Why HelloRoster AI</p>
            <h2 id="why-title">Local, focused, and proven.</h2>
            <ul className="reasons">
              {REASONS.map((reason) => (
                <li className="reason" key={reason.title}>
                  <h3>{reason.title}</h3>
                  <p>{reason.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="final" aria-labelledby="final-title">
          <div className="ag-container final-inner">
            <h2 id="final-title">Stop losing calls this week.</h2>
            <p>Tell us about your business. We'll show you what your callers would hear.</p>
            <div className="cta-row cta-row-center">
              <PrimaryButton />
              <TalkButton className="btn btn-ghost-light" />
            </div>
          </div>
        </section>
      </main>

      <footer className="ag-footer">
        <div className="ag-container footer-grid">
          <div>
            <p className="footer-brand">{site.name}</p>
            <p>AI receptionists for local businesses.</p>
          </div>
          <div>
            <p className="footer-label">{site.phone ? "Call us" : "Hear it first"}</p>
            {site.phone ? (
              <a className="footer-phone" href={`tel:${site.phone}`}>
                {formatPhone(site.phone)}
              </a>
            ) : (
              <button type="button" className="footer-link-button" onClick={openReceptionist}>
                Talk to our receptionist
              </button>
            )}
          </div>
          <div>
            <p className="footer-label">Service area</p>
            <p>{site.serviceArea} and surrounding cities</p>
          </div>
          <div>
            <p className="footer-label">Ready?</p>
            <PrimaryButton short className="btn btn-primary btn-small" />
          </div>
        </div>
        <div className="ag-container footer-base">
          <p>
            © {new Date().getFullYear()} {site.name}. Your number stays yours.
          </p>
        </div>
      </footer>

      <ReceptionistWidget />
    </>
  );
}
