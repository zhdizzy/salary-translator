/**
 * 2026 Federal and State Income Tax Data
 * Federal: IRS Rev. Proc. 2025-28 (projected 2026 brackets)
 * State: Tax Foundation 2026 State Individual Income Tax Rates
 */

// Federal tax brackets — Single filer (2026)
export const FEDERAL_BRACKETS_SINGLE = [
    { rate: 0.10, min: 0,      max: 11925 },
    { rate: 0.12, min: 11925,  max: 48475 },
    { rate: 0.22, min: 48475,  max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250525 },
    { rate: 0.35, min: 250525, max: 626350 },
    { rate: 0.37, min: 626350, max: Infinity }
];

// Federal tax brackets — Married filing jointly (2026)
export const FEDERAL_BRACKETS_MFJ = [
    { rate: 0.10, min: 0,      max: 23850 },
    { rate: 0.12, min: 23850,  max: 96950 },
    { rate: 0.22, min: 96950,  max: 206700 },
    { rate: 0.24, min: 206700, max: 394600 },
    { rate: 0.32, min: 394600, max: 501050 },
    { rate: 0.35, min: 501050, max: 751600 },
    { rate: 0.37, min: 751600, max: Infinity }
];

// Standard deductions (2026)
export const STANDARD_DEDUCTION = {
    single: 15000,
    married: 30000
};

/**
 * State income tax data — all 50 states + DC
 * type: "none" = no income tax, "flat" = single rate, "progressive" = brackets
 * Rates are for single filers unless noted; married brackets roughly double for most states.
 * Simplified: using single-filer brackets for all to keep data manageable.
 */
export const STATE_TAX = {
    "AL": { name: "Alabama", type: "progressive", brackets: [
        { rate: 0.02, min: 0, max: 500 }, { rate: 0.04, min: 500, max: 3000 }, { rate: 0.05, min: 3000, max: Infinity }
    ]},
    "AK": { name: "Alaska", type: "none" },
    "AZ": { name: "Arizona", type: "flat", rate: 0.025 },
    "AR": { name: "Arkansas", type: "progressive", brackets: [
        { rate: 0.02, min: 0, max: 4400 }, { rate: 0.04, min: 4400, max: 8800 }, { rate: 0.044, min: 8800, max: Infinity }
    ]},
    "CA": { name: "California", type: "progressive", brackets: [
        { rate: 0.01, min: 0, max: 10756 }, { rate: 0.02, min: 10756, max: 25499 },
        { rate: 0.04, min: 25499, max: 40245 }, { rate: 0.06, min: 40245, max: 55866 },
        { rate: 0.08, min: 55866, max: 70606 }, { rate: 0.093, min: 70606, max: 360659 },
        { rate: 0.103, min: 360659, max: 432787 }, { rate: 0.113, min: 432787, max: 721314 },
        { rate: 0.123, min: 721314, max: Infinity }
    ]},
    "CO": { name: "Colorado", type: "flat", rate: 0.044 },
    "CT": { name: "Connecticut", type: "progressive", brackets: [
        { rate: 0.02, min: 0, max: 10000 }, { rate: 0.045, min: 10000, max: 50000 },
        { rate: 0.055, min: 50000, max: 100000 }, { rate: 0.06, min: 100000, max: 200000 },
        { rate: 0.065, min: 200000, max: 250000 }, { rate: 0.069, min: 250000, max: 500000 },
        { rate: 0.0699, min: 500000, max: Infinity }
    ]},
    "DE": { name: "Delaware", type: "progressive", brackets: [
        { rate: 0.022, min: 2000, max: 5000 }, { rate: 0.039, min: 5000, max: 10000 },
        { rate: 0.048, min: 10000, max: 20000 }, { rate: 0.052, min: 20000, max: 25000 },
        { rate: 0.0555, min: 25000, max: 60000 }, { rate: 0.066, min: 60000, max: Infinity }
    ]},
    "FL": { name: "Florida", type: "none" },
    "GA": { name: "Georgia", type: "flat", rate: 0.0549 },
    "HI": { name: "Hawaii", type: "progressive", brackets: [
        { rate: 0.014, min: 0, max: 2400 }, { rate: 0.032, min: 2400, max: 4800 },
        { rate: 0.055, min: 4800, max: 9600 }, { rate: 0.064, min: 9600, max: 14400 },
        { rate: 0.068, min: 14400, max: 19200 }, { rate: 0.072, min: 19200, max: 24000 },
        { rate: 0.076, min: 24000, max: 36000 }, { rate: 0.079, min: 36000, max: 48000 },
        { rate: 0.0825, min: 48000, max: 150000 }, { rate: 0.09, min: 150000, max: 175000 },
        { rate: 0.10, min: 175000, max: 200000 }, { rate: 0.11, min: 200000, max: Infinity }
    ]},
    "ID": { name: "Idaho", type: "flat", rate: 0.058 },
    "IL": { name: "Illinois", type: "flat", rate: 0.0495 },
    "IN": { name: "Indiana", type: "flat", rate: 0.0305 },
    "IA": { name: "Iowa", type: "flat", rate: 0.038 },
    "KS": { name: "Kansas", type: "progressive", brackets: [
        { rate: 0.031, min: 0, max: 15000 }, { rate: 0.0525, min: 15000, max: 30000 },
        { rate: 0.057, min: 30000, max: Infinity }
    ]},
    "KY": { name: "Kentucky", type: "flat", rate: 0.04 },
    "LA": { name: "Louisiana", type: "progressive", brackets: [
        { rate: 0.0185, min: 0, max: 12500 }, { rate: 0.035, min: 12500, max: 50000 },
        { rate: 0.0425, min: 50000, max: Infinity }
    ]},
    "ME": { name: "Maine", type: "progressive", brackets: [
        { rate: 0.058, min: 0, max: 26050 }, { rate: 0.0675, min: 26050, max: 61600 },
        { rate: 0.0715, min: 61600, max: Infinity }
    ]},
    "MD": { name: "Maryland", type: "progressive", brackets: [
        { rate: 0.02, min: 0, max: 1000 }, { rate: 0.03, min: 1000, max: 2000 },
        { rate: 0.04, min: 2000, max: 3000 }, { rate: 0.0475, min: 3000, max: 100000 },
        { rate: 0.05, min: 100000, max: 125000 }, { rate: 0.0525, min: 125000, max: 150000 },
        { rate: 0.055, min: 150000, max: 250000 }, { rate: 0.0575, min: 250000, max: Infinity }
    ]},
    "MA": { name: "Massachusetts", type: "flat", rate: 0.05 },
    "MI": { name: "Michigan", type: "flat", rate: 0.0405 },
    "MN": { name: "Minnesota", type: "progressive", brackets: [
        { rate: 0.0535, min: 0, max: 31690 }, { rate: 0.068, min: 31690, max: 104090 },
        { rate: 0.0785, min: 104090, max: 183340 }, { rate: 0.0985, min: 183340, max: Infinity }
    ]},
    "MS": { name: "Mississippi", type: "flat", rate: 0.047 },
    "MO": { name: "Missouri", type: "progressive", brackets: [
        { rate: 0.02, min: 0, max: 1207 }, { rate: 0.025, min: 1207, max: 2414 },
        { rate: 0.03, min: 2414, max: 3621 }, { rate: 0.035, min: 3621, max: 4828 },
        { rate: 0.04, min: 4828, max: 6035 }, { rate: 0.045, min: 6035, max: 7242 },
        { rate: 0.048, min: 7242, max: Infinity }
    ]},
    "MT": { name: "Montana", type: "flat", rate: 0.057 },
    "NE": { name: "Nebraska", type: "progressive", brackets: [
        { rate: 0.0246, min: 0, max: 3700 }, { rate: 0.0351, min: 3700, max: 22170 },
        { rate: 0.0501, min: 22170, max: 35730 }, { rate: 0.0584, min: 35730, max: Infinity }
    ]},
    "NV": { name: "Nevada", type: "none" },
    "NH": { name: "New Hampshire", type: "none" },
    "NJ": { name: "New Jersey", type: "progressive", brackets: [
        { rate: 0.014, min: 0, max: 20000 }, { rate: 0.0175, min: 20000, max: 35000 },
        { rate: 0.035, min: 35000, max: 40000 }, { rate: 0.05525, min: 40000, max: 75000 },
        { rate: 0.0637, min: 75000, max: 500000 }, { rate: 0.0897, min: 500000, max: 1000000 },
        { rate: 0.1075, min: 1000000, max: Infinity }
    ]},
    "NM": { name: "New Mexico", type: "progressive", brackets: [
        { rate: 0.017, min: 0, max: 5500 }, { rate: 0.032, min: 5500, max: 11000 },
        { rate: 0.047, min: 11000, max: 16000 }, { rate: 0.049, min: 16000, max: 210000 },
        { rate: 0.059, min: 210000, max: Infinity }
    ]},
    "NY": { name: "New York", type: "progressive", brackets: [
        { rate: 0.04, min: 0, max: 8500 }, { rate: 0.045, min: 8500, max: 11700 },
        { rate: 0.0525, min: 11700, max: 13900 }, { rate: 0.0585, min: 13900, max: 80650 },
        { rate: 0.0625, min: 80650, max: 215400 }, { rate: 0.0685, min: 215400, max: 1077550 },
        { rate: 0.0965, min: 1077550, max: 5000000 }, { rate: 0.103, min: 5000000, max: 25000000 },
        { rate: 0.109, min: 25000000, max: Infinity }
    ]},
    "NC": { name: "North Carolina", type: "flat", rate: 0.045 },
    "ND": { name: "North Dakota", type: "flat", rate: 0.0195 },
    "OH": { name: "Ohio", type: "progressive", brackets: [
        { rate: 0.0, min: 0, max: 26050 }, { rate: 0.02765, min: 26050, max: 100000 },
        { rate: 0.035, min: 100000, max: Infinity }
    ]},
    "OK": { name: "Oklahoma", type: "progressive", brackets: [
        { rate: 0.0025, min: 0, max: 1000 }, { rate: 0.0075, min: 1000, max: 2500 },
        { rate: 0.0175, min: 2500, max: 3750 }, { rate: 0.0275, min: 3750, max: 4900 },
        { rate: 0.0375, min: 4900, max: 7200 }, { rate: 0.0475, min: 7200, max: Infinity }
    ]},
    "OR": { name: "Oregon", type: "progressive", brackets: [
        { rate: 0.0475, min: 0, max: 4300 }, { rate: 0.0675, min: 4300, max: 10750 },
        { rate: 0.0875, min: 10750, max: 125000 }, { rate: 0.099, min: 125000, max: Infinity }
    ]},
    "PA": { name: "Pennsylvania", type: "flat", rate: 0.0307 },
    "RI": { name: "Rhode Island", type: "progressive", brackets: [
        { rate: 0.0375, min: 0, max: 77450 }, { rate: 0.0475, min: 77450, max: 176050 },
        { rate: 0.0599, min: 176050, max: Infinity }
    ]},
    "SC": { name: "South Carolina", type: "progressive", brackets: [
        { rate: 0.0, min: 0, max: 3460 }, { rate: 0.03, min: 3460, max: 17330 },
        { rate: 0.064, min: 17330, max: Infinity }
    ]},
    "SD": { name: "South Dakota", type: "none" },
    "TN": { name: "Tennessee", type: "none" },
    "TX": { name: "Texas", type: "none" },
    "UT": { name: "Utah", type: "flat", rate: 0.0465 },
    "VT": { name: "Vermont", type: "progressive", brackets: [
        { rate: 0.0335, min: 0, max: 45400 }, { rate: 0.066, min: 45400, max: 110050 },
        { rate: 0.076, min: 110050, max: 229550 }, { rate: 0.0875, min: 229550, max: Infinity }
    ]},
    "VA": { name: "Virginia", type: "progressive", brackets: [
        { rate: 0.02, min: 0, max: 3000 }, { rate: 0.03, min: 3000, max: 5000 },
        { rate: 0.05, min: 5000, max: 17000 }, { rate: 0.0575, min: 17000, max: Infinity }
    ]},
    "WA": { name: "Washington", type: "none" },
    "WV": { name: "West Virginia", type: "progressive", brackets: [
        { rate: 0.0236, min: 0, max: 10000 }, { rate: 0.0315, min: 10000, max: 25000 },
        { rate: 0.0354, min: 25000, max: 40000 }, { rate: 0.0472, min: 40000, max: 60000 },
        { rate: 0.0512, min: 60000, max: Infinity }
    ]},
    "WI": { name: "Wisconsin", type: "progressive", brackets: [
        { rate: 0.035, min: 0, max: 14320 }, { rate: 0.044, min: 14320, max: 28640 },
        { rate: 0.053, min: 28640, max: 315310 }, { rate: 0.0765, min: 315310, max: Infinity }
    ]},
    "WY": { name: "Wyoming", type: "none" },
    "DC": { name: "District of Columbia", type: "progressive", brackets: [
        { rate: 0.04, min: 0, max: 10000 }, { rate: 0.06, min: 10000, max: 40000 },
        { rate: 0.065, min: 40000, max: 60000 }, { rate: 0.085, min: 60000, max: 250000 },
        { rate: 0.0925, min: 250000, max: 500000 }, { rate: 0.0975, min: 500000, max: 1000000 },
        { rate: 0.1075, min: 1000000, max: Infinity }
    ]}
};

// VA disability compensation (monthly, tax-free) — single veteran, no dependents
// Source: VA.gov 2026 rates (effective Dec 1, 2025)
export const VA_DISABILITY_MONTHLY = {
    0: 0, 10: 175.51, 20: 346.89, 30: 537.42, 40: 774.07,
    50: 1102.04, 60: 1395.07, 70: 1759.92, 80: 2045.53,
    90: 2299.52, 100: 3938.58
};

/**
 * Calculate federal income tax using progressive brackets
 */
export function calcFederalTax(annualIncome, filingStatus) {
    const brackets = filingStatus === 'married'
        ? FEDERAL_BRACKETS_MFJ
        : FEDERAL_BRACKETS_SINGLE;
    const deduction = filingStatus === 'married'
        ? STANDARD_DEDUCTION.married
        : STANDARD_DEDUCTION.single;

    const taxableIncome = Math.max(0, annualIncome - deduction);
    let tax = 0;

    for (const bracket of brackets) {
        if (taxableIncome <= bracket.min) break;
        const taxable = Math.min(taxableIncome, bracket.max) - bracket.min;
        tax += taxable * bracket.rate;
    }
    return tax;
}

/**
 * Calculate state income tax
 */
export function calcStateTax(annualIncome, stateCode) {
    const state = STATE_TAX[stateCode];
    if (!state || state.type === 'none') return 0;

    if (state.type === 'flat') {
        return annualIncome * state.rate;
    }

    // Progressive brackets
    let tax = 0;
    for (const bracket of state.brackets) {
        if (annualIncome <= bracket.min) break;
        const taxable = Math.min(annualIncome, bracket.max) - bracket.min;
        tax += taxable * bracket.rate;
    }
    return tax;
}
