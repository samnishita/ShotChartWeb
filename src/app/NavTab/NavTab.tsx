import { FC, KeyboardEvent } from 'react';
import './NavTab.scss';
import { styled, Tab } from '@mui/material';
import { Link } from 'react-router-dom';
import { appTheme } from '../styles/app-theme';

interface NavTabProps {
  id: string, display: string, path: string,
  selected: boolean, onChange: any, displayorder: number

}
const StyledTab = styled(Tab)({
  textTransform: 'none',
  color: appTheme.palette.primary.contrastText,
  height: '100%',
  fontSize: '1rem',
  fontFamily: 'inherit',
  fontWeight: '300',
});

const NavTab: FC<NavTabProps> = (props: NavTabProps) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLAnchorElement>, displayOrder: number) => {
    if (e.key === 'Enter') {
      props.onChange(e,displayOrder);
    }
  }
  return (<>
    <Link to={props.path} onKeyDown={e => handleKeyPress(e, props.displayorder)}>
      <StyledTab disableRipple aria-current={props.selected} tabIndex={-1}
        className='header-nav-tab' label={props.display}{...props} />
    </Link></>
  )
};

export default NavTab;
