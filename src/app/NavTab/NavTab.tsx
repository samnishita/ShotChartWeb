import { FC, KeyboardEvent } from 'react';
import './NavTab.scss';
import { styled, Tab } from '@mui/material';
import { navTabTheme } from '../styles/nav-tab-theme';
import { Link } from 'react-router-dom';

interface NavTabProps {
  id: string, display: string, path: string,
  selected: boolean, onChange: any, displayorder: number

}
const StyledTab = styled(Tab)({
  textTransform: 'none',
  color: navTabTheme.palette.primary.main,
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
