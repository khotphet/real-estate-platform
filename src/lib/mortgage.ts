/**
 * MapNest Mortgage Calculation Utility
 * Standard Thai Commercial Bank PMT Amortization Formula
 */

export interface MortgageCalculation {
  price: number;
  downPaymentPct: number;
  downPaymentAmount: number;
  loanAmount: number;
  loanTermYears: number;
  interestRate: number;
  monthlyPayment: number;
  principalPortion: number;
  interestPortion: number;
  principalPct: number;
  interestPct: number;
  dsr: number;
}

export const DEFAULT_MORTGAGE_CONFIG = {
  downPaymentPct: 10,
  loanTermYears: 30,
  interestRate: 3.5, // 3.50% ต่อปี (เกณฑ์เฉลี่ย 3 ปีแรก ธนาคารพันธมิตร ธอส. / SCB)
  monthlyIncome: 30000,
};

export function calculateMortgage(params: {
  price: number;
  downPaymentPct?: number;
  downPaymentAmount?: number;
  loanTermYears?: number;
  interestRate?: number;
  monthlyIncome?: number;
}): MortgageCalculation {
  const price = Math.max(0, params.price);

  const downPaymentPct =
    params.downPaymentPct !== undefined
      ? params.downPaymentPct
      : params.downPaymentAmount !== undefined && price > 0
      ? Math.round((params.downPaymentAmount / price) * 100)
      : DEFAULT_MORTGAGE_CONFIG.downPaymentPct;

  const downPaymentAmount =
    params.downPaymentAmount !== undefined
      ? params.downPaymentAmount
      : Math.round(price * (downPaymentPct / 100));

  const loanAmount = Math.max(0, price - downPaymentAmount);
  const loanTermYears = params.loanTermYears ?? DEFAULT_MORTGAGE_CONFIG.loanTermYears;
  const interestRate = params.interestRate ?? DEFAULT_MORTGAGE_CONFIG.interestRate;
  const monthlyIncome = params.monthlyIncome ?? DEFAULT_MORTGAGE_CONFIG.monthlyIncome;

  if (loanAmount <= 0) {
    return {
      price,
      downPaymentPct,
      downPaymentAmount,
      loanAmount: 0,
      loanTermYears,
      interestRate,
      monthlyPayment: 0,
      principalPortion: 0,
      interestPortion: 0,
      principalPct: 0,
      interestPct: 0,
      dsr: 0,
    };
  }

  // Monthly interest rate and total number of installment months
  const r = interestRate / 100 / 12;
  const n = loanTermYears * 12;

  // Monthly PMT Formula: P * [ r(1+r)^n ] / [ (1+r)^n - 1 ]
  let monthly = 0;
  if (r === 0) {
    monthly = loanAmount / n;
  } else {
    const factor = Math.pow(1 + r, n);
    monthly = (loanAmount * (r * factor)) / (factor - 1);
  }

  // First month breakdown
  const firstMonthInterest = loanAmount * r;
  const firstMonthPrincipal = Math.max(0, monthly - firstMonthInterest);

  const monthlyPayment = Math.round(monthly);
  const principalPortion = Math.round(firstMonthPrincipal);
  const interestPortion = Math.round(firstMonthInterest);

  const principalPct = monthlyPayment > 0 ? Math.round((principalPortion / monthlyPayment) * 100) : 0;
  const interestPct = Math.max(0, 100 - principalPct);
  const dsr = monthlyIncome > 0 ? parseFloat(((monthly / monthlyIncome) * 100).toFixed(1)) : 0;

  return {
    price,
    downPaymentPct,
    downPaymentAmount,
    loanAmount,
    loanTermYears,
    interestRate,
    monthlyPayment,
    principalPortion,
    interestPortion,
    principalPct,
    interestPct,
    dsr,
  };
}
