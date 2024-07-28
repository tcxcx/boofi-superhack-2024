import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./interfaces/routes/userRoutes";
import webhookRoutes from "./interfaces/routes/webhookRoutes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/webhooks", webhookRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
