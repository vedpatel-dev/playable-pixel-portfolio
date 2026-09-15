/**
 * Twinkling pixel stars. Positions come from a seeded LCG so the server and
 * client render byte-identical markup (no hydration mismatch), and the whole
 * thing is pure CSS once painted — no scroll listeners, no rAF.
 */

const STAR_COLORS = ["#e8ecff", "#46e0d0", "#9d7bff", "#ffc24b"];

function makeStars(seed: number, count: number) {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    left: +(rand() * 100).toFixed(3),
    top: +(rand() * 100).toFixed(3),
    size: rand() > 0.82 ? 3 : 2,
    color: STAR_COLORS[Math.floor(rand() * STAR_COLORS.length)],
    delay: +(rand() * 4).toFixed(2),
    duration: +(2.6 + rand() * 3.4).toFixed(2),
  }));
}

const LAYERS = [
  { stars: makeStars(20260915, 22), float: 26, opacity: 0.9 },
  { stars: makeStars(770315, 18), float: 38, opacity: 0.6 },
  { stars: makeStars(190277, 14), float: 52, opacity: 0.4 },
];

export function StarField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {LAYERS.map((layer, li) => (
        <div
          key={li}
          className="absolute inset-0"
          style={{
            opacity: layer.opacity,
            animation: `bob ${layer.float}s ease-in-out infinite`,
            animationDelay: `${li * -4}s`,
          }}
        >
          {layer.stars.map((star, si) => (
            <span
              key={si}
              className="absolute"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
                background: star.color,
                animation: `twinkle ${star.duration}s steps(2, end) ${star.delay}s infinite`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
