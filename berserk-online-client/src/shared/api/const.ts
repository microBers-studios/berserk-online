export enum RoomEvent {
    PlayerJoined = 'PlayerJoined',
    SpectatorJoined = 'SpectatorJoined',
    PlayerLeaved = 'PlayerLeaved',
    SpectatorLeaved = 'SpectatorLeaved',
    SpectatorToPlayer = 'SpectatorToPlayer',
    PlayerToSpectator = 'PlayerToSpectator',
}

export enum RoomListEvent {
    RoomCreated = 'RoomCreated',
    RoomRemoved = 'RoomRemoved',
}
