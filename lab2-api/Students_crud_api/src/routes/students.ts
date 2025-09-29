import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { openDb } from "../db";

const router = Router();

// GET all students
router.get("/", async (req, res) => {
    const db = await openDb();
    const students = await db.all("SELECT * FROM students");
    res.json({ value: students });
});

// Create a new student
router.post("/", async (req, res) => {
    const { firstName, lastName, studentNumber, email, course } = req.body;
    const id = uuidv4();
    const db = await openDb();
    await db.run(
        "INSERT INTO students (id, firstName, lastName, studentNumber, email, course) VALUES (?, ?, ?, ?, ?, ?)",
        id, firstName, lastName, studentNumber, email, course
    );
    const newStudent = await db.get("SELECT * FROM students WHERE id = ?", id);
    res.status(201).json(newStudent);
});

// Update a Student Record
router.put("/:id", async (req, res) => {
    const { firstName, lastName, studentNumber, email, course } = req.body;
    const db = await openDb();
    await db.run(
        "UPDATE students SET firstName=?, lastName=?, studentNumber=?, email=?, course=? WHERE id=?",
        firstName, lastName, studentNumber, email, course, req.params.id
    );
    const updatedStudent = await db.get("SELECT * FROM students WHERE id = ?", req.params.id);
    res.json(updatedStudent);
});

// Delete a Student 
router.delete("/:id", async (req, res) => {
    const db = await openDb();
    await db.run("DELETE FROM students WHERE id=?", req.params.id);
    res.status(204).send();
});

// GET Individual Student
router.get("/:id", async (req, res) => {
    const db = await openDb();
    const student = await db.get("SELECT * FROM students WHERE id = ?", req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
});

/**
 * @swagger
 * /v1/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of students
 */

/**
 * @swagger
 * /v1/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     responses:
 *       200:
 *         description: Student found
 *       404:
 *         description: Student not found
 */

/**
 * @swagger
 * /v1/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - studentNumber
 *               - email
 *               - course
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               studentNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               course:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created
 */

/**
 * @swagger
 * /v1/students/{id}:
 *   put:
 *     summary: Update a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               studentNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               course:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated
 *       404:
 *         description: Student not found
 */

/**
 * @swagger
 * /v1/students/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     responses:
 *       204:
 *         description: Student deleted
 *       404:
 *         description: Student not found
 */

export default router;
