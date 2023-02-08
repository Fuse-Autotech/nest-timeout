import { Module, NestInterceptor } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from './app.controller';
import { TimeoutInterceptor } from "./timeout";
import { IS_TIMEOUT_ENABLED, REQUEST_TIMEOUT_LIMIT } from "./timeout/constants";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [{
    provide: APP_INTERCEPTOR,
    useFactory: async (): Promise<NestInterceptor> => {
      return new TimeoutInterceptor({
        defaultTimeout: REQUEST_TIMEOUT_LIMIT,
        isEnabled: IS_TIMEOUT_ENABLED,
      });
    },
    inject: [],
  },],
})
export class AppModule {}
