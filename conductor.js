/* =============================================
   CONDUCTOR PORTAL — JavaScript
   Gujarat Bus Seva
   ============================================= */

// ── Dynamic bus + route combinations matching script.js
const gujaratCities = [
  { name: "Ahmedabad", lat: 23.03, lng: 72.58 },
  { name: "Gandhinagar", lat: 23.22, lng: 72.64 },
  { name: "Surat", lat: 21.17, lng: 72.83 },
  { name: "Vadodara", lat: 22.31, lng: 73.18 },
  { name: "Rajkot", lat: 22.30, lng: 70.80 },
  { name: "Bhavnagar", lat: 21.76, lng: 72.15 },
  { name: "Jamnagar", lat: 22.47, lng: 70.07 },
  { name: "Junagadh", lat: 21.52, lng: 70.46 },
  { name: "Anand", lat: 22.56, lng: 72.95 },
  { name: "Nadiad", lat: 22.69, lng: 72.86 },
  { name: "Bharuch", lat: 21.71, lng: 72.99 },
  { name: "Ankleshwar", lat: 21.63, lng: 73.00 },
  { name: "Navsari", lat: 20.95, lng: 72.93 },
  { name: "Valsad", lat: 20.61, lng: 72.93 },
  { name: "Vapi", lat: 20.37, lng: 72.91 },
  { name: "Mehsana", lat: 23.59, lng: 72.37 },
  { name: "Patan", lat: 23.85, lng: 72.13 },
  { name: "Palanpur", lat: 24.17, lng: 72.43 },
  { name: "Deesa", lat: 24.26, lng: 72.18 },
  { name: "Himmatnagar", lat: 23.60, lng: 72.96 },
  { name: "Modasa", lat: 23.47, lng: 73.30 },
  { name: "Godhra", lat: 22.78, lng: 73.61 },
  { name: "Dahod", lat: 22.84, lng: 74.26 },
  { name: "Bhuj", lat: 23.24, lng: 69.67 },
  { name: "Gandhidham", lat: 23.08, lng: 70.13 },
  { name: "Mandvi", lat: 22.83, lng: 69.36 },
  { name: "Morbi", lat: 22.82, lng: 70.83 },
  { name: "Surendranagar", lat: 22.73, lng: 71.64 },
  { name: "Botad", lat: 22.17, lng: 71.66 },
  { name: "Amreli", lat: 21.60, lng: 71.22 },
  { name: "Porbandar", lat: 21.64, lng: 69.61 },
  { name: "Dwarka", lat: 22.24, lng: 68.97 },
  { name: "Somnath", lat: 20.89, lng: 70.40 },
  { name: "Veraval", lat: 20.91, lng: 70.37 },
  { name: "Palitana", lat: 21.52, lng: 71.83 },
  { name: "Sanand", lat: 22.99, lng: 72.38 },
  { name: "Kalol", lat: 23.25, lng: 72.50 },
  { name: "Unjha", lat: 23.80, lng: 72.39 },
  { name: "Rajpipla", lat: 21.87, lng: 73.50 },
  { name: "Vyara", lat: 21.11, lng: 73.39 },
  { name: "Chhota Udaipur", lat: 22.31, lng: 74.02 },
];

const cityLookup = Object.fromEntries(gujaratCities.map((city) => [city.name, city]));

const routeTemplates = [
  {
    id: "ahm-sur-lux",
    from: "Ahmedabad",
    to: "Surat",
    name: "Saurashtra Deluxe Express",
    type: "AC Sleeper",
    depart: "06:15",
    arrive: "11:25",
    duration: "5h 10m",
    fare: 620,
    seatsLeft: 18,
    rating: "4.8",
    amenities: ["AC", "Sleeper", "Charging", "Water"],
  },
  {
    id: "ahm-sur-super",
    from: "Ahmedabad",
    to: "Surat",
    name: "Gujarat Super Fast",
    type: "Express Seater",
    depart: "09:40",
    arrive: "15:05",
    duration: "5h 25m",
    fare: 390,
    seatsLeft: 24,
    rating: "4.5",
    amenities: ["Seater", "Live GPS", "Charging"],
  },
  {
    id: "sur-dwa-coast",
    from: "Surat",
    to: "Dwarka",
    name: "Coastal Night Rider",
    type: "AC Sleeper",
    depart: "20:30",
    arrive: "08:20",
    duration: "11h 50m",
    fare: 960,
    seatsLeft: 12,
    rating: "4.7",
    amenities: ["AC", "Sleeper", "Blanket", "Water"],
  },
  {
    id: "vad-ahm-rapid",
    from: "Vadodara",
    to: "Ahmedabad",
    name: "Central Gujarat Rapid",
    type: "Volvo Seater",
    depart: "07:10",
    arrive: "09:25",
    duration: "2h 15m",
    fare: 280,
    seatsLeft: 31,
    rating: "4.6",
    amenities: ["Volvo", "Wi-Fi", "Charging"],
  },
  {
    id: "gnd-som-pilgrim",
    from: "Gandhinagar",
    to: "Somnath",
    name: "Somnath Pilgrim Special",
    type: "AC Seater",
    depart: "05:50",
    arrive: "14:35",
    duration: "8h 45m",
    fare: 720,
    seatsLeft: 16,
    rating: "4.4",
    amenities: ["AC", "Recliner", "Live GPS"],
  },
  {
    id: "raj-bha-local",
    from: "Rajkot",
    to: "Bhavnagar",
    name: "Kathiyawad Express",
    type: "Non AC Seater",
    depart: "12:20",
    arrive: "16:45",
    duration: "4h 25m",
    fare: 260,
    seatsLeft: 28,
    rating: "4.3",
    amenities: ["Seater", "Window", "Parcel Hold"],
  },
  {
    id: "jam-bhj-desert",
    from: "Jamnagar",
    to: "Bhuj",
    name: "Kutch Desert Connect",
    type: "Express Seater",
    depart: "15:15",
    arrive: "21:30",
    duration: "6h 15m",
    fare: 510,
    seatsLeft: 20,
    rating: "4.5",
    amenities: ["Seater", "Live GPS", "Charging"],
  },
  {
    id: "jun-ahm-night",
    from: "Junagadh",
    to: "Ahmedabad",
    name: "Gir Night Express",
    type: "Sleeper",
    depart: "22:00",
    arrive: "05:40",
    duration: "7h 40m",
    fare: 690,
    seatsLeft: 14,
    rating: "4.6",
    amenities: ["Sleeper", "Blanket", "Charging"],
  },
];

const serviceVariants = [
  { name: "Gujarat Express Connect", type: "Express Seater", depart: "06:30", fareBoost: 0 },
  { name: "State Deluxe Cruiser", type: "AC Sleeper", depart: "13:10", fareBoost: 180 },
  { name: "Night Comfort Service", type: "Sleeper", depart: "21:45", fareBoost: 130 },
];

function calculateDistanceKm(from, to) {
  const origin = cityLookup[from];
  const destination = cityLookup[to];
  if (!origin || !destination) return 220;
  const earthRadiusKm = 6371;
  const latitudeDistance = (destination.lat - origin.lat) * Math.PI / 180;
  const longitudeDistance = (destination.lng - origin.lng) * Math.PI / 180;
  const originLatitude = origin.lat * Math.PI / 180;
  const destinationLatitude = destination.lat * Math.PI / 180;
  const haversine =
    Math.sin(latitudeDistance / 2) ** 2 +
    Math.cos(originLatitude) * Math.cos(destinationLatitude) *
    Math.sin(longitudeDistance / 2) ** 2;
  return Math.max(35, Math.round(earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)) * 1.22));
}

function addMinutes(time, minutesToAdd) {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const nextHours = Math.floor(totalMinutes / 60) % 24;
  const nextMinutes = totalMinutes % 60;
  return `${String(nextHours).padStart(2, "0")}:${String(nextMinutes).padStart(2, "0")}`;
}

function minutesToDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${String(remainingMinutes).padStart(2, "0")}m`;
}

function buildGeneratedRoutes(from, to) {
  const distanceKm = calculateDistanceKm(from, to);
  const speeds = [54, 58, 50];
  const fareRates = [1.45, 2.05, 1.72];
  return serviceVariants.map((variant, index) => {
    const durationMinutes = Math.round((distanceKm / speeds[index]) * 60 + 28 + index * 12);
    const fare = Math.max(120, Math.round((distanceKm * fareRates[index] + variant.fareBoost + 60) / 10) * 10);
    return {
      id: `${from}-${to}-${index}`.toLowerCase().replace(/\s+/g, "-"),
      from,
      to,
      name: variant.name,
      type: variant.type,
      depart: variant.depart,
      arrive: addMinutes(variant.depart, durationMinutes),
      duration: minutesToDuration(durationMinutes),
      fare,
      seatsLeft: 18 + ((distanceKm + index * 7) % 18),
      rating: (4.4 + index * 0.1).toFixed(1),
      amenities: index === 1 ? ["AC", "Sleeper", "Charging", "Water"] : ["Seater", "Live GPS", `${distanceKm} km`],
    };
  });
}

function getSearchRoutes(from, to) {
  const exactRoutes = routeTemplates.filter((route) => route.from === from && route.to === to);
  return exactRoutes.length ? exactRoutes : buildGeneratedRoutes(from, to);
}

function getFilteredBuses() {
  const fromVal = filterFrom.value;
  const toVal = filterTo.value;
  let baseBuses = [];
  if (fromVal && toVal) {
    baseBuses = getSearchRoutes(fromVal, toVal);
  } else if (fromVal) {
    baseBuses = routeTemplates.filter(b => b.from === fromVal);
  } else if (toVal) {
    baseBuses = routeTemplates.filter(b => b.to === toVal);
  } else {
    baseBuses = routeTemplates;
  }
  const nameQ = filterBusName.value.toLowerCase();
  return baseBuses.filter(b => {
    return !nameQ || b.name.toLowerCase().includes(nameQ) || b.type.toLowerCase().includes(nameQ);
  });
}


// ── State
let selectedBus     = null;
let selectedDate    = null;
let allPassengers   = [];
let filteredPax     = [];
let toastTimer      = null;

// ── DOM references
const $ = id => document.getElementById(id);

const sectionStep1     = $("sectionStep1");
const sectionStep2     = $("sectionStep2");
const sectionStep3     = $("sectionStep3");
const step1Ind         = $("step1Ind");
const step2Ind         = $("step2Ind");
const step3Ind         = $("step3Ind");

const filterFrom       = $("filterFrom");
const filterTo         = $("filterTo");
const filterBusName    = $("filterBusName");
const clearFiltersBtn  = $("clearFiltersBtn");
const busGrid          = $("busGrid");
const busEmpty         = $("busEmpty");

const backToStep1Btn   = $("backToStep1Btn");
const selectedBusLabel = $("selectedBusLabel");
const journeyDatePicker= $("journeyDatePicker");
const quickDates       = $("quickDates");
const proceedToListBtn = $("proceedToListBtn");

const backToStep2Btn   = $("backToStep2Btn");
const listSubLabel     = $("listSubLabel");
const refreshListBtn   = $("refreshListBtn");
const downloadCsvBtn   = $("downloadCsvBtn");
const printListBtn     = $("printListBtn");
const listSearch       = $("listSearch");
const passengerTableBody = $("passengerTableBody");
const listEmpty        = $("listEmpty");
const countBadge       = $("countBadge");

const statTotal    = $("statTotal");
const statSeats    = $("statSeats");
const statRevenue  = $("statRevenue");
const statBoarding = $("statBoarding");

// ── Toast
function showToast(msg) {
  const t = $("cToast");
  clearTimeout(toastTimer);
  t.textContent = msg;
  t.classList.add("show");
  toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
}

// ── Populate city filters
function populateCityFilters() {
  const sortedCities = [...gujaratCities].sort((a, b) => a.name.localeCompare(b.name));
  sortedCities.forEach(city => {
    const o1 = document.createElement("option");
    o1.value = city.name; o1.textContent = city.name;
    filterFrom.appendChild(o1);

    const o2 = document.createElement("option");
    o2.value = city.name; o2.textContent = city.name;
    filterTo.appendChild(o2);
  });
}

// ── Render Bus Cards (Step 1)
function renderBusCards() {
  const filtered = getFilteredBuses();

  if (filtered.length === 0) {
    busGrid.innerHTML = "";
    busEmpty.style.display = "";
    return;
  }
  busEmpty.style.display = "none";

  busGrid.innerHTML = filtered.map((bus, i) => `
    <div class="c-bus-card" data-bus-id="${bus.id}" style="animation-delay:${i * 60}ms">
      <div class="c-bus-card-header">
        <div class="c-bus-name">${bus.name}</div>
        <span class="c-bus-type-badge">${bus.type}</span>
      </div>
      <div class="c-bus-route">
        <span class="c-bus-city">${bus.from}</span>
        <div class="c-bus-arrow">
          <div class="c-bus-arrow-line"></div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
        <span class="c-bus-city">${bus.to}</span>
      </div>
      <div class="c-bus-footer">
        <div class="c-bus-time">
          <strong>${bus.depart}</strong>
          Departure
        </div>
        <div class="c-bus-time" style="text-align:right">
          <strong>${bus.arrive}</strong>
          Arrival
        </div>
        <button class="c-select-btn">Select Bus →</button>
      </div>
    </div>
  `).join("");

  // Click handlers
  busGrid.querySelectorAll(".c-bus-card").forEach(card => {
    card.addEventListener("click", () => {
      const bus = filtered.find(b => b.id === card.dataset.busId);
      if (bus) selectBus(bus);
    });
  });
}

// ── Step navigation helpers
function goToStep(step) {
  [sectionStep1, sectionStep2, sectionStep3].forEach(s => s.style.display = "none");
  [step1Ind, step2Ind, step3Ind].forEach(s => { s.classList.remove("active", "done"); });

  if (step === 1) {
    sectionStep1.style.display = "";
    step1Ind.classList.add("active");
  } else if (step === 2) {
    sectionStep2.style.display = "";
    step1Ind.classList.add("done");
    step2Ind.classList.add("active");
  } else if (step === 3) {
    sectionStep3.style.display = "";
    step1Ind.classList.add("done");
    step2Ind.classList.add("done");
    step3Ind.classList.add("active");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Step 1 → Step 2
function selectBus(bus) {
  selectedBus = bus;
  selectedBusLabel.textContent = `${bus.name} · ${bus.from} → ${bus.to} · Dep ${bus.depart}`;
  buildQuickDates();
  // Default date = today
  const today = new Date().toISOString().slice(0, 10);
  journeyDatePicker.value = today;
  selectedDate = today;
  goToStep(2);
}

// ── Build quick date chips (today, tomorrow, day after)
function buildQuickDates() {
  quickDates.innerHTML = "";
  const labels = ["Today", "Tomorrow", "Day After"];
  labels.forEach((label, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const val = d.toISOString().slice(0, 10);
    const chip = document.createElement("button");
    chip.className = "c-chip" + (i === 0 ? " active" : "");
    chip.textContent = `${label} (${d.toLocaleDateString("en-IN", { day:"numeric", month:"short" })})`;
    chip.dataset.date = val;
    chip.addEventListener("click", () => {
      document.querySelectorAll(".c-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      journeyDatePicker.value = val;
      selectedDate = val;
    });
    quickDates.appendChild(chip);
  });

  journeyDatePicker.addEventListener("change", () => {
    selectedDate = journeyDatePicker.value;
    document.querySelectorAll(".c-chip").forEach(c => {
      c.classList.toggle("active", c.dataset.date === selectedDate);
    });
  });
}

// ── Step 2 → Step 3: Fetch passengers
async function loadPassengers() {
  if (!selectedBus || !selectedDate) {
    showToast("Please select a bus and date first.");
    return;
  }

  goToStep(3);

  const dateObj = new Date(selectedDate);
  const dateLabel = dateObj.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
  listSubLabel.textContent = `${selectedBus.name} · ${selectedBus.from} → ${selectedBus.to} · ${dateLabel}`;

  passengerTableBody.innerHTML = `<tr><td colspan="10" class="c-loading">⏳ Fetching passenger list…</td></tr>`;
  listEmpty.style.display = "none";

  try {
    // ✅ FastAPI Python backend se bookings fetch karo
    const res = await fetch(`${API_BASE}/api/bookings`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Filter by bus + date client-side
    allPassengers = (data || []).filter(b =>
      b.journey_date === selectedDate && (
        b.bus_id   === selectedBus.id   ||
        b.bus_name === selectedBus.name ||
        (b.source === selectedBus.from && b.destination === selectedBus.to)
      )
    );

    renderPassengerList();
    updateStats();
  } catch (err) {
    console.error("Error:", err);
    passengerTableBody.innerHTML = `<tr><td colspan="10" class="c-loading" style="color:#ef4444;">❌ Error loading data. Is the Python FastAPI server running? (start_server.bat)</td></tr>`;
    showToast("Failed to load passenger data. Start the Python server.");

  }
}

// ── Render passenger table
function renderPassengerList() {
  const q = listSearch ? listSearch.value.toLowerCase() : "";

  filteredPax = allPassengers.filter(p => {
    if (!q) return true;
    return (
      p.pnr?.toLowerCase().includes(q) ||
      p.passenger_name?.toLowerCase().includes(q) ||
      p.mobile?.includes(q) ||
      p.seats?.toLowerCase().includes(q) ||
      p.boarding_point?.toLowerCase().includes(q)
    );
  });

  countBadge.textContent = `${filteredPax.length} passenger${filteredPax.length !== 1 ? "s" : ""}`;

  if (filteredPax.length === 0) {
    passengerTableBody.innerHTML = "";
    listEmpty.style.display = "";
    return;
  }

  listEmpty.style.display = "none";

  passengerTableBody.innerHTML = filteredPax.map((p, i) => {
    const seats = (p.seats || "").split(",").map(s => s.trim()).filter(Boolean);
    const seatChips = seats.map(s => `<span class="c-seat-chip">${s}</span>`).join("");
    const bookedAt = p.created_at ? new Date(p.created_at).toLocaleString("en-IN") : "—";
    return `
      <tr>
        <td style="color:var(--muted);font-weight:700;">${i + 1}</td>
        <td><span class="c-pnr">${p.pnr || "—"}</span></td>
        <td>
          <div class="c-passenger-name">${p.passenger_name || "—"}</div>
          <div class="c-passenger-mobile">${p.email || ""}</div>
        </td>
        <td>
          <div class="c-passenger-name" style="font-size:0.85rem;">${p.mobile || "—"}</div>
        </td>
        <td>${seatChips || "—"}</td>
        <td style="font-size:0.82rem;color:var(--muted);font-weight:600;">${p.concession && p.concession !== "Rs. 0" ? "Concession" : "General"}</td>
        <td><span class="c-boarding-text">${p.boarding_point || "—"}</span></td>
        <td><span class="c-amount">${p.amount || "—"}</span></td>
        <td style="font-size:0.78rem;color:var(--muted);">${bookedAt}</td>
        <td><span class="c-status-badge confirmed">✓ Confirmed</span></td>
      </tr>
    `;
  }).join("");
}

// ── Update stat cards
function updateStats() {
  if (statTotal) statTotal.textContent = allPassengers.length;

  const totalSeats = allPassengers.reduce((acc, p) => {
    const s = (p.seats || "").split(",").filter(Boolean);
    return acc + s.length;
  }, 0);
  if (statSeats) statSeats.textContent = totalSeats;

  const totalRev = allPassengers.reduce((acc, p) => {
    const m = p.amount ? p.amount.replace(/[^0-9.]/g, "") : "0";
    return acc + parseFloat(m || "0");
  }, 0);
  if (statRevenue) statRevenue.textContent = `₹${totalRev.toLocaleString("en-IN")}`;

  // Top boarding point
  const bpCount = {};
  allPassengers.forEach(p => {
    if (p.boarding_point) bpCount[p.boarding_point] = (bpCount[p.boarding_point] || 0) + 1;
  });
  const topBp = Object.entries(bpCount).sort((a, b) => b[1] - a[1])[0];
  if (statBoarding) {
    statBoarding.textContent = topBp ? topBp[0].split(" ").slice(0, 2).join(" ") : "—";
  }
}

// ── Download CSV
function downloadCSV() {
  if (!filteredPax.length) {
    showToast("No data to download.");
    return;
  }

  const headers = ["#", "PNR", "Passenger Name", "Mobile", "Email", "Seats", "Boarding Point", "Amount", "Base Fare", "Concession", "Service Fee", "Booked At", "Status"];
  const rows = filteredPax.map((p, i) => [
    i + 1,
    p.pnr || "",
    `"${(p.passenger_name || "").replace(/"/g, '""')}"`,
    p.mobile || "",
    p.email || "",
    `"${p.seats || ""}"`,
    `"${(p.boarding_point || "").replace(/"/g, '""')}"`,
    p.amount || "",
    p.base_fare || "",
    p.concession || "",
    p.service_fee || "",
    p.created_at ? new Date(p.created_at).toLocaleString("en-IN") : "",
    "Confirmed"
  ]);

  const dateLabel = selectedDate ? new Date(selectedDate).toLocaleDateString("en-IN") : "";
  const titleRow  = [`Gujarat Bus Seva — Conductor Passenger List`];
  const busRow    = [`Bus: ${selectedBus.name} | Route: ${selectedBus.from} → ${selectedBus.to} | Date: ${dateLabel}`];
  const emptyRow  = [];

  const csv = [
    titleRow.join(","),
    busRow.join(","),
    emptyRow.join(","),
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `passengers_${selectedBus.id}_${selectedDate}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast(`✅ Downloaded ${filteredPax.length} passenger records.`);
}

// ── Print
function printList() {
  window.print();
}

// ── Event Listeners
filterFrom.addEventListener("change", renderBusCards);
filterTo.addEventListener("change", renderBusCards);
filterBusName.addEventListener("input", renderBusCards);
clearFiltersBtn.addEventListener("click", () => {
  filterFrom.value = "";
  filterTo.value   = "";
  filterBusName.value = "";
  renderBusCards();
});

backToStep1Btn.addEventListener("click", () => goToStep(1));
backToStep2Btn.addEventListener("click", () => goToStep(2));

proceedToListBtn.addEventListener("click", () => {
  if (!journeyDatePicker.value) {
    showToast("Please select a date.");
    return;
  }
  selectedDate = journeyDatePicker.value;
  loadPassengers();
});

refreshListBtn.addEventListener("click", loadPassengers);
downloadCsvBtn.addEventListener("click", downloadCSV);
printListBtn.addEventListener("click", printList);

listSearch.addEventListener("input", renderPassengerList);

// ── Init
populateCityFilters();
renderBusCards();
goToStep(1);
