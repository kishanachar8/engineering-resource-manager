const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const engineerRoutes = require('./routes/engineers');
const projectRoutes = require('./routes/projects');
const assignmentRoutes = require('./routes/assignments');
const metaRoutes = require("./routes/meta");



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());



connectDB();

const PORT = process.env.PORT;

app.use('/api/auth', authRoutes);
app.use('/api/engineers', engineerRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use("/api", metaRoutes);


app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));