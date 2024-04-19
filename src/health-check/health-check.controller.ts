import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { Response } from "express";

import { Public } from "delivery/guards/auth.guard";

@Controller("health")
export class HealthCheckController {
	@Get()
	@Public()
	health(@Res() res: Response) {
		res.status(HttpStatus.OK).send();
	}
}
