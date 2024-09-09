import { ConfigLoader } from '@/common/lib/configuration/ConfigLoader'
import { TelemetryConfig } from '@/common/models/config'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { Resource } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

// import { ATTR_SERVICE_NAMESPACE } from '@opentelemetry/semantic-conventions/build/esnext/experimental_attributes'

export class AppTelemetry {
  private readonly telemetryConfig =
    ConfigLoader.getModelConfig(TelemetryConfig)

  public start(): void {
    if (!this.telemetryConfig.enable) {
      return
    }

    const metricExporter = new OTLPMetricExporter({
      url: this.telemetryConfig.metricsEndpoint,
      headers: {},
      timeoutMillis: 1000,
    })

    const traceExporter = new OTLPTraceExporter({
      url: this.telemetryConfig.traceEndpoint,
      timeoutMillis: 1000,
      // headers: { 'signoz-access-token': 'your SigNoz Cloud ingestion key' }, // Use if you are using SigNoz Cloud
    })

    const sdk = new NodeSDK({
      traceExporter: traceExporter,
      metricReader: new PeriodicExportingMetricReader({
        exporter: metricExporter,
      }),
      instrumentations: [getNodeAutoInstrumentations()],
      resource: new Resource({
        [ATTR_SERVICE_NAME]: this.telemetryConfig.serviceName,
        // [ATTR_SERVICE_NAMESPACE]: this.telemetryConfig.serviceNamespace,
        'service.namespace': this.telemetryConfig.serviceNamespace,
        'deployment.environment.name': this.telemetryConfig.serviceNamespace,
      }),
    })

    sdk.start()
  }
}
