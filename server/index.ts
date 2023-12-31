import express, {Request, Response} from "express";
import router from "./router";
import next from "next";
import {errorMiddleware} from "./middlewares";
import cors from "cors";
import cookieParser from "cookie-parser";

const dev = process.env.NODE_ENV !== "production";
const app = next({dev});
const handle = app.getRequestHandler();

const start = async () => {
	try {
		await app.prepare();

		const PORT = process.env.PORT || 3000;
		const server = express();

		server.use(express.json());
		server.use(cookieParser());
		server.use(cors({credentials: true, origin: process.env.APP_URL}));

		server.use("/api", router);
		server.use(errorMiddleware);

		server.all("*", (req: Request, res: Response) => handle(req, res));

		server.listen(PORT, (err?: any) => {
			if (err) throw err;
			console.log(`> Ready on localhost:${PORT} - env ${process.env.NODE_ENV}`);
		});
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
};
start();
