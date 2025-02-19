// URL du fichier reservations.json sur GitHub
const JSON_URL = "https://raw.githubusercontent.com/votre-utilisateur/reservation-calendrier/main/reservations.json";

// Variables globales
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let selectedActivity = null;
let reservations = [];

// Fonction pour charger les réservations depuis GitHub
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

// Fonction pour afficher le calendrier
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
            timeSlot.classList.add('time-slot');
            timeSlot.textContent = time;

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

// Fonction pour ouvrir la fenêtre pop-up de réservation
function openReservationPopup(day, time, activity) {
    selectedDate = `${day}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    selectedTime = time;
    selectedActivity = activity;

    document.getElementById('popup-date').textContent = `Date : ${selectedDate}`;
    document.getElementById('popup-time').textContent = `Créneau : ${selectedTime}`;
    document.getElementById('popup-activity').textContent = `Niveau : ${selectedActivity}`;
    
    document.getElementById('reservation-popup').style.display = 'block';
}

// Fonction pour fermer la fenêtre pop-up
function closeReservationPopup() {
    document.getElementById('reservation-popup').style.display = 'none';
}

// Fonction pour valider la réservation
function confirmReservation() {
    const name = document.getElementById('professor-name').value.trim();
    if (!name) {
        alert("Veuillez entrer votre nom.");
        return;
    }

    const isAlreadyReserved = reservations.some(r =>
        r.date === selectedDate &&
        r.time === selectedTime &&
        r.activity === selectedActivity
    );

    if (isAlreadyReserved) {
        alert("Désolé, ce créneau est déjà occupé. Merci de bien vouloir en choisir un autre.");
        closeReservationPopup();
        return;
    }

    const recipient = "votre-email@example.com"; // Remplacez par votre email
    const subject = `Demande de réservation pour ${selectedDate}`;
    const body = `Bonjour,\n\nLe professeur ${name} souhaite réserver le créneau ${selectedTime} (${selectedActivity}) pour la date du ${selectedDate}.\n\nMerci.\n\nCordialement.`;

    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    alert("Merci, votre demande va être prise en compte et nous bloquerons vos désidératas si cela est possible.");
    closeReservationPopup();
}

// Charger les réservations au démarrage
loadReservations();
