import React, { FC } from 'react';
import './SearchComponent.scss';
import Grid from '@mui/material/Grid2';
import { Paper, styled } from '@mui/material';
import CourtDisplay from '../CourtDisplay/CourtDisplay';
import MenuInputAutocomplete from '../MenuInputAutocomplete/MenuInputAutocomplete';
import MenuInputStandard from '../MenuInputStandard/MenuInputStandard';

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
  return (
    <div className="SearchComponent">
      <Grid container spacing={3}  >
        <Grid size={{ sm: 12, md: 4 }}>
          <div className='grid-item-container'>
            <div id='search-menu-container'>
              <MenuInputAutocomplete />
              <MenuInputAutocomplete />
              <MenuInputStandard />
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
