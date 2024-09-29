import React, { FC, useState } from 'react';
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
  const [year, setYear] = useState(null);
  const [player, setPlayer] = useState(null);
  const [seasonType, setSeasonType] = useState(null);
  return (
    <div className="SearchComponent">
      <Grid container spacing={3}  >
        <Grid size={{ sm: 12, md: 4 }}>
          <div className='grid-item-container'>
            <div id='search-menu-container'>
              <AutocompleteMenu id={'year-selection'} labelText='Year' setSelectedValue={setYear} menuItems={generateYearsArray(generateYearsFromCurrentYearNumber(CURRENT_YEAR_NUMBER))} />
              <AutocompleteMenu id={'player-selection'} labelText={'Player'} setSelectedValue={setPlayer} menuItems={getAllPlayers()} />
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
