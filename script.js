const JSON_URL = "https://raw.githubusercontent.com/jm84130/reservation-calendrier/main/reservations.json";

let currentDate = new Date();
let reservations = [];

async function loadReservations() {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error("Erreur de chargement du fichier JSON.");
        reservations = await response.json();
        renderCalendar();
    } catch (error) {
        console.error("Erreur lors du chargement des réservations :", error);
    }
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const monthYearHeader = document.getElementById('current-month-year');
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    monthYearHeader.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    calendar.innerHTML = '';

    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    for (let day = 1; day <= lastDay; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');
        dayCell.innerHTML = `<strong>${day}</strong>`;

        ['Matinée', 'Après-midi'].forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot', time === 'Matinée' ? 'morning' : 'afternoon');
            timeSlot.innerHTML = `<strong>${time}</strong>`;

            ['CTRM', 'CLM', 'CRM'].forEach(activity => {
                const key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}-${time}-${activity}`;
                const reservation = reservations.find(r => r.date === `${day}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}` && r.time === time && r.activity === activity);

                const activityDiv = document.createElement('div');
                activityDiv.textContent = activity;
                activityDiv.classList.add('activity');

                if (reservation) {
                    activityDiv.textContent += ` (${reservation.name})`;
                    activityDiv.classList.add('reserved');
                }

                timeSlot.appendChild(activityDiv);
            });

            dayCell.appendChild(timeSlot);
        });

        calendar.appendChild(dayCell);
    }
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
}

loadReservations();
