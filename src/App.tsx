import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Menu, X } from "lucide-react";
import { Button } from "./components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion";

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 42 42"><path d="M11 29c3-10 10-16 21-18-1 10-7 18-18 20"/><path className="vein" d="M14 29c4-5 9-9 16-14"/></svg>
      </span>
      <span>PalmWatch</span>
    </span>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = document.querySelectorAll<HTMLElement>(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("in-view"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header" id="home">
        <nav className="nav-shell" aria-label="Main navigation">
          <a href="#home" aria-label="PalmWatch home"><Brand /></a>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="nav-links" onClick={() => setMenuOpen((open) => !open)}>
            <span className="sr-only">Toggle navigation</span>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`} id="nav-links">
            <a onClick={closeMenu} href="#overview">Overview</a>
            <a onClick={closeMenu} href="#method">Method</a>
            <a onClick={closeMenu} href="#research">Research</a>
            <a onClick={closeMenu} href="#outputs">Outputs</a>
            <a onClick={closeMenu} href="#faq">FAQ</a>
          </div>
          <Button asChild className="nav-cta"><a href="#pilot">Plan a pilot <span aria-hidden="true">↗</span></a></Button>
        </nav>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero-image" src={asset("palmwatch-hero.png")} alt="Aerial view of a mature oil-palm plantation at sunrise" />
          <div className="hero-shade" />
          <div className="hero-inner">
            <div className="hero-copy reveal">
              <span className="eyebrow eyebrow-dark">AI-assisted oil-palm intelligence</span>
              <h1 id="hero-title">See the health of every palm, sooner.</h1>
            </div>
            <article className="hero-card reveal" aria-label="Palm-level monitoring">
              <img src={asset("palmwatch-drone.png")} alt="Mapping drone surveying oil palms" />
              <h2>One palm. One history.</h2>
              <p>Repeat surveys build a traceable health record for every mapped tree.</p>
            </article>
            <div className="hero-intro reveal">
              <p>PalmWatch combines calibrated drone imagery, field observations, and confirmation data to screen palm health and focus inspection where it matters most.</p>
              <Button asChild><a href="#method">Explore the method <ArrowDown size={17} aria-hidden="true" /></a></Button>
            </div>
          </div>
        </section>

        <section className="statement section" id="overview">
          <div className="section-label reveal">01 / Overview</div>
          <div className="statement-copy reveal">
            <h2>From plantation-scale imagery to a decision for every tree.</h2>
            <p>PalmWatch is being developed as a scientifically validated field-research platform—not a black-box diagnosis. It tracks spectral, structural, thermal, environmental, and field evidence over time, then ranks palms for expert inspection.</p>
          </div>
          <div className="metric-grid" aria-label="Recommended minimum NBL research design">
            <article className="metric reveal"><strong>120</strong><span>balanced study farms</span></article>
            <article className="metric reveal"><strong>6,000</strong><span>mapped palms</span></article>
            <article className="metric reveal"><strong>3</strong><span>repeat survey rounds</span></article>
            <article className="metric reveal"><strong>18,000</strong><span>tree observations</span></article>
          </div>
          <p className="metric-note">Recommended minimum defensible research design for the expanded NBL study; these are study targets, not deployment results.</p>
        </section>

        <section className="solutions section section-dark" id="outputs">
          <div className="section-head reveal">
            <div><span className="eyebrow">What the platform delivers</span><h2>One evidence trail.<br />Three decision layers.</h2></div>
            <p>Designed for plantation leaders, agronomists, and field teams to move from signal to verified action.</p>
          </div>
          <div className="solution-grid">
            <article className="solution-card reveal">
              <div className="solution-visual canopy-map" aria-hidden="true"><span className="palm p1"/><span className="palm p2 warning"/><span className="palm p3"/><span className="palm p4"/><span className="palm p5 risk"/><span className="palm p6"/></div>
              <span className="card-index">01</span><h3>Palm health baseline</h3><p>Give every palm a stable identity and compare it with its own history, similar-age neighbours, and local healthy controls.</p><div className="tags"><span>Tree ID</span><span>Time series</span></div>
            </article>
            <article className="solution-card reveal">
              <div className="solution-visual signal-chart" aria-hidden="true"><svg viewBox="0 0 480 210" preserveAspectRatio="none"><path d="M0 165C70 150 103 151 155 128s95-7 146-48 96 20 179-50"/><path className="ghost" d="M0 114c78 4 113-30 177-18s91 43 145 17 104-20 158-11"/></svg><span className="chart-chip">persistent change</span></div>
              <span className="card-index">02</span><h3>Risk screening</h3><p>Combine multiple signals to identify palms that warrant inspection—without treating one index or image as a diagnosis.</p><div className="tags"><span>Explainable score</span><span>Priority</span></div>
            </article>
            <article className="solution-card reveal">
              <div className="solution-visual action-stack" aria-hidden="true"><div><i/><span>Inspect PW-2048</span><b>Today</b></div><div><i className="amber"/><span>Revisit Block 06</span><b>3 days</b></div><div><i className="green"/><span>Verify field note</span><b>Done</b></div></div>
              <span className="card-index">03</span><h3>Field action system</h3><p>Turn flagged palms into assigned inspections, confirmation records, intervention follow-ups, and management reports.</p><div className="tags"><span>Assignments</span><span>Audit trail</span></div>
            </article>
          </div>
        </section>

        <section className="method section" id="method">
          <div className="method-intro reveal"><span className="eyebrow eyebrow-light">The PalmWatch method</span><h2>Observe. Compare. Confirm. Act.</h2><p>Repeated evidence matters more than a single abnormal scan. PalmWatch is built around a closed learning loop between remote sensing and the field.</p></div>
          <div className="method-list">
            <article className="method-step reveal"><span>01</span><div><h3>Map every palm</h3><p>Register boundaries, blocks, farms, and stable palm IDs before analysis begins.</p></div><svg aria-hidden="true" viewBox="0 0 64 64"><path d="M13 18l14-6 12 5 12-5v34l-12 6-12-5-14 6z"/><path d="M27 12v35m12-30v35"/></svg></article>
            <article className="method-step reveal"><span>02</span><div><h3>Capture calibrated evidence</h3><p>Collect repeat RGB, multispectral, thermal, weather, and field observations under controlled protocols.</p></div><svg aria-hidden="true" viewBox="0 0 64 64"><circle cx="32" cy="32" r="19"/><circle cx="32" cy="32" r="7"/><path d="M32 6v7m0 38v7M6 32h7m38 0h7"/></svg></article>
            <article className="method-step reveal"><span>03</span><div><h3>Score change, not snapshots</h3><p>Compare each palm with its own baseline, local peers, and confirmed reference cases.</p></div><svg aria-hidden="true" viewBox="0 0 64 64"><path d="M9 49l13-15 10 8 22-28"/><path d="M44 14h10v10"/></svg></article>
            <article className="method-step reveal"><span>04</span><div><h3>Confirm in the field</h3><p>Use agronomist inspection and laboratory evidence to validate labels and improve the model.</p></div><svg aria-hidden="true" viewBox="0 0 64 64"><path d="M15 33l11 11 23-25"/><circle cx="32" cy="32" r="25"/></svg></article>
          </div>
        </section>

        <section className="research section" id="research">
          <div className="research-visual reveal"><img src={asset("palmwatch-drone.png")} alt="Drone surveying a mature oil-palm plantation"/><div className="floating-reading reading-one"><span>NDRE trend</span><strong>−8.4%</strong><small>needs review</small></div><div className="floating-reading reading-two"><span>Palm ID</span><strong>PW-2048</strong><small>Block 06</small></div></div>
          <div className="research-copy reveal"><span className="eyebrow eyebrow-light">Whole-plantation research</span><h2>Health is more than one disease.</h2><p>The expanded NBL research scope evaluates the context around every tree so the model can distinguish possible disease from water, nutrient, pest, and management stress.</p><div className="factor-cloud" aria-label="Research factors"><span>Soil condition</span><span>Leaf condition</span><span>Seed variety</span><span>Geography</span><span>Irrigation</span><span>Fertilizer</span><span>Infestation</span><span>Intercropping</span><span>Adjacent farming</span><span>Plantation age</span></div></div>
        </section>

        <section className="evidence section">
          <div className="section-head reveal"><div><span className="eyebrow eyebrow-light">Evidence architecture</span><h2>Signals become useful when they agree.</h2></div><p>No universal NDVI threshold can diagnose a palm. PalmWatch combines calibrated measurements, neighbour comparisons, temporal change, and confirmed field labels.</p></div>
          <div className="evidence-grid"><article className="evidence-card reveal"><span className="evidence-num">01</span><h3>Spectral</h3><p>NDVI, NDRE, GNDVI, red edge, NIR, and calibrated reflectance.</p></article><article className="evidence-card reveal"><span className="evidence-num">02</span><h3>Structural</h3><p>Crown area, density, symmetry, gaps, yellowing, and visible change.</p></article><article className="evidence-card reveal"><span className="evidence-num">03</span><h3>Thermal</h3><p>Canopy temperature, transpiration stress, and neighbour-relative anomalies.</p></article><article className="evidence-card reveal"><span className="evidence-num">04</span><h3>Contextual</h3><p>Soil, weather, age, seed, management history, and spatial clustering.</p></article></div>
        </section>

        <section className="faq section" id="faq">
          <div className="faq-title reveal"><span className="eyebrow eyebrow-light">Questions, answered</span><h2>Clear science.<br/>Useful action.</h2></div>
          <Accordion className="accordion" type="single" defaultValue="diagnosis" collapsible>
            <AccordionItem value="diagnosis" className="reveal"><AccordionTrigger>Does PalmWatch diagnose Ganoderma?</AccordionTrigger><AccordionContent>No. PalmWatch detects patterns consistent with elevated risk and prioritizes palms for expert inspection. Field or laboratory confirmation remains essential.</AccordionContent></AccordionItem>
            <AccordionItem value="repeat" className="reveal"><AccordionTrigger>Why are repeat surveys necessary?</AccordionTrigger><AccordionContent>A persistent decline while nearby palms remain stable is more informative than a single unusual reading. Repetition also reduces seasonal and flight-condition noise.</AccordionContent></AccordionItem>
            <AccordionItem value="target" className="reveal"><AccordionTrigger>What is the initial model target?</AccordionTrigger><AccordionContent>The realistic first target is a three-way screen: healthy, other stress, and suspected Ganoderma. More detailed disease and severity labels require sufficient confirmed samples.</AccordionContent></AccordionItem>
            <AccordionItem value="split" className="reveal"><AccordionTrigger>How is research data divided?</AccordionTrigger><AccordionContent>Training, validation, and locked testing should be separated by farm—not randomly by tree—to prevent information leakage between similar palms from the same location.</AccordionContent></AccordionItem>
          </Accordion>
        </section>

        <section className="pilot" id="pilot" style={{ backgroundImage: `url(${asset("palmwatch-hero.png")})` }}>
          <div className="pilot-shade"/><div className="pilot-inner reveal"><span className="eyebrow eyebrow-dark">Build the evidence base</span><h2>Ready to move from a demo to a validated field study?</h2><Button asChild><a href="#research">Review the study scope <ArrowUp size={17} aria-hidden="true"/></a></Button></div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand"><a href="#home"><Brand /></a><p>Oil-palm intelligence, tree by tree.</p></div>
        <div className="footer-links"><a href="#overview">Overview</a><a href="#method">Method</a><a href="#research">Research</a><a href="#faq">FAQ</a></div>
        <div className="footer-note"><p>AI-assisted screening. Field-confirmed decisions.</p><span>© 2026 PalmWatch</span></div>
      </footer>
    </>
  );
}

export default App;
