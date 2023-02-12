<div align="center">
<p align="center">
  <a href="http://fuseautotech.com/" target="blank"><img src="https://fuseautotech.com/hubfs/Logo.svg" width="300" alt="Fuse Logo" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1>Timeout Interceptor for NestJS</h1>

[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Fuse-Autotech](https://circleci.com/gh/Fuse-Autotech/nest-timeout.svg?branch=main&style=shield&circle-token=94c693abc89341393d317ca92a78e8da4f7ca104)](https://app.circleci.com/pipelines/github/Fuse-Autotech/nest-timeout)
</div>

## Description

NestJS Timeout Interceptor repository. It enables setting up a timeout for a NestJS application. It also exposes a Decorator for controller and controller methods specific timeouts.

## Installation

```bash
$ npm install @fuse-autotech/nest-timeout
```

## Usage
As a global intercaptor
```typescript

import { Module, NestInterceptor } from "@nestjs/common";
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

## Test

```bash
# unit tests
$ npm run test
```

## License

Nest timeout is [MIT licensed](LICENSE.md).
