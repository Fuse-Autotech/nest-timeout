import { Controller, Get, Param } from '@nestjs/common';

@Controller('test-controller')
export class TestController {
  @Get('/:sleepTime')
  async get(@Param('sleepTime') sleepTime: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, sleepTime));

    return;
  }
}
