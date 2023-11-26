/**
 * Made with help from ChatGPT
 */

const getStudentLoanPlan = () => {
  const studentLoanPlan = document.getElementById('studentLoanPlan').value;
  console.log(studentLoanPlan);

  if (studentLoanPlan === 'none') {
    return
  }

  if (studentLoanPlan === 'plan1') {
  // Plan 1
  // monthly threshold is 1,834
    return {
      threshold: 22015,
      rate: 0.09
    };
  }

  if (studentLoanPlan === 'plan2') {
    // Plan 2
    // monthly threshold is 1,834
    return {
      threshold: 27295,
      rate: 0.09
    };
  }
}

function calculateTakeHomeSalary(annualSalary, taxBands, _undefined1, niRates, _pensionRate, pensionContribution, pensionContributionP) {
  const studentLoanRate = getStudentLoanPlan();
  // Income Tax
  let incomeTax = 0;

  for (let band of taxBands) {
      if (annualSalary > band.threshold) {
          const taxableAmount = Math.min(annualSalary - band.threshold, band.limit);
          const taxDue = taxableAmount * band.rate;
          // console.log(taxableAmount, taxDue, band)
          incomeTax += taxDue
      }
  }

  // Student Loan Repayment
  const studentLoanRepayment = studentLoanRate ? Math.max(0, annualSalary - studentLoanRate.threshold) * studentLoanRate.rate : 0;

  // National Insurance
  const monthlyEarnings = annualSalary / 12;

  let monthlyNI = 0;

  for (let rate of niRates) {
      if (monthlyEarnings > rate.threshold) {
          const niAmount = Math.min(monthlyEarnings - rate.threshold, rate.limit);
          const nationalInsuranceDue = niAmount * rate.rate;
          // console.log(niAmount, nationalInsuranceDue, rate)
          monthlyNI += nationalInsuranceDue;
      }
  }

  const autoEnrollmentBands = {
    lower: 6240,
    upper: 50270,
  }

  const difference = autoEnrollmentBands.upper - autoEnrollmentBands.lower;

  const salMinusLower = annualSalary - autoEnrollmentBands.lower;

  if (salMinusLower > 0) {
    if (salMinusLower > difference) {
      pensionContribution = (difference / 12) * pensionContributionP;
    } else {
      pensionContribution = (salMinusLower / 12) * pensionContributionP;
    }
  }

  // Pension
  // const monthlyPension = (annualSalary / 12) * pensionRate;
  // const monthlyPension = 146.76;
  // const monthlyPension = 0;
  const monthlyPension = pensionContribution;

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
  // No tax start mid-year
  // { threshold: 0, limit: 45000, rate: 0.0 },
  // { threshold: 12571, limit: 37700, rate: 0.2 },  // up to 50,270
  // 1257L
  // { threshold: 0, limit: 12570, rate: 0.0 },
  // { threshold: 12571, limit: 37700, rate: 0.2 },  // up to 50,270
  // I'm on 1238L so I have slightly less tax allowance
  { threshold: 0, limit: 12380, rate: 0.0 },
  { threshold: 12381, limit: 37890, rate: 0.2 },  // up to 50,270
  { threshold: 50271, limit: 999730, rate: 0.4 }  // assuming no one earns more than £1M for simplicity
];

// https://www.gov.uk/repaying-your-student-loan/what-you-pay
/**
 * Plan type	Yearly threshold	Monthly threshold	Weekly threshold
Plan 1	£22,015	£1,834	£423
Plan 2	£27,295	£2,274	£524
Plan 4	£27,660	£2,305	£532
Plan 5	£25,000	£2,083	£480
Postgraduate Loan	£21,000	£1,750	£403
 */

// Category letter
// £123 to £242 (£533 to £1,048 a month)	
// £242.01 to £967 (£1,048.01 to £4,189 a month)
// Over £967 a week (£4,189 a month)
// A	0%	12%	2%
const niRates = [
  { threshold: 0, limit: 1047, rate: 0.0 },
  { threshold: 1048, limit: 3141, rate: 0.12 },
  { threshold: 4189, limit: 999999, rate: 0.02 },
];

/**
 * // My pension calculation
 * > 50270 - 6240
  44030
  > (44030 * 0.05) / 12
  183.45833333333334
  > (44030 * 0.04) / 12
  146.76666666666668
  > 
 */
// https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment/automatic-enrolment-an-introduction
// How much will I have to contribute?
// There is a minimum total amount that has to be contributed by you, your employer, and the government (in the form of tax relief).

// These minimums are generally: 5% from you (which includes tax relief) and 3% from your employer.

// The minimum contribution applies to anything you earn over £6,240 up to a limit of £50,270 (in the tax year 2023/24). This slice of your earnings is known as ‘qualifying earnings’.

// So, if you were earning £18,000 a year, your minimum contribution would be a percentage of £11,760 (the difference between £6,240 and £18,000).

// Some employers apply the pension contribution to the whole of your earnings, not just to qualifying earnings.

// This depends on how they’ve set up the scheme. If you’re not sure whether you pay pension contributions on qualifying earnings or on full earnings, talk to your employer.

// Your employer will let you know how much of your earnings you’ll need to contribute.

// They might tell you this as a sum of money or as a percentage.

const pensionRate = 0.00;

// const overTime = 2400;
const overTime = 0;

const result = calculateTakeHomeSalary(45000 + overTime, taxBands, undefined, niRates, pensionRate);

console.log(`Gross Monthly Salary: £${result.grossMonthly.toFixed(2)}`);
console.log(`Total Monthly Deductions: £${result.totalDeductions.toFixed(2)}`);
console.log(`Take-home Monthly Salary: £${result.takeHomeMonthly.toFixed(2)}`);
console.log(result);