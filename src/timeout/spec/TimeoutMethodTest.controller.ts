import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Timeout } from '../decorator/timeout.decorator';

@Controller('timeout-method-test-controller')
export class TimeoutMethodTestController {
  @Get('/:sleepTime')
  async getTimeout(@Param('sleepTime') sleepTime: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, sleepTime));

    return;
  }
  @Post('/:sleepTime')
  @Timeout(500)
  async postTimeout(@Param('sleepTime') sleepTime: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, sleepTime));

    return;
  }

  @Patch('/:sleepTime')
  @Timeout(2000)
  async patchTimeout(@Param('sleepTime') sleepTime: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, sleepTime));

    return;
  }
  @Delete('/:sleepTime')
  @Timeout(12000)
  async overrideTimeout(@Param('sleepTime') sleepTime: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, sleepTime));

    return;
  }
}
