const bubbles = [
  { size: 72, left: 8, top: 18, duration: 24, delay: 0 },
  { size: 120, left: 82, top: 12, duration: 30, delay: 2 },
  { size: 96, left: 18, top: 72, duration: 28, delay: 4 },
  { size: 64, left: 70, top: 78, duration: 22, delay: 1 },
  { size: 140, left: 45, top: 38, duration: 34, delay: 5 },
  { size: 88, left: 60, top: 58, duration: 26, delay: 3 },
];

export default function FloatingBubbles() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-orange-200/30 blur-3xl animate-pulse"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  );
}