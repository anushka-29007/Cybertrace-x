/**
 * CyberTrace-X Case Linkage & Network Discovery Algorithm
 * Implements Algorithm C from the Framework Poster:
 * 1. Input: New case evidence E
 * 2. Extract entities using NLP/OCR
 * 3. Generate embedding / signature of E
 * 4. Retrieve candidate cases from Vector DB / Case Store
 * 5. Compute similarity score (cosine + Jaccard entity overlap)
 * 6. If score > threshold:
 *    - Link cases in Knowledge Graph
 *    - Update relationship strength (Direct / Indirect)
 *    - Recalculate risk score
 * 7. Else: Store as isolated case
 * 8. Return linked cases + score + explainable reasons
 */

const { extractEntities } = require('./entityExtractor');

// Tokenize and compute term frequencies for cosine similarity
function getTermVector(text) {
  if (!text) return {};
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
  
  const counts = {};
  for (const w of words) {
    counts[w] = (counts[w] || 0) + 1;
  }
  return counts;
}

function cosineSimilarity(vecA, vecB) {
  const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const k of Object.keys(vecA)) {
    normA += vecA[k] * vecA[k];
  }
  for (const k of Object.keys(vecB)) {
    normB += vecB[k] * vecB[k];
  }
  for (const k of Object.keys(vecA)) {
    if (vecB[k]) {
      dotProduct += vecA[k] * vecB[k];
    }
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Compute entity overlap and exact matches
function compareEntities(entitiesA, entitiesB) {
  const shared = {
    phoneNumbers: [],
    bankAccounts: [],
    upiIds: [],
    ipAddresses: [],
    cryptoWallets: [],
    urls: []
  };

  const directMatches = [];
  const indirectMatches = [];

  // Check Phone numbers
  for (const p of entitiesA.phoneNumbers || []) {
    const cleanP = p.replace(/\D/g, '');
    const found = (entitiesB.phoneNumbers || []).some(bp => {
      const cleanBP = bp.replace(/\D/g, '');
      return cleanP.endsWith(cleanBP) || cleanBP.endsWith(cleanP) || cleanP === cleanBP;
    });
    if (found) {
      shared.phoneNumbers.push(p);
      directMatches.push(`Shared Calling/Target Phone: ${p}`);
    }
  }

  // Check Bank accounts
  for (const b of entitiesA.bankAccounts || []) {
    const cleanB = b.replace(/[^0-9]/g, '');
    const found = (entitiesB.bankAccounts || []).some(bb => {
      const cleanBB = bb.replace(/[^0-9]/g, '');
      return (cleanB && cleanBB && (cleanB === cleanBB || cleanB.endsWith(cleanBB) || cleanBB.endsWith(cleanB)));
    });
    if (found) {
      shared.bankAccounts.push(b);
      directMatches.push(`Shared Mule Bank A/C: ${b}`);
    }
  }

  // Check UPI IDs
  for (const u of entitiesA.upiIds || []) {
    if ((entitiesB.upiIds || []).includes(u.toLowerCase())) {
      shared.upiIds.push(u);
      directMatches.push(`Direct UPI ID Match: ${u}`);
    }
  }

  // Check Crypto Wallets
  for (const w of entitiesA.cryptoWallets || []) {
    if ((entitiesB.cryptoWallets || []).includes(w)) {
      shared.cryptoWallets.push(w);
      directMatches.push(`Shared Crypto Laundering Wallet: ${w}`);
    }
  }

  // Check IP Addresses
  for (const ip of entitiesA.ipAddresses || []) {
    if ((entitiesB.ipAddresses || []).includes(ip)) {
      shared.ipAddresses.push(ip);
      directMatches.push(`Identical Origin IP: ${ip}`);
    } else {
      // Subnet match (Indirect)
      const subnetA = ip.split('.').slice(0, 3).join('.');
      const subMatch = (entitiesB.ipAddresses || []).some(bip => bip.startsWith(subnetA));
      if (subMatch) {
        indirectMatches.push(`Correlated IP Subnet: ${subnetA}.x`);
      }
    }
  }

  // Check URLs / Domains
  for (const u of entitiesA.urls || []) {
    const domainA = u.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0].toLowerCase();
    const found = (entitiesB.urls || []).some(bu => {
      const domainB = bu.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0].toLowerCase();
      return domainA === domainB || domainA.includes(domainB) || domainB.includes(domainA);
    });
    if (found) {
      shared.urls.push(u);
      directMatches.push(`Associated Phishing/Host Domain: ${domainA}`);
    }
  }

  const directCount = directMatches.length;
  const indirectCount = indirectMatches.length;

  return {
    shared,
    directMatches,
    indirectMatches,
    directCount,
    indirectCount,
    hasDirectLink: directCount > 0,
    hasIndirectLink: indirectCount > 0
  };
}

/**
 * Main Case Linker execution
 */
function linkCaseAgainstRepository(newCase, existingCases, threshold = 0.45) {
  const newEntities = newCase.entities || extractEntities(newCase.evidenceText || newCase.description || '');
  const newVec = getTermVector(`${newCase.title || ''} ${newCase.evidenceText || ''} ${newCase.crimeType || ''}`);

  const linkedResults = [];

  for (const existing of existingCases) {
    if (existing.id === newCase.id) continue;

    const existEntities = existing.entities || extractEntities(existing.evidenceText || existing.description || '');
    const existVec = getTermVector(`${existing.title || ''} ${existing.evidenceText || ''} ${existing.crimeType || ''}`);

    const semanticSim = cosineSimilarity(newVec, existVec);
    const entityComparison = compareEntities(newEntities, existEntities);

    // Entity overlap score
    let entityScore = 0;
    if (entityComparison.hasDirectLink) {
      entityScore = Math.min(1.0, 0.6 + entityComparison.directCount * 0.15);
    } else if (entityComparison.hasIndirectLink) {
      entityScore = 0.35 + entityComparison.indirectCount * 0.1;
    }

    // Combined score: heavily weights hard entity overlap
    let totalScore = entityScore > 0 ? (0.65 * entityScore + 0.35 * semanticSim) : semanticSim;

    // Direct match bonus
    if (entityComparison.hasDirectLink) {
      totalScore = Math.max(totalScore, 0.78);
    }

    if (totalScore >= threshold || entityComparison.hasDirectLink) {
      const linkType = entityComparison.hasDirectLink ? 'Direct Link' : 'Indirect Link';
      
      const reasons = [
        ...entityComparison.directMatches,
        ...entityComparison.indirectMatches
      ];

      if (semanticSim > 0.45) {
        reasons.push(`Modus Operandi & Vocabulary Correlation (${Math.round(semanticSim * 100)}% match)`);
      }

      linkedResults.push({
        targetCaseId: existing.id,
        targetCaseNumber: existing.caseNumber || existing.id,
        targetTitle: existing.title,
        crimeType: existing.crimeType,
        victimLocation: existing.location || existing.victimLocation,
        financialLoss: existing.financialLoss || 0,
        similarityScore: Math.min(1.0, parseFloat(totalScore.toFixed(3))),
        similarityPercent: Math.min(100, Math.round(totalScore * 100)),
        linkType,
        sharedEntities: entityComparison.shared,
        reasons
      });
    }
  }

  // Sort by highest similarity
  linkedResults.sort((a, b) => b.similarityScore - a.similarityScore);

  return {
    linkedCount: linkedResults.length,
    isLinked: linkedResults.length > 0,
    links: linkedResults
  };
}

module.exports = {
  linkCaseAgainstRepository,
  compareEntities,
  cosineSimilarity
};
