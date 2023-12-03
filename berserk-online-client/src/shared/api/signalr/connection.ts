import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { apiUrl } from 'src/shared/lib'

export const signalRConnection = new HubConnectionBuilder()
    .withUrl(apiUrl + '/connect', {
        withCredentials: true,
    })
    .configureLogging(LogLevel.Information)
    .build()
