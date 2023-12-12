import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from '@microsoft/signalr'
import { apiUrl } from 'src/shared/lib'

export const connect = (url: string): HubConnection =>
    new HubConnectionBuilder()
        .withUrl(apiUrl + url, {
            withCredentials: true,
        })
        .configureLogging(LogLevel.Information)
        .build()
