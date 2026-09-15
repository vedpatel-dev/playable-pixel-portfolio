const MARQUEE_ITEMS = [
  "PYTHON",
  "CLAUDE CODE",
  "CURSOR",
  "AZURE AI FOUNDRY",
  "LANGCHAIN",
  "N8N",
  "FASTAPI",
  "PYTORCH",
  "REACT",
  "PANDAS",
  "NUMPY",
  "SCIKIT-LEARN",
  "MCP SERVERS",
  "POWER BI",
  "AZURE DEVOPS",
  "SQL",
  "C/C++",
  "PYTEST",
  "PLOTLY",
  "COPILOT STUDIO",
  "CODEX",
  "MICROSOFT GRAPH",
];

/**
 * Pure-CSS infinite ticker. The list is rendered twice and translated -50%,
 * which loops seamlessly with a single compositor-only animation.
 */
export function TechMarquee() {
  return (
    <div
      aria-hidden="true"
      className="group relative overflow-hidden border-y-[3px] border-line bg-ink/60 py-3"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div
        className="flex w-max gap-8 group-hover:[animation-play-state:paused]"
        style={{ animation: "marquee 46s linear infinite" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-8">
            {MARQUEE_ITEMS.map((item) => (
              <span
                key={item}
                className="font-pixel flex items-center gap-8 text-[12px] tracking-[0.18em] text-dim"
              >
                {item}
                <span className="inline-block h-[6px] w-[6px] bg-line" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
