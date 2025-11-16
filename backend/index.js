import express from 'express';
import characterRoutes from './routes/character.js';

const app = express();

const PORT = 3001;

app.get('/', (req, res) => {
    res.send("SpeakUp Backend is running!");
});


app.use('/api/characters', characterRoutes);


app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
});
