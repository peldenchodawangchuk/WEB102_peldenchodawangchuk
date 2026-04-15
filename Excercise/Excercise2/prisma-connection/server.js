const express = require('express');
const cors = require('cors');
const prisma = require('./prisma');

const app = express();
const port = 5100;

// Middleware
app.use(cors());
app.use(express.json());

// Get all students
app.get('/students', async (req, res) => {
    try {
        const students = await prisma.student.findMany();
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get one student by ID
app.get('/students/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const student = await prisma.student.findUnique({
            where: { id }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new student
app.post('/students', async (req, res) => {
    try {
        const { name, email, course, enrollment_date } = req.body;

        const newStudent = await prisma.student.create({
            data: {
                name,
                email,
                course,
                enrollment_date: new Date(enrollment_date)
            }
        });

        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Gracefully shut down Prisma when the app terminates
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});

// Start the server
app.listen(port, () => {
    console.log(`Prisma server running on http://localhost:${port}`);
});