import { getBasePay, GRADE_NAMES } from './data/pay-tables.js';
import { getMhaFromZip, getMhaName, getBahRate } from './data/bah-data.js';
import { calcFederalTax, calcStateTax, STATE_TAX, VA_DISABILITY_MONTHLY } from './data/tax-data.js';
import { BAS, TSP, ENLISTED_GRADES, CIVILIAN_HEALTH_INSURANCE, CIVILIAN_RETIREMENT_CONTRIBUTION_RATE, FICA } from './data/military-data.js';

// --- DOM Cache ---
const gradeSelect = document.getElementById('grade-select');
const yosSelect = document.getElementById('yos-select');
const branchSelect = document.getElementById('branch-select');
const zipInput = document.getElementById('zip-input');
const zipStatus = document.getElementById('zip-status');
const bahToggle = document.getElementById('bah-toggle');
const bahOptions = document.getElementById('bah-options');
const basToggle = document.getElementById('bas-toggle');
const dependentsSelect = document.getElementById('dependents-select');
const maritalStatusSelect = document.getElementById('marital-status-select');
const stateSelect = document.getElementById('state-select');
const specialPayInput = document.getElementById('special-pay');
const tspSelect = document.getElementById('tsp-select');
const civilianOfferInput = document.getElementById('civilian-offer');
const vaRatingSelect = document.getElementById('va-rating-select');
const viewMonthlyBtn = document.getElementById('view-monthly');
const viewAnnualBtn = document.getElementById('view-annual');
const resultsSection = document.getElementById('results-section');
const printBtn = document.getElementById('print-btn');
const shareBtn = document.getElementById('share-btn');
const emailResultsContainer = document.getElementById('email-results-container');
const emailResultsForm = document.getElementById('email-results-form');
const emailInput = document.getElementById('email-input');
const emailSubmitBtn = document.getElementById('email-submit-btn');
const emailStatus = document.getElementById('email-status');

let compChart = null;
let currentView = 'monthly';
let lastResult = null;

// --- URL Sharing ---
function buildShareUrl() {
    const params = new URLSearchParams();
    params.set('g', gradeSelect.value);
    params.set('y', yosSelect.value);
    params.set('b', branchSelect.value);
    params.set('z', zipInput.value);
    params.set('d', dependentsSelect.value);
    params.set('f', maritalStatusSelect.value);
    params.set('s', stateSelect.value);
    params.set('t', tspSelect.value);
    if (!bahToggle.checked) params.set('bah', '0');
    if (!basToggle.checked) params.set('bas', '0');
    const sp = parseFloat(specialPayInput.value) || 0;
    if (sp > 0) params.set('sp', sp);
    const offer = parseFloat(civilianOfferInput.value) || 0;
    if (offer > 0) params.set('o', offer);
    const va = parseInt(vaRatingSelect.value) || 0;
    if (va > 0) params.set('va', va);
    return window.location.origin + window.location.pathname + '?' + params.toString();
}

function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.size === 0) return;
    if (params.has('g')) gradeSelect.value = params.get('g');
    if (params.has('y')) yosSelect.value = params.get('y');
    if (params.has('b')) branchSelect.value = params.get('b');
    if (params.has('z')) zipInput.value = params.get('z');
    if (params.has('d')) dependentsSelect.value = params.get('d');
    if (params.has('f')) maritalStatusSelect.value = params.get('f');
    if (params.has('s')) stateSelect.value = params.get('s');
    if (params.has('t')) tspSelect.value = params.get('t');
    if (params.get('bah') === '0') { bahToggle.checked = false; bahOptions.classList.add('bah-options-hidden'); }
    if (params.get('bas') === '0') basToggle.checked = false;
    if (params.has('sp')) specialPayInput.value = params.get('sp');
    if (params.has('o')) civilianOfferInput.value = params.get('o');
    if (params.has('va')) vaRatingSelect.value = params.get('va');
}

// --- Initialization ---
function init() {
    populateGrades();
    populateYOS();
    populateStates();
    loadFromUrl();
    attachListeners();
    updateZipStatus();
    calculate();
}

function populateGrades() {
    const groups = [
        { label: 'Enlisted', grades: ['E1','E2','E3','E4','E5','E6','E7','E8','E9'] },
        { label: 'Warrant Officer', grades: ['W1','W2','W3','W4','W5'] },
        { label: 'Officer', grades: ['O1','O2','O3','O4','O5','O6','O7','O8','O9','O10'] },
        { label: 'Prior-Enlisted Officer', grades: ['O1E','O2E','O3E'] }
    ];
    for (const group of groups) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = group.label;
        for (const grade of group.grades) {
            const opt = document.createElement('option');
            opt.value = grade;
            opt.textContent = GRADE_NAMES[grade] || grade;
            if (grade === 'E7') opt.selected = true;
            optgroup.appendChild(opt);
        }
        gradeSelect.appendChild(optgroup);
    }
}

function populateYOS() {
    for (let y = 1; y <= 40; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = `${y} year${y > 1 ? 's' : ''}`;
        if (y === 12) opt.selected = true;
        yosSelect.appendChild(opt);
    }
}

function updateZipStatus() {
    const zip = zipInput.value.trim();
    if (zip.length !== 5) {
        zipStatus.innerHTML = 'Enter a 5-digit zip code for BAH rates.';
        zipStatus.className = 'input-hint';
        return;
    }
    const mha = getMhaFromZip(zip);
    if (mha) {
        zipStatus.innerHTML = `<span class="zip-found">✓ ${getMhaName(mha)}</span> — <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/BAH-Rate-Lookup/" target="_blank" rel="noopener noreferrer">Verify at DTMO</a>`;
    } else {
        zipStatus.innerHTML = '<span class="zip-not-found">Zip code not found in BAH data.</span> Try a nearby zip or check <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/BAH-Rate-Lookup/" target="_blank" rel="noopener noreferrer">DTMO</a>.';
    }
}

function populateStates() {
    const entries = Object.entries(STATE_TAX).sort((a, b) => a[1].name.localeCompare(b[1].name));
    for (const [code, data] of entries) {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = `${data.name}${data.type === 'none' ? ' (no income tax)' : ''}`;
        if (code === 'TX') opt.selected = true;
        stateSelect.appendChild(opt);
    }
}

function attachListeners() {
    const inputs = [gradeSelect, yosSelect, branchSelect, tspSelect,
                    dependentsSelect, maritalStatusSelect, stateSelect, vaRatingSelect];
    for (const el of inputs) {
        el.addEventListener('change', calculate);
    }

    bahToggle.addEventListener('change', () => {
        bahOptions.classList.toggle('bah-options-hidden', !bahToggle.checked);
        calculate();
    });
    basToggle.addEventListener('change', calculate);

    let zipTimer;
    zipInput.addEventListener('input', () => {
        // Only allow digits
        zipInput.value = zipInput.value.replace(/\D/g, '').slice(0, 5);
        clearTimeout(zipTimer);
        zipTimer = setTimeout(() => { updateZipStatus(); calculate(); }, 400);
    });

    let specialPayTimer;
    specialPayInput.addEventListener('input', () => {
        clearTimeout(specialPayTimer);
        specialPayTimer = setTimeout(calculate, 400);
    });

    let offerTimer;
    civilianOfferInput.addEventListener('input', () => {
        clearTimeout(offerTimer);
        offerTimer = setTimeout(calculate, 400);
    });

    viewMonthlyBtn.addEventListener('click', () => { currentView = 'monthly'; rerenderView(); });
    viewAnnualBtn.addEventListener('click', () => { currentView = 'annual'; rerenderView(); });

    printBtn.addEventListener('click', () => window.print());
    shareBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(buildShareUrl())
            .then(() => { shareBtn.textContent = 'Link Copied!'; setTimeout(() => { shareBtn.textContent = 'Copy Link to Share'; }, 2000); });
    });

    emailResultsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        if (!email) return;

        emailSubmitBtn.disabled = true;
        emailSubmitBtn.textContent = 'Sending...';
        emailStatus.textContent = '';
        emailStatus.className = 'email-status';

        try {
            const res = await fetch('/api/email-results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, resultsUrl: buildShareUrl() }),
            });
            const data = await res.json();

            if (res.ok) {
                emailStatus.textContent = 'Check your inbox — your results link is on the way.';
                emailStatus.classList.add('email-success');
                emailInput.value = '';
            } else {
                emailStatus.textContent = data.error || 'Something went wrong. Please try again.';
                emailStatus.classList.add('email-error');
            }
        } catch {
            emailStatus.textContent = 'Network error. Please check your connection and try again.';
            emailStatus.classList.add('email-error');
        }

        emailSubmitBtn.disabled = false;
        emailSubmitBtn.textContent = 'Send My Results';
    });

    document.querySelectorAll('.input-group-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            const isCollapsed = target.classList.toggle('collapsed');
            btn.setAttribute('aria-expanded', !isCollapsed);
            btn.querySelector('.toggle-indicator').style.transform = isCollapsed ? 'rotate(-90deg)' : '';
        });
    });
}

// --- Formatting ---
function fmt(monthlyVal) {
    const val = currentView === 'annual' ? monthlyVal * 12 : monthlyVal;
    return '$' + Math.round(val).toLocaleString('en-US');
}

function fmtAnnual(v) {
    return '$' + Math.round(v).toLocaleString('en-US');
}

function period() { return currentView === 'monthly' ? '/mo' : '/yr'; }

// --- Core Calculations ---
// FICA: Social Security (6.2% up to wage cap) + Medicare (1.45% + 0.9% above $200K)
function calcFica(annualIncome) {
    const ss = Math.min(annualIncome, FICA.socialSecurityWageCap) * FICA.socialSecurityRate;
    let medicare = annualIncome * FICA.medicareRate;
    if (annualIncome > FICA.additionalMedicareThreshold) {
        medicare += (annualIncome - FICA.additionalMedicareThreshold) * FICA.additionalMedicareRate;
    }
    return ss + medicare;
}

// BRS TSP matching: 1% auto + dollar-for-dollar on first 3% + 50 cents on next 2%
function calcTspMatch(basePay, memberContribPct) {
    const autoContrib = basePay * 0.01;
    let match = 0;
    if (memberContribPct >= 1) match += basePay * Math.min(memberContribPct, 3) / 100;
    if (memberContribPct > 3) match += basePay * Math.min(memberContribPct - 3, 2) * 0.5 / 100;
    return autoContrib + match;
}

function calcMilitaryComp(inputs) {
    const { grade, yearsOfService, hasDependents, filingStatus, mha, stateCode, vaDisabilityRating, tspContribPct, receivesBah, receivesBas, specialPayMonthly } = inputs;

    const basePay = getBasePay(grade, yearsOfService);
    const bahMonthly = (receivesBah && mha) ? getBahRate(mha, grade, hasDependents) : 0;
    const isEnlisted = ENLISTED_GRADES.has(grade);
    const basMonthly = receivesBas ? (isEnlisted ? BAS.enlisted : BAS.officer) : 0;
    const tspMatchMonthly = calcTspMatch(basePay, tspContribPct);
    const specPay = specialPayMonthly || 0;

    const healthInsAnnual = hasDependents ? CIVILIAN_HEALTH_INSURANCE.familyAnnual : CIVILIAN_HEALTH_INSURANCE.singleAnnual;
    const tricareMonthly = healthInsAnnual / 12;

    // Tax savings: tax avoided because BAH+BAS are tax-free
    // Special pay is taxable, so include it in the taxable income
    const annualBasePay = (basePay + specPay) * 12;
    const annualBah = bahMonthly * 12;
    const annualBas = basMonthly * 12;

    const taxIfAllTaxable = calcFederalTax(annualBasePay + annualBah + annualBas, filingStatus)
                          + calcStateTax(annualBasePay + annualBah + annualBas, stateCode);
    const taxOnBaseOnly = calcFederalTax(annualBasePay, filingStatus)
                        + calcStateTax(annualBasePay, stateCode);
    const annualTaxSavings = taxIfAllTaxable - taxOnBaseOnly;
    const taxSavingsMonthly = annualTaxSavings / 12;

    const vaCompMonthly = vaDisabilityRating > 0 ? (VA_DISABILITY_MONTHLY[vaDisabilityRating] || 0) : 0;
    const militaryFicaAnnual = calcFica(annualBasePay);

    const militaryTotalMonthly = basePay + specPay + bahMonthly + basMonthly + tspMatchMonthly + tricareMonthly + taxSavingsMonthly;

    return {
        basePay, specialPayMonthly: specPay, bahMonthly, basMonthly, tspMatchMonthly, tricareMonthly, taxSavingsMonthly,
        vaCompMonthly, militaryTotalMonthly, tspContribPct, militaryFicaAnnual,
        militaryTotalAnnual: militaryTotalMonthly * 12,
        taxableBasePayAnnual: annualBasePay,
        actualFederalTax: calcFederalTax(annualBasePay, filingStatus),
        actualStateTax: calcStateTax(annualBasePay, stateCode),
        healthInsAnnual
    };
}

function calcEquivalentCivilianSalary(inputs, milComp) {
    const { filingStatus, stateCode, hasDependents } = inputs;

    // Military monthly net cash = what hits bank account (after FICA)
    const milNetCashMonthly = milComp.basePay + milComp.specialPayMonthly
        - milComp.actualFederalTax / 12
        - milComp.actualStateTax / 12
        - milComp.militaryFicaAnnual / 12
        + milComp.bahMonthly
        + milComp.basMonthly;

    const civHealthInsMonthly = milComp.healthInsAnnual / 12;
    const civRetireRate = CIVILIAN_RETIREMENT_CONTRIBUTION_RATE;

    function civilianNetForSalary(gross) {
        const monthly = gross / 12;
        const fedTax = calcFederalTax(gross, filingStatus) / 12;
        const stTax = calcStateTax(gross, stateCode) / 12;
        const fica = calcFica(gross) / 12;
        const retire = (gross * civRetireRate) / 12;
        return monthly - fedTax - stTax - fica - civHealthInsMonthly - retire;
    }

    // Binary search
    let lo = 0, hi = 500000;
    for (let i = 0; i < 60; i++) {
        const mid = (lo + hi) / 2;
        if (civilianNetForSalary(mid) < milNetCashMonthly) lo = mid;
        else hi = mid;
    }

    const equivSalary = Math.round((lo + hi) / 2);

    // Compute the breakdown for display
    const fedTaxOnEquiv = calcFederalTax(equivSalary, filingStatus);
    const stTaxOnEquiv = calcStateTax(equivSalary, stateCode);
    const ficaOnEquiv = calcFica(equivSalary);
    const retireContrib = equivSalary * civRetireRate;
    const takeHome = equivSalary - fedTaxOnEquiv - stTaxOnEquiv - ficaOnEquiv - milComp.healthInsAnnual - retireContrib;

    return {
        equivalentSalary: equivSalary,
        fedTax: fedTaxOnEquiv,
        stateTax: stTaxOnEquiv,
        fica: ficaOnEquiv,
        healthInsurance: milComp.healthInsAnnual,
        retirementContrib: retireContrib,
        takeHome,
        milNetCashAnnual: milNetCashMonthly * 12
    };
}

function calcGapAnalysis(equivSal, civilianOffer, vaCompAnnual) {
    if (!civilianOffer || civilianOffer <= 0) return null;

    const gap = civilianOffer - equivSal.equivalentSalary;
    const adjustedEquiv = vaCompAnnual > 0
        ? Math.max(0, equivSal.equivalentSalary - vaCompAnnual)
        : equivSal.equivalentSalary;
    const adjustedGap = civilianOffer - adjustedEquiv;

    return {
        gap, gapAbs: Math.abs(gap),
        direction: gap >= 0 ? 'raise' : 'cut',
        equivalentSalary: equivSal.equivalentSalary,
        adjustedEquivalent: adjustedEquiv,
        adjustedGap,
        isActuallyRaise: adjustedGap >= 0,
        vaCompAnnual
    };
}

// --- Main Calculate ---
function calculate() {
    const grade = gradeSelect.value;
    const yos = parseInt(yosSelect.value);
    const receivesBah = bahToggle.checked;
    const receivesBas = basToggle.checked;
    const zip = zipInput.value.trim();
    const mha = (receivesBah && zip.length === 5) ? getMhaFromZip(zip) : null;
    const hasDeps = dependentsSelect.value === 'yes';
    const filing = maritalStatusSelect.value === 'married' ? 'married' : 'single';
    const stateCode = stateSelect.value;
    const tspPct = parseInt(tspSelect.value) || 0;
    const specialPay = parseFloat(specialPayInput.value) || 0;
    const civOffer = parseFloat(civilianOfferInput.value) || 0;
    const vaRating = parseInt(vaRatingSelect.value) || 0;

    const inputs = {
        grade, yearsOfService: yos, hasDependents: hasDeps,
        filingStatus: filing, mha, stateCode, vaDisabilityRating: vaRating,
        tspContribPct: tspPct, receivesBah, receivesBas, specialPayMonthly: specialPay
    };

    const milComp = calcMilitaryComp(inputs);
    const equivSal = calcEquivalentCivilianSalary(inputs, milComp);
    const vaCompAnnual = milComp.vaCompMonthly * 12;
    const gap = calcGapAnalysis(equivSal, civOffer, vaCompAnnual);

    lastResult = { milComp, equivSal, inputs, gap };

    renderHeroCard(milComp, equivSal, vaCompAnnual);
    renderMilitaryBreakdown(milComp);
    renderEquivalentSalary(milComp, equivSal, vaCompAnnual);
    renderGapSection(gap);
    renderPostSepSection(milComp, equivSal, vaRating);
    renderChart(milComp, equivSal, civOffer, vaCompAnnual);
    renderSummary(milComp, equivSal, gap, vaCompAnnual, civOffer);

    resultsSection.style.display = 'block';
    emailResultsContainer.style.display = 'block';
}

function rerenderView() {
    if (!lastResult) return;
    viewMonthlyBtn.classList.toggle('active', currentView === 'monthly');
    viewAnnualBtn.classList.toggle('active', currentView === 'annual');
    const { milComp, equivSal } = lastResult;
    const vaCompAnnual = milComp.vaCompMonthly * 12;
    renderHeroCard(milComp, equivSal, vaCompAnnual);
    renderMilitaryBreakdown(milComp);
    renderEquivalentSalary(milComp, equivSal, vaCompAnnual);
}

// --- Render Functions ---
function renderHeroCard(milComp, equivSal, vaCompAnnual) {
    const container = document.getElementById('hero-card');
    let vaLine = '';
    if (vaCompAnnual > 0) {
        const adjustedSalary = Math.max(0, equivSal.equivalentSalary - vaCompAnnual);
        vaLine = `<p class="hero-detail">With your VA disability (<strong>${fmtAnnual(vaCompAnnual)}/yr tax-free</strong>), you only need <strong>${fmtAnnual(adjustedSalary)}/year</strong> from a job</p>`;
    }
    container.innerHTML = `
        <div class="hero-value-card">
            <p class="hero-label">Your Total Military Compensation</p>
            <p class="hero-amount">${fmt(milComp.militaryTotalMonthly)}<span style="font-size:0.35em;font-weight:400;">${period()}</span></p>
            <p class="hero-detail">To match this as a civilian, you'd need to earn <strong>${fmtAnnual(equivSal.equivalentSalary)}/year</strong></p>
            ${vaLine}
        </div>
    `;
}

function renderMilitaryBreakdown(milComp) {
    const grid = document.getElementById('military-breakdown-grid');
    const items = [
        { label: 'Base Pay', amount: milComp.basePay, desc: 'Taxable monthly pay based on grade and years of service.', tag: 'taxable' },
        ...(milComp.specialPayMonthly > 0 ? [{ label: 'Special & Incentive Pay', amount: milComp.specialPayMonthly, desc: 'Jump pay, dive pay, flight pay, SDAP, hazardous duty pay, and other special/incentive pays. Taxable like base pay.', tag: 'taxable' }] : []),
        { label: 'BAH', amount: milComp.bahMonthly, desc: milComp.bahMonthly > 0 ? 'Basic Allowance for Housing — tax-free, based on your duty station.' : 'Not receiving BAH (living in barracks/on-post housing).', tag: 'tax-free' },
        { label: 'BAS', amount: milComp.basMonthly, desc: milComp.basMonthly > 0 ? 'Basic Allowance for Subsistence — tax-free food allowance.' : 'Not receiving BAS (meal deductions or DFAC).', tag: 'tax-free' },
        { label: 'Tricare Value', amount: milComp.tricareMonthly, desc: 'What a civilian would pay for equivalent health insurance.', tag: 'tax-free' },
        { label: 'TSP Match (BRS)', amount: milComp.tspMatchMonthly, desc: `DoD puts ${fmt(milComp.tspMatchMonthly)} into your TSP${milComp.tspContribPct > 0 ? ` (your own ${milComp.tspContribPct}% = ${fmt(milComp.basePay * milComp.tspContribPct / 100)} comes out of your base pay)` : ''}. This is free money from DoD — not deducted from your paycheck. ${milComp.tspContribPct < 5 ? 'Contribute 5% to get the full match.' : 'You\'re getting the maximum match.'}`, tag: 'tax-free' },
        { label: 'Tax Advantage', amount: milComp.taxSavingsMonthly, desc: milComp.taxSavingsMonthly > 0 ? 'Federal + state taxes you avoid because BAH and BAS are tax-free.' : 'No tax-free allowances to create a tax advantage.', tag: 'tax-free' }
    ];

    grid.innerHTML = items.map(item => `
        <div class="benefit-card">
            <h3>${item.label}</h3>
            <p class="benefit-amount">${fmt(item.amount)}<span class="benefit-period">${period()}</span></p>
            <p class="benefit-desc">${item.desc}</p>
            <span class="benefit-tag ${item.tag}">${item.tag === 'tax-free' ? 'Tax-Free' : 'Taxable'}</span>
        </div>
    `).join('');
}

function renderEquivalentSalary(milComp, equivSal, vaCompAnnual) {
    const container = document.getElementById('equivalent-salary-section');

    let vaRow = '';
    let vaFraming = '';
    if (vaCompAnnual > 0) {
        const adjustedSalary = Math.max(0, equivSal.equivalentSalary - vaCompAnnual);
        vaRow = `
            <div class="salary-math-row">
                <span class="salary-math-label">VA Disability (tax-free)</span>
                <span class="salary-math-value positive">-${fmtAnnual(vaCompAnnual)}</span>
            </div>
            <div class="salary-math-row total-highlight">
                <span class="salary-math-label">Civilian Salary You Actually Need</span>
                <span class="salary-math-value">${fmtAnnual(adjustedSalary)}/yr</span>
            </div>
        `;
        vaFraming = `
            <p class="framing-text">
                Your VA disability covers <strong>${fmtAnnual(vaCompAnnual)}</strong>/yr tax-free, so you only need
                <strong>${fmtAnnual(adjustedSalary)}</strong> from a civilian job to match your military total comp.
            </p>
        `;
    }

    container.innerHTML = `
        <div class="salary-math-card">
            <div class="salary-math-row total-highlight">
                <span class="salary-math-label">Civilian Gross Salary Needed (without VA)</span>
                <span class="salary-math-value">${fmtAnnual(equivSal.equivalentSalary)}/yr</span>
            </div>
            <div class="salary-math-row">
                <span class="salary-math-label">Federal Income Tax</span>
                <span class="salary-math-value negative">-${fmtAnnual(equivSal.fedTax)}</span>
            </div>
            <div class="salary-math-row">
                <span class="salary-math-label">State Income Tax</span>
                <span class="salary-math-value negative">-${fmtAnnual(equivSal.stateTax)}</span>
            </div>
            <div class="salary-math-row">
                <span class="salary-math-label">FICA (Social Security + Medicare)</span>
                <span class="salary-math-value negative">-${fmtAnnual(equivSal.fica)}</span>
            </div>
            <div class="salary-math-row">
                <span class="salary-math-label">Health Insurance (your share)</span>
                <span class="salary-math-value negative">-${fmtAnnual(equivSal.healthInsurance)}</span>
            </div>
            <div class="salary-math-row">
                <span class="salary-math-label">Your 6% 401(k) Contribution</span>
                <span class="salary-math-value negative">-${fmtAnnual(equivSal.retirementContrib)}</span>
            </div>
            <div class="salary-math-row total">
                <span class="salary-math-label">= Your Take-Home</span>
                <span class="salary-math-value positive">${fmtAnnual(equivSal.takeHome)}</span>
            </div>
            ${vaRow}
        </div>
        <p class="framing-text">
            Your base pay is <strong>${fmtAnnual(milComp.taxableBasePayAnnual)}</strong>.
            But if a recruiter offers you less than <strong>${fmtAnnual(equivSal.equivalentSalary)}</strong>,
            you're taking a pay cut — even if it <em>looks</em> like a raise.
        </p>
        ${vaFraming}
    `;
}

function renderGapSection(gap) {
    const section = document.getElementById('gap-section');
    const container = document.getElementById('gap-content');
    if (!gap) { section.style.display = 'none'; return; }
    section.style.display = 'block';

    const cardClass = gap.direction === 'raise' ? 'pay-raise' : 'pay-cut';
    const label = gap.direction === 'raise' ? 'This Offer Is a Raise' : 'This Offer Is a Pay Cut';
    const sign = gap.direction === 'raise' ? '+' : '-';

    let html = `
        <div class="gap-card ${cardClass}">
            <p class="gap-label">${label}</p>
            <p class="gap-amount">${sign}${fmtAnnual(gap.gapAbs)}/year</p>
            <p class="gap-detail">vs. your military equivalent of ${fmtAnnual(gap.equivalentSalary)}/year</p>
        </div>
    `;

    if (gap.vaCompAnnual > 0) {
        const adjCardClass = gap.isActuallyRaise ? 'pay-raise' : 'pay-cut';
        const adjLabel = gap.isActuallyRaise ? 'With VA Disability: It\'s Actually a Raise' : 'Even With VA Disability: Still a Pay Cut';
        const adjSign = gap.adjustedGap >= 0 ? '+' : '-';
        html += `
            <div class="gap-card ${adjCardClass}" style="margin-top: 12px;">
                <p class="gap-label">${adjLabel}</p>
                <p class="gap-amount">${adjSign}${fmtAnnual(Math.abs(gap.adjustedGap))}/year</p>
                <p class="gap-detail">Your tax-free VA comp (${fmtAnnual(gap.vaCompAnnual)}/yr) reduces the salary you need to ${fmtAnnual(gap.adjustedEquivalent)}/yr</p>
            </div>
        `;
    }

    container.innerHTML = html;
}

function renderPostSepSection(milComp, equivSal, vaRating) {
    const section = document.getElementById('post-sep-section');
    const container = document.getElementById('post-sep-content');
    if (vaRating <= 0) { section.style.display = 'none'; return; }
    section.style.display = 'block';

    const vaAnnual = milComp.vaCompMonthly * 12;
    const neededFromJob = Math.max(0, equivSal.equivalentSalary - vaAnnual);
    const totalStack = neededFromJob + vaAnnual;

    container.innerHTML = `
        <div class="stack-grid">
            <div class="stack-card">
                <h4>VA Disability (${vaRating}%)</h4>
                <p class="stack-amount green">${fmtAnnual(vaAnnual)}/yr</p>
                <p class="stack-desc">Tax-free, guaranteed</p>
            </div>
            <div class="stack-card">
                <h4>Civilian Salary Needed</h4>
                <p class="stack-amount primary">${fmtAnnual(neededFromJob)}/yr</p>
                <p class="stack-desc">To match your military total comp</p>
            </div>
            <div class="stack-card">
                <h4>Your Total Stack</h4>
                <p class="stack-amount green">${fmtAnnual(totalStack)}/yr</p>
                <p class="stack-desc">VA comp + civilian salary</p>
            </div>
        </div>
        <p class="framing-text">
            With <strong>${vaRating}%</strong> VA disability, you receive <strong>${fmtAnnual(vaAnnual)}</strong>/yr tax-free.
            That means you only need <strong>${fmtAnnual(neededFromJob)}</strong> from a civilian job to match your
            <strong>${fmtAnnual(equivSal.equivalentSalary)}</strong> military equivalent.
        </p>
    `;
}

function renderChart(milComp, equivSal, civOffer, vaCompAnnual) {
    const ctx = document.getElementById('comp-chart');
    if (compChart) compChart.destroy();

    const hasVa = vaCompAnnual > 0;
    const labels = ['Military Total Comp', 'Equivalent Civilian Salary'];
    const basePay = [milComp.basePay * 12, 0];
    const specPay = [milComp.specialPayMonthly * 12, 0];
    const bah = [milComp.bahMonthly * 12, 0];
    const bas = [milComp.basMonthly * 12, 0];
    const tricare = [milComp.tricareMonthly * 12, 0];
    const tsp = [milComp.tspMatchMonthly * 12, 0];
    const taxAdv = [milComp.taxSavingsMonthly * 12, 0];
    const civSal = [0, equivSal.equivalentSalary];
    const vaComp = [0, 0];

    if (hasVa) {
        // Show VA comp as a segment on the equivalent salary bar
        const adjustedSalary = Math.max(0, equivSal.equivalentSalary - vaCompAnnual);
        civSal[1] = adjustedSalary;
        vaComp[1] = vaCompAnnual;
    }

    if (civOffer > 0) {
        labels.push(hasVa ? 'Your Offer + VA Comp' : 'Your Offer');
        basePay.push(0); specPay.push(0); bah.push(0); bas.push(0);
        tricare.push(0); tsp.push(0); taxAdv.push(0);
        civSal.push(civOffer);
        vaComp.push(hasVa ? vaCompAnnual : 0);
    }

    const datasets = [
        { label: 'Base Pay', data: basePay, backgroundColor: '#2b6cb0' },
        ...(milComp.specialPayMonthly > 0 ? [{ label: 'Special Pay', data: specPay, backgroundColor: '#4299e1' }] : []),
        { label: 'BAH', data: bah, backgroundColor: '#38a169' },
        { label: 'BAS', data: bas, backgroundColor: '#68d391' },
        { label: 'Tricare Value', data: tricare, backgroundColor: '#9ae6b4' },
        { label: 'TSP Match', data: tsp, backgroundColor: '#c6f6d5' },
        { label: 'Tax Savings on Allowances', data: taxAdv, backgroundColor: '#C4A55A' },
        { label: 'Civilian Salary', data: civSal, backgroundColor: '#1a365d' }
    ];

    if (hasVa) {
        datasets.push({ label: 'VA Disability (tax-free)', data: vaComp, backgroundColor: '#e53e3e' });
    }

    compChart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12, font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ctx.raw > 0 ? `${ctx.dataset.label}: $${Math.round(ctx.raw).toLocaleString()}` : null
                    }
                }
            },
            scales: {
                x: { stacked: true, grid: { display: false } },
                y: {
                    stacked: true,
                    ticks: { callback: v => '$' + (v / 1000).toFixed(0) + 'K' },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                }
            }
        }
    });
}

function renderSummary(milComp, equivSal, gap, vaCompAnnual, civOffer) {
    const container = document.getElementById('summary-content');
    const grade = gradeSelect.options[gradeSelect.selectedIndex].textContent;
    const adjustedSalary = vaCompAnnual > 0
        ? Math.max(0, equivSal.equivalentSalary - vaCompAnnual) : equivSal.equivalentSalary;

    let bullets = [];

    bullets.push(`Your total military compensation as a <strong>${grade}</strong> is <span class="summary-number">${fmtAnnual(milComp.militaryTotalAnnual)}/year</span> — not just the ${fmtAnnual(milComp.taxableBasePayAnnual)} base pay on your LES.`);

    bullets.push(`A civilian employer would need to pay you <span class="summary-number">${fmtAnnual(equivSal.equivalentSalary)}/year</span> for you to take home the same amount after taxes, health insurance, and retirement contributions.`);

    if (vaCompAnnual > 0) {
        bullets.push(`Your VA disability pays <span class="summary-number">${fmtAnnual(vaCompAnnual)}/year tax-free</span>, which means you only need <span class="summary-number">${fmtAnnual(adjustedSalary)}/year</span> from a civilian job to match your current military lifestyle.`);
    }

    if (gap && civOffer > 0) {
        if (vaCompAnnual > 0) {
            if (gap.isActuallyRaise) {
                bullets.push(`Your ${fmtAnnual(civOffer)} offer + VA comp = a <span class="summary-number">net raise of ${fmtAnnual(Math.abs(gap.adjustedGap))}/year</span> compared to your military equivalent.`);
            } else {
                bullets.push(`Even with VA comp, your ${fmtAnnual(civOffer)} offer is a <span class="summary-number accent">net pay cut of ${fmtAnnual(Math.abs(gap.adjustedGap))}/year</span> compared to your military equivalent.`);
            }
        } else {
            if (gap.direction === 'raise') {
                bullets.push(`Your ${fmtAnnual(civOffer)} offer is a <span class="summary-number">net raise of ${fmtAnnual(gap.gapAbs)}/year</span> compared to your military equivalent.`);
            } else {
                bullets.push(`Your ${fmtAnnual(civOffer)} offer is a <span class="summary-number accent">net pay cut of ${fmtAnnual(gap.gapAbs)}/year</span> — even if the number looks bigger than your base pay.`);
            }
        }
    }

    // CTA — the "what to do with this" box
    let ctaText = '';
    if (civOffer > 0 && gap) {
        const targetSalary = vaCompAnnual > 0 ? adjustedSalary : equivSal.equivalentSalary;
        if ((vaCompAnnual > 0 ? gap.adjustedGap : gap.gap) < 0) {
            ctaText = `To truly match your military pay, negotiate for at least <strong>${fmtAnnual(targetSalary)}</strong>. Print this page and bring it to the negotiation — the numbers speak for themselves.`;
        } else {
            ctaText = `This offer exceeds your military equivalent. Factor in career growth, location, and quality of life — but from a pure compensation standpoint, the math works.`;
        }
    } else {
        ctaText = `Know your number before you start interviewing. Any offer below <strong>${fmtAnnual(adjustedSalary)}</strong> is a pay cut in disguise. Print this page and keep it in your back pocket.`;
    }

    container.innerHTML = `
        <ul class="summary-list">
            ${bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
        <div class="summary-cta">
            <p>${ctaText}</p>
        </div>
        <p class="section-footnote" style="margin-top:12px;">Retiring after 20+ years? Your military pension further reduces the civilian salary you need. <a href="https://www.dfas.mil/RetiredMilitary/plan/estimate/" target="_blank" rel="noopener noreferrer">Estimate your pension at DFAS</a>.</p>
    `;
}

// --- Start ---
init();
