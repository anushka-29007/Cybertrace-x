# CyberTrace-X 🛡️
### An AI-Powered Multimodal Cybercrime Investigation & Intelligence Framework
**Category Code:** 5. Engineering and technology  
**Motto:** *Evidence → Understand → Connect → Reconstruct | Discover → Prioritize → Explain → Investigate*  
*AI for Smarter Investigations. Stronger Evidence. Stronger Decisions. Safer India.*

---

## 🎯 1. Overview & Problem Statement
Cybercrime investigations face severe challenges due to:
- **Scattered Evidence:** Fragmented data across complaints, bank statements, CDR/IPDR logs, phishing portals, and payment gateways.
- **Hidden Links:** Organized syndicates reuse phone numbers, mule bank accounts, and UPI IDs across multiple police jurisdictions.
- **Slow Investigations:** Manual correlation delays interdiction beyond the critical "golden hour".
- **Repeat Victimization:** Lack of proactive syndicate mapping allows repeat offenders to target new victims.

**CyberTrace-X** provides an end-to-end AI-driven intelligence system enabling faster, accurate, and explainable forensic decisions.

---

## ✨ 2. Key Features

1. **Automated Entity Extraction (NLP / NER):**
   - Extracts phone numbers (Indian & international formats), bank account numbers, IFSC codes, UPI IDs, emails, IP addresses, phishing URLs/domains, and cryptocurrency wallets (BTC/ETH/USDT).
2. **Multimodal Evidence Processing:**
   - Ingests text complaints, PDFs, screenshot OCR (EasyOCR / Tesseract regex), and structured CSV/log streams.
3. **Case Linkage & Network Discovery (Algorithm C):**
   - Implements hybrid Vector Cosine similarity + Jaccard entity overlap.
   - Detects Direct Links (shared financial/telecom identifiers) and Indirect Links (shared IP subnets and phishing templates).
4. **Attack Timeline Reconstruction:**
   - Sequences chronological forensic events from first contact to cash-out:
     1. Phishing SMS / Email (1st contact) [10:01 AM]
     2. Fake Bank Link Opened (10:18 AM)
     3. Credential Theft & OTP Intercept (10:25 AM)
     4. Unauthorized Money Transfer / UPI Fraud (10:33 AM)
     5. Rapid ATM Cash-Out / Multi-Hop Siphoning (10:48 AM)
5. **AI Risk Scoring & Prioritization (XGBoost ML):**
   - Multi-factor risk scoring engine assessing financial loss, repeat syndicate markers, infrastructure volatility, and interdiction urgency.
6. **AI Investigator Assistant (RAG Engine):**
   - Interactive conversational assistant citing case facts, suspect profiles, and Indian Cyber Laws (IT Act 2000 Sec 43, 66C, 66D; Bharatiya Nyaya Sanhita 2023 Sec 318(4), 319, 336; BNSS Sec 94/106).
7. **Security, RBAC & Compliance:**
   - Role-Based Access Control (Lead Investigator, Forensics Analyst, Court Auditor).
   - Toggleable PII Masking for court-compliant presentations.
   - Tamper-evident Audit Logs with SHA-256 integrity verification.

---

## 🏗️ 3. Architecture & Technical Stack

- **Investigator UI:** React JS, Tailwind CSS, Vite, Lucide Icons, Interactive SVG Knowledge Graph & Geospatial Radar.
- **Backend API Server:** Node.js, Express.js, REST APIs, Multer for multimodal evidence uploads.
- **AI / NLP Engine:** Automated Regex + Tokenizer NER, Jaccard & Cosine Vector Linker, Temporal Chain Analyzer, XGBoost-style ML Risk Scorer.
- **Knowledge Graph:** Node-edge graph engine with degree centrality and hub detection.
- **Database & Preloaded Data:** Preloaded with 1,248 cases including the core syndicate from the poster: **Case #104**, **Case #117**, and **Case #126** linked via Phone `+91-9876543210`, Bank Account `123456789012`, and UPI ID `abc@upi`.

---

## 🚀 4. Quick Start (Ready to Access)

### Option 1: Double-Click (Windows)
Double-click `run.bat` or right-click `run.ps1` → **Run with PowerShell**.  
The server will start and automatically launch your browser to:
👉 **`http://localhost:5000`**

### Option 2: Command Line
```bash
# 1. Start Server
cd server
npm start

# 2. Open Browser
http://localhost:5000
```

---

## 📊 5. Key Metrics (Direct from Framework Poster)
- **Total Cases:** 1,248
- **Linked Cases:** 862
- **High Risk Cases:** 187 (15%)
- **Medium Risk Cases:** 512 (41%)
- **Low Risk Cases:** 549 (44%)
- **Entities Extracted:** 15,732 (Phone Numbers: 4,562 | Bank Accounts: 2,164 | UPI IDs: 1,298 | Email IDs: 1,102 | IP Addresses: 966)
- **Average Risk Score:** 78 / 100
- **Impact:** 70% reduction in manual effort, up to 95% linkage accuracy.
