<div align="center">
<p align="center">
  <a href="http://fuseautotech.com/" target="blank"><img src="https://fuseautotech.com/hubfs/Logo.svg" width="300" alt="Fuse Logo" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1>Timeout Interceptor for NestJS</h1>
</div>

## Description

NestJS Timeout Interceptor repository. It enables setting up a global timeout for a NestJS application, which can be overridden by a Timeout Decorator for controller classes and methods specific timeouts.
This gives the user more flexibility with a small amount of additional code. Method timeouts are preferred over class timeouts, which are preferred over global timeouts. Enjoy!

## Installation

```bash
$ npm install @fuse-autotech/nest-timeout
```

## Usage
As a global interceptor
```typescript

import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TimeoutInterceptor } from "@fuse-autotech/nest-timeout";

@Module({
    imports: [],
    controllers: [],
    providers: [{
        provide: APP_INTERCEPTOR,
        useValue: new TimeoutInterceptor({ defaultTimeout: 10000 })
    }]
})
export class AppModule {}

```

Using the `@Timeout()` decorator for controller or controller methods specific timeouts
```typescript

import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Timeout } from '@fuse-autotech/nest-timeout';

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

## License

Nest timeout is [MIT licensed](LICENSE.md).
