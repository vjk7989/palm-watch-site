import { useMemo, useState } from "react";

type Unit = "acre" | "hectare";

export function LossCalculator() {
  const [area, setArea] = useState(100);
  const [unit, setUnit] = useState<Unit>("acre");
  const [healthyYield, setHealthyYield] = useState(20);
  const [affectedShare, setAffectedShare] = useState(10);
  const [lossFraction, setLossFraction] = useState(40);
  const [price, setPrice] = useState(0);

  const result = useMemo(() => {
    const hectares = unit === "acre" ? area * 0.404685642 : area;
    const affectedHectares = hectares * Math.max(0, affectedShare) / 100;
    const lostTonnes = affectedHectares * Math.max(0, healthyYield) * Math.max(0, lossFraction) / 100;
    return { hectares, affectedHectares, lostTonnes, value: lostTonnes * Math.max(0, price) };
  }, [area, unit, healthyYield, affectedShare, lossFraction, price]);

  return <section className="loss-calculator" aria-labelledby="loss-calculator-title">
    <div className="calculator-intro"><p>Scenario tool</p><h2 id="loss-calculator-title">Estimate a transparent loss range</h2><p>Use estate-specific inputs. The result is a planning scenario, not a diagnosis or universal Ganoderma loss rate.</p></div>
    <div className="calculator-grid">
      <label>Estate area<input type="number" min="0" step="1" value={area} onChange={(e) => setArea(Number(e.target.value))} /></label>
      <label>Area unit<select value={unit} onChange={(e) => setUnit(e.target.value as Unit)}><option value="acre">Acres</option><option value="hectare">Hectares</option></select></label>
      <label>Healthy FFB yield (t/ha/year)<input type="number" min="0" step="0.1" value={healthyYield} onChange={(e) => setHealthyYield(Number(e.target.value))} /></label>
      <label>Affected area (%)<input type="number" min="0" max="100" step="1" value={affectedShare} onChange={(e) => setAffectedShare(Number(e.target.value))} /></label>
      <label>Yield reduction in affected area (%)<input type="number" min="0" max="100" step="1" value={lossFraction} onChange={(e) => setLossFraction(Number(e.target.value))} /></label>
      <label>Optional price per tonne<input type="number" min="0" step="1" value={price} onChange={(e) => setPrice(Number(e.target.value))} /></label>
    </div>
    <div className="calculator-results" aria-live="polite">
      <div><span>Estate basis</span><strong>{result.hectares.toFixed(1)} ha</strong></div>
      <div><span>Affected area</span><strong>{result.affectedHectares.toFixed(1)} ha</strong></div>
      <div><span>Estimated FFB loss</span><strong>{result.lostTonnes.toFixed(1)} t/year</strong></div>
      {price > 0 && <div><span>Indicative revenue exposure</span><strong>{result.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong></div>}
    </div>
    <p className="calculator-formula"><strong>Formula:</strong> hectares × affected share × healthy yield × yield-loss fraction. It excludes treatment, replanting, mortality, price volatility, and recovery effects.</p>
  </section>;
}
