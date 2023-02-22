import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Timeout } from '../Timeout.decorator';

@Controller('timeout-override-class-test-controller')
@Timeout(2000)
export class TimeoutOverrideClassTestController {
	@Get('/:sleepTime')
	async getTimeout(@Param('sleepTime') sleepTime: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, sleepTime));

		return;
	}
	@Post('/:sleepTime')
	@Timeout(75)
	async postTimeout(@Param('sleepTime') sleepTime: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, sleepTime));

		return;
	}

	@Patch('/:sleepTime')
	@Timeout(3000)
	async patchTimeout(@Param('sleepTime') sleepTime: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, sleepTime));

		return;
	}
	@Delete('/:sleepTime')
	@Timeout(0)
	async deleteTimeout(@Param('sleepTime') sleepTime: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, sleepTime));

		return;
	}
}
