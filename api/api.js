// Importer les modules nécessaires
import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';

// Initialiser l'application Express
const app = express();
const PORT = 3000;

// Middleware pour analyser les requêtes JSON
app.use(bodyParser.json());

// Configuration de la connexion MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Remplacez par votre mot de passe
    database: 'tp_hotels'
});

// Connecter à la base de données
db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Connecté à la base de données MySQL.');
});

// Routes CRUD pour les hôtels

// 1. Récupérer tous les hôtels
app.get('/api/hotels', (req, res) => {
    const query = 'SELECT * FROM hotels';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la récupération des hôtels.' });
        } else {
            res.json(results);
        }
    });
});

// 2. Récupérer un hôtel spécifique par ID
app.get('/api/hotels/:id', (req, res) => {
    const query = 'SELECT * FROM hotels WHERE id = ?';
    const hotelId = req.params.id;

    db.query(query, [hotelId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'hôtel.' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Hôtel non trouvé.' });
        } else {
            res.json(results[0]);
        }
    });
});

// 3. Créer un nouvel hôtel
app.post('/api/hotels', (req, res) => {
    const { code, city, address, reference } = req.body;
    const query = 'INSERT INTO hotels (code, city, address, reference, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';

    db.query(query, [code, city, address, reference], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la création de l\'hôtel.' });
        } else {
            res.status(201).json({ message: 'Hôtel créé avec succès.', hotelId: result.insertId });
        }
    });
});

// 4. Mettre à jour un hôtel
app.put('/api/hotels/:id', (req, res) => {
    const hotelId = req.params.id;
    const { code, city, address, reference } = req.body;
    const query = 'UPDATE hotels SET code = ?, city = ?, address = ?, reference = ?, updated_at = NOW() WHERE id = ?';

    db.query(query, [code, city, address, reference, hotelId], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'hôtel.' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Hôtel non trouvé.' });
        } else {
            res.json({ message: 'Hôtel mis à jour avec succès.' });
        }
    });
});

// 5. Supprimer un hôtel
app.delete('/api/hotels/:id', (req, res) => {
    const hotelId = req.params.id;
    const query = 'DELETE FROM hotels WHERE id = ?';

    db.query(query, [hotelId], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la suppression de l\'hôtel.' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Hôtel non trouvé.' });
        } else {
            res.json({ message: 'Hôtel supprimé avec succès.' });
        }
    });
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d\'exécution sur http://localhost:${PORT}`);
});

import HotelManagement from "./components/HotelManagement";

function App() {
  return <HotelManagement />;
}

export default App;
