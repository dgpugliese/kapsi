'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase';

const PAYMENT_OPTIONS = [
  {
    value: 'annual_dues',
    title: 'Annual Dues',
    amount: 200,
    amountDisplay: '$200.00',
    desc: 'Standard annual per capita assessment',
    fy: '2026-2027',
  },
  {
    value: 'subscribing_life',
    title: 'Subscribing Life',
    amount: 1250,
    amountDisplay: '$1,250.00',
    desc: 'Installment plan — 4 payments of $1,250',
    fy: '2026-2027 (1 of 4)',
  },
  {
    value: 'life_membership',
    title: 'Life Membership',
    amount: 3500,
    amountDisplay: '$3,500.00',
    desc: 'One-time payment for lifetime financial status',
    fy: 'N/A — Lifetime',
  },
];

interface DuesFormProps {
  cardNameDefault: string;
}

export default function DuesForm({ cardNameDefault }: DuesFormProps) {
  const [selectedType, setSelectedType] = useState('annual_dues');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardName, setCardName] = useState(cardNameDefault);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardZip, setCardZip] = useState('');

  const selected = PAYMENT_OPTIONS.find((o) => o.value === selectedType)!;

  function handleCardNumberInput(val: string) {
    setCardNumber(
      val
        .replace(/\D/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .substring(0, 19)
    );
  }

  function handleExpInput(val: string) {
    let v = val.replace(/\D/g, '');
    if (v.length >= 2) v = v.substring(0, 2) + ' / ' + v.substring(2, 4);
    setCardExp(v);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user.id;

    const { error } = await supabase.from('dues_payments').insert({
      member_id: userId,
      amount: selected.amount,
      payment_type: selectedType,
      fiscal_year: selected.fy,
      status: 'completed',
      notes: 'Online payment via member portal',
    });

    if (error) {
      alert('Payment failed: ' + error.message);
      setSubmitting(false);
    } else {
      setSuccess(true);
      setTimeout(() => window.location.reload(), 1500);
    }
  }

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <div className="payment-options">
        {PAYMENT_OPTIONS.map((opt) => (
          <label className="payment-option" key={opt.value}>
            <input
              type="radio"
              name="payment_type"
              value={opt.value}
              checked={selectedType === opt.value}
              onChange={() => setSelectedType(opt.value)}
            />
            <div className="payment-option-card">
              <div className="payment-option-title">{opt.title}</div>
              <div className="payment-option-amount">{opt.amountDisplay}</div>
              <div className="payment-option-desc">{opt.desc}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="payment-card-section">
        <h3>Payment Details</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="card-name">Name on Card</label>
            <input
              type="text"
              id="card-name"
              placeholder="Full name as shown on card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="card-number">Card Number</label>
            <input
              type="text"
              id="card-number"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={cardNumber}
              onChange={(e) => handleCardNumberInput(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-row form-row--split">
          <div className="form-group">
            <label htmlFor="card-exp">Expiration</label>
            <input
              type="text"
              id="card-exp"
              placeholder="MM / YY"
              maxLength={7}
              value={cardExp}
              onChange={(e) => handleExpInput(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="card-cvv">CVV</label>
            <input
              type="text"
              id="card-cvv"
              placeholder="123"
              maxLength={4}
              value={cardCvv}
              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="card-zip">Billing ZIP</label>
            <input
              type="text"
              id="card-zip"
              placeholder="19132"
              maxLength={10}
              value={cardZip}
              onChange={(e) => setCardZip(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="payment-summary">
        <div className="payment-summary-line">
          <span>Payment Amount</span>
          <span className="payment-summary-amount">{selected.amountDisplay}</span>
        </div>
        <div className="payment-summary-line payment-summary-line--sub">
          <span>Fiscal Year</span>
          <span>{selected.fy}</span>
        </div>
      </div>

      <button
        type="submit"
        className={`btn btn--primary dues-submit-btn${success ? ' dues-submit-btn--success' : ''}`}
        disabled={submitting}
      >
        {submitting
          ? success
            ? 'Payment Successful!'
            : 'Processing...'
          : `Submit Payment — ${selected.amountDisplay}`}
      </button>

      <p className="payment-disclaimer">
        This is a demonstration portal. No actual payment will be processed. In production,
        this would integrate with a PCI-compliant payment processor.
      </p>
    </form>
  );
}
