// URL du fichier JSON sur GitHub (À MODIFIER AVEC TON LIEN GITHUB)
const JSON_URL = "https://raw.githubusercontent.com/jm84130/reservation-calendrier/main/reservations.json";

let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let selectedActivity = null;
let reservations = [];

// 🔹 Charger les réservations depuis le fichier GitHub
async function loadReservations() {
    try {
        const response = await fetch(JSON_URL);
        reservations = await response.json();
        console.log("Réservations chargées :", reservations);
        renderCalendar();
    } catch (error) {
        console.error("Erreur lors du chargement des réservations :", error);
    }
}

// 🔹 Afficher le calendrier avec les créneaux et les réservations
function renderCalendar() {
    const calendarElement = document.getElementById('calendar');
    const monthYearHeader = document.getElementById('current-month-year');

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août',
        'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    monthYearHeader.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    calendarElement.innerHTML = '';

    for (let day = 1; day <= lastDay; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = day;

        ['Matinée', 'Après-midi'].forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot', time === 'Matinée' ? 'morning' : 'afternoon');

            ['CTRM', 'CLM', 'CRM'].forEach(activity => {
                const key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}-${time}-${activity}`;
                const reservation = reservations.find(r =>
                    r.date === `${day}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}` &&
                    r.time === time &&
                    r.activity === activity
                );

                const activityDiv = document.createElement('div');
                activityDiv.textContent = activity;
                activityDiv.classList.add('activity');

                if (reservation) {
                    activityDiv.textContent += ` (${reservation.name})`;
                    activityDiv.classList.add('reserved');
                } else {
                    activityDiv.addEventListener('click', () => openReservationPopup(day, time, activity));
                }

                timeSlot.appendChild(activityDiv);
            });

            dayElement.appendChild(timeSlot);
        });

        calendarElement.appendChild(dayElement);
    }
}

// 🔹 Ouvrir la pop-up de réservation
function openReservationPopup(day, time, activity) {
    selectedDate = `${day}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    selectedTime = time;
    selectedActivity = activity;

    document.getElementById('popup-date').textContent = `Date : ${selectedDate}`;
    document.getElementById('popup-time').textContent = `Créneau : ${selectedTime}`;
    document.getElementById('popup-activity').textContent = `Niveau : ${selectedActivity}`;
    
    document.getElementById('reservation-popup').style.display = 'block';
}

// 🔹 Fermer la pop-up
function closeReservationPopup() {
    document.getElementById('reservation-popup').style.display = 'none';
}

// 🔹 Envoi d'un e-mail pour la réservation
function confirmReservation() {
    const name = document.getElementById('professor-name').value.trim();
    if (!name) {
        alert("Veuillez entrer votre nom.");
        return;
    }

    // Demande l'adresse académique
    const emailAcad = prompt("Veuillez entrer votre adresse académique (@ac-académie.fr) :").trim();
    if (!emailAcad || !emailAcad.endsWith("@ac-aix-marseille.fr")) {
        alert("Adresse académique invalide. Veuillez entrer une adresse @ac-aix-marseille.fr.");
        return;
    }

    // Empêcher la réservation d'un créneau déjà pris
    const isAlreadyReserved = reservations.some(r =>
        r.date === selectedDate &&
        r.time === selectedTime &&
        r.activity === selectedActivity
    );

    if (isAlreadyReserved) {
        alert("Ce créneau est déjà réservé. Veuillez en choisir un autre.");
        closeReservationPopup();
        return;
    }

    // Génération de l'e-mail prérempli
    const subject = encodeURIComponent("Demande de réservation de créneau");
    const body = encodeURIComponent(
        `Bonjour,\n\nJe souhaite réserver ce créneau :\n\n` +
        `- 📅 Date : ${selectedDate}\n` +
        `- 🕒 Créneau : ${selectedTime}\n` +
        `- 🎓 Niveau : ${selectedActivity}\n\n` +
        `Merci.\n\nCordialement,\nM./Mme ${name}\n📩 Adresse académique : ${emailAcad}`
    );

    // Ouvrir l'application mail avec l'e-mail prérempli
    window.location.href = `mailto:jean-marie-jose.chazel@ac-aix-marseille.fr?subject=${subject}&body=${body}`;

    alert("Votre demande a bien été envoyée.");
    closeReservationPopup();

    const validateButton = document.querySelector('.validate');
    if (validateButton !== null) {
    validateButton.disabled = true;
}



// 🔹 Changer de mois
function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
}

// 🔹 Charger les réservations au démarrage
loadReservations();
