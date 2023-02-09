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
