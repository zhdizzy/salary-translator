/**
 * Military compensation constants (non-pay-table)
 * Sources: DFAS, Defense Health Agency, TSP.gov, KFF
 */

// BAS rates (2026, monthly, tax-free)
export const BAS = {
    enlisted: 460.25,
    officer: 316.98
};

// TSP matching (Blended Retirement System)
// DoD auto-contributes 1% + matches up to 4% more = 5% max
export const TSP = {
    autoContribute: 0.01,
    maxEmployerMatch: 0.05,
    assumedMemberContribution: 0.05
};

// Tricare value — what civilians pay for equivalent coverage
// Source: KFF 2025 Employer Health Benefits Survey
export const TRICARE = {
    activeDutyPremium: 0,
    civilianEquivalent: {
        singleWorkerAnnual: 1401,
        singleTotalAnnual: 8951,
        familyWorkerAnnual: 6296,
        familyTotalAnnual: 25572
    }
};

// Grade classifications
export const ENLISTED_GRADES = new Set(["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"]);
export const WARRANT_GRADES = new Set(["W1", "W2", "W3", "W4", "W5"]);
export const OFFICER_GRADES = new Set(["O1", "O2", "O3", "O4", "O5", "O6", "O7", "O8", "O9", "O10", "O1E", "O2E", "O3E"]);

// Civilian comparison assumptions
export const CIVILIAN_HEALTH_INSURANCE = {
    singleAnnual: 1401,
    familyAnnual: 6296
};

export const CIVILIAN_401K_MATCH_RATE = 0.04;
export const CIVILIAN_RETIREMENT_CONTRIBUTION_RATE = 0.06;

// FICA taxes (Social Security + Medicare)
export const FICA = {
    socialSecurityRate: 0.062,
    socialSecurityWageCap: 176100,
    medicareRate: 0.0145,
    additionalMedicareRate: 0.009,
    additionalMedicareThreshold: 200000
};
