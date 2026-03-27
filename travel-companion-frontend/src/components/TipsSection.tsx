interface TipsSectionProps {
  tips: string[];
}

export default function TipsSection({ tips }: TipsSectionProps) {
  return (
    <section className="section">
      <h2 className="section-title">Travel Tips</h2>
      <ul className="tips-list">
        {tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </section>
  );
}
