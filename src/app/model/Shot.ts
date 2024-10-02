export interface Shot {
    uniqueShotId: string;
    year: string,
    seasonType: string,
    gameId: number,
    gameEventId: number,
    playerId: number,
    playerFullName: string,
    playerLastName: string,
    playerFirstName: string,
    shootingTeamId: number,
    shootingTeamName: string,
    period: number,
    minutes: number,
    seconds: number,
    eventType: string,
    actionType: string,
    shotType: string,
    shotZoneBasic: string,
    shotZoneArea: string,
    shotZoneRange: string,
    distance: number,
    x: number,
    y: number,
    shotAttempted: true,
    shotMade: false,
    gameDate: string,
    awayTeamAbbr: string,
    awayTeamId: number,
    awayTeamName: string,
    homeTeamAbbr: string,
    homeTeamId: number,
    homeTeamName: string,
    atHome: boolean
}