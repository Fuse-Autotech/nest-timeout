import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Timeout } from '../timeout.decorator';

@Controller('timeout-bigger-class-test-controller')
@Timeout(2000)
export class TimeoutBiggerClassTestController {
	@Get('/:sleepTime')
	async getTimeout(@Param('sleepTime') sleepTime: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, sleepTime));

		return;
	}
	@Post('/:sleepTime')
	async postTimeout(@Param('sleepTime') sleepTime: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, sleepTime));

		return;
	}

	@Patch('/:sleepTime')
	async patchTimeout(@Param('sleepTime') sleepTime: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, sleepTime));

		return;
	}
	@Delete('/:sleepTime')
	async overrideTimeout(@Param('sleepTime') sleepTime: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, sleepTime));

		return;
	}
}
