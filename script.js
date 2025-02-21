<script>
    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    let currentDate = new Date();
    let selectedActivity = null;

// 🔹 Charger les réservations depuis GitHub (au lieu de localStorage)
let reservations = [];

async function loadReservations() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/jm84130/reservation-calendrier/main/reservations.json");
        reservations = await response.json();
        console.log("Réservations chargées :", reservations);
        renderCalendar(currentDate);
    } catch (error) {
        console.error("Erreur lors du chargement des réservations :", error);
    }
}

// Charger les réservations dès que la page se charge
loadReservations();

function saveReservations() {
    console.log("Sauvegarde en cours...");
    console.log("NOUVELLES RÉSERVATIONS :", reservations);

    // Générer le JSON pour l'admin
    const reservationsJSON = JSON.stringify(reservations, null, 2);

    // 📩 Envoyer un email automatique (via mailto)
    const subject = encodeURIComponent("Nouvelle réservation à mettre à jour sur GitHub");
    const body = encodeURIComponent(
        `Bonjour,\n\nUne nouvelle réservation a été faite sur le calendrier.\n\n` +
        `Merci de mettre à jour le fichier 'reservations.json' sur GitHub.\n\n` +
        `📌 Copie ce JSON et colle-le dans 'reservations.json' sur GitHub :\n\n` +
        `${reservationsJSON}\n\n` +
        `Cordialement, \nVotre site web`
    );

    // Ouvrir l'application mail avec le mail prérempli
    window.location.href = `mailto:jean-marie-jose.chazel@ac-aix-marseille.fr?subject=${subject}&body=${body}`;

    // Alerte pour l'admin
    alert("✅ Réservation enregistrée en local.\n\nUn email automatique vient d'être généré pour que l'admin puisse mettre à jour GitHub.");
}


    function renderCalendar(date) {
        const calendar = document.getElementById('calendar');
        const monthYearHeader = document.getElementById('current-month-year');

        const monthNames = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août',
            'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        monthYearHeader.textContent = ${monthNames[date.getMonth()]} ${date.getFullYear()};

        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

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
                    const activityDiv = document.createElement('div');
                    activityDiv.textContent = activity;
                    activityDiv.classList.add('activity');

                    const key = ${date.getFullYear()}-${date.getMonth()}-${day}-${time}-${activity};

                    if (reservations[key]) {
                        activityDiv.textContent = ${activity} (${reservations[key]});
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

        div.textContent = ${div.textContent} (${name});
        div.classList.add('reserved');
        div.classList.remove('selected');
        selectedActivity = null;
        nameInput.value = '';
    }

    function changeMonth(offset) {
        currentDate.setMonth(currentDate.getMonth() + offset);
        renderCalendar(currentDate);
    }

    renderCalendar(currentDate);
</script>

</body>
</html>