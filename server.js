const express = require('express');
const app = express();
const fileRoutes = require('./routes/fileRoutes');

require('dotenv').config();
app.use(express.json());
app.use('/api', fileRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));