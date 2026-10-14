/**
 * CyberTrace-X AI Risk Scoring & Case Prioritization Engine
 * Models XGBoost multi-factor scoring mechanism to assess threat severity,
 * financial loss, syndicate repeat indicators, and case urgency.
 */

function calculateRiskScore(caseData, linkedCasesCount = 0) {
  let score = 25; // Base baseline score

  // Factor 1: Financial Loss impact (up to +30 points)
  const loss = parseFloat(caseData.financialLoss || 0);
  if (loss > 500000) {
    score += 30; // Very large financial fraud (> 5 Lakhs)
  } else if (loss > 200000) {
    score += 24;
  } else if (loss > 50000) {
    score += 18;
  } else if (loss > 10000) {
    score += 10;
  } else {
    score += 4;
  }

  // Factor 2: Repeat Syndicate & Linkage Count (up to +25 points)
  if (linkedCasesCount >= 3) {
    score += 25; // High organized syndicate activity
  } else if (linkedCasesCount === 2) {
    score += 18;
  } else if (linkedCasesCount === 1) {
    score += 12;
  }

  // Factor 3: High-Risk Infrastructure / Vectors (up to +15 points)
  const entities = caseData.entities || {};
  if ((entities.cryptoWallets && entities.cryptoWallets.length > 0) || (caseData.crimeType && caseData.crimeType.toLowerCase().includes('crypto'))) {
    score += 12; // Crypto laundering is hard to trace, raises priority
  }
  if (entities.urls && entities.urls.length > 0) {
    score += 5; // Active phishing link in the wild
  }
  if (entities.bankAccounts && entities.bankAccounts.length > 1) {
    score += 6; // Layered mule account architecture
  }

  // Factor 4: Crime Type Severity & Active Ongoing Threat (up to +15 points)
  const cType = (caseData.crimeType || '').toLowerCase();
  if (cType.includes('ransomware') || cType.includes('extortion') || cType.includes('blackmail')) {
    score += 15;
  } else if (cType.includes('banking') || cType.includes('upi') || cType.includes('phishing') || cType.includes('impersonation')) {
    score += 10;
  } else if (cType.includes('investment') || cType.includes('telegram')) {
    score += 8;
  }

  // Normalize between 1 and 99
  const finalScore = Math.min(99, Math.max(12, Math.round(score)));

  let tier = 'LOW';
  let badgeColor = 'emerald';
  let urgency = 'Routine Forensic Queue';

  if (finalScore >= 70) {
    tier = 'HIGH';
    badgeColor = 'rose';
    urgency = 'Immediate Interdiction Required (LEA Notice & Bank Freeze)';
  } else if (finalScore >= 40) {
    tier = 'MEDIUM';
    badgeColor = 'amber';
    urgency = 'Active Investigation & Account Tracing';
  }

  return {
    score: finalScore,
    tier,
    badgeColor,
    urgency,
    factors: {
      financialWeight: loss > 100000 ? 'High Financial Impact' : 'Standard Loss',
      syndicateWeight: linkedCasesCount > 0 ? `${linkedCasesCount} Linked Multi-Victim Cases` : 'Isolated Incident',
      technicalComplexity: entities.cryptoWallets?.length ? 'Cryptocurrency Laundering' : 'Domestic Banking / UPI',
      actionRecommendation: finalScore >= 70 ? 'Freeze target mule A/C within golden hour window' : 'Correlate CDR & IP logs'
    }
  };
}

module.exports = {
  calculateRiskScore
};
