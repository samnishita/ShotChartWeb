import React, { FC, useEffect, useState } from 'react';
import './SearchComponent.scss';
import Grid from '@mui/material/Grid2';
import { Button, Paper, styled } from '@mui/material';
import CourtDisplay from '../CourtDisplay/CourtDisplay';
import SelectMenu from '../SelectMenu/SelectMenu';
import AutocompleteMenu from '../AutocompleteMenu/AutocompleteMenu';
import { generateYearsFromCurrentYearNumber } from '../util/shared-util';
import { CURRENT_YEAR_NUMBER } from '../util/constants';
import { generateYearsArray } from '../model/AutocompleteMenuItem';
import { getAllPlayers } from '../service/player-service';
import { Player } from '../model/Player';

interface SearchComponentProps { }
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const SearchComponent: FC<SearchComponentProps> = () => {
  const [year, setYear] = useState<string | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [seasonType, setSeasonType] = useState<string | null>(null);
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
              <AutocompleteMenu id={'year-selection'} labelText='Year' setSelectedValue={setYear} menuItems={generateYearsArray(generateYearsFromCurrentYearNumber(CURRENT_YEAR_NUMBER))} />
              <AutocompleteMenu id={'player-selection'} labelText={'Player'} setSelectedValue={setPlayer} menuItems={playerList} />
              <SelectMenu id={'season-type-selection'} labelText={'Season Type'} value={''} setSelectedValue={setSeasonType} menuItems={[]} />
              <Button variant="contained">Search</Button>
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
