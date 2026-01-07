// script.js - Single-source debug version (PFF only)

const proxy = 'https://api.allorigins.win/raw?url=';
const testUrl = 'https://www.pff.com/news/draft-2026-nfl-draft-big-board';

async function fetchData() {
  const loading = document.getElementById('loading');
  const errorDiv = document.getElementById('error');
  const table = document.getElementById('draftTable');
  const tbody = document.getElementById('tableBody');

  loading.textContent = 'Testing PFF only... (this may take 5-10 seconds)';
  loading.style.display = 'block';
  errorDiv.style.display = 'none';
  table.style.display = 'none';
  tbody.innerHTML = '';

  try {
    const fullUrl = proxy + encodeURIComponent(testUrl);
    console.log('Attempting fetch from:', fullUrl);

    const response = await fetch(fullUrl);
    console.log('Fetch status:', response.status);

    if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);

    const html = await response.text();
    console.log('Received HTML length:', html.length);

    if (html.length < 500) throw new Error('HTML too short – likely blocked or empty');

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Aggressive selector search
    let rows = doc.querySelectorAll('tr, .player-row, li, div[class*="player"], div[class*="prospect"], .ranking, .big-board, .draft-board-item');
    console.log('Found potential rows/elements:', rows.length);

    let parsedCount = 0;
    rows.forEach(row => {
      const text = row.textContent.trim().replace(/\s+/g, ' ');
      if (text.length < 20) return;

      // Very flexible match
      const match = text.match(/(\d{1,3}(?:\.\d)?\.?\s*)([\w\s\.\-']+?)\s*(EDGE|DE|QB|CB|S|OT|WR|RB|LB|DT|TE|OL|DL|ILB|OLB|SAF|K|P)\s*(.+)/i);
      if (match) {
        const rank = parseInt(match[1].trim().replace(/[\.\s]/g, '')) || 'N/A';
        const name = match[2].trim();
        const pos = match[3].toUpperCase();
        let school = match[4].trim();
        school = school.replace(/\(.*?\)/g, '').replace(/vs\.?|at\s/gi, '').trim();

        if (name && pos && rank !== 'N/A') {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${rank}</td>
            <td>${name}</td>
            <td>${pos}</td>
            <td>${school || 'N/A'}</td>
            <td><strong>${rank}</strong></td>
            <td>${rank}</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>N/A</td>
          `;
          tbody.appendChild(tr);
          parsedCount++;
        }
      }
    });

    console.log(`Successfully parsed ${parsedCount} players from PFF`);

    loading.style.display = 'none';
    if (parsedCount > 0) {
      table.style.display = 'table';
      document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleString()} – PFF test successful!`;
    } else {
      errorDiv.textContent = 'No players found on PFF page. Likely blocked or page structure changed. Mock data shown.';
      errorDiv.style.display = 'block';
      showMockData(tbody);
    }

  } catch (err) {
    console.error('Error during fetch/parse:', err);
    loading.style.display = 'none';
    errorDiv.textContent = 'Test failed: ' + err.message + ' – PFF may be blocking the request. Mock data shown.';
    errorDiv.style.display = 'block';
    showMockData(tbody);
  }
}

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
  document.getElementById('draftTable').style.display = 'table';
}

window.onload = fetchData;
