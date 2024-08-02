/**
 * Made with help from ChatGPT
 */

/**
 * https://www.gov.uk/repaying-your-student-loan/what-you-pay
 */
const getStudentLoanPlan = () => {
  const studentLoanPlan = document.getElementById('studentLoanPlan').value;

  if (studentLoanPlan === 'none') {
    return
  }

  if (studentLoanPlan === 'plan1') {
  // Plan 1
    return {
      threshold: 22015,
      rate: 0.09
    };
  }

  if (studentLoanPlan === 'plan2') {
    // Plan 2
    return {
      threshold: 27295,
      rate: 0.09
    };
  }
}

let workings = {}

const getNationalInsuranceRate = () => {
  const nationalInsuranceRace = document.getElementById('nationalInsuranceRate').value;

  if (nationalInsuranceRace === '8') {
    return 0.08
  }

  if (nationalInsuranceRace === '10') {
    return 0.1
  }

  return 0.12;
}

const getNiRates = () => {
  // Category letter
  // £123 to £242 (£533 to £1,048 a month)	
  // £242.01 to £967 (£1,048.01 to £4,189 a month)
  // Over £967 a week (£4,189 a month)
  // A	0%	12%	2%
  return [
    { threshold: 0, limit: 1047, rate: 0.0 },
    { threshold: 1048, limit: 3141, rate: getNationalInsuranceRate() },
    { threshold: 4189, limit: 999999, rate: 0.02 },
  ];

}

function calculateTakeHomeSalary(annualSalary, taxBands, _undefined1, _niRates, _pensionRate, pensionContribution, pensionContributionP) {
  const studentLoanRate = getStudentLoanPlan();
  // Income Tax
  let incomeTax = 0;

  for (let band of taxBands) {
      if (annualSalary > band.threshold) {
          const taxableAmount = Math.min(annualSalary - band.threshold, band.limit);
          const taxDue = taxableAmount * band.rate;
          incomeTax += taxDue
      }
  }

  // Student Loan Repayment
  const studentLoanRepayment = studentLoanRate ? Math.max(0, annualSalary - studentLoanRate.threshold) * studentLoanRate.rate : 0;

  // National Insurance
  const monthlyEarnings = annualSalary / 12;

  let monthlyNI = 0;

  const niRates = getNiRates();

  for (let rate of niRates) {;
      if (monthlyEarnings > rate.threshold) {
          const niAmount = Math.min(monthlyEarnings - rate.threshold, rate.limit);
          const nationalInsuranceDue = niAmount * rate.rate;
          monthlyNI += nationalInsuranceDue;
          workings[rate.rate] = nationalInsuranceDue;
      }
  }

  const autoEnrollmentBands = {
    lower: 6240,
    upper: 50270,
  }

  const difference = autoEnrollmentBands.upper - autoEnrollmentBands.lower;

  const salMinusLower = annualSalary - autoEnrollmentBands.lower;

  // https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment/automatic-enrolment-an-introduction
  if (pensionContributionP && salMinusLower > 0) {
    if (salMinusLower > difference) {
      pensionContribution = (difference / 12) * pensionContributionP;
    } else {
      pensionContribution = (salMinusLower / 12) * pensionContributionP;
    }
  }

  // Pension
  const monthlyPension = pensionContribution || 0;

  // Total Deductions and Take-home Salary
  const totalDeductions = (incomeTax + studentLoanRepayment + monthlyNI * 12 + monthlyPension * 12) / 12;
  const grossMonthly = annualSalary / 12;
  const takeHomeMonthly = grossMonthly - totalDeductions;

  return {
      grossMonthly,
      totalDeductions,
      takeHomeMonthly,
      incomeTax: incomeTax / 12,
      monthlyNI,
      monthlyPension,
      studentLoanRepayment: studentLoanRepayment / 12,
  };
}

const taxCode = '1238L'
// Grab 1238 from this string and * 10 to get tax free allowance

// Example usage:
const taxBands = [
  { threshold: 0, limit: 12380, rate: 0.0 },
  { threshold: 12381, limit: 37890, rate: 0.2 },  // up to 50,270
  { threshold: 50271, limit: 999730000, rate: 0.4 } // assuming no-one earns more than 999730000 for now
];

const pensionRate = 0.00;
const overTime = 0;

const result = calculateTakeHomeSalary(45000 + overTime, taxBands, undefined, undefined, pensionRate);
