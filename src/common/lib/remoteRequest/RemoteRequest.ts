import axios, { Axios, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

export class RemoteRequest {
    public readonly service: Axios
    private config: AxiosRequestConfig

    constructor(config?: AxiosRequestConfig) {
        this.config = config
        this.service = axios.create(config)

        this.service.interceptors.request.use(
            config => {
                return { ...config, ...this.config } as InternalAxiosRequestConfig<any>
            },
            error => {
                return Promise.reject(error)
            },
        )
        this.service.interceptors.response.use(
            response => {
                return response.data
            },
            error => {
                return Promise.reject(error)
            },
        )
    }

    public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.service.get(url, config)
    }

    public post<T>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
        return this.service.post(url, data, config)
    }

    public put<T>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
        return this.service.put(url, data, config)
    }

    public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.service.delete(url, config)
    }

    public setConfig(config: AxiosRequestConfig): void {
        this.config = { ...this.config, ...config }
    }
}
