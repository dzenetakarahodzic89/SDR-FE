export class MapState {
  countries: any[];
  numberOfActivePlayerTeams: number;
  numberOfActiveNpcTeams: number;
  numberOfActiveCountries: number;
  numberOfInactiveCountries: number;
  numberOfPassiveCountries: number;
  constructor(
    playerTeams: number,
    npcTeams: number,
    activeCountries: number,
    inactiveCountries: number,
    passiveCountries: number
  ) {
    (this.numberOfActivePlayerTeams = playerTeams),
      (this.numberOfActiveNpcTeams = npcTeams);
    this.numberOfActiveCountries = activeCountries;
    this.numberOfInactiveCountries = inactiveCountries;
    this.numberOfPassiveCountries = passiveCountries;
  }
}
