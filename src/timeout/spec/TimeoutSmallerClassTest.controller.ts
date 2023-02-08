import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Timeout } from '../decorator/timeout.decorator';

@Controller('timeout-smaller-class-test-controller')
@Timeout(75)
export class TimeoutSmallerClassTestController {
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
