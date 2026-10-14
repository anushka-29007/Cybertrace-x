/**
 * CyberTrace-X Automated Multimodal Entity Extraction Engine
 * Implements automated NER & regex-based forensic entity parsing
 * Extracts: Phones, Bank Accounts, IFSC, UPI IDs, Emails, IP addresses, URLs, Crypto Wallets, Amounts
 */

function extractEntities(text) {
  if (!text || typeof text !== 'string') {
    return {
      phoneNumbers: [],
      bankAccounts: [],
      upiIds: [],
      emails: [],
      ipAddresses: [],
      urls: [],
      cryptoWallets: [],
      amounts: [],
      ifscCodes: []
    };
  }

  // 1. Phone numbers: Indian (+91-9876543210, 9876543210, 9876XXXXX, 98765-43210)
  const phoneRegex = /(?:\+?91[\s.-]?)?(?:[6-9]\d{4}[\s.-]?\d{5}|[6-9]\d{9}|[6-9]\d{3}[X|x]{4}\d{2}|[6-9]\d{3}[X|x]{5})/g;
  const rawPhones = text.match(phoneRegex) || [];
  const phoneNumbers = [...new Set(rawPhones.map(p => p.replace(/[\s.-]/g, '')))];

  // 2. UPI IDs: standard format username@bank (abc@upi, scammer@okaxis, 9876543210@paytm, user@ybl)
  const upiRegex = /\b[a-zA-Z0-9.\-_]{2,30}@(upi|okhdfcbank|okaxis|oksbi|okicici|paytm|ybl|ibl|axl|federal|apl|barodampay|postbank|airtel|gpay|phonepe)\b/gi;
  const rawUpi = text.match(upiRegex) || [];
  // Also generic pattern: username@provider
  const genericUpiRegex = /\b[a-zA-Z0-9._-]{3,}@[a-zA-Z]{3,15}\b/g;
  const rawGenericUpi = text.match(genericUpiRegex) || [];
  const validGenericUpi = rawGenericUpi.filter(u => !u.includes('.com') && !u.includes('.org') && !u.includes('.in') && !u.includes('.net') && !u.includes('.edu'));
  const upiIds = [...new Set([...rawUpi, ...validGenericUpi].map(u => u.toLowerCase()))];

  // 3. Email IDs
  const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
  const emails = [...new Set((text.match(emailRegex) || []).map(e => e.toLowerCase()))];

  // 4. IP Addresses (IPv4)
  const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
  const ipAddresses = [...new Set(text.match(ipRegex) || [])];

  // 5. URLs / Domains
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>"'{}|\\^`[\]]+/gi;
  const rawUrls = text.match(urlRegex) || [];
  const domainRegex = /\b(?:[a-zA-Z0-9-]+\.)+(?:com|in|org|net|xyz|top|ru|cc|club|live|info|biz|site|online)\b/gi;
  const rawDomains = text.match(domainRegex) || [];
  const urls = [...new Set([...rawUrls, ...rawDomains])];

  // 6. Bank Accounts: 9-18 digit strings, often near keywords like A/C, Account, Acc, or 1234XXXX
  const bankAccPattern = /(?:(?:A\/C|acc|account|acct)[\s.:#]*([0-9]{9,18}|[0-9]{4}[Xx*]{4,8}[0-9]{2,4}))|\b([0-9]{4}[Xx*]{4}[0-9]{2,4})\b/gi;
  let match;
  const bankAccSet = new Set();
  while ((match = bankAccPattern.exec(text)) !== null) {
    const acc = match[1] || match[2];
    if (acc && acc.length >= 9) {
      bankAccSet.add(acc.trim());
    }
  }
  // Check for standalone 11-16 digit numbers that aren't phones or timestamps
  const standaloneDigits = text.match(/\b\d{11,16}\b/g) || [];
  standaloneDigits.forEach(num => {
    if (!num.startsWith('91') && !num.startsWith('2024') && !num.startsWith('2025') && !num.startsWith('2026')) {
      bankAccSet.add(num);
    }
  });

  // 7. IFSC Codes (4 letters, 0, 6 alphanumeric)
  const ifscRegex = /\b[A-Z]{4}0[A-Z0-9]{6}\b/g;
  const ifscCodes = [...new Set(text.match(ifscRegex) || [])];

  // 8. Crypto Wallet Addresses (BTC: 1 or 3 or bc1, ETH/USDT: 0x...)
  const ethRegex = /\b0x[a-fA-F0-9]{40}\b/g;
  const btcRegex = /\b(?:1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}\b/g;
  const cryptoWallets = [...new Set([...(text.match(ethRegex) || []), ...(text.match(btcRegex) || [])])];

  // 9. Financial Amounts (₹50,000, Rs. 2,45,000, INR 10000, $500)
  const amountRegex = /(?:₹|Rs\.?|INR|\$)\s?([0-9,]+(?:\.[0-9]{2})?)/gi;
  const amounts = [];
  let amtMatch;
  while ((amtMatch = amountRegex.exec(text)) !== null) {
    const cleanAmt = amtMatch[1].replace(/,/g, '');
    const num = parseFloat(cleanAmt);
    if (!isNaN(num) && num > 0) {
      amounts.push(num);
    }
  }

  return {
    phoneNumbers,
    bankAccounts: Array.from(bankAccSet),
    upiIds,
    emails,
    ipAddresses,
    urls,
    cryptoWallets,
    amounts,
    ifscCodes,
    totalEntitiesCount: phoneNumbers.length + bankAccSet.size + upiIds.length + emails.length + ipAddresses.length + urls.length + cryptoWallets.length
  };
}

/**
 * PII Masking utility for investigative data protection and legal exports
 */
function maskPII(text) {
  if (!text) return '';
  return text
    .replace(/(?:\+?91[\s.-]?)?([6-9]\d{2})\d{4}(\d{3})/g, '$1-XXXX-$2')
    .replace(/\b([a-zA-Z0-9._%+-]{2})[a-zA-Z0-9._%+-]+(@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g, '$1***$2')
    .replace(/\b([a-zA-Z0-9]{2})[a-zA-Z0-9._-]+(@[a-zA-Z]+)\b/g, '$1***$2')
    .replace(/\b(\d{4})\d{4,8}(\d{4})\b/g, '$1-XXXX-$2');
}

module.exports = {
  extractEntities,
  maskPII
};
