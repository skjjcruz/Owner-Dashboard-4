// script.js - 2026 NFL Draft Tracker JavaScript

// Theme toggle (already in HTML, but keeping here for completeness)
function toggleTheme() {
  const body = document.body;
  const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// CORS proxy helper (use one of these; they rotate to avoid blocks)
const proxies = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://crossorigin.me/'
];

// Current sources (update URLs if they 404 or change - check in Jan 2026)
const sources = [
  { name: 'PFF', url: 'https://www.pff.com/news/draft-2026-nfl-draft-big-board' },
  { name: 'PFN', url: 'https://www.profootballnetwork.com/2026-nfl-draft-big-board' },
  { name: 'CBS', url: 'https://www.cbssports.com/nfl/draft/news/2026-nfl-draft-big-board-top-50-prospects/' },
  { name: 'Kiper', url: 'https://www.espn.com/nfl/draft2026/story/_/id/46573669/2026-nfl-draft-rankings-mel-kiper-big-board-top-prospects-players-positions' },
  // Add more as you find stable links (e.g., Daniel Jeremiah, Draft Scout)
];

// Main fetch function
async function fetchData() {
  const loading = document.getElementById('loading');
  const errorDiv = document.getElementById('error');
  const table = document.getElementById('draftTable');
  const tbody = document.getElementById('tableBody');

  loading.style.display = 'block';
  errorDiv.style.display = 'none';
  table.style.display = 'none';
  tbody.innerHTML = '';

  let allPlayers = [];

  for (const source of sources) {
    for (const proxy of proxies) {  // Try each proxy until one works
      try {
        console.log(`Trying ${source.name} via ${proxy}`);
        const response = await fetch(proxy + encodeURIComponent(source.url), {
          headers: { 'Accept': 'text/html' }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Site-specific parsing - adjust these selectors by inspecting each page
        let rows;
        if (source.name === 'PFF') {
          rows = doc.querySelectorAll('.player-row, tr'); // PFF often uses divs or tables
        } else if (source.name === 'PFN') {
          rows = doc.querySelectorAll('.big-board-item, li.player');
        } else if (source.name === 'CBS') {
          rows = doc.querySelectorAll('table tr, .prospect-item');
        } else {
          rows = doc.querySelectorAll('tr, li, .player'); // fallback
        }

        rows.forEach(row => {
          const text = row.textContent.trim();
          if (!text || text.includes('Rank') || text.includes('Player') || text.length < 10) return;

          // Simple regex parse - "1. Rueben Bain Jr. EDGE Miami (FL)"
          const match = text.match(/(\d+\.?\s*)([\w\s\.\-']+?)\s*(EDGE|QB|CB|S|OT|WR|RB|LB|DT|TE|OL|DL|DE|ILB|OLB|SAF|K|P)\s*(.+)/i);
          if (match) {
            const rank = parseInt(match[1].trim().replace('.', '')) || null;
            const name = match[2].trim();
            const pos = match[3].toUpperCase();
            const school = match[4].trim().split('(')[0].trim(); // remove conference if present
            allPlayers.push({ source: source.name, rank, name, pos, school });
          }
        });

        // If we got data, break to next source
        if (rows.length > 0) break;

      } catch (err) {
        console.warn(`Failed ${source.name} via ${proxy}:`, err);
      }
    }
  }

  // Aggregate by player name
  const playerMap = {};
  allPlayers.forEach(p => {
    if (!p.name || !p.rank) return;
    const key = p.name.toLowerCase();
    if (!playerMap[key]) {
      playerMap[key] = { name: p.name, pos: p.pos, school: p.school, ranks: [] };
    }
    playerMap[key].ranks.push(p.rank);
  });

  const aggregated = Object.values(playerMap).map(p => {
    const ranks = p.ranks.filter(r => r);
    const avg = ranks.length ? (ranks.reduce((a, b) => a + b, 0) / ranks.length).toFixed(1) : 'N/A';
    return { ...p, avgRank: avg };
  }).sort((a, b) => {
    const aVal = a.avgRank === 'N/A' ? Infinity : parseFloat(a.avgRank);
    const bVal = b.avgRank === 'N/A' ? Infinity : parseFloat(b.avgRank);
    return aVal - bVal;
  });

  // Render table
  aggregated.forEach((p, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.name}</td>
      <td>${p.pos || 'N/A'}</td>
      <td>${p.school || 'N/A'}</td>
      <td><strong>${p.avgRank}</strong></td>
      <td>${p.ranks.includes(source => source === 'PFF') ? p.ranks.find(r => r.source === 'PFF').rank : 'N/A'}</td>
      <td>${p.ranks.includes(source => source === 'PFN') ? p.ranks.find(r => r.source === 'PFN').rank : 'N/A'}</td>
      <td>${p.ranks.includes(source => source === 'CBS') ? p.ranks.find(r => r.source === 'CBS').rank : 'N/A'}</td>
      <td>N/A</td>
      <td>N/A</td>
    `;
    tbody.appendChild(tr);
  });

  loading.style.display = 'none';
  if (aggregated.length > 0) {
    table.style.display = 'table';
    document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleString()}`;
  } else {
    errorDiv.textContent = 'No data could be loaded. Sites may have blocked the request or changed layout. Try again later or check console.';
    errorDiv.style.display = 'block';
  }
}

// Load data when page opens
window.onload = fetchData;
