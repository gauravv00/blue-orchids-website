/**
 * Admin Dashboard — Client-side logic
 * Fetches bookings, renders table, handles status updates and deletion
 */
(function () {
  'use strict';

  const API_URL = 'https://blue-orchids-website-production.up.railway.app/api/bookings';
  const tableBody = document.getElementById('bookings-table-body');
  const searchInput = document.getElementById('admin-search');
  const filterSelect = document.getElementById('admin-filter');
  const refreshBtn = document.getElementById('admin-refresh');

  // Stats elements
  const statTotal = document.getElementById('stat-total');
  const statToday = document.getElementById('stat-today');
  const statPending = document.getElementById('stat-pending');
  const statConfirmed = document.getElementById('stat-confirmed');
  const statPaid = document.getElementById('stat-paid');

  let allBookings = [];

  // ── Init ─────────────────────────────────────────────────────
  loadBookings();
  loadStats();

  if (refreshBtn) refreshBtn.addEventListener('click', () => { loadBookings(); loadStats(); });
  if (searchInput) searchInput.addEventListener('input', renderTable);
  if (filterSelect) filterSelect.addEventListener('change', renderTable);

  // ── Fetch bookings ───────────────────────────────────────────
  async function loadBookings() {
    try {
      tableBody.innerHTML = '<tr><td colspan="11" class="admin-loading">Loading bookings...</td></tr>';
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.success) {
        allBookings = json.data;
        renderTable();
      }
    } catch (err) {
      tableBody.innerHTML = '<tr><td colspan="11" class="admin-error">Failed to load bookings. Is the server running?</td></tr>';
    }
  }

  // ── Fetch stats ──────────────────────────────────────────────
  async function loadStats() {
    try {
      const res = await fetch(API_URL + '/stats');
      const json = await res.json();
      if (json.success) {
        if (statTotal) statTotal.textContent = json.data.total;
        if (statToday) statToday.textContent = json.data.todayCount;
        if (statPending) statPending.textContent = json.data.pending;
        if (statConfirmed) statConfirmed.textContent = json.data.confirmed;
        if (statPaid) statPaid.textContent = json.data.paid || 0;
      }
    } catch (e) { /* silent */ }
  }

  // ── Render table ─────────────────────────────────────────────
  function renderTable() {
    const search = searchInput ? searchInput.value.toLowerCase() : '';
    const filter = filterSelect ? filterSelect.value : '';

    let filtered = allBookings;

    if (filter) {
      filtered = filtered.filter(b => b.status === filter);
    }

    if (search) {
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(search) ||
        b.email.toLowerCase().includes(search) ||
        b.phone.includes(search)
      );
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="11" class="admin-empty">No bookings found</td></tr>';
      return;
    }

    tableBody.innerHTML = filtered.map((b, index) => `
      <tr>
        <td><strong>#${filtered.length - index}</strong></td>
        <td>${escapeHtml(b.name)}</td>
        <td><a href="mailto:${escapeHtml(b.email)}">${escapeHtml(b.email)}</a></td>
        <td><a href="tel:${escapeHtml(b.phone)}">${escapeHtml(b.phone)}</a></td>
        <td>${formatDate(b.date)}</td>
        <td>${escapeHtml(b.time)}</td>
        <td>${b.guests}</td>
        <td style="max-width:150px;font-size:.78rem;color:var(--muted);">${b.special_requests ? escapeHtml(b.special_requests) : '<span style="opacity:.3">—</span>'}</td>
        <td><span class="status-badge status-${b.status}">${b.status}</span></td>
        <td><span class="status-badge status-pay-${b.payment_status || 'unpaid'}">${(b.payment_status || 'unpaid').toUpperCase()}${b.payment_method ? ' · ' + b.payment_method : ''}</span></td>
        <td class="admin-actions">
          ${b.status === 'pending' ? `<button class="admin-btn confirm-btn" onclick="updateStatus(${b.id},'confirmed')">✓ Confirm</button>` : ''}
          ${b.status !== 'cancelled' ? `<button class="admin-btn cancel-btn" onclick="updateStatus(${b.id},'cancelled')">✕ Cancel</button>` : ''}
          <button class="admin-btn delete-btn" onclick="deleteBooking(${b.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  // ── Update status ────────────────────────────────────────────
  window.updateStatus = async function (id, status) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (json.success) {
        loadBookings();
        loadStats();
      } else {
        alert(json.message || 'Failed to update');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // ── Delete booking ───────────────────────────────────────────
  window.deleteBooking = async function (id) {
    // Use a simple confirmation
    var yes = window.confirm('Delete booking #' + id + '? This cannot be undone.');
    if (!yes) return;
    try {
      const res = await fetch(API_URL + '/' + id, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        loadBookings();
        loadStats();
      } else {
        alert(json.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  // ── Delete all bookings ────────────────────────────────────────
  const deleteAllBtn = document.getElementById('admin-delete-all');
  if (deleteAllBtn) {
    deleteAllBtn.addEventListener('click', async () => {
      const pw = prompt('Enter admin password to delete ALL bookings:');
      if (!pw) return;

      const yes = confirm('⚠️ This will permanently delete ALL bookings. Are you sure?');
      if (!yes) return;

      try {
        const res = await fetch(API_URL + '/all', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pw })
        });
        const json = await res.json();
        if (json.success) {
          alert('✅ All bookings deleted successfully.');
          loadBookings();
          loadStats();
        } else {
          alert('❌ ' + (json.message || 'Failed to delete'));
        }
      } catch (err) {
        alert('Network error: ' + err.message);
      }
    });
  }

  // ── Helpers ──────────────────────────────────────────────────
  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
