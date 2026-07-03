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

const passengerCategories = {
  male: { label: "Male", short: "M", discount: 0 },
  female: { label: "Female", short: "F", discount: 0 },
  child: { label: "Child", short: "C", discount: 0.5 },
  divyang: { label: "Divyang", short: "D", discount: 0.4 },
};

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

const els = {
  searchForm: document.querySelector("#searchForm"),
  fromCity: document.querySelector("#fromCity"),
  toCity: document.querySelector("#toCity"),
  journeyDate: document.querySelector("#journeyDate"),
  passengerCount: document.querySelector("#passengerCount"),
  journeySummary: document.querySelector("#journeySummary"),
  routeResults: document.querySelector("#routeResults"),
  seatMap: document.querySelector("#seatMap"),
  selectedBusName: document.querySelector("#selectedBusName"),
  summaryFrom: document.querySelector("#summaryFrom"),
  summaryDepart: document.querySelector("#summaryDepart"),
  summaryTo: document.querySelector("#summaryTo"),
  summaryArrive: document.querySelector("#summaryArrive"),
  summarySeats: document.querySelector("#summarySeats"),
  passengerTypes: document.querySelector("#passengerTypes"),
  baseFare: document.querySelector("#baseFare"),
  discountFare: document.querySelector("#discountFare"),
  serviceFee: document.querySelector("#serviceFee"),
  totalFare: document.querySelector("#totalFare"),
  continuePayment: document.querySelector("#continuePayment"),
  passengerForm: document.querySelector("#passengerForm"),
  passengerName: document.querySelector("#passengerName"),
  mobileNumber: document.querySelector("#mobileNumber"),
  emailAddress: document.querySelector("#emailAddress"),
  boardingPoint: document.querySelector("#boardingPoint"),
  paymentContent: document.querySelector("#paymentContent"),
  payNowBtn: document.querySelector("#payNowBtn"),
  toast: document.querySelector("#toast"),
  ticketDialog: document.querySelector("#ticketDialog"),
  closeTicket: document.querySelector("#closeTicket"),
  myTicketsBtn: document.querySelector("#myTicketsBtn"),
  myTicketsAuthDialog: document.querySelector("#myTicketsAuthDialog"),
  myTicketsMobile: document.querySelector("#myTicketsMobile"),
  myTicketsEmail: document.querySelector("#myTicketsEmail"),
  fetchMyTicketsBtn: document.querySelector("#fetchMyTicketsBtn"),
  myTicketsListDialog: document.querySelector("#myTicketsListDialog"),
  ticketsListContent: document.querySelector("#ticketsListContent"),
  myTicketsSubtitle: document.querySelector("#myTicketsSubtitle"),
  downloadTicketAction: document.querySelector("#downloadTicketAction"),
  ticketFrom: document.querySelector("#ticketFrom"),
  ticketTo: document.querySelector("#ticketTo"),
  ticketPnr: document.querySelector("#ticketPnr"),
  ticketDate: document.querySelector("#ticketDate"),
  ticketBus: document.querySelector("#ticketBus"),
  ticketSeats: document.querySelector("#ticketSeats"),
  ticketCategories: document.querySelector("#ticketCategories"),
  ticketPassenger: document.querySelector("#ticketPassenger"),
  ticketBoarding: document.querySelector("#ticketBoarding"),
  ticketAmount: document.querySelector("#ticketAmount"),
};

const hasToast = Boolean(els.toast);
function safeToast(message) {
  if (!hasToast) return;
  showToast(message);
}

let visibleRoutes = [];
let selectedRoute = null;
let bookedSeats = new Set();
let selectedSeats = new Set();
let selectedSeatTypes = new Map();
let activePayment = "upi";
let toastTimer = null;
let confirmedTicket = null;

function formatCurrency(value) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

function addMinutes(time, minutesToAdd) {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const nextHours = Math.floor(totalMinutes / 60) % 24;
  const nextMinutes = totalMinutes % 60;
  return `${String(nextHours).padStart(2, "0")}:${String(nextMinutes).padStart(2, "0")}`;
}

function routeSeed(route) {
  return route.id.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function showToast(message) {
  if (!els.toast) return;
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = window.setTimeout(() => els.toast.classList.remove("show"), 2800);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function setDefaultDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  els.journeyDate.min = date.toISOString().slice(0, 10);
  els.journeyDate.value = date.toISOString().slice(0, 10);
}

function populateCitySelects() {
  const options = gujaratCities
    .map((city) => `<option value="${city.name}">${city.name}</option>`)
    .join("");
  els.fromCity.innerHTML = options;
  els.toCity.innerHTML = options;
  els.fromCity.value = "Ahmedabad";
  els.toCity.value = "Surat";
}

function calculateDistanceKm(from, to) {
  const origin = cityLookup[from];
  const destination = cityLookup[to];

  if (!origin || !destination) {
    return 220;
  }

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

function renderRoutes(routes) {
  els.routeResults.innerHTML = routes
    .map((route, index) => {
      const isActive = selectedRoute?.id === route.id ? " active" : "";
      const amenities = route.amenities.map((amenity) => `<span>${amenity}</span>`).join("");
      return `
        <article class="route-card${isActive}" style="animation-delay: ${index * 80}ms">
          <div>
            <h3>${route.name}</h3>
            <div class="bus-meta">
              <span>${route.type}</span>
              <span>${route.rating} rating</span>
              <span>${route.seatsLeft} seats left</span>
            </div>
          </div>
          <div>
            <div class="route-time">
              <div class="time-block">
                <strong>${route.depart}</strong>
                <span>${route.from}</span>
              </div>
              <div class="route-line"><i class="moving-dot"></i></div>
              <div class="time-block">
                <strong>${route.arrive}</strong>
                <span>${route.to}</span>
              </div>
            </div>
            <div class="amenities" aria-label="Amenities">${amenities}</div>
          </div>
          <div class="price-box">
            <span>${route.duration}</span>
            <strong>${formatCurrency(route.fare)}</strong>
            <button class="select-bus" data-route-id="${route.id}" type="button">Select Bus</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function buildBookedSeats(route) {
  const seed = routeSeed(route);
  const seats = new Set();
  for (let row = 1; row <= 10; row += 1) {
    ["A", "B", "C", "D"].forEach((column, columnIndex) => {
      const seat = `${row}${column}`;
      const value = row * 11 + columnIndex * 7 + seed;
      if (value % 6 === 0 || value % 11 === 0) {
        seats.add(seat);
      }
    });
  }
  return seats;
}

async function loadRealBookedSeats() {
  if (!selectedRoute) return;
  const dateStr = sessionStorage.getItem("searchDate") || new Date().toISOString().slice(0, 10);
  try {
    // ✅ FastAPI Python backend se booked seats fetch karo
    const res = await fetch(`${API_BASE}/api/bookings/seats/${selectedRoute.id}/${dateStr}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { booked_seats } = await res.json();
    if (booked_seats && booked_seats.length > 0) {
      booked_seats.forEach(seat => bookedSeats.add(seat));
      renderSeats();
    }
  } catch (err) {
    console.warn("Could not load real booked seats from FastAPI backend:", err.message);
    // Non-fatal: demo seats still shown from buildBookedSeats()
  }
}

function renderSeats() {
  els.seatMap.innerHTML = "";

  for (let row = 1; row <= 10; row += 1) {
    ["A", "B"].forEach((column) => els.seatMap.appendChild(createSeatButton(`${row}${column}`)));
    const aisle = document.createElement("div");
    aisle.className = "aisle";
    els.seatMap.appendChild(aisle);
    ["C", "D"].forEach((column) => els.seatMap.appendChild(createSeatButton(`${row}${column}`)));
  }
}

function createSeatButton(seatNumber) {
  const button = document.createElement("button");
  button.className = "seat";
  button.type = "button";
  button.textContent = seatNumber;
  button.setAttribute("aria-label", `Seat ${seatNumber}`);

  if (bookedSeats.has(seatNumber)) {
    button.classList.add("booked");
    button.disabled = true;
  }

  if (selectedSeats.has(seatNumber)) {
    const category = getSeatCategory(seatNumber);
    button.classList.add("selected", category);
    button.textContent = `${seatNumber} ${passengerCategories[category].short}`;
  }

  button.addEventListener("click", () => toggleSeat(seatNumber));
  return button;
}

function getSortedSeats() {
  return Array.from(selectedSeats).sort((first, second) => first.localeCompare(second, undefined, { numeric: true }));
}

function getSeatCategory(seatNumber) {
  return selectedSeatTypes.get(seatNumber) || "male";
}

function calculateFareBreakdown() {
  const seats = getSortedSeats();
  const baseFare = selectedRoute ? selectedRoute.fare * seats.length : 0;
  const discount = selectedRoute
    ? seats.reduce((total, seat) => total + Math.round(selectedRoute.fare * passengerCategories[getSeatCategory(seat)].discount), 0)
    : 0;
  const serviceFee = seats.length ? Math.max(20, seats.length * 18) : 0;
  return {
    seats,
    baseFare,
    discount,
    serviceFee,
    total: Math.max(0, baseFare - discount + serviceFee),
  };
}

function renderPassengerTypes(seats) {
  if (!els.passengerTypes) return;

  if (!seats.length) {
    els.passengerTypes.textContent = "Select seats first";
    return;
  }

  els.passengerTypes.innerHTML = `
    <div class="passenger-type-list">
      ${seats.map((seat) => `
        <label class="passenger-type-row">
          <strong>${seat}</strong>
          <select data-seat-type="${seat}" aria-label="Passenger type for seat ${seat}">
            ${Object.entries(passengerCategories).map(([value, category]) => `
              <option value="${value}" ${getSeatCategory(seat) === value ? "selected" : ""}>
                ${category.label}${category.discount ? ` - ${Math.round(category.discount * 100)}% less` : ""}
              </option>
            `).join("")}
          </select>
        </label>
      `).join("")}
    </div>
  `;

  els.passengerTypes.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", () => {
      selectedSeatTypes.set(select.dataset.seatType, select.value);
      renderSeats();
      updateSummary();
    });
  });
}

function toggleSeat(seatNumber) {
  if (!selectedRoute) {
    safeToast("Please select a bus first.");
    return;
  }

  if (!els.passengerCount) return;
  const passengerLimit = Number(els.passengerCount.value);
  if (selectedSeats.has(seatNumber)) {
    selectedSeats.delete(seatNumber);
    selectedSeatTypes.delete(seatNumber);
  } else if (selectedSeats.size >= passengerLimit) {
    showToast(`You can select only ${passengerLimit} seat(s).`);
    return;
  } else {
    selectedSeats.add(seatNumber);
    selectedSeatTypes.set(seatNumber, "male");
  }

  renderSeats();
  updateSummary();
}

function selectRoute(routeId) {
  selectedRoute = visibleRoutes.find((route) => route.id === routeId);
  selectedSeats = new Set();
  selectedSeatTypes = new Map();
  bookedSeats = buildBookedSeats(selectedRoute);
  updateSummary();
  showToast(`${selectedRoute.name} selected. Now choose your seat.`);

  // persist selection for next page
  try {
    sessionStorage.setItem("selectedRoute", JSON.stringify(selectedRoute));
  } catch (e) { }

  window.location.href = "seats.html";
}

function updateSummary() {
  const fare = calculateFareBreakdown();

  if (els.selectedBusName) els.selectedBusName.textContent = selectedRoute ? selectedRoute.name : "Select a bus";
  if (els.summaryFrom) els.summaryFrom.textContent = selectedRoute?.from || (els.fromCity ? els.fromCity.value : "");
  if (els.summaryTo) els.summaryTo.textContent = selectedRoute?.to || (els.toCity ? els.toCity.value : "");
  if (els.summaryDepart) els.summaryDepart.textContent = selectedRoute?.depart || "--:--";
  if (els.summaryArrive) els.summaryArrive.textContent = selectedRoute?.arrive || "--:--";
  if (els.summarySeats) els.summarySeats.textContent = fare.seats.length ? fare.seats.join(", ") : "None";
  if (els.baseFare) els.baseFare.textContent = formatCurrency(fare.baseFare);
  if (els.discountFare) els.discountFare.textContent = fare.discount ? `- ${formatCurrency(fare.discount)}` : formatCurrency(0);
  if (els.serviceFee) els.serviceFee.textContent = formatCurrency(fare.serviceFee);
  if (els.totalFare) els.totalFare.textContent = formatCurrency(fare.total);
  if (els.passengerTypes) renderPassengerTypes(fare.seats);
}

function showPage(pageId) {
  const currentPage = document.querySelector('.page.active');
  const nextPage = document.getElementById(`page-${pageId}`);

  if (currentPage) {
    currentPage.classList.remove('active');
    currentPage.classList.add('page-transition-out');
    currentPage.addEventListener('animationend', () => {
      currentPage.classList.remove('page-transition-out');
      currentPage.style.display = 'none';
    }, { once: true });
  }

  if (nextPage) {
    setTimeout(() => {
      nextPage.style.display = 'block';
      nextPage.classList.add('active', 'page-transition-in');
      nextPage.addEventListener('animationend', () => {
        nextPage.classList.remove('page-transition-in');
      }, { once: true });
    }, currentPage ? 120 : 0);
  }
}

function animatePageTransition(selector) {
  const target = document.querySelector(selector);
  if (!target) return;

  target.classList.remove("page-transition");
  void target.offsetWidth; // Trigger reflow
  target.classList.add("page-transition");
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function performSearch(shouldScroll = true) {
  const from = els.fromCity.value;
  const to = els.toCity.value;

  if (from === to) {
    showToast("From and To cities must be different.");
    return;
  }

  visibleRoutes = getSearchRoutes(from, to);
  selectedRoute = visibleRoutes[0];
  selectedSeats = new Set();
  selectedSeatTypes = new Map();
  bookedSeats = buildBookedSeats(selectedRoute);

  // persist for routes.html
  try {
    sessionStorage.setItem("searchFrom", from);
    sessionStorage.setItem("searchTo", to);
    sessionStorage.setItem("searchDate", els.journeyDate.value);
    sessionStorage.setItem("selectedRoute", JSON.stringify(selectedRoute));
    sessionStorage.setItem("passengerCount", els.passengerCount ? els.passengerCount.value : "1");
    sessionStorage.removeItem("selectedSeats");
    sessionStorage.removeItem("selectedSeatTypes");
  } catch (e) { }

  if (els.journeySummary) {
    els.journeySummary.textContent = `${from} to ${to} on ${new Date(els.journeyDate.value).toLocaleDateString("en-IN")}`;
  }

  // In multi-page mode always navigate to routes.html
  window.location.href = "routes.html";
}


function renderPaymentContent(mode) {
  // Dummy payment UI removed in favor of real Razorpay checkout
}

function validateBooking() {
  if (!selectedRoute) {
    safeToast("Please select a bus.");
    return false;
  }

  if (!selectedSeats.size) {
    safeToast("Please select at least one seat.");
    window.location.href = "seats.html";
    return false;
  }

  if (!els.passengerForm || !els.passengerForm.reportValidity()) {
    safeToast("Please complete passenger details.");
    return false;
  }

  return true;
}

function buildTicketData() {
  const fare = calculateFareBreakdown();
  const categories = fare.seats
    .map((seat) => `${seat}: ${passengerCategories[getSeatCategory(seat)].label}`)
    .join(", ");
  return {
    pnr: `GS${Date.now().toString().slice(-6)}`,
    from: selectedRoute.from,
    to: selectedRoute.to,
    date: new Date(sessionStorage.getItem("searchDate") || Date.now()).toLocaleDateString("en-IN"),
    bus: selectedRoute.name,
    seats: fare.seats.join(", "),
    categories,
    passenger: els.passengerName.value,
    baseFare: formatCurrency(fare.baseFare),
    concession: fare.discount ? `- ${formatCurrency(fare.discount)}` : formatCurrency(0),
    serviceFee: formatCurrency(fare.serviceFee),
    amount: formatCurrency(fare.total),
    boardingPoint: els.boardingPoint.value,
    mobile: els.mobileNumber.value,
    email: els.emailAddress.value,
    depart: selectedRoute.depart,
    arrive: selectedRoute.arrive,
  };
}

function renderTicket(ticket) {
  els.ticketFrom.textContent = ticket.from;
  els.ticketTo.textContent = ticket.to;
  els.ticketPnr.textContent = ticket.pnr;
  els.ticketDate.textContent = ticket.date;
  els.ticketBus.textContent = ticket.bus;
  els.ticketSeats.textContent = ticket.seats;
  els.ticketCategories.textContent = ticket.categories;
  els.ticketPassenger.textContent = ticket.passenger;
  els.ticketBoarding.textContent = ticket.boardingPoint;
  els.ticketAmount.textContent = ticket.amount;
}

function openTicket(ticket = confirmedTicket) {
  if (!ticket) {
    showToast("Please confirm a ticket first.");
    return;
  }

  renderTicket(ticket);
  els.ticketDialog.showModal();
}

async function downloadTicket() {
  if (!confirmedTicket) {
    showToast("Please confirm a ticket first.");
    return;
  }

  // ✅ Try Python FastAPI PDF first
  try {
    const pdfUrl = `${API_BASE}/api/ticket/${encodeURIComponent(confirmedTicket.pnr)}/pdf`;
    const res = await fetch(pdfUrl);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `gujarat-bus-ticket-${confirmedTicket.pnr}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showToast("PDF ticket downloaded!");
      return;
    }
  } catch (pdfErr) {
    console.warn("FastAPI PDF not available, falling back to HTML ticket:", pdfErr.message);
  }

  // Fallback: HTML ticket (works without backend)
  const ticket = Object.fromEntries(
    Object.entries(confirmedTicket).map(([key, value]) => [key, escapeHtml(value)])
  );
  const ticketHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ticket ${ticket.pnr}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 32px; color: #141821; background: #f5f7fa; }
    .ticket { max-width: 720px; margin: 0 auto; padding: 28px; border-radius: 10px; background: #fff; border-top: 8px solid #bf1f2f; box-shadow: 0 18px 50px rgba(31, 41, 55, 0.14); }
    h1 { margin: 0 0 6px; color: #bf1f2f; }
    .route { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 26px 0; font-size: 24px; font-weight: 800; }
    .line { flex: 1; height: 3px; background: linear-gradient(90deg, #bf1f2f, #0f766e); }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .box { padding: 14px; border: 1px solid #e6e9ee; border-radius: 8px; }
    span { display: block; margin-bottom: 5px; color: #667085; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    strong { font-size: 16px; }
  </style>
</head>
<body>
  <main class="ticket">
    <h1>Gujarat Bus Seva</h1>
    <p>Confirmed e-ticket</p>
    <section class="route">
      <div>${ticket.from}</div>
      <div class="line"></div>
      <div>${ticket.to}</div>
    </section>
    <section class="grid">
      <div class="box"><span>PNR</span><strong>${ticket.pnr}</strong></div>
      <div class="box"><span>Date</span><strong>${ticket.date}</strong></div>
      <div class="box"><span>Departure</span><strong>${ticket.depart}</strong></div>
      <div class="box"><span>Arrival</span><strong>${ticket.arrive}</strong></div>
      <div class="box"><span>Bus</span><strong>${ticket.bus}</strong></div>
      <div class="box"><span>Seats</span><strong>${ticket.seats}</strong></div>
      <div class="box"><span>Category</span><strong>${ticket.categories}</strong></div>
      <div class="box"><span>Passenger</span><strong>${ticket.passenger}</strong></div>
      <div class="box"><span>Mobile</span><strong>${ticket.mobile}</strong></div>
      <div class="box"><span>Email</span><strong>${ticket.email}</strong></div>
      <div class="box"><span>Boarding Point</span><strong>${ticket.boardingPoint}</strong></div>
      <div class="box"><span>Base Fare</span><strong>${ticket.baseFare}</strong></div>
      <div class="box"><span>Concession</span><strong>${ticket.concession}</strong></div>
      <div class="box"><span>Service Fee</span><strong>${ticket.serviceFee}</strong></div>
      <div class="box"><span>Amount</span><strong>${ticket.amount}</strong></div>
      <div class="box"><span>Status</span><strong>Confirmed</strong></div>
    </section>
  </main>
</body>
</html>`;

  const blob = new Blob([ticketHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `gujarat-bus-ticket-${confirmedTicket.pnr}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Ticket downloaded successfully.");
}

function bindEvents() {
  if (els.searchForm) {
    els.searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      performSearch();
    });
  }

  // Ensure seats page loads selection when user returns from routes
  if (els.seatMap && window.location.pathname.includes("seats.html")) {
    try {
      const storedRoute = sessionStorage.getItem("selectedRoute");
      if (storedRoute) selectedRoute = JSON.parse(storedRoute);
    } catch (e) { }
  }


  document.querySelectorAll(".route-strip button").forEach((button) => {
    button.addEventListener("click", () => {
      if (!els.fromCity || !els.toCity) return;
      els.fromCity.value = button.dataset.from;
      els.toCity.value = button.dataset.to;
      performSearch();
    });
  });

  // In multi-page mode, topnav/back clicks should be handled by normal browser navigation (href/onclick).
  // So do NOT intercept .topnav a clicks here.

  // Route card select (routes.html)
  if (els.routeResults) {
    els.routeResults.addEventListener("click", (event) => {
      const button = event.target.closest(".select-bus");
      if (!button) return;

      // hard check: ensure dataset exists
      const routeId = button.dataset.routeId;
      if (!routeId) {
        safeToast("Invalid route selection.");
        return;
      }

      selectRoute(routeId);
    });
  }


  // Seat selection limits — +/- button handlers
  if (els.passengerCount) {
    function applyPassengerLimit() {
      const limit = Number(els.passengerCount.value);
      try { sessionStorage.setItem("passengerCount", String(limit)); } catch (e) { }
      if (selectedSeats.size > limit) {
        selectedSeats = new Set(Array.from(selectedSeats).slice(0, limit));
        selectedSeatTypes = new Map(
          Array.from(selectedSeatTypes).filter(([seat]) => selectedSeats.has(seat))
        );
        renderSeats();
        updateSummary();
        safeToast("Seat selection updated to match passenger count.");
      }
    }

    // Handle visible +/- buttons (seats.html)
    const pcMinus = document.getElementById("pcMinus");
    const pcPlus = document.getElementById("pcPlus");
    if (pcMinus) {
      pcMinus.addEventListener("click", () => {
        const cur = Number(els.passengerCount.value);
        if (cur > 1) { els.passengerCount.value = cur - 1; applyPassengerLimit(); }
      });
    }
    if (pcPlus) {
      pcPlus.addEventListener("click", () => {
        const cur = Number(els.passengerCount.value);
        if (cur < 6) { els.passengerCount.value = cur + 1; applyPassengerLimit(); }
      });
    }

    // Also handle direct input changes (search.html)
    els.passengerCount.addEventListener("input", applyPassengerLimit);
  }

  // Continue payment (single-page flow)
  if (els.continuePayment) {
    els.continuePayment.addEventListener("click", () => {
      if (!selectedSeats.size) {
        safeToast("Select seat first, then continue to payment.");
        return;
      }

      // persist seats + types
      try {
        sessionStorage.setItem("selectedSeats", JSON.stringify(Array.from(selectedSeats)));
        sessionStorage.setItem("selectedSeatTypes", JSON.stringify(Array.from(selectedSeatTypes.entries())));
      } catch (e) { }

      window.location.href = "payment.html";
    });
  }

  if (els.payNowBtn) {
    els.payNowBtn.addEventListener("click", async () => {
      if (!validateBooking()) return;

      if (!RAZORPAY_KEY || RAZORPAY_KEY === "YOUR_RAZORPAY_TEST_KEY") {
        safeToast("Please add your Razorpay Test Key in env.js to test real payment.");
        return;
      }

      els.payNowBtn.textContent = "Creating Secure Order...";
      els.payNowBtn.disabled = true;

      confirmedTicket = buildTicketData();
      const fareData = calculateFareBreakdown();
      const amountInPaise = fareData.total * 100;

      try {
        // ✅ Step 1: Create Razorpay Order via Python FastAPI backend
        let orderId = null;
        try {
          const orderRes = await fetch(`${API_BASE}/api/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amountInPaise, receipt: confirmedTicket.pnr })
          });
          const orderData = await orderRes.json();
          if (orderRes.ok && orderData && orderData.id) {
            orderId = orderData.id;
          } else {
            console.warn("FastAPI order creation failed:", orderData.detail || orderData);
          }
        } catch (fetchErr) {
          console.warn("FastAPI server not reachable. Running in frontend-only test mode:", fetchErr.message);
        }

        if (!orderId) {
          console.warn("No order ID obtained. Proceeding in Razorpay test mode without server order.");
        }

        const options = {
          key: RAZORPAY_KEY,
          amount: amountInPaise,
          currency: "INR",
          name: "Gujarat Bus Seva",
          description: "Bus Ticket Booking",
          image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/GSRTC_Logo.svg/1200px-GSRTC_Logo.svg.png",
          handler: async function (response) {
            // ✅ Payment Success — Save confirmedTicket to sessionStorage for persistence
            try { sessionStorage.setItem("confirmedTicket", JSON.stringify(confirmedTicket)); } catch(e) {}

            els.payNowBtn.textContent = "Confirming Ticket...";
            const dateStr = sessionStorage.getItem("searchDate") || new Date().toISOString().slice(0, 10);

            try {
              const bookingPayload = {
                pnr: confirmedTicket.pnr,
                passenger_name: confirmedTicket.passenger,
                mobile: confirmedTicket.mobile,
                email: confirmedTicket.email,
                bus_id: selectedRoute.id,
                bus_name: selectedRoute.name,
                journey_date: dateStr,
                source: confirmedTicket.from,
                destination: confirmedTicket.to,
                boarding_point: confirmedTicket.boardingPoint,
                seats: confirmedTicket.seats,
                base_fare: confirmedTicket.baseFare,
                concession: confirmedTicket.concession,
                service_fee: confirmedTicket.serviceFee,
                amount: confirmedTicket.amount,
              };

              const saveRes = await fetch(`${API_BASE}/api/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingPayload),
              });

              if (!saveRes.ok) {
                const errData = await saveRes.json().catch(() => ({}));
                throw new Error(errData.detail || `HTTP ${saveRes.status}`);
              }

              safeToast("Payment successful! Ticket confirmed.");
            } catch (err) {
              console.error("Error saving booking to FastAPI:", err);
              safeToast("Payment successful! Ticket confirmed.");
            } finally {
              els.payNowBtn.textContent = "Pay with Razorpay";
              els.payNowBtn.disabled = false;
              // Always show ticket after payment — regardless of backend save result
              openTicket(confirmedTicket);
            }
          },
          prefill: {
            name: confirmedTicket.passenger,
            email: confirmedTicket.email,
            contact: confirmedTicket.mobile
          },
          theme: {
            color: "#bf1f2f"
          }
        };

        if (orderId) {
          options.order_id = orderId;
        }

        try {
          const rzp = new Razorpay(options);
          rzp.on('payment.failed', function (response) {
            console.error(response.error);
            safeToast("Payment failed or cancelled.");
            els.payNowBtn.textContent = "Pay with Razorpay";
            els.payNowBtn.disabled = false;
          });
          rzp.open();
        } catch (err) {
          console.error(err);
          safeToast(err.message || "Failed to load Razorpay.");
          els.payNowBtn.textContent = "Pay with Razorpay";
          els.payNowBtn.disabled = false;
        }
      } catch (outerErr) {
        console.error(outerErr);
        safeToast(outerErr.message || "Order creation failed.");
        els.payNowBtn.textContent = "Pay with Razorpay";
        els.payNowBtn.disabled = false;
      }
    });
  }

  if (els.closeTicket && els.ticketDialog) {
    els.closeTicket.addEventListener("click", () => els.ticketDialog.close());
  }
  if (els.downloadTicketAction) {
    els.downloadTicketAction.addEventListener("click", downloadTicket);
  }
  if (els.myTicketsBtn && els.myTicketsAuthDialog) {
    els.myTicketsBtn.addEventListener("click", () => {
      els.myTicketsAuthDialog.showModal();
    });
  }

  if (els.fetchMyTicketsBtn) {
    els.fetchMyTicketsBtn.addEventListener("click", async () => {
      const mobile = els.myTicketsMobile?.value.trim();
      const email = els.myTicketsEmail?.value.trim();

      if (!mobile || !email) {
        safeToast("Please enter both mobile and email.");
        return;
      }

      els.fetchMyTicketsBtn.textContent = "Fetching...";
      els.fetchMyTicketsBtn.disabled = true;

      try {
        const response = await fetch(`${API_BASE}/api/ticket/my-tickets?mobile=${encodeURIComponent(mobile)}&email=${encodeURIComponent(email)}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch tickets.");
        }

        const tickets = await response.json();
        
        window.myTicketsData = tickets;
        
        els.myTicketsAuthDialog.close();
        if (els.myTicketsSubtitle) els.myTicketsSubtitle.textContent = `Tickets for ${mobile} | ${email}`;
        els.myTicketsListDialog.showModal();
        
        switchTicketTab('upcoming');

      } catch (err) {
        console.error(err);
        safeToast(err.message || "Could not fetch tickets.");
      } finally {
        els.fetchMyTicketsBtn.textContent = "Fetch My Tickets";
        els.fetchMyTicketsBtn.disabled = false;
      }
    });
  }
}

// Ensure global scope for switchTicketTab since it's used in inline HTML onclick
window.switchTicketTab = function(tab) {
  document.getElementById('tabUpcoming').classList.toggle('active', tab === 'upcoming');
  document.getElementById('tabPast').classList.toggle('active', tab === 'past');
  
  const content = document.getElementById('ticketsListContent');
  if (!content) return;
  
  const tickets = window.myTicketsData || [];
  
  const now = new Date();
  // Strip time from current date for accurate comparison with journey date
  now.setHours(0, 0, 0, 0);

  const filtered = tickets.filter(t => {
    // Attempt to parse "YYYY-MM-DD" or similar
    const jDate = new Date(t.journey_date);
    jDate.setHours(0, 0, 0, 0); // normalize journey date

    // Fallback: If date parsing fails or is invalid, assume upcoming
    if (isNaN(jDate.getTime())) return tab === 'upcoming';
    
    if (tab === 'upcoming') {
      return jDate >= now;
    } else {
      return jDate < now;
    }
  });

  if (filtered.length === 0) {
    content.innerHTML = `<div class="no-tickets-msg">No ${tab} tickets found.</div>`;
    return;
  }

  content.innerHTML = filtered.map(t => {
    const isUpcoming = tab === 'upcoming';
    return `
      <div class="ticket-list-card">
        <div class="route-info">
          <h3>${t.source} ➔ ${t.destination}</h3>
          <p><strong>PNR:</strong> ${t.pnr} | <strong>Date:</strong> ${t.journey_date}</p>
          <p><strong>Bus:</strong> ${t.bus_name} | <strong>Seats:</strong> ${t.seats}</p>
        </div>
        <div class="actions">
          <span class="status-badge ${isUpcoming ? 'upcoming' : 'past'}">
            ${isUpcoming ? 'Upcoming' : 'Past'}
          </span>
          <button class="btn-download-small" onclick="window.open(API_BASE + '/api/ticket/${t.pnr}/pdf', '_blank')">
            Download PDF
          </button>
        </div>
      </div>
    `;
  }).join('');
};

if (els.fromCity && els.toCity) populateCitySelects();
if (els.journeyDate) setDefaultDate();

bindEvents();

// Only render payment content if payment UI exists
if (els.paymentContent) renderPaymentContent(activePayment);

// Load persisted state for multi-page flow
(function hydrateFromSession() {
  try {
    const routeJson = sessionStorage.getItem("selectedRoute");
    if (routeJson) selectedRoute = JSON.parse(routeJson);

    const seatsJson = sessionStorage.getItem("selectedSeats");
    if (seatsJson) selectedSeats = new Set(JSON.parse(seatsJson));

    const seatTypesJson = sessionStorage.getItem("selectedSeatTypes");
    if (seatTypesJson) selectedSeatTypes = new Map(JSON.parse(seatTypesJson));
  } catch (e) { }
})();

// ── Page detection (pathname-based, not element-based) ────────────────────────
// search.html is a multi-page SPA that contains ALL elements embedded.
// Checking for element existence alone would trigger redirects on search.html.
// We use the URL pathname to know which standalone page we're actually on.
(function () {
  const path = window.location.pathname.toLowerCase();
  const isRoutesPage  = path.endsWith("routes.html")  || path.endsWith("/routes");
  const isSeatsPage   = path.endsWith("seats.html")   || path.endsWith("/seats");
  const isPaymentPage = path.endsWith("payment.html") || path.endsWith("/payment");

  // ── Routes page ──────────────────────────────────────────────────────────────
  if (isRoutesPage) {
    try {
      const storedFrom = sessionStorage.getItem("searchFrom");
      const storedTo   = sessionStorage.getItem("searchTo");
      if ((!selectedRoute || !selectedRoute.from || !selectedRoute.to) && storedFrom && storedTo) {
        selectedRoute = { from: storedFrom, to: storedTo };
      }

      if (!selectedRoute || !selectedRoute.from || !selectedRoute.to) {
        window.location.href = "search.html";
        return;
      }

      visibleRoutes = getSearchRoutes(selectedRoute.from, selectedRoute.to);

      if (selectedRoute.id) {
        selectedRoute = visibleRoutes.find((r) => r.id === selectedRoute.id) || visibleRoutes[0];
      } else if (visibleRoutes && visibleRoutes.length > 0) {
        selectedRoute = visibleRoutes[0];
      } else {
        window.location.href = "search.html";
        return;
      }

      renderRoutes(visibleRoutes);

      const dateStr = sessionStorage.getItem("searchDate");
      const journeyDate = dateStr ? new Date(dateStr) : new Date();
      if (els.journeySummary) {
        els.journeySummary.textContent = `${selectedRoute.from} to ${selectedRoute.to} on ${journeyDate.toLocaleDateString("en-IN")}`;
      }
    } catch (e) {
      console.error("Routes page init error:", e);
    }
    return;
  }

  // ── Seats page ───────────────────────────────────────────────────────────────
  if (isSeatsPage) {
    if (!selectedRoute) {
      safeToast("Please select a bus first.");
      window.location.href = "search.html";
      return;
    }

    bookedSeats = buildBookedSeats(selectedRoute);
    if (els.selectedBusName) els.selectedBusName.textContent = selectedRoute.name;
    renderSeats();
    updateSummary();
    loadRealBookedSeats();

    try {
      const pc = sessionStorage.getItem("passengerCount");
      if (els.passengerCount) {
        if (pc) els.passengerCount.value = String(pc);
        else if (!els.passengerCount.value) els.passengerCount.value = "1";
      }
    } catch (e) { }
    return;
  }

  // ── Payment page ─────────────────────────────────────────────────────────────
  if (isPaymentPage) {
    // Restore confirmedTicket from session (e.g. after Razorpay callback redirect)
    try {
      const saved = sessionStorage.getItem("confirmedTicket");
      if (saved) confirmedTicket = JSON.parse(saved);
    } catch(e) {}

    // If ticket already confirmed, show it directly
    if (confirmedTicket && els.ticketDialog) {
      renderTicket(confirmedTicket);
      els.ticketDialog.showModal();
      return;
    }

    if (!selectedRoute) {
      safeToast("Please select a bus first.");
      window.location.href = "search.html";
      return;
    }
    if (!selectedSeats || !selectedSeats.size) {
      safeToast("Please select seats first.");
      window.location.href = "seats.html";
      return;
    }
    bookedSeats = buildBookedSeats(selectedRoute);
    updateSummary();
    return;
  }

  // ── Search page (SPA) — no auto-redirects needed ─────────────────────────────
  // search.html manages its own page state via showPage() + performSearch()
})();

// Only auto-populate search form when search UI exists
if (els.searchForm) {
  setDefaultDate();
  populateCitySelects();
}

