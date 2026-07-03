// admin.js — Gujarat Bus Seva Command Center
// ═══════════════════════════════════════════
const BASE = typeof API_BASE !== 'undefined' ? API_BASE : 'http://localhost:8000';

let allBookings = [];
let filteredBookings = [];
const PAGE_SIZE = 15;
let currentPage = 1;
let toastTimer;

// DOM Elements
const appEl = document.getElementById('app');
const loginOverlay = document.getElementById('loginOverlay');
const loginError = document.getElementById('loginError');

// Charts
let revenueChart = null;
let routeChart = null;

function doLogin() {
  const u = document.getElementById('adminUser').value.trim();
  const p = document.getElementById('adminPass').value;
  if (u === 'admin' && p === 'admin123') {
    loginError.style.display = 'none';
    loginOverlay.style.transition = 'opacity 400ms';
    loginOverlay.style.opacity = '0';
    setTimeout(() => {
      loginOverlay.style.display = 'none';
      appEl.style.display = 'flex';
      init();
    }, 420);
  } else {
    loginError.style.display = 'block';
    document.getElementById('adminPass').value = '';
    document.getElementById('adminPass').focus();
  }
}

function doLogout() {
  appEl.style.display = 'none';
  loginOverlay.style.display = 'flex';
  loginOverlay.style.opacity = '1';
  document.getElementById('adminUser').value = '';
  document.getElementById('adminPass').value = '';
  loginError.style.display = 'none';
}

const pages = {
  dashboard: { title: 'Dashboard', sub: 'Overview of all bookings and revenue' },
  bookings: { title: 'Bookings', sub: 'All confirmed bookings' },
  analytics: { title: 'Analytics', sub: 'Revenue and route performance' }
};

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item[id]').forEach(n => n.classList.remove('active'));
  
  const sectionEl = document.getElementById('section-' + id);
  if (sectionEl) sectionEl.classList.add('active');
  
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');
  
  document.getElementById('pageTitle').textContent = pages[id]?.title || id;
  document.getElementById('pageSubtitle').textContent = pages[id]?.sub || '';
  
  if (id === 'dashboard') loadDashboard();
  if (id === 'bookings') loadBookings();
  if (id === 'analytics') loadAnalytics();
}

function refreshCurrent() {
  const a = document.querySelector('.section.active');
  if (!a) return;
  const id = a.id.replace('section-', '');
  if (id === 'dashboard') loadDashboard();
  else if (id === 'bookings') loadBookings();
  else if (id === 'analytics') loadAnalytics();
}

function toast(msg, type = 'success') {
  const t = document.getElementById('toast');
  const icon = type === 'success' ? '✅' : '🔴';
  t.innerHTML = `<span style="font-size:16px;">${icon}</span><span>${msg}</span>`;
  t.className = 'show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.className = '', 3500);
}

async function fetchBookings() {
  try {
    const res = await fetch(`${BASE}/api/bookings`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    allBookings = await res.json();
    // Sort descending by date
    allBookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return allBookings;
  } catch (e) {
    toast('Failed to load: ' + e.message, 'error');
    return [];
  }
}

async function loadDashboard() {
  const data = await fetchBookings();
  const total = data.length;
  const revenue = data.reduce((s, b) => s + parseAmount(b.amount), 0);
  const seats = data.reduce((s, b) => s + (b.seats ? b.seats.split(',').length : 0), 0);
  const routes = new Set(data.map(b => `${b.source}-${b.destination}`)).size;
  
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-revenue').textContent = 'Rs. ' + revenue.toLocaleString('en-IN');
  document.getElementById('stat-seats').textContent = seats;
  document.getElementById('stat-routes').textContent = routes;
  
  const recent = data.slice(0, 8);
  const recentBody = document.getElementById('recentBody');
  if (recent.length) {
    recentBody.innerHTML = recent.map(b => `
      <tr>
        <td><span class="pnr-code">${esc(b.pnr)}</span></td>
        <td class="font-bold">${esc(b.passenger_name)}</td>
        <td class="text-muted">${esc(b.source)} → ${esc(b.destination)}</td>
        <td>${fmtDate(b.journey_date)}</td>
        <td class="text-green font-bold">${esc(b.amount)}</td>
        <td><span class="badge badge-green">✓ Confirmed</span></td>
      </tr>
    `).join('');
  } else {
    recentBody.innerHTML = `<tr class="loading-row"><td colspan="6">No bookings yet.</td></tr>`;
  }
  
  // Render Dashboard Charts
  renderDashboardCharts(data);
}

function renderDashboardCharts(data) {
  const revByDate = {};
  data.forEach(b => {
    const date = (b.created_at || '').substring(0, 10);
    if (!date) return;
    revByDate[date] = (revByDate[date] || 0) + parseAmount(b.amount);
  });
  
  const sortedDates = Object.keys(revByDate).sort();
  const dates = sortedDates.slice(-7);
  const revenues = dates.map(d => revByDate[d]);
  
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;
  if (revenueChart) revenueChart.destroy();
  
  // Gradient fill — website red
  const chartCtx = ctx.getContext('2d');
  const gradient = chartCtx.createLinearGradient(0, 0, 0, 280);
  gradient.addColorStop(0, 'rgba(191, 31, 47, 0.18)');
  gradient.addColorStop(1, 'rgba(191, 31, 47, 0.0)');

  revenueChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates.map(d => fmtDate(d)),
      datasets: [{
        label: 'Revenue (₹)',
        data: revenues,
        borderColor: '#bf1f2f',
        backgroundColor: gradient,
        borderWidth: 2.5,
        pointBackgroundColor: '#bf1f2f',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.45
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#141821',
          bodyColor: '#bf1f2f',
          borderColor: '#e6e9ee',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => ' ₹ ' + ctx.parsed.y.toLocaleString('en-IN')
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(230,233,238,0.7)', drawBorder: false },
          ticks: { color: '#667085', font: { family: 'Inter', size: 11 } }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#667085', font: { family: 'Inter', size: 11 } }
        }
      }
    }
  });
}

async function loadBookings() {
  document.getElementById('bookingsBody').innerHTML = `<tr class="loading-row"><td colspan="11"><div class="spinner"></div>Loading…</td></tr>`;
  await fetchBookings();
  filterBookings();
}

function filterBookings() {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const d = document.getElementById('dateFilter')?.value || '';
  
  filteredBookings = allBookings.filter(b => {
    const mq = !q || [b.pnr, b.passenger_name, b.mobile, b.bus_name, b.source, b.destination].some(v => (v || '').toLowerCase().includes(q));
    const md = !d || (b.journey_date || '').startsWith(d);
    return mq && md;
  });
  
  currentPage = 1;
  renderBookingsTable();
}

function renderBookingsTable() {
  const total = filteredBookings.length;
  const start = (currentPage - 1) * PAGE_SIZE;
  const page = filteredBookings.slice(start, start + PAGE_SIZE);
  
  document.getElementById('bookingCount').textContent = `(${total})`;
  document.getElementById('footerInfo').textContent = total ? `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, total)} of ${total}` : 'No bookings';
  
  if (!page.length) {
    document.getElementById('bookingsBody').innerHTML = `<tr class="loading-row"><td colspan="11">No bookings found.</td></tr>`;
    document.getElementById('pagination').innerHTML = '';
    return;
  }
  
  document.getElementById('bookingsBody').innerHTML = page.map((b, i) => `
    <tr>
      <td class="text-muted font-mono" style="font-size:0.78rem;">${start + i + 1}</td>
      <td><span class="pnr-code">${esc(b.pnr)}</span></td>
      <td class="font-bold">${esc(b.passenger_name)}</td>
      <td class="font-mono text-muted" style="font-size:0.82rem;">${esc(b.mobile)}</td>
      <td class="text-muted" style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(b.bus_name)}</td>
      <td>${esc(b.source)} → ${esc(b.destination)}</td>
      <td>${fmtDate(b.journey_date)}</td>
      <td><span class="badge badge-blue">${esc(b.seats)}</span></td>
      <td class="text-green font-bold">${esc(b.amount)}</td>
      <td class="text-muted font-mono" style="font-size:0.78rem;">${fmtDateTime(b.created_at)}</td>
      <td><button class="action-btn action-delete" onclick="openDeleteModal('${esc(b.pnr)}')">🗑 Delete</button></td>
    </tr>
  `).join('');
  
  const pagesCount = Math.ceil(total / PAGE_SIZE);
  let ph = '';
  // Simple pagination view
  const maxPages = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(pagesCount, startPage + maxPages - 1);
  if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
  }
  
  if (startPage > 1) ph += `<button class="page-btn" onclick="goPage(1)">1</button>...`;
  
  for (let i = startPage; i <= endPage; i++) {
    ph += `<button class="page-btn${i === currentPage ? ' active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  
  if (endPage < pagesCount) ph += `...<button class="page-btn" onclick="goPage(${pagesCount})">${pagesCount}</button>`;
  
  document.getElementById('pagination').innerHTML = ph;
}

function goPage(p) {
  currentPage = p;
  renderBookingsTable();
}

let deletePnr = null;

function openDeleteModal(pnr) {
  deletePnr = pnr;
  document.getElementById('deletePnrLabel').textContent = pnr;
  document.getElementById('deleteModal').classList.add('open');
}

function closeDeleteModal() {
  deletePnr = null;
  document.getElementById('deleteModal').classList.remove('open');
}

async function confirmDelete() {
  if (!deletePnr) return;
  try {
    const res = await fetch(`${BASE}/api/bookings/${deletePnr}`, { method: 'DELETE' });
    if (res.ok || res.status === 404) {
      allBookings = allBookings.filter(b => b.pnr !== deletePnr);
      filterBookings();
      toast(`Booking ${deletePnr} deleted.`);
      loadDashboard(); // Refresh stats in background
    } else {
      toast('Delete failed: ' + res.status, 'error');
    }
  } catch (e) {
    toast('Error: ' + e.message, 'error');
  }
  closeDeleteModal();
}

document.getElementById('deleteModal').addEventListener('click', e => {
  if (e.target === document.getElementById('deleteModal')) closeDeleteModal();
});

async function loadAnalytics() {
  document.getElementById('analyticsBody').innerHTML = `<tr class="loading-row"><td colspan="6"><div class="spinner"></div>Loading…</td></tr>`;
  const data = await fetchBookings();
  
  if (!data.length) {
    ['ana-today', 'ana-route', 'ana-avg', 'ana-bus'].forEach(id => document.getElementById(id).textContent = '0');
    document.getElementById('analyticsBody').innerHTML = `<tr class="loading-row"><td colspan="6">No data yet.</td></tr>`;
    return;
  }
  
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = data.filter(b => (b.journey_date || '').startsWith(today)).length;
  
  const rm = {};
  data.forEach(b => {
    const k = `${b.source} → ${b.destination}`;
    if (!rm[k]) rm[k] = { count: 0, seats: 0, revenue: 0 };
    rm[k].count++;
    rm[k].seats += (b.seats || '').split(',').length;
    rm[k].revenue += parseAmount(b.amount);
  });
  
  const rs = Object.entries(rm).sort((a, b) => b[1].count - a[1].count);
  const topR = rs[0]?.[0] || '—';
  
  const totRev = data.reduce((s, b) => s + parseAmount(b.amount), 0);
  const avg = data.length ? Math.round(totRev / data.length) : 0;
  
  const bm = {};
  data.forEach(b => {
    bm[b.bus_name] = (bm[b.bus_name] || 0) + 1;
  });
  const topB = Object.entries(bm).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  
  document.getElementById('ana-today').textContent = todayCount;
  document.getElementById('ana-route').textContent = topR.length > 20 ? topR.slice(0, 20) + '…' : topR;
  document.getElementById('ana-avg').textContent = '\u20b9 ' + avg.toLocaleString('en-IN');
  document.getElementById('ana-bus').textContent = topB.length > 20 ? topB.slice(0, 20) + '…' : topB;
  
  const tot = data.length;
  document.getElementById('analyticsBody').innerHTML = rs.map(([r, info], i) => `
    <tr>
      <td class="text-muted font-mono" style="font-size:0.78rem;">${i + 1}</td>
      <td class="font-bold">${esc(r)}</td>
      <td><span class="badge badge-blue">${info.count}</span></td>
      <td class="font-mono">${info.seats}</td>
      <td class="text-green font-bold font-mono">₹ ${info.revenue.toLocaleString('en-IN')}</td>
      <td>
        <div class="progress-wrap">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${Math.round(info.count / tot * 100)}%;"></div>
          </div>
          <span class="progress-label">${Math.round(info.count / tot * 100)}%</span>
        </div>
      </td>
    </tr>
  `).join('');

  // Render Analytics Chart
  renderAnalyticsChart(rs.slice(0,5)); // Top 5 routes
}

function renderAnalyticsChart(topRoutes) {
  const ctx = document.getElementById('routeChart');
  if (!ctx) return;
  if (routeChart) routeChart.destroy();
  
  routeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: topRoutes.map(r => r[0]),
      datasets: [{
        data: topRoutes.map(r => r[1].count),
        backgroundColor: [
          '#bf1f2f', '#f59d1f', '#187a52', '#0f766e', '#667085'
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 8,
        hoverBorderColor: 'rgba(0,0,0,0.1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#667085',
            padding: 14,
            font: { family: 'Inter', size: 11 },
            boxWidth: 10,
            boxHeight: 10,
            borderRadius: 3
          }
        },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#141821',
          bodyColor: '#667085',
          borderColor: '#e6e9ee',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8
        }
      }
    }
  });
}

function exportCSV() {
  const data = filteredBookings.length ? filteredBookings : allBookings;
  if (!data.length) {
    toast('No data to export.', 'error');
    return;
  }
  const h = ['#', 'PNR', 'Passenger', 'Mobile', 'Email', 'Bus', 'Route', 'Journey Date', 'Seats', 'Amount', 'Booked At'];
  const rows = data.map((b, i) => [
    i + 1, b.pnr, b.passenger_name, b.mobile, b.email || '', b.bus_name,
    `${b.source} → ${b.destination}`, b.journey_date, b.seats, b.amount,
    b.created_at ? new Date(b.created_at).toLocaleString('en-IN') : ''
  ].map(v => `"${String(v || '').replace(/"/g, '""')}"`));
  
  const csv = [h.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast('CSV exported successfully!');
}

function esc(v) { return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function parseAmount(v) { if (!v) return 0; return parseInt(String(v).replace(/[^\d]/g, '')) || 0; }
function fmtDate(v) { if (!v) return '—'; try { return new Date(v).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'}); } catch { return v; } }
function fmtDateTime(v) { if (!v) return '—'; try { return new Date(v).toLocaleString('en-IN', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'}); } catch { return v; } }

function init() {
  loadDashboard();
}

// Add event listeners on load
document.addEventListener('DOMContentLoaded', () => {
    const pwInput = document.getElementById('adminPass');
    if (pwInput) pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
});
