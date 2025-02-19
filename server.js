const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 5000;
const DATA_FILE = "reservations.json";

app.use(cors());
app.use(express.json());

// 🔹 Charger les réservations
app.get("/api/reservations", (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) return res.status(500).send("Erreur serveur");
        res.json(JSON.parse(data));
    });
});

// 🔹 Ajouter une réservation (Admin uniquement)
app.post("/api/reservations", (req, res) => {
    const newReservation = req.body;

    fs.readFile(DATA_FILE, (err, data) => {
        if (err) return res.status(500).send("Erreur serveur");
        let reservations = JSON.parse(data);
        reservations.push(newReservation);
        fs.writeFile(DATA_FILE, JSON.stringify(reservations, null, 2), (err) => {
            if (err) return res.status(500).send("Erreur serveur");
            res.json({ message: "Réservation enregistrée" });
        });
    });
});

// 🔹 Supprimer une réservation (Admin)
app.delete("/api/reservations", (req, res) => {
    const { date, time, activity } = req.body;

    fs.readFile(DATA_FILE, (err, data) => {
        if (err) return res.status(500).send("Erreur serveur");
        let reservations = JSON.parse(data);
        reservations = reservations.filter(
            (r) => !(r.date === date && r.time === time && r.activity === activity)
        );
        fs.writeFile(DATA_FILE, JSON.stringify(reservations, null, 2), (err) => {
            if (err) return res.status(500).send("Erreur serveur");
            res.json({ message: "Réservation supprimée" });
        });
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
