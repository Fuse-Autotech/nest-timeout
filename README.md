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
### Interceptor
Options:
* `defaultTimeout` - Number of milliseconds after which the interceptor throws a `RequestTimeoutException` if no other timeout is defined for the endpoint
* `[isEnabled]` - Determain if the interceptor is enabled. Defaults to `true`. useful for debugging to avoid timeouts
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
### `@Timeout()` Decorator
Can be used both on Controllers and Controller Methods:
```typescript

import { Controller, Get, Param, Post } from '@nestjs/common';
import { Timeout } from '@fuse-autotech/nest-timeout';

@Controller('cats')
@Timeout(10000) // Applied for all methods unless decorated
export class CatsController {
    @Get()
    findAll(): string {
        return 'This action returns all cats';
    }
		
		@Get(':id') 
    @Timeout(30000) // Overrides controller timeout
    findOne(@Param('id') id: string ): string {
			return `This action returns a #${id} cat`;
		}

    @Post()
    @Timeout(0) // Disables timeout for the method
    create(): string {
        return 'This action adds a new cat';
    }
}
```

## License

Nest timeout is [MIT licensed](LICENSE.md).
