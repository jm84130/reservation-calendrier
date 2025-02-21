const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
let currentDate = new Date();
let selectedActivity = null;

// Charger les réservations depuis localStorage
const reservations = JSON.parse(localStorage.getItem('reservations')) || {};

function saveReservations() {
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const monthYearHeader = document.getElementById('current-month-year');

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août',
        'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    monthYearHeader.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    calendar.innerHTML = '';

    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.classList.add('day-header');
        calendar.appendChild(dayHeader);
    });

    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
        const emptyCell = document.createElement('div');
        calendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= lastDay; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');

        const dayNumber = document.createElement('div');
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);

        ['morning', 'afternoon'].forEach((time) => {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot', time);

            const activityRow = document.createElement('div');
            activityRow.classList.add('activity-row');

            ['CTRM', 'CLM', 'CRM'].forEach(activity => {
                const key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}-${time}-${activity}`;

                const activityDiv = document.createElement('div');
                activityDiv.textContent = `${activity} (${reservations[key] || "Libre"})`;
                activityDiv.classList.add('activity');

                if (reservations[key]) {
                    activityDiv.classList.add('reserved');
                } else {
                    activityDiv.addEventListener('click', () => selectActivity(activityDiv, key));
                }

                activityRow.appendChild(activityDiv);
            });

            timeSlot.appendChild(activityRow);
            dayCell.appendChild(timeSlot);
        });

        calendar.appendChild(dayCell);
    }
}

function selectActivity(activityDiv, key) {
    if (activityDiv.classList.contains('reserved')) return;

    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    activityDiv.classList.add('selected');
    selectedActivity = { div: activityDiv, key };
}

function confirmReservation() {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value.trim();

    if (!selectedActivity || !name) {
        alert('Veuillez sélectionner une activité et entrer votre nom.');
        return;
    }

    const { div, key } = selectedActivity;

    reservations[key] = name;
    saveReservations();

    div.textContent = `${div.textContent.split(' (')[0]} (${name})`;
    div.classList.add('reserved');
    div.classList.remove('selected');
    selectedActivity = null;
    nameInput.value = '';
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
}

renderCalendar();
