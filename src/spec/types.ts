export const TIMEOUT_VALUES = {
	requestRTT: 50, // RoundTripTime, approx. request time without delays, tested in debug. Randomly failing on range.
	test100ms: 100,
	timeout500ms: 500,
	test1000ms: 1000,
	test2000ms: 2000,
	defaultTimeout: 10 * 1000,
	testOverrideBiggerDefault12000ms: 12000,
	testOverrideSmallerDefault75ms: 75,
};
