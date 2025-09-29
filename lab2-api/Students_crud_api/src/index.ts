import express from "express";
import bodyParser from "body-parser";
import { initDb } from "./db";
import studentsRouter from "./routes/students";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Student API",
            version: "1.0.0",
            description: "API to manage students",
        },
        servers: [{ url: `http://localhost:${PORT}` }],
        paths: {}, // ✅ prevents TS error
    },
    apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Test to see the server working in the browser
app.get("/", (req, res) => {
    res.send("<h1>Student API</h1>")
});

//routes
app.use("/v1/students", studentsRouter);

// Start server
initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});
