import React, { FC, useState } from 'react';
import './Header.scss';
import githubLogo from '/src/images/GitHub-Mark-Light-64px.png'
import { Tabs, ThemeProvider } from '@mui/material';
import { useScreenWidth } from '../util/screen-size-util';
import MenuIcon from '@mui/icons-material/Menu';
import { navTabTheme } from '../styles/nav-tab-theme';
import { useLocation } from 'react-router-dom';
import NavTab from '../NavTab/NavTab';

interface HeaderProps {

}

const menuItems = [{
  display: 'Home', path: 'home', id: "home-tab", displayOrder: 0
}, {
  display: 'Search', path: 'search', id: 'search-tab', displayOrder: 1
}, {
  display: 'Advanced', path: 'advanced', id: 'advanced-tab', displayOrder: 2
}];

const Header: FC<HeaderProps> = () => {
  const { pathname } = useLocation();
  const foundIndex: number = menuItems.findIndex(item => item.path === pathname.split("/")?.pop());

  const [navTabsValue, setNavTabsValue] = useState(foundIndex);
  const maxWidthToShowMenuIcon: number = 1000;
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event)
    console.log(newValue)
    setNavTabsValue(newValue)
  };

  const createNavTabs: JSX.Element[] = menuItems.map(eachMenuItem =>
    <NavTab key={eachMenuItem.id} id={eachMenuItem.id} display={eachMenuItem.display} path={eachMenuItem.path}
      selected={false} onChange={handleTabChange} displayorder={eachMenuItem.displayOrder} />
  );

  return (
    <>
      <div className="Header">
        <div id="titles-container">
          <h1 className='main-header'>customnbashotcharts.com</h1>
          <h4 className='sub-header'>NBA Shooting Data Analytics</h4>
        </div>
        <div id="header-right-container">
          <div id="nav-tab-container" hidden={useScreenWidth() < maxWidthToShowMenuIcon}>
            <ThemeProvider theme={navTabTheme}>
              <Tabs value={navTabsValue > -1 ? navTabsValue : false} onChange={handleTabChange} textColor='secondary' indicatorColor='secondary'>
                {createNavTabs}
              </Tabs>
            </ThemeProvider>
          </div>
          <div hidden={useScreenWidth() >= maxWidthToShowMenuIcon}>
            <MenuIcon id="menu-button" />
          </div>
          <a id="github-icon" target="_blank" href="https://github.com/samnishita/ShotChartWeb"><img src={githubLogo} alt="link to github repository"></img></a>
        </div>
      </div>
    </>
  )
};

export default Header;
