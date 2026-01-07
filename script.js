// script.js - Updated 2026 NFL Draft Big Board Fetcher with ALL sources from spreadsheet

// CORS proxies (rotate to avoid blocks)
const proxies = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://crossorigin.me/'
];

// All sources from your spreadsheet (URLs as of Jan 6, 2026 - update if changed)
const sources = [
  { name: 'PFF', url: 'https://www.pff.com/news/draft-2026-nfl-draft-big-board' },
  { name: 'Draft Scout', url: 'https://www.nfldraftscout.com/rankings/big-board/2026' },
  { name: 'Pro Football Network', url: 'https://www.profootballnetwork.com/2026-nfl-draft-big-board' },
  { name: 'Mel Kiper', url: 'https://www.espn.com/nfl/draft2026/story/_/id/46573669/2026-nfl-draft-rankings-mel-kiper-big-board-top-prospects-players-positions' },
  { name: 'Daniel Jeremiah', url: 'https://www.nfl.com/news/daniel-jeremiah-2026-nfl-draft-big-board-top-50-prospects' },
  { name: 'NFL Draft Buzz', url: 'https://www.nfldraftbuzz.com/2026-nfl-draft-big-board' },
  { name: 'Walter Camp Football', url: 'https://waltercamp.org/2026-nfl-draft-big-board' },
  { name: 'ESPN', url: 'https://www.espn.com/nfl/draft2026' }, // general page; may need specific board link
  { name: 'CBS', url: 'https://www.cbssports.com/nfl/draft/news/renners-2026-nfl-draft-big-board-top-150-prospects/' },
  { name: 'Fantasy Pros', url: 'https://www.fantasypros.com/nfl/draft/big-board.php?year=2026' },
  { name: 'Dan Brugler', url: 'https://theathletic.com/nfl/draft/2026-nfl-draft-big-board' }, // The Athletic link
  { name: 'USA Today', url: 'https://www.usatoday.com/story/sports/nfl/draft/2026/01/01/nfl-draft-2026-big-board/' },
  { name: 'Sporting News', url: 'https://www.sportingnews.com/us/nfl/news/2026-nfl-mock-draft-big-board-top-prospects/1j8k9p0zq0q0q0q0q0q0q0' }
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
    let success = false;
    for (const proxy of proxies) {
      try {
        console.log(`Fetching ${source.name} via ${proxy}`);
        const response = await fetch(proxy + encodeURIComponent(source.url));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Expanded selectors - tries multiple common patterns
        let rows = doc.querySelectorAll('table tr, .player-row, li.player, .prospect, .big-board-item, .player-card, div[class*="player"], div[class*="prospect"], .ranking-item');
        if (rows.length === 0) {
          rows = doc.querySelectorAll('li, div, p'); // very broad fallback
        }

        rows.forEach(row => {
          const text = row.textContent.trim();
          if (!text || text.includes('Rank') || text.includes('Player') || text.includes('Position') || text.length < 15) return;

          // Flexible parsing for various formats
          const match = text.match(/(\d{1,3}(?:\.\d)?\.?\s*)([\w\s\.\-']+?)\s*(EDGE|QB|CB|S|OT|WR|RB|LB|DT|TE|OL|DL|DE|ILB|OLB|SAF|K|P|SAFETY|CORNER|GUARD|TACKLE|CENTER)\s*(.+)/i);
          if (match) {
            const rankStr = match[1].trim().replace(/[\.\s]/g, '');
            const rank = parseFloat(rankStr) || null;
            const name = match[2].trim();
            const pos = match[3].toUpperCase();
            let school = match[4].trim();
            school = school.split('(')[0].split('-')[0].split(/vs|at|vs\./i)[0].trim(); // clean up

            allPlayers.push({ source: source.name, rank, name, pos, school });
            success = true;
          }
        });

        if (success && rows.length > 5) break; // good data, skip other proxies

      } catch (err) {
        console.warn(`Failed ${source.name} via ${proxy}:`, err);
      }
    }
  }

  // Aggregate by player (case-insensitive key)
  const playerMap = {};
  allPlayers.forEach(p => {
    if (!p.name || !p.rank) return;
    const key = p.name.toLowerCase().replace(/\s+/g, '-');
    if (!playerMap[key]) {
      playerMap[key] = { name: p.name, pos: p.pos, school: p.school, ranks: [] };
    }
    playerMap[key].ranks.push({ source: p.source, rank: p.rank });
  });

  const aggregated = Object.values(playerMap).map(p => {
    const ranks = p.ranks.map(r => r.rank).filter(r => r !== null);
    const avg = ranks.length ? (ranks.reduce((a, b) => a + b, 0) / ranks.length).toFixed(1) : 'N/A';
    return { ...p, avgRank: avg, ranks: p.ranks };
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
      ${sources.map(src => {
        const r = p.ranks.find(r => r.source === src.name);
        return `<td>${r ? r.rank : 'N/A'}</td>`;
      }).join('')}
    `;
    tbody.appendChild(tr);
  });

  loading.style.display = 'none';
  if (aggregated.length > 0) {
    table.style.display = 'table';
    document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleString()} (from ${sources.length} sources)`;
  } else {
    errorDiv.textContent = 'No data could be loaded. Sites may block requests, use anti-bot protection, or have changed layout. Open browser console (F12) for details. Try again later.';
    errorDiv.style.display = 'block';
  }
}

// Load on page open
window.onload = fetchData;
