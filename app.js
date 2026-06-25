/* ═══════════════════════════════════════════════
   INTIKHABAAT · Pakistan Election DApp
   app.js — MetaMask + Ethers.js v5 Integration
   ═══════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────────────────
//  CONTRACT CONFIG
//  Replace CONTRACT_ADDRESS after deploying via Remix
// ─────────────────────────────────────────────────────────

const CONTRACT_ADDRESS = "0xBdA4FB792d44E67a262F87597f7f5B0ED7DeD6c9"; // ← REPLACE

const ABI =[
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "approveCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "fullName",
        "type": "string"
      }
    ],
    "name": "CandidateApproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "fullName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "constituency",
        "type": "string"
      }
    ],
    "name": "CandidateRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_voterCnic",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "castVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_durationInSeconds",
        "type": "uint256"
      }
    ],
    "name": "createElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalVotes",
        "type": "uint256"
      }
    ],
    "name": "ElectionEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      }
    ],
    "name": "ElectionStarted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "endElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_cnic",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_fullName",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "_age",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "_nationality",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_religion",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_province",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_constituency",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_party",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_manifesto",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_educationLevel",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "_hasCriminalRecord",
        "type": "bool"
      }
    ],
    "name": "registerCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_cnic",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_fullName",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "_age",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "_province",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_constituency",
        "type": "string"
      }
    ],
    "name": "registerVoter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "voterCnicHash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      }
    ],
    "name": "VoteCast",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "cnicHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "constituency",
        "type": "string"
      }
    ],
    "name": "VoterRegistered",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentElection",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "totalVotes",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getCandidateById",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "fullName",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "age",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "nationality",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "religion",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "province",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "constituency",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "party",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manifesto",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "educationLevel",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isApproved",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCandidateCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getElectionInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "totalVotes",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_cnic",
        "type": "string"
      }
    ],
    "name": "getVoterByCNIC",
    "outputs": [
      {
        "internalType": "string",
        "name": "fullName",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "age",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "province",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "constituency",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "hasVoted",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "votedFor",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVoterCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_cnic",
        "type": "string"
      }
    ],
    "name": "isCNICRegistered",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// ─────────────────────────────────────────────────────────
//  GLOBALS
// ─────────────────────────────────────────────────────────

let provider, signer, contract;
let selectedCandidateId = null;
let isConnected = false;

// ─────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  animateHeroEntry();

  // Auto-connect if already authorised
  if (window.ethereum) {
    window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
      if (accounts.length > 0) connectWallet();
    });
    window.ethereum.on('accountsChanged', accounts => {
      if (accounts.length === 0) disconnectUI();
      else connectWallet();
    });
    window.ethereum.on('chainChanged', () => window.location.reload());
  }
});

// ─────────────────────────────────────────────────────────
//  WALLET CONNECTION
// ─────────────────────────────────────────────────────────

async function connectWallet() {
  if (!window.ethereum) {
    showToast('MetaMask not found. Please install it.', 'error');
    return;
  }
  try {
    showLoader('Connecting to MetaMask…');
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer   = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const addr    = await signer.getAddress();
    const network = await provider.getNetwork();

    // Update UI
    document.getElementById('statusDot').classList.add('connected');
    document.getElementById('statusText').textContent =
      `${addr.slice(0,6)}…${addr.slice(-4)} · ${network.name}`;
    document.getElementById('connectBtn').textContent = 'Connected ✓';
    document.getElementById('connectBtn').style.background =
      'linear-gradient(135deg, #0f7a50 0%, #1a9e6e 100%)';

    isConnected = true;
    hideLoader();
    showToast('Wallet connected!', 'success');
    refreshStats();

  } catch (err) {
    hideLoader();
    showToast(err.message || 'Connection failed', 'error');
  }
}

function disconnectUI() {
  isConnected = false;
  document.getElementById('statusDot').classList.remove('connected');
  document.getElementById('statusText').textContent = 'Not Connected';
  document.getElementById('connectBtn').textContent = 'Connect Wallet';
  document.getElementById('connectBtn').style.background = '';
}

// ─────────────────────────────────────────────────────────
//  PANEL NAVIGATION
// ─────────────────────────────────────────────────────────

function showPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`panel-${name}`).classList.add('active');
  document.querySelector(`.tab[data-panel="${name}"]`).classList.add('active');
  document.getElementById('panels').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─────────────────────────────────────────────────────────
//  CNIC VISUALISER
// ─────────────────────────────────────────────────────────

function formatCNIC(input, displayId) {
  const raw = input.value.replace(/\D/g, '').slice(0, 13);
  input.value = raw;
  const padded = raw.padEnd(13, '_');
  document.getElementById(displayId).textContent = padded.split('').join(' ');
}

// ─────────────────────────────────────────────────────────
//  VOTER REGISTRATION
// ─────────────────────────────────────────────────────────

async function registerVoter() {
  if (!guardConnected()) return;

  const cnic         = document.getElementById('v-cnic').value.trim();
  const fullName     = document.getElementById('v-name').value.trim();
  const age          = parseInt(document.getElementById('v-age').value);
  const province     = document.getElementById('v-province').value;
  const constituency = document.getElementById('v-constituency').value.trim();

  // Client-side validation
  if (!cnic || cnic.length !== 13 || !/^\d+$/.test(cnic))
    return showTxStatus('voter-tx', 'error', '✗ CNIC must be exactly 13 numeric digits.');
  if (!fullName) return showTxStatus('voter-tx', 'error', '✗ Full name is required.');
  if (!age || age < 18) return showTxStatus('voter-tx', 'error', '✗ Must be at least 18 years old.');
  if (!province) return showTxStatus('voter-tx', 'error', '✗ Please select a province.');
  if (!constituency) return showTxStatus('voter-tx', 'error', '✗ Constituency is required.');

  showTxStatus('voter-tx', 'pending', '⏳ Check MetaMask to confirm transaction…');
  showLoader('Registering voter on blockchain…');

  try {
    // Check if already registered
    const already = await contract.isCNICRegistered(cnic);
    if (already) {
      hideLoader();
      return showTxStatus('voter-tx', 'error', '✗ This CNIC is already registered on-chain.');
    }

    const tx = await contract.registerVoter(cnic, fullName, age, province, constituency);
    showTxStatus('voter-tx', 'pending', `⏳ Transaction submitted: ${tx.hash.slice(0,18)}… Waiting for confirmation.`);
    await tx.wait();
    hideLoader();
    showTxStatus('voter-tx', 'success', `✓ Voter registered on blockchain!\nTX: ${tx.hash}`);
    showToast('Voter registered successfully!', 'success');
    refreshStats();
  } catch (err) {
    hideLoader();
    showTxStatus('voter-tx', 'error', `✗ ${parseContractError(err)}`);
  }
}

// ─────────────────────────────────────────────────────────
//  CANDIDATE REGISTRATION
// ─────────────────────────────────────────────────────────

async function registerCandidate() {
  if (!guardConnected()) return;

  const cnic         = document.getElementById('c-cnic').value.trim();
  const fullName     = document.getElementById('c-name').value.trim();
  const age          = parseInt(document.getElementById('c-age').value);
  const nationality  = document.getElementById('c-nationality').value;
  const religion     = document.getElementById('c-religion').value.trim();
  const province     = document.getElementById('c-province').value;
  const constituency = document.getElementById('c-constituency').value.trim();
  const party        = document.getElementById('c-party').value.trim();
  const manifesto    = document.getElementById('c-manifesto').value.trim();
  const education    = document.getElementById('c-education').value;
  const noCriminal   = document.getElementById('c-criminal').checked;
  const confirmed    = document.getElementById('c-confirm').checked;

  // Validation
  if (!cnic || cnic.length !== 13 || !/^\d+$/.test(cnic))
    return showTxStatus('candidate-tx', 'error', '✗ CNIC must be exactly 13 numeric digits.');
  if (!fullName)     return showTxStatus('candidate-tx', 'error', '✗ Full name required.');
  if (!age || age < 25) return showTxStatus('candidate-tx', 'error', '✗ Must be at least 25 years old (Article 62).');
  if (!religion)     return showTxStatus('candidate-tx', 'error', '✗ Religion required (Article 62).');
  if (!province)     return showTxStatus('candidate-tx', 'error', '✗ Province required.');
  if (!constituency) return showTxStatus('candidate-tx', 'error', '✗ Constituency required.');
  if (!party)        return showTxStatus('candidate-tx', 'error', '✗ Party name required.');
  if (!manifesto)    return showTxStatus('candidate-tx', 'error', '✗ Manifesto required.');
  if (!education)    return showTxStatus('candidate-tx', 'error', '✗ Education level required.');
  if (!noCriminal)   return showTxStatus('candidate-tx', 'error', '✗ You must declare no criminal record (Article 62/63).');
  if (!confirmed)    return showTxStatus('candidate-tx', 'error', '✗ You must confirm truthfulness of information.');

  showTxStatus('candidate-tx', 'pending', '⏳ Check MetaMask to confirm transaction…');
  showLoader('Submitting candidacy to blockchain…');

  try {
    const already = await contract.isCNICRegistered(cnic);
    if (already) {
      hideLoader();
      return showTxStatus('candidate-tx', 'error', '✗ This CNIC is already registered.');
    }

    const tx = await contract.registerCandidate(
      cnic, fullName, age, nationality, religion,
      province, constituency, party, manifesto, education,
      false  // hasCriminalRecord — always false (validated above)
    );
    showTxStatus('candidate-tx', 'pending', `⏳ TX: ${tx.hash.slice(0,18)}… Waiting for confirmation.`);
    await tx.wait();
    hideLoader();
    showTxStatus('candidate-tx', 'success',
      `✓ Candidacy submitted on blockchain!\nTX: ${tx.hash}\n\nAwait admin approval before you appear in voting.`);
    showToast('Candidacy registered!', 'success');
    refreshStats();
  } catch (err) {
    hideLoader();
    showTxStatus('candidate-tx', 'error', `✗ ${parseContractError(err)}`);
  }
}

// ─────────────────────────────────────────────────────────
//  LOAD CANDIDATES (for voting panel)
// ─────────────────────────────────────────────────────────

async function loadCandidates() {
  if (!guardConnected()) return;

  const container = document.getElementById('candidates-container');
  container.innerHTML = '<p style="color:var(--text2);padding:20px 0">Loading candidates from blockchain…</p>';

  try {
    const count = await contract.getCandidateCount();
    const total = count.toNumber();

    if (total === 0) {
      container.innerHTML = '<p style="color:var(--text3);padding:20px 0">No candidates registered yet.</p>';
      return;
    }

    container.innerHTML = '';
    for (let i = 1; i <= total; i++) {
      const c = await contract.getCandidateById(i);
      // c[10] = isApproved
      if (!c[10]) continue; // Skip unapproved

      const card = document.createElement('div');
      card.className = 'candidate-card';
      card.innerHTML = `
        <div class="cc-id">CANDIDATE #${c[0].toString()}</div>
        <div class="cc-name">${escHtml(c[1])}</div>
        <div class="cc-party">${escHtml(c[8])}</div>
        <div class="cc-constituency">${escHtml(c[7])}</div>
        <div class="cc-votes">${c[11].toString()}</div>
        <div class="cc-votes-label">VOTES</div>
      `;
      card.onclick = () => selectCandidate(i, c[1], card);
      container.appendChild(card);
    }

    if (container.children.length === 0)
      container.innerHTML = '<p style="color:var(--text3);padding:20px 0">No approved candidates yet.</p>';

  } catch (err) {
    container.innerHTML = `<p style="color:var(--red)">Error: ${parseContractError(err)}</p>`;
  }
}

function selectCandidate(id, name, cardEl) {
  document.querySelectorAll('.candidate-card').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
  selectedCandidateId = id;
  document.getElementById('selectedName').textContent = name;
  document.getElementById('selectedInfo').style.display = 'block';
}

// ─────────────────────────────────────────────────────────
//  CAST VOTE
// ─────────────────────────────────────────────────────────

async function castVote() {
  if (!guardConnected()) return;

  const cnic = document.getElementById('vote-cnic').value.trim();
  if (!cnic || cnic.length !== 13 || !/^\d+$/.test(cnic))
    return showTxStatus('vote-tx', 'error', '✗ Enter a valid 13-digit CNIC.');
  if (!selectedCandidateId)
    return showTxStatus('vote-tx', 'error', '✗ Please select a candidate first.');

  // Confirm irreversibility
  const confirmed = window.confirm(
    `⚠ FINAL CONFIRMATION\n\nYou are about to cast your vote for Candidate #${selectedCandidateId}.\n\nThis action is IRREVERSIBLE and permanently recorded on the blockchain.\n\nProceed?`
  );
  if (!confirmed) return;

  showTxStatus('vote-tx', 'pending', '⏳ Check MetaMask to confirm vote transaction…');
  showLoader('Casting vote on Ethereum…');

  try {
    const tx = await contract.castVote(cnic, selectedCandidateId);
    showTxStatus('vote-tx', 'pending', `⏳ TX: ${tx.hash.slice(0,18)}… Confirming on blockchain.`);
    await tx.wait();
    hideLoader();
    showTxStatus('vote-tx', 'success',
      `✓ VOTE CAST SUCCESSFULLY!\nTX: ${tx.hash}\n\nYour vote is permanently recorded on Ethereum.`);
    showToast('Vote cast! Blockchain confirmed.', 'success');
    refreshStats();
    loadResults();
  } catch (err) {
    hideLoader();
    showTxStatus('vote-tx', 'error', `✗ ${parseContractError(err)}`);
  }
}

// ─────────────────────────────────────────────────────────
//  RESULTS
// ─────────────────────────────────────────────────────────

async function loadResults() {
  if (!guardConnected()) return;

  const container = document.getElementById('results-container');
  container.innerHTML = '<p style="color:var(--text2);padding:20px 0">Fetching results from blockchain…</p>';

  try {
    const count = await contract.getCandidateCount();
    const total = count.toNumber();
    if (total === 0) {
      container.innerHTML = '<p style="color:var(--text3)">No candidates registered yet.</p>';
      return;
    }

    const candidates = [];
    for (let i = 1; i <= total; i++) {
      const c = await contract.getCandidateById(i);
      candidates.push({
        id:           c[0].toNumber(),
        name:         c[1],
        province:     c[5],
        constituency: c[7],
        party:        c[8],
        isApproved:   c[10],
        votes:        c[11].toNumber(),
      });
    }

    // Sort by votes descending
    candidates.sort((a, b) => b.votes - a.votes);
    const maxVotes = candidates[0]?.votes || 1;

    const rankLabels = ['1st', '2nd', '3rd'];
    const rankClasses = ['first', 'second', 'third'];

    container.innerHTML = '';
    candidates.forEach((c, i) => {
      const div = document.createElement('div');
      div.className = 'result-item';
      const pct = maxVotes > 0 ? Math.round((c.votes / maxVotes) * 100) : 0;
      div.innerHTML = `
        <div class="ri-rank ${rankClasses[i] || ''}">${rankLabels[i] || `#${i+1}`}</div>
        <div class="ri-info">
          <div class="ri-name">${escHtml(c.name)}</div>
          <div class="ri-meta">${escHtml(c.party)} · ${escHtml(c.constituency)}</div>
        </div>
        <div class="ri-bar-wrap">
          <div class="ri-bar-bg"><div class="ri-bar" style="width:${pct}%"></div></div>
        </div>
        <div class="ri-votes">${c.votes}</div>
      `;
      container.appendChild(div);
    });

  } catch (err) {
    container.innerHTML = `<p style="color:var(--red)">Error: ${parseContractError(err)}</p>`;
  }
}

// ─────────────────────────────────────────────────────────
//  ADMIN FUNCTIONS
// ─────────────────────────────────────────────────────────

async function createElection() {
  if (!guardConnected()) return;
  const name     = document.getElementById('a-name').value.trim();
  const hours    = parseInt(document.getElementById('a-duration').value);
  if (!name || !hours) return showTxStatus('admin-tx', 'error', '✗ Fill in election name and duration.');
  const seconds  = hours * 3600;
  showLoader('Creating election on blockchain…');
  try {
    const tx = await contract.createElection(name, seconds);
    await tx.wait();
    hideLoader();
    showTxStatus('admin-tx', 'success', `✓ Election "${name}" created! Duration: ${hours} hrs.\nTX: ${tx.hash}`);
    refreshStats();
  } catch (err) {
    hideLoader();
    showTxStatus('admin-tx', 'error', `✗ ${parseContractError(err)}`);
  }
}

async function approveCandidate() {
  if (!guardConnected()) return;
  const id = parseInt(document.getElementById('a-candidate-id').value);
  if (!id) return showTxStatus('admin-tx', 'error', '✗ Enter a candidate ID.');
  showLoader(`Approving Candidate #${id}…`);
  try {
    const tx = await contract.approveCandidate(id);
    await tx.wait();
    hideLoader();
    showTxStatus('admin-tx', 'success', `✓ Candidate #${id} approved!\nTX: ${tx.hash}`);
  } catch (err) {
    hideLoader();
    showTxStatus('admin-tx', 'error', `✗ ${parseContractError(err)}`);
  }
}

async function endElection() {
  if (!guardConnected()) return;
  if (!confirm('End the election? This is irreversible.')) return;
  showLoader('Ending election…');
  try {
    const tx = await contract.endElection();
    await tx.wait();
    hideLoader();
    showTxStatus('admin-tx', 'success', `✓ Election ended.\nTX: ${tx.hash}`);
  } catch (err) {
    hideLoader();
    showTxStatus('admin-tx', 'error', `✗ ${parseContractError(err)}`);
  }
}

// ─────────────────────────────────────────────────────────
//  STATS REFRESH
// ─────────────────────────────────────────────────────────

async function refreshStats() {
  if (!contract) return;
  try {
    const [voters, candidates, elec] = await Promise.all([
      contract.getVoterCount(),
      contract.getCandidateCount(),
      contract.getElectionInfo(),
    ]);
    animateCount('statVoters',     voters.toNumber());
    animateCount('statCandidates', candidates.toNumber());
    animateCount('statVotes',      elec[4].toNumber());
  } catch (_) {}
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = parseInt(el.textContent) || 0;
  const diff  = target - start;
  if (diff === 0) { el.textContent = target; return; }
  const steps = 24;
  let step = 0;
  const iv = setInterval(() => {
    step++;
    el.textContent = Math.round(start + (diff * step / steps));
    if (step >= steps) { clearInterval(iv); el.textContent = target; }
  }, 16);
}

// ─────────────────────────────────────────────────────────
//  UI HELPERS
// ─────────────────────────────────────────────────────────

function showTxStatus(id, type, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `tx-status ${type}`;
  el.textContent = msg;
}

function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3200);
}

function showLoader(text = 'Processing…') {
  document.getElementById('loaderText').textContent = text;
  document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoader() {
  document.getElementById('loadingOverlay').classList.remove('active');
}

function guardConnected() {
  if (!isConnected) {
    showToast('Please connect your MetaMask wallet first.', 'error');
    return false;
  }
  return true;
}

function parseContractError(err) {
  if (err.reason) return err.reason;
  if (err.data?.message) return err.data.message;
  if (err.message) {
    const match = err.message.match(/reason="([^"]+)"/);
    if (match) return match[1];
    return err.message.slice(0, 120);
  }
  return 'Transaction failed';
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ─────────────────────────────────────────────────────────
//  ANIMATED BACKGROUND CANVAS
// ─────────────────────────────────────────────────────────

function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: 55 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.4 + .3,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18,
      a:  Math.random(),
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Subtle crescent pattern in background
    const cx = W * .72, cy = H * .28, rad = Math.min(W,H) * .22;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(200,168,75,0.04)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + rad * .3, cy - rad * .05, rad * .82, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(6,13,10,0.06)';
    ctx.fill();

    // Particles & connections
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(26,158,110,${p.a * .6})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(26,158,110,${.07 * (1 - d/140)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

// ─────────────────────────────────────────────────────────
//  HERO ENTRANCE ANIMATION
// ─────────────────────────────────────────────────────────

function animateHeroEntry() {
  const els = [
    '.hero-eyebrow', '.ht-line1', '.ht-line2', '.ht-line3',
    '.hero-sub', '.hero-ctas', '.hero-stats'
  ];
  els.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity .6s ease ${i * .12}s, transform .6s ease ${i * .12}s`;
    setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'none'; }, 80);
  });
}