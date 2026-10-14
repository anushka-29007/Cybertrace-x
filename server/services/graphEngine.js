/**
 * CyberTrace-X Knowledge Graph Engine
 * Builds node-edge representation for cases, suspects, bank accounts, phones, UPIs, IPs, and domains
 * Identifies shared nodes, clusters, direct & indirect links, and centrality
 */

function buildKnowledgeGraph(cases, activeCaseId = null) {
  const nodes = [];
  const links = [];
  const nodeMap = new Map();

  function addNode(id, label, type, properties = {}) {
    if (!nodeMap.has(id)) {
      const node = {
        id,
        label,
        type, // 'case', 'phone', 'bank', 'upi', 'ip', 'domain', 'suspect'
        ...properties
      };
      nodeMap.set(id, node);
      nodes.push(node);
    }
    return nodeMap.get(id);
  }

  function addLink(source, target, label, type = 'direct', strength = 1) {
    const key = `${source}->${target}`;
    const reverseKey = `${target}->${source}`;
    // prevent duplicates
    if (!links.some(l => (l.source === source && l.target === target) || (l.source === target && l.target === source))) {
      links.push({
        id: `link-${links.length + 1}`,
        source,
        target,
        label,
        type, // 'direct', 'indirect'
        strength
      });
    }
  }

  // Iterate over cases to populate graph
  cases.forEach(c => {
    const caseNodeId = `case-${c.id}`;
    addNode(caseNodeId, c.caseNumber || `Case #${c.id}`, 'case', {
      title: c.title,
      crimeType: c.crimeType,
      riskScore: c.riskScore || 75,
      loss: c.financialLoss,
      location: c.location,
      status: c.status || 'Active'
    });

    const entities = c.entities || {};

    // 1. Phone nodes
    (entities.phoneNumbers || []).forEach(phone => {
      const phoneId = `phone-${phone}`;
      addNode(phoneId, phone, 'phone', { raw: phone });
      addLink(caseNodeId, phoneId, 'USED_PHONE', 'direct');
    });

    // 2. Bank nodes
    (entities.bankAccounts || []).forEach(bank => {
      const bankId = `bank-${bank}`;
      addNode(bankId, bank, 'bank', { raw: bank });
      addLink(caseNodeId, bankId, 'SIPHONED_TO', 'direct');
    });

    // 3. UPI nodes
    (entities.upiIds || []).forEach(upi => {
      const upiId = `upi-${upi}`;
      addNode(upiId, upi, 'upi', { raw: upi });
      addLink(caseNodeId, upiId, 'PAID_VIA_UPI', 'direct');
    });

    // 4. IP nodes
    (entities.ipAddresses || []).forEach(ip => {
      const ipId = `ip-${ip}`;
      addNode(ipId, ip, 'ip', { raw: ip });
      addLink(caseNodeId, ipId, 'ROUTED_THROUGH', 'indirect');
    });

    // 5. Domain nodes
    (entities.urls || []).forEach(url => {
      const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
      const domainId = `domain-${domain}`;
      addNode(domainId, domain, 'domain', { raw: url });
      addLink(caseNodeId, domainId, 'HOSTED_PHISH', 'direct');
    });

    // If explicit linked cases exist
    if (c.linkedCases && Array.isArray(c.linkedCases)) {
      c.linkedCases.forEach(lc => {
        const targetCaseNodeId = `case-${lc.targetCaseId || lc.id}`;
        // If target case exists, draw direct/indirect case-to-case link
        addLink(caseNodeId, targetCaseNodeId, lc.linkType || 'SIMILAR_MO', lc.linkType === 'Direct Link' ? 'direct' : 'indirect', lc.similarityScore || 0.85);
      });
    }
  });

  // Calculate degree centrality (how many connections each node has)
  nodes.forEach(n => {
    n.connections = links.filter(l => l.source === n.id || l.target === n.id).length;
    // Highlight central hub nodes
    if (n.type !== 'case' && n.connections > 1) {
      n.isHub = true;
    }
  });

  return {
    nodes,
    links,
    summary: {
      totalNodes: nodes.length,
      totalLinks: links.length,
      hubEntities: nodes.filter(n => n.isHub).map(n => ({ id: n.id, label: n.label, type: n.type, connections: n.connections }))
    }
  };
}

module.exports = {
  buildKnowledgeGraph
};
