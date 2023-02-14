import { Test } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TimeoutInterceptor } from "./Timeout.interceptor";
import { ITimeoutInterceptorOptions } from "./types";
import {IDecoratorTestCase, IGlobalTestCase, TIMEOUT_VALUES} from "./spec/types";
import { TestController } from "./spec/Test.controller";
import { TimeoutMethodTestController } from "./spec/TimeoutMethodTest.controller";
import { TimeoutBiggerClassTestController } from "./spec/TimeoutBiggerClassTest.controller";
import { TimeoutSmallerClassTestController } from "./spec/TimeoutSmallerClassTest.controller";
import { TimeoutOverrideClassTestController } from "./spec/TimeoutClassOverrideTest.controller";
import {isNil} from "./internal/utils";

let app: INestApplication;
let httpServer;

afterAll(async () => {
  await app.close();
});

async function setUpModule(timeoutOptions: ITimeoutInterceptorOptions): Promise<void> {
  const moduleRef = await Test.createTestingModule({
    providers: [
      {
        provide: APP_INTERCEPTOR,
        useFactory: (): TimeoutInterceptor => {
          return new TimeoutInterceptor(timeoutOptions as ITimeoutInterceptorOptions);
        },
      },
    ],
    controllers: [
      TestController,
      TimeoutMethodTestController,
      TimeoutBiggerClassTestController,
      TimeoutSmallerClassTestController,
      TimeoutOverrideClassTestController,
    ],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.init();
  httpServer = app.getHttpServer();
}

describe('TimeoutInterceptor without timeout decorator', () => {
  const setUpModule = async (timeoutOptions: ITimeoutInterceptorOptions): Promise<void> => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useFactory: (): TimeoutInterceptor => {
            return new TimeoutInterceptor(timeoutOptions);
          },
        },
      ],
      controllers: [TestController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  }

  const testCases: IGlobalTestCase[] =
    [
      {
        title: 'Should timeout using the default timeout value',
        options: { defaultTimeout: 100 },
        shouldTimeout: true,
        addSleepTime: true,
      },
      {
        title: 'Should timeout using overrides without method that apply',
        options: { defaultTimeout: 1000 },
        shouldTimeout: true,
        addSleepTime: true,
      },
      {
        title:
          'Should not timeout using overrides without method that do not apply',
        options: { defaultTimeout: 1000 },
        shouldTimeout: false,
        addSleepTime: false,
      },
      {
        title: 'Should timeout using overrides with method that apply',
        options: { defaultTimeout: 1000 },
        shouldTimeout: true,
        addSleepTime: true,
      },
      {
        title:
          'Should not timeout using overrides with method that do not apply',
        options: { defaultTimeout: 1000 },
        shouldTimeout: false,
        addSleepTime: false,
      },
      {
        title: 'Should not timeout within the time limit',
        options: { defaultTimeout: 100 },
        shouldTimeout: false,
        addSleepTime: false,
      },
      {
        title: 'Should not timeout when disabled',
        options: { isEnabled: false, defaultTimeout: 100 },
        shouldTimeout: false,
        addSleepTime: true,
      },
    ];

  testCases.map(({ title, options, shouldTimeout, addSleepTime = true }) => {
    it(title, async () => {
      // Arrange
      await setUpModule(options);
      const sleepTime = options.defaultTimeout + (addSleepTime ? 100 : -100);

      // Act
      const response = await request(httpServer).get(
        `/test-controller/${sleepTime}`,
      );

      // Assert
      expect(response.status).toEqual(
        shouldTimeout ? HttpStatus.REQUEST_TIMEOUT : HttpStatus.OK,
      );
    });
  });
});

describe('TimeoutInterceptor with timeout decorator', () => {
  const testCases: IDecoratorTestCase[] =
      [
        {
          title: 'Should timeout using the default timeout value',
          options: [
            { defaultTimeout: TIMEOUT_VALUES.test100ms },
          ],
          sleepTime: TIMEOUT_VALUES.test3000ms,
          timeoutBorder: [TIMEOUT_VALUES.test100ms],
          controllerPath: '/timeout-method-test-controller/',
          restMethod: ['get'],
          responseStatus: [HttpStatus.REQUEST_TIMEOUT],
          skip: false
        },
        {
          title:
            'Should not timeout using the default timeout using timeout decorator',
          options: [
            { isEnabled: false, defaultTimeout: TIMEOUT_VALUES.test100ms },
          ],
          sleepTime: TIMEOUT_VALUES.noTimeout,
          timeoutBorder: [TIMEOUT_VALUES.noTimeout],
          controllerPath: '/timeout-method-test-controller/',
          restMethod: ['get'],
          responseStatus: [HttpStatus.OK],
          skip: false
        },
        {
          title:
            'Should not timeout before default timeout using timeout decorator',
          options: [
            { isEnabled: false, defaultTimeout: TIMEOUT_VALUES.test1000ms },
          ],
          sleepTime: TIMEOUT_VALUES.noTimeout,
          timeoutBorder: [TIMEOUT_VALUES.noTimeout],
          controllerPath: '/timeout-method-test-controller/',
          restMethod: ['post'],
          responseStatus: [HttpStatus.CREATED],
          skip: false
        },
        {
          title:
            'Should timeout before default timeout using timeout decorator',
          options: [
            { defaultTimeout: TIMEOUT_VALUES.test1000ms },
          ],
          sleepTime: TIMEOUT_VALUES.test3000ms,
          timeoutBorder: [TIMEOUT_VALUES.timeout500ms],
          controllerPath: '/timeout-method-test-controller/',
          restMethod: ['post'],
          responseStatus: [HttpStatus.REQUEST_TIMEOUT],
          skip: false
        },
        {
          title:
            'Should timeout after default timeout using timeout decorator',
          options: [
            { defaultTimeout: TIMEOUT_VALUES.test1000ms },
          ],
          sleepTime: TIMEOUT_VALUES.test3000ms,
          timeoutBorder: [TIMEOUT_VALUES.test2000ms],
          controllerPath: '/timeout-bigger-class-test-controller/',
          restMethod: ['patch'],
          responseStatus: [HttpStatus.REQUEST_TIMEOUT],
          skip: false
        },
        {
          title:
            'Should timeout after default timeout using timeout decorator without default timeout in the options',
          options: [{} as ITimeoutInterceptorOptions],
          sleepTime: TIMEOUT_VALUES.test3000ms,
          timeoutBorder: [TIMEOUT_VALUES.test2000ms],
          controllerPath: '/timeout-bigger-class-test-controller/',
          restMethod: ['delete'],
          responseStatus: [HttpStatus.REQUEST_TIMEOUT],
          skip: false
        },
        {
          title:
            'Should timeout after default timeout using timeout decorator for the class without default timeout in the options',
          options: [{} as ITimeoutInterceptorOptions],
          sleepTime: TIMEOUT_VALUES.test3000ms,
          timeoutBorder: [TIMEOUT_VALUES.test2000ms],
          controllerPath: '/timeout-bigger-class-test-controller/',
          restMethod: ['delete'],
          responseStatus: [HttpStatus.REQUEST_TIMEOUT],
          skip: false
        },
        {
          title:
            'Should timeout before default timeout using timeout decorator for the class without default timeout in the options',
          options: [{} as ITimeoutInterceptorOptions],
          sleepTime: TIMEOUT_VALUES.test3000ms,
          timeoutBorder: [TIMEOUT_VALUES.testOverrideSmallerDefault75ms],
          controllerPath: '/timeout-smaller-class-test-controller/',
          restMethod: ['delete'],
          responseStatus: [HttpStatus.REQUEST_TIMEOUT],
          skip: false
        },
        {
          title:
            'Should override class decorator with method decorator with a smaller value',
          options: [{ defaultTimeout: TIMEOUT_VALUES.test1000ms }],
          sleepTime: TIMEOUT_VALUES.test3000ms,
          timeoutBorder: [
            TIMEOUT_VALUES.timeout500ms,
            TIMEOUT_VALUES.defaultTimeout,
          ],
          controllerPath: '/timeout-override-class-test-controller/',
          restMethod: ['post', 'get'],
          responseStatus: [HttpStatus.REQUEST_TIMEOUT, HttpStatus.REQUEST_TIMEOUT],
          overrideWithSmallerValue: true,
          skip: false
        },
        {
          title:
            'Should override class decorator with method decorator with a bigger value',
          options: [{} as ITimeoutInterceptorOptions],
          sleepTime: TIMEOUT_VALUES.test5000ms,
          timeoutBorder: [TIMEOUT_VALUES.test3000ms],
          controllerPath: '/timeout-override-class-test-controller/',
          restMethod: ['patch'],
          responseStatus: [HttpStatus.REQUEST_TIMEOUT],
          skip: false
        },
        {
          title: 'Should timeout using the class decorator',
          options: [{} as ITimeoutInterceptorOptions],
          sleepTime: TIMEOUT_VALUES.test3000ms,
          timeoutBorder: [TIMEOUT_VALUES.test2000ms],
          controllerPath: '/timeout-override-class-test-controller/',
          restMethod: ['get'],
          responseStatus: [HttpStatus.REQUEST_TIMEOUT],
          skip: false
        },
        {
          title: 'Should not timeout using the class decorator',
          options: [{} as ITimeoutInterceptorOptions, { isEnabled: false } as ITimeoutInterceptorOptions],
          sleepTime: TIMEOUT_VALUES.test1000ms,
          timeoutBorder: [TIMEOUT_VALUES.test1000ms],
          controllerPath: '/timeout-override-class-test-controller/',
          restMethod: ['get'],
          responseStatus: [HttpStatus.OK],
          skip: false,
        },
        {
          title: 'Should not timeout (disable timeout) using the class decorator with value = 0',
          options: [{} as ITimeoutInterceptorOptions, { isEnabled: false } as ITimeoutInterceptorOptions],
          sleepTime: TIMEOUT_VALUES.test3000ms,
          timeoutBorder: [TIMEOUT_VALUES.test3000ms],
          controllerPath: '/timeout-override-class-test-controller/',
          restMethod: ['delete'],
          responseStatus: [HttpStatus.OK],
          skip: false
        },
      ];

  testCases.map(
      ({
         title,
         options,
         controllerPath,
         restMethod,
         responseStatus,
         sleepTime,
         timeoutBorder,
         overrideWithSmallerValue,
         skip
       }) => {
        options.forEach((option) => {
          // isEnabled is set to true in the timeout interceptor
          title = (isNil(option?.isEnabled) ? 'isEnabled = true  - ' : 'isEnabled = false - ') + title;
          const testFn = skip ? xit : it;
          testFn(title, async () => {
            // Arrange
            await setUpModule(option);

            await testRequestTimeAndStatus(
                {
                  sleepTime,
                  restMethod,
                  timeoutBorder,
                  responseStatus,
                  controllerPath,
                  overrideWithSmallerValue
                }
            );
          });
        });
      },
  );
});

const testRequestTimeAndStatus = async ({
      sleepTime,
      restMethod,
      timeoutBorder,
      responseStatus,
      controllerPath,
      overrideWithSmallerValue = false,
    }: Partial<IDecoratorTestCase>): Promise<void> => {
  for (const [index, method] of restMethod.entries()) {
    const startTime = new Date().valueOf();

    // Act
    const response = await request(httpServer)[method](
      `${controllerPath}${sleepTime}`,
    );
    const endTime = new Date().valueOf();

    const timeoutDurationValue = endTime - startTime;

    // Assert
    if (!overrideWithSmallerValue) {
      expect(timeoutDurationValue).toBeGreaterThanOrEqual(timeoutBorder[index]);
    }

    expect(timeoutDurationValue).toBeLessThan(
      timeoutBorder[index] + TIMEOUT_VALUES.requestRTT,
    );

    expect(response.status).toEqual(responseStatus[index]);
  }
};
