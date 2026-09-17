import { useEffect, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUp, ClipboardCheck, Layers3, MapPinned, Menu, RefreshCw, ScanLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./components/ui/sheet";

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

interface Solution { title: string; description: string; image: string; alt: string; tags: string[]; }
interface Service { title: string; description: string; image: string; alt: string; }
interface Feature { title: string; description: string; detail: string; icon: LucideIcon; visual: "identity" | "signals" | "estate" | "loop"; }

const solutions: Solution[] = [
  { title: "Palm health mapping", description: "Give every mapped palm a stable identity, baseline, and repeat-survey history.", image: "palmwatch-hero.png", alt: "Aerial view across a mapped oil-palm estate", tags: ["Palm ID", "Time series"] },
  { title: "Risk screening & prioritisation", description: "Bring spectral, structural, thermal, and contextual signals into one explainable review queue.", image: "palmwatch-drone.png", alt: "Mapping drone surveying oil palms", tags: ["Multisignal", "Priority"] },
  { title: "Field action & traceability", description: "Move from a flagged palm to inspection, confirmation, follow-up, and an auditable record.", image: "palmwatch-field-verification.png", alt: "Agronomists verifying an oil-palm observation in the field", tags: ["Assignments", "Audit trail"] },
];

const services: Service[] = [
  { title: "Map & inventory", description: "Register estate boundaries, blocks, and stable palm identities before analysis begins.", image: "palmwatch-hero.png", alt: "Aerial view of an oil-palm estate arranged in mapped blocks" },
  { title: "Calibrated aerial survey", description: "Capture repeat RGB, multispectral, and thermal evidence under controlled field protocols.", image: "palmwatch-drone.png", alt: "Drone collecting calibrated imagery over mature oil palms" },
  { title: "Risk screening", description: "Compare each palm with its own history and relevant neighbours to find persistent change.", image: "palmwatch-hero.png", alt: "Oil-palm rows viewed from above for comparative screening" },
  { title: "Field verification", description: "Send prioritised observations to agronomists for inspection and, where needed, laboratory confirmation.", image: "palmwatch-field-verification.png", alt: "Field specialists examining a mature oil palm with a tablet" },
  { title: "Monitoring & reporting", description: "Close the loop with repeat visits, intervention follow-ups, and estate-level evidence reports.", image: "palmwatch-drone.png", alt: "Drone survey providing repeat monitoring evidence for an estate" },
];

const features: Feature[] = [
  { title: "Palm-level identity and history", description: "A permanent tree record replaces disconnected survey snapshots.", detail: "Every observation, image, inspection, and follow-up stays attached to the same mapped palm.", icon: ScanLine, visual: "identity" },
  { title: "Multisignal health intelligence", description: "No single index is treated as a diagnosis.", detail: "Spectral, structural, thermal, temporal, and field evidence are reviewed together.", icon: Layers3, visual: "signals" },
  { title: "Whole-estate context", description: "A palm is interpreted in the place where it grows.", detail: "Block, age, soil, weather, neighbours, and management history supply the comparison context.", icon: MapPinned, visual: "estate" },
  { title: "Field-to-model confirmation loop", description: "Screening becomes useful when it leads to verified action.", detail: "Assignments, field findings, confirmations, and outcomes improve the evidence trail over time.", icon: RefreshCw, visual: "loop" },
];

const navItems = [["Overview", "#overview"], ["Solutions", "#solutions"], ["Services", "#services"], ["Features", "#features"], ["FAQ", "#faq"]] as const;

function Brand() {
  return <span className="brand"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 42 42"><path d="M11 29c3-10 10-16 21-18-1 10-7 18-18 20"/><path className="vein" d="M14 29c4-5 9-9 16-14"/></svg></span><span>PalmWatch</span></span>;
}

function FeatureVisual({ type }: { type: Feature["visual"] }) {
  if (type === "identity") return <div className="identity-visual" aria-hidden="true"><div className="visual-head"><span>Palm record</span><b>PW-2048</b><em>Active</em></div><div className="record-row"><span>Baseline</span><strong>Survey established</strong><small>Round 01</small></div><div className="record-row"><span>Change</span><strong>Trend flagged for review</strong><small>Round 02</small></div><div className="record-row"><span>Field note</span><strong>Inspection attached</strong><small>Latest</small></div></div>;
  if (type === "signals") return <div className="signal-visual" aria-hidden="true"><div className="visual-head"><span>Evidence review</span><b>Signals considered together</b></div><div className="signal-row"><span>Spectral</span><strong>Change detected</strong><i className="review"/></div><div className="signal-row"><span>Structural</span><strong>Pattern consistent</strong><i/></div><div className="signal-row"><span>Thermal</span><strong>Needs repeat capture</strong><i className="pending"/></div><div className="signal-row"><span>Context</span><strong>Neighbour comparison added</strong><i/></div></div>;
  if (type === "estate") return <div className="estate-visual" aria-hidden="true"><div className="estate-summary"><span>Proposed study scale</span><strong>6,000</strong><small>mapped palms across 120 balanced farms</small></div><div className="estate-map">{Array.from({ length: 35 }, (_, index) => <i className={index === 11 || index === 24 ? "review" : ""} key={index}/>)}</div><div className="estate-key"><span><i/>Mapped</span><span><i className="review"/>Prioritised</span></div></div>;
  return <div className="loop-visual" aria-hidden="true"><div className="visual-head"><span>Confirmation workflow</span><b>Every decision leaves evidence</b></div><div className="loop-step"><span>01</span><ScanLine/><strong>Observe</strong><small>Persistent change enters review</small></div><div className="loop-step"><span>02</span><MapPinned/><strong>Prioritise</strong><small>Context sets field order</small></div><div className="loop-step"><span>03</span><ClipboardCheck/><strong>Confirm</strong><small>Expert finding is attached</small></div><div className="loop-step"><span>04</span><RefreshCw/><strong>Learn</strong><small>Outcome improves the record</small></div></div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sentinels = document.querySelectorAll<HTMLElement>(".service-sentinel");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveService(Number((entry.target as HTMLElement).dataset.index ?? 0)); });
    }, { threshold: 0.1, rootMargin: "-42% 0px -42% 0px" });
    sentinels.forEach((sentinel) => observer.observe(sentinel));
    return () => observer.disconnect();
  }, []);

  const currentService = services[activeService];

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <a href="#home" aria-label="PalmWatch home"><Brand /></a>
        <div className="nav-links">{navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div>
        <Button asChild className="nav-cta"><a href="#pilot">Plan a pilot <span aria-hidden="true">↗</span></a></Button>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild><button className="menu-toggle" type="button" aria-label="Open navigation"><Menu aria-hidden="true" /></button></SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only">Main navigation</SheetTitle>
            <a className="sheet-brand" href="#home" onClick={() => setMenuOpen(false)}><Brand /></a>
            <div className="sheet-links">{navItems.map(([label, href]) => <SheetClose asChild key={href}><a href={href}>{label}</a></SheetClose>)}</div>
            <SheetClose asChild><Button asChild><a href="#pilot">Plan a pilot <span aria-hidden="true">↗</span></a></Button></SheetClose>
          </SheetContent>
        </Sheet>
      </nav>
    </header>

    <main id="main">
      <section className="hero" id="home" aria-labelledby="hero-title">
        <img className="hero-image" src={asset("palmwatch-hero.png")} alt="Aerial view of a mature oil-palm plantation at sunrise" />
        <div className="hero-shade" />
        <div className="hero-inner">
          <div className="hero-copy"><span className="hero-kicker">AI-assisted oil-palm intelligence</span><h1 id="hero-title"><span>See the health of</span><span>every palm, sooner.</span></h1></div>
          <article className="hero-card" aria-label="Estate-level monitoring"><img src={asset("palmwatch-drone.png")} alt="Mapping drone surveying oil palms" /><h2>Your entire oil-palm estate. One dashboard.</h2></article>
          <div className="hero-intro"><p>Connect calibrated aerial evidence with field confirmation, then focus inspection where it matters most.</p><Button asChild><a href="#services">Explore the workflow <ArrowDown size={17} aria-hidden="true" /></a></Button></div>
        </div>
      </section>

      <section className="statement section" id="overview">
        <p className="section-label">PalmWatch overview</p>
        <div className="statement-copy"><h2>From plantation-scale imagery to a decision for every tree.</h2><p>PalmWatch is being developed as a scientifically validated field-research platform—not a black-box diagnosis. It tracks spectral, structural, thermal, environmental, and field evidence over time, then ranks palms for expert inspection.</p></div>
        <div className="metric-grid" aria-label="Recommended minimum NBL research design"><article className="metric"><strong>120</strong><span>balanced study farms</span></article><article className="metric"><strong>6,000</strong><span>mapped palms</span></article><article className="metric"><strong>3</strong><span>repeat survey rounds</span></article><article className="metric"><strong>18,000</strong><span>tree observations</span></article></div>
        <p className="metric-note">Recommended minimum defensible research design for the expanded NBL study; these are study targets, not deployment results.</p>
      </section>

      <section className="solutions section" id="solutions">
        <div className="solutions-intro"><div><p className="section-label">Our solutions</p><h2>One platform. Complete oil-palm intelligence.</h2></div><Button asChild><a href="#pilot">Plan a pilot <span aria-hidden="true">↗</span></a></Button></div>
        <div className="solution-grid">{solutions.map((solution, index) => <article className="solution-card" key={solution.title}><img src={asset(solution.image)} alt={solution.alt} loading="lazy"/><div className="solution-shade"/><div className="solution-copy"><span className="card-index">0{index + 1}</span><h3>{solution.title}</h3><p>{solution.description}</p><div className="tags">{solution.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></article>)}</div>
      </section>

      <section className="service-story" id="services" aria-labelledby="services-title">
        <div className="service-sticky">
          <div className="service-backgrounds" aria-hidden="true">{services.map((service, index) => <img className={index === activeService ? "active" : ""} key={service.title} src={asset(service.image)} alt="" />)}</div><div className="service-shade"/>
          <div className="service-stage">
            <div className="service-heading"><p>Our services</p><h2 id="services-title">Evidence from the air.<br/>Decisions in the field.</h2></div>
            <article className="service-card" key={currentService.title}><img src={asset(currentService.image)} alt={currentService.alt}/><div><h3>{currentService.title}</h3><p>{currentService.description}</p></div></article>
            <div className="service-progress"><strong>{String(activeService + 1).padStart(2, "0")}/05</strong><span>{activeService === services.length - 1 ? "Continue below" : "Keep scrolling"}</span></div>
          </div>
          <ol className="sr-only">{services.map((service) => <li key={service.title}>{service.title}: {service.description}</li>)}</ol>
        </div>
        <div className="service-track" aria-hidden="true">{services.map((service, index) => <div className="service-sentinel" data-index={index} key={service.title}/>)}</div>
        <div className="service-mobile-list"><div className="service-mobile-head"><p className="section-label">Our services</p><h2>Evidence from the air. Decisions in the field.</h2></div>{services.map((service, index) => <article key={service.title}><img src={asset(service.image)} alt={service.alt} loading="lazy"/><span>0{index + 1}/05</span><h3>{service.title}</h3><p>{service.description}</p></article>)}</div>
      </section>

      <section className="features section" id="features">
        <div className="features-head"><p className="section-label">Built for evidence, not guesswork</p><h2>Four capabilities.<br/>One continuous record.</h2><p>Each layer keeps the estate view connected to the palm, the observation, and the field decision.</p></div>
        <div className="feature-stack">{features.map((feature, index) => { const Icon = feature.icon; return <article className={`feature-card feature-${index + 1}`} key={feature.title} style={{ "--card-index": index } as CSSProperties}><div className="feature-copy"><span className="feature-number">0{index + 1}</span><Icon aria-hidden="true"/><h3>{feature.title}</h3><p>{feature.description}</p><small>{feature.detail}</small></div><FeatureVisual type={feature.visual}/></article>; })}</div>
      </section>

      <section className="research section" id="research"><div className="research-visual"><img src={asset("palmwatch-field-verification.png")} alt="Agronomists verifying an oil-palm observation in the field" loading="lazy"/><div className="floating-reading reading-one"><span>NDRE trend</span><strong>−8.4%</strong><small>needs review</small></div><div className="floating-reading reading-two"><span>Palm ID</span><strong>PW-2048</strong><small>Block 06</small></div></div><div className="research-copy"><p className="section-label">Whole-plantation research</p><h2>Health is more than one disease.</h2><p>The expanded NBL research scope evaluates the context around every tree so the model can distinguish possible disease from water, nutrient, pest, and management stress.</p><div className="factor-cloud" aria-label="Research factors"><span>Soil condition</span><span>Leaf condition</span><span>Seed variety</span><span>Geography</span><span>Irrigation</span><span>Fertilizer</span><span>Infestation</span><span>Intercropping</span><span>Adjacent farming</span><span>Plantation age</span></div></div></section>

      <section className="evidence section"><div className="section-head"><div><p className="section-label">Evidence architecture</p><h2>Signals become useful when they agree.</h2></div><p>No universal NDVI threshold can diagnose a palm. PalmWatch combines calibrated measurements, neighbour comparisons, temporal change, and confirmed field labels.</p></div><div className="evidence-grid"><article className="evidence-card"><span>01</span><h3>Spectral</h3><p>NDVI, NDRE, GNDVI, red edge, NIR, and calibrated reflectance.</p></article><article className="evidence-card"><span>02</span><h3>Structural</h3><p>Crown area, density, symmetry, gaps, yellowing, and visible change.</p></article><article className="evidence-card"><span>03</span><h3>Thermal</h3><p>Canopy temperature, transpiration stress, and neighbour-relative anomalies.</p></article><article className="evidence-card"><span>04</span><h3>Contextual</h3><p>Soil, weather, age, seed, management history, and spatial clustering.</p></article></div></section>

      <section className="faq section" id="faq"><div className="faq-title"><p className="section-label">Questions, answered</p><h2>Clear science.<br/>Useful action.</h2></div><Accordion className="accordion" type="single" defaultValue="diagnosis" collapsible><AccordionItem value="diagnosis"><AccordionTrigger>Does PalmWatch diagnose Ganoderma?</AccordionTrigger><AccordionContent>No. PalmWatch detects patterns consistent with elevated risk and prioritises palms for expert inspection. Field or laboratory confirmation remains essential.</AccordionContent></AccordionItem><AccordionItem value="repeat"><AccordionTrigger>Why are repeat surveys necessary?</AccordionTrigger><AccordionContent>A persistent decline while nearby palms remain stable is more informative than a single unusual reading. Repetition also reduces seasonal and flight-condition noise.</AccordionContent></AccordionItem><AccordionItem value="target"><AccordionTrigger>What is the initial model target?</AccordionTrigger><AccordionContent>The realistic first target is a three-way screen: healthy, other stress, and suspected Ganoderma. More detailed disease and severity labels require sufficient confirmed samples.</AccordionContent></AccordionItem><AccordionItem value="split"><AccordionTrigger>How is research data divided?</AccordionTrigger><AccordionContent>Training, validation, and locked testing should be separated by farm—not randomly by tree—to prevent information leakage between similar palms from the same location.</AccordionContent></AccordionItem></Accordion></section>

      <section className="pilot" id="pilot" style={{ backgroundImage: `url(${asset("palmwatch-hero.png")})` }}><div className="pilot-shade"/><div className="pilot-inner"><p>Build the evidence base</p><h2>Ready to move from a demo to a validated field study?</h2><Button asChild><a href="#research">Review the study scope <ArrowUp size={17} aria-hidden="true"/></a></Button></div></section>
    </main>

    <footer className="footer-stage" style={{ backgroundImage: `url(${asset("palmwatch-hero.png")})` }}><div className="footer-shade"/><div className="footer-tab"><div className="footer-brand"><a href="#home"><Brand /></a><p>Oil-palm intelligence,<br/>tree by tree.</p></div><div className="footer-column"><strong>Explore</strong><a href="#overview">Overview</a><a href="#solutions">Solutions</a><a href="#services">Services</a><a href="#features">Features</a></div><div className="footer-column"><strong>Research</strong><a href="#research">Study scope</a><a href="#faq">Questions</a><a href={asset("palmwatch-whitepaper.pdf")} target="_blank" rel="noreferrer">White paper ↗</a></div><div className="footer-column"><strong>Actions</strong><a href="#pilot">Plan a pilot</a><a href="#research">Review evidence</a><a href="#home">Back to top ↑</a></div><div className="footer-bottom"><span>AI-assisted screening. Field-confirmed decisions.</span><span>© 2026 PalmWatch. All rights reserved.</span></div></div></footer>
  </>;
}

export default App;
