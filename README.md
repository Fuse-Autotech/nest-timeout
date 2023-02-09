<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Timeout Decorator for NestJS</p>
## Description

Nest timeout decorator repository. It enables you to set a timeout for your controller methods using the NestJS
framework. It can be also used on the Controller class itself alongside with decorators on the methods. For
the timeout it uses a timeout interceptor.

## Installation

```bash
$ npm install
```

## Usage

```typescript

import { Module, NestInterceptor } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TimeoutInterceptor } from "./timeout";
import { IS_TIMEOUT_ENABLED, REQUEST_TIMEOUT_LIMIT } from "./timeout/constants";
import { TimeoutOverrideClassTestController } from "./timeout/spec/TimeoutClassOverrideTest.controller";

@Module({
  imports: [],
  controllers: [TimeoutOverrideClassTestController],
  providers: [{
    provide: APP_INTERCEPTOR,
    useFactory: async (): Promise<NestInterceptor> => {
      return new TimeoutInterceptor({
        defaultTimeout: +process.env.REQUEST_TIMEOUT_LIMIT ?? REQUEST_TIMEOUT_LIMIT,
        isEnabled: Boolean(process.env.IS_TIMEOUT_ENABLED) ?? IS_TIMEOUT_ENABLED,
      });
    },
    inject: [],
  },],
})
export class AppModule {}

```

```typescript

import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Timeout } from '../decorator/timeout.decorator';

@Controller('timeout-override-class-test-controller')
@Timeout(10000)
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
  @Timeout(12000)
  async patchTimeout(@Param('sleepTime') sleepTime: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, sleepTime));

    return;
  }
}
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest timeout is [MIT licensed](LICENSE).
