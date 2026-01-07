// script.js - Minimal test version for debugging (PFF only)

const proxy = 'https://api.allorigins.win/raw?url=';
const testSource = { name: 'PFF', url: 'https://www.pff.com/news/draft-2026-nfl-draft-big-board' };

async function fetchData() {
  const loading = document.getElementById('loading');
  const errorDiv = document.getElementById('error');
  const table = document.getElementById('draftTable');
  const tbody = document.getElementById('tableBody');

  loading.textContent = 'Testing PFF only...';
  loading.style.display = 'block';
  errorDiv.style.display = 'none';
  table.style.display = 'none';
  tbody.innerHTML = '';

  try {
    console.log(`Fetching PFF via ${proxy}`);
    const response = await fetch(proxy + encodeURIComponent(testSource.url));
    console.log('Response status:', response.status);

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const html = await response.text();
    console.log('HTML length:', html.length); // If 0 or very small, proxy failed

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Try to find any player-like content
    let rows = doc.querySelectorAll('table tr, .player-row, li, div[class*="player"], div[class*="prospect"], .ranking-item');
    console.log('Found potential rows:', rows.length);

    let parsed = 0;
    rows.forEach(row => {
      const text = row.textContent.trim().replace(/\s+/g, ' ');
      if (text.length < 20) return;

      const match = text.match(/(\d+\.?\s*)([\w\s\.\-']+?)\s*(EDGE|QB|CB|S|OT|WR|RB|LB|DT|TE|OL|DL|DE|ILB|OLB|SAF|K|P)\s*(.+)/i);
      if (match) {
        const rank = parseInt(match[1].trim().replace('.', '')) || 'N/A';
        const name = match[2].trim();
        const pos = match[3].toUpperCase();
        const school = match[4].trim().split('(')[0].trim();

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${rank}</td>
          <td>${name}</td>
          <td>${pos}</td>
          <td>${school}</td>
          <td><strong>${rank}</strong></td>
          <td>${rank}</td>
          <td>N/A</td>
          <td>N/A</td>
          <td>N/A</td>
          <td>N/A</td>
        `;
        tbody.appendChild(tr);
        parsed++;
      }
    });

    console.log(`Parsed ${parsed} players from PFF`);

    loading.style.display = 'none';
    if (parsed > 0) {
      table.style.display = 'table';
      document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleString()} (PFF test)`;
    } else {
      errorDiv.textContent = 'No players parsed from PFF. Check console for details. Showing mock data instead.';
      errorDiv.style.display = 'block';
      // Show mock data as fallback
      showMockData(tbody);
    }

  } catch (err) {
    console.error('Fetch error:', err);
    loading.style.display = 'none';
    errorDiv.textContent = 'Fetch failed: ' + err.message + '. PFF may be blocking the request. Mock data shown.';
    errorDiv.style.display = 'block';
    showMockData(tbody);
  }
}

// Fallback mock data function
function showMockData(tbody) {
  const mock = [
    { rank: 1, name: "Rueben Bain Jr.", pos: "EDGE", school: "Miami (FL)", avg: "4.8" },
    { rank: 2, name: "Caleb Downs", pos: "S", school: "Ohio State", avg: "5.5" },
    { rank: 3, name: "Fernando Mendoza", pos: "QB", school: "Indiana", avg: "3.75" }
  ];
  mock.forEach((p, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.name}</td>
      <td>${p.pos}</td>
      <td>${p.school}</td>
      <td><strong>${p.avg}</strong></td>
      <td>${p.avg.split('.')[0]}</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
    `;
    tbody.appendChild(tr);
  });
  table.style.display = 'table';
}

// Load on open
window.onload = fetchData;
