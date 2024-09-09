import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import realFs from 'fs'
import { gracefulify } from 'graceful-fs'
import { useContainer } from 'class-validator'
import dotenv from 'dotenv'
import Transport from 'winston-transport'
import { NestJsConsoleTransport } from '@/common/lib/log/transports/console/NestJsConsoleTransport'
import { ConfigLoader } from '@/common/lib/configuration/ConfigLoader'
import { AppTelemetry } from '@/common/telemetry/AppTelemetry'
import { WinstonModule } from 'nest-winston'
import { ValidationPipe, VERSION_NEUTRAL, VersioningType } from '@nestjs/common'
import { DocumentationLoader } from '@/common/docs/DocumentationLoader'
import { TransformPipe } from '@/common/pipes/transform.pipe'
import { json, urlencoded } from 'express'

gracefulify(realFs)
dotenv.config()
ConfigLoader.loadAll(process.env)

async function bootstrap(): Promise<void> {
  const telemetry = new AppTelemetry()
  telemetry.start()

  const logTransports: Transport[] = [new NestJsConsoleTransport()]
  const appPort = process.env.PORT || 5000

  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger({
      transports: logTransports,
    }),
  })

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  })

  DocumentationLoader.load(app)

  app.useGlobalPipes(new TransformPipe(), new ValidationPipe())
  app.use(urlencoded({ extended: true, limit: '10mb' }))
  app.use(json({ limit: '10mb' }))

  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  await app.listen(appPort, () => console.log(`Server started on port = ${appPort}`))
}

bootstrap().catch(console.error)
