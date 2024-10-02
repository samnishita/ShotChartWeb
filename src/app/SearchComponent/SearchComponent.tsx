import React, { FC, useEffect, useState } from 'react';
import './SearchComponent.scss';
import Grid from '@mui/material/Grid2';
import { Button, Paper, styled, ThemeProvider } from '@mui/material';
import CourtDisplay from '../CourtDisplay/CourtDisplay';
import SelectMenu from '../SelectMenu/SelectMenu';
import AutocompleteMenu from '../AutocompleteMenu/AutocompleteMenu';
import { generateYearsFromCurrentYearNumber } from '../util/shared-util';
import { CURRENT_YEAR_NUMBER } from '../util/constants';
import { getAllPlayers } from '../service/player-service';
import { Player } from '../model/Player';
import { ALL_SEASON_TYPES, SeasonType } from '../model/SeasonType';
import { appTheme } from '../styles/app-theme';
import { Shot } from '../model/Shot';
import { getBasicShots } from '../service/shot-service';
import { generateYearsArray, Year } from '../model/Year';

interface SearchComponentProps { }

const SearchComponent: FC<SearchComponentProps> = () => {
  const [yearList, setYearList] = useState<Year[]>(generateYearsArray(generateYearsFromCurrentYearNumber(CURRENT_YEAR_NUMBER)).reverse());
  const [year, setYear] = useState<Year>(yearList[0]);
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [player, setPlayer] = useState<Player>(playerList[0]);
  const [seasonTypeList, setSeasonTypeList] = useState<SeasonType[]>(ALL_SEASON_TYPES);
  const [seasonType, setSeasonType] = useState<SeasonType>(seasonTypeList[1]);
  const [currentShots, setCurrentShots] = useState<Shot[]>([]);
  const handleSearchButtonClick = async () => {
    setCurrentShots(await getBasicShots(year, player, seasonType));
  }
  useEffect(() => {
    getAllPlayers().then(data => {
      setPlayerList(data.map(player => {
        return {
          ...player,
          id: player.playerId,
          label: (player.playerFirstName + " " + player.playerLastName).trim()
        }
      }));
    })
  }, [])
  return (
    <div className="SearchComponent">
      <Grid container spacing={3}  >
        <Grid size={{ sm: 12, md: 4 }}>
          <div className='grid-item-container'>
            <div id='search-menu-container'>
              <ThemeProvider theme={appTheme}>
                <AutocompleteMenu id={'year-selection'} labelText='Year' setSelectedValue={setYear} menuItems={yearList} />
                <AutocompleteMenu id={'player-selection'} labelText={'Player'} setSelectedValue={setPlayer} menuItems={playerList} />
                <SelectMenu id={'season-type-selection'} labelText={'Season Type'} value={seasonType} setSelectedValue={setSeasonType} menuItems={seasonTypeList} />
                <Button variant="contained" onClick={handleSearchButtonClick}>Search</Button>
              </ThemeProvider>
            </div>
          </div>
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <div className='grid-item-container'>
            <CourtDisplay />
          </div>
        </Grid>
        <Grid size={{ sm: 12, md: 2 }}>
          <div className='grid-item-container'>
            Metrics will go here
          </div>
        </Grid>
        <Grid size={12}>
          <div className='grid-item-container'>
            Distribution could go here?
          </div>
        </Grid>
      </Grid>

    </div>
  )
};

export default SearchComponent;
