const express = require('express');
const cors = require('cors');
const prisma = require('./prisma');

const app = express();
const port = 5100; //Using a diff port fron the original app

//middleware
app.use(cors());
app.use(express.json());

//routes
app.get('/students', async (req, res) => {
    try {
        const students = await prisma.student.findMany();
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/students/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        //Using prisma to fetch a student by id
        const student = await prisma.student.findUnique({
            where: { id },
        });
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/students', async (req, res) => {
    try {
        const { name, email, course, enrollment_date } = req.body;

        //using prisma to create a new student
        const newStudent = await prisma.student.create({
            data: {
                name,
                email,
                course,
                enrollment_date: new Date(enrollment_date),
            },
        });

        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
});

//Gracefully shutdown the server and disconnect from the database
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

//start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});