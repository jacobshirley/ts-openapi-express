import { openapiRoutes, openapiExpress } from '../../src/index.js'
import { expect, describe, it } from 'vitest'
import request from 'supertest'
import { paths } from './test-schema.gen.js'

const TEST_SPEC = `${__dirname}/openapi.test.yaml`

describe('openapi-express', () => {
    it('should be validated against a generated TypeScript (output of npm package "openapi-typescript") spec', async () => {
        openapiRoutes<paths>({
            // @ts-expect-error
            '/somethingThatShouldNotBeHere': {
                get: {
                    handler() {
                        return {
                            status: 200,
                            headers: {},
                            body: {},
                        }
                    },
                },
            },
            '/testKeepLocalSchemas': {
                get: {
                    handler() {
                        return {
                            '200': {
                                headers: {},
                                body: {},
                            },
                        }
                    },
                },
            },
            '/': {
                post: {
                    handler() {
                        return {
                            200: {
                                headers: {},
                                body: {},
                            },
                        }
                    },
                },
            },
            '/testPost': {
                post: {
                    handler(request) {
                        return {
                            200: {
                                headers: {},
                                body: {
                                    allowedProperty: 'test',
                                },
                            },
                        }
                    },
                },
            },
            '/testApiCall': {
                get: {
                    handler(request) {
                        return {
                            200: {
                                headers: {},
                                body: 'something',
                            },
                        }
                    },
                },
            },
            '/testPathParameters/{param1}/{param2}': {
                get: {
                    handler(req) {
                        req.params.param1 === 'test'
                        //@ts-expect-error
                        req.params.param1 === true
                        //@ts-expect-error
                        req.params.param2 === 'test'
                        req.params.param2 === true

                        //@ts-expect-error
                        req.params.param3

                        return {
                            200: {
                                headers: {
                                    'X-Defined-Header': 'text/plain',
                                    'accept-ranges': '123',
                                    'X-Undefined-Headers': 'text/plain',
                                },
                                body: 'test',
                            },
                        }
                    },
                },
            },
            '/testQueryParams': {
                get: {
                    handler(request) {
                        request.query.id
                        //@ts-expect-error
                        request.query.notADefinedProperty

                        return {
                            200: {
                                headers: {},
                                body: {},
                            },
                        }
                    },
                },
            },
            '/testRequestHeaders': {
                post: {
                    async handler(request) {
                        request.header('x-test-header') === 'test'
                        //@ts-expect-error
                        request.header('x-test-header') === 'test2'

                        return {
                            200: {
                                headers: {},
                                body: {},
                            },
                        }
                    },
                },
            },
            '/testCommonParameters/{commonParam}': {
                get: {
                    async handler(request) {
                        request.params.commonParam
                        request.query.commonQuery

                        return {
                            200: {
                                headers: {},
                                body: {},
                            },
                        }
                    },
                },
            },
        })
    })

    it('should be convertable to an HTTP server', async () => {
        const app = openapiExpress<paths>({
            specPath: TEST_SPEC,
            routes: {
                '/testApiCall': {
                    get: {
                        //@ts-expect-error
                        handler(req) {
                            return {
                                403: {
                                    headers: {},
                                    //@ts-expect-error
                                    body: req.query.test,
                                },
                            }
                        },
                    },
                },
            },
            validateRequest: false,
            validateResponse: false,
        })

        const { text } = await request(app)
            .get('/testApiCall?test=10')
            .send()
            .expect(403)

        expect(text).to.equal('10')
    })

    it('should convert OpenAPI path parameter format (curly brackets) into Express parameter format (colon)', async () => {
        const app = openapiExpress({
            specPath: TEST_SPEC,
            routes: {
                '/testPathParameters/{param1}/{param2}': {
                    get: {
                        handler(req) {
                            return {
                                200: {
                                    headers: {},
                                    body: {
                                        //@ts-expect-error
                                        param1: req.params.param1,
                                        //@ts-expect-error
                                        param2: req.params.param2,
                                    },
                                },
                            }
                        },
                    },
                },
            },
            validateRequest: false,
            validateResponse: false,
        })

        await request(app).get('/testPathParameters/1/2').expect(200)
    })

    it('should get parameters from the JSON body, if enabled', async () => {
        const app = openapiExpress<paths>({
            specPath: TEST_SPEC,
            //@ts-expect-error
            routes: {
                '/testPost': {
                    post: {
                        handler(req) {
                            return {
                                200: {
                                    headers: {},
                                    body: {
                                        allowedProperty: req.body.testString,
                                    },
                                },
                            }
                        },
                    },
                },
            },
            validateRequest: false,
            validateResponse: false,
        })

        const { body, status } = await request(app).post('/testPost').send({
            testString: '123',
        })

        expect(body.allowedProperty).to.equal('123')
        expect(status).to.equal(200)
    })

    it('should allow access to /', async () => {
        const app = openapiExpress<paths>({
            specPath: TEST_SPEC,
            //@ts-expect-error
            routes: {
                '/': {
                    post: {
                        handler(req) {
                            return {
                                200: {
                                    headers: {},
                                    body: {},
                                },
                            }
                        },
                    },
                },
            },
            validateRequest: false,
            validateResponse: false,
        })

        const { status } = await request(app).post('/').send({
            testString: '123',
        })

        expect(status).to.equal(200)
    })

    it('should return a 415 error when the content type does not match an allowed type', async () => {
        const app = openapiExpress<paths>({
            specPath: TEST_SPEC,
            //@ts-expect-error
            routes: {
                '/testPost': {
                    post: {
                        handler(req) {
                            return {
                                200: {
                                    headers: {},
                                    body: {
                                        allowedProperty: req.body.testString,
                                    },
                                },
                            }
                        },
                    },
                },
            },
        })

        app.use((err, req, next) => {
            if (err instanceof Error) {
                err.message = '' //Reduce logging
                err.stack = '' //Reduce logging
            }
            next(err)
        })

        const { status, text } = await request(app)
            .post('/testPost')
            .set('Content-Type', 'image/png')
            .send('123')

        expect(status, text).to.equal(415)
    })

    it('should be able to stream an Iterable', async () => {
        const app = openapiExpress<paths>({
            specPath: TEST_SPEC,
            //@ts-expect-error
            routes: {
                '/testApiCall': {
                    get: {
                        handler() {
                            return {
                                200: {
                                    headers: {},
                                    body: (function* () {
                                        yield '1'
                                        yield '2'
                                        yield '3'
                                    })(),
                                },
                            }
                        },
                    },
                },
            },
        })

        const { text } = await request(app)
            .get('/testApiCall')
            .send()
            .expect(200)

        expect(text).to.equal('123')
    })

    it('should be able to stream an AsyncIterable', async () => {
        const app = openapiExpress<paths>({
            specPath: TEST_SPEC,
            //@ts-expect-error
            routes: {
                '/testApiCall': {
                    get: {
                        handler() {
                            return {
                                200: {
                                    headers: {},
                                    body: (async function* () {
                                        yield '1'
                                        yield '2'
                                        yield '3'
                                    })(),
                                },
                            }
                        },
                    },
                },
            },
        })

        const { text } = await request(app)
            .get('/testApiCall')
            .send()
            .expect(200)

        expect(text).to.equal('123')
    })

    it('should be able to stream a ReadableStream', async () => {
        const app = openapiExpress<paths>({
            specPath: TEST_SPEC,
            //@ts-expect-error
            routes: {
                '/testApiCall': {
                    get: {
                        handler() {
                            return {
                                200: {
                                    headers: {},
                                    body: new ReadableStream({
                                        start(controller) {
                                            controller.enqueue('test')
                                            controller.close()
                                        },
                                    }),
                                },
                            }
                        },
                    },
                },
            },
        })

        const { text } = await request(app)
            .get('/testApiCall')
            .send()
            .expect(200)

        expect(text).to.equal('test')
    })

    it('should be able to stream an Array', async () => {
        const app = openapiExpress<paths>({
            specPath: TEST_SPEC,
            //@ts-expect-error
            routes: {
                '/testArray': {
                    get: {
                        handler() {
                            return {
                                200: {
                                    headers: {},
                                    body: ['1', '2', '3'],
                                },
                            }
                        },
                    },
                },
            },
        })

        const { text } = await request(app).get('/testArray').send().expect(200)

        expect(text).to.equal(JSON.stringify(['1', '2', '3']))
    })

    it('should be able to handle errors thrown in handlers', async () => {
        class CustomError extends Error {
            statusCode: number
            constructor(message: string, statusCode: number) {
                super(message)
                this.statusCode = statusCode
            }
        }

        const app = openapiExpress<paths>({
            specPath: TEST_SPEC,
            routes: {
                //@ts-expect-error
                '/testErrorHandling': {
                    get: {
                        handler() {
                            throw new CustomError('Test error', 203)
                        },
                    },
                },
            },
            errorMiddleware: [
                (err, req, res, next) => {
                    if (err instanceof CustomError) {
                        res.status(err.statusCode).send(err.message)
                    } else {
                        res.status(500).send('Internal Server Error')
                    }
                },
            ],
        })

        const { status, text } = await request(app)
            .get('/testErrorHandling')
            .send()
            .expect(203)

        expect(text).to.equal('Test error')
    })
})
