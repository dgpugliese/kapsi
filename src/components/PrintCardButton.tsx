'use client';

export default function PrintCardButton() {
  return (
    <button className="btn btn--primary" onClick={() => window.print()}>
      Print Card
    </button>
  );
}
