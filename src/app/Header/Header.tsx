import React, { FC, useState } from 'react';
import './Header.scss';
import githubLogo from '/src/images/GitHub-Mark-Light-64px.png'
import { Tabs, ThemeProvider } from '@mui/material';
import { useScreenWidth } from '../util/screen-size-util';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import NavTab from '../NavTab/NavTab';
import { appTheme } from '../styles/app-theme';

interface HeaderProps {

}

const menuItems = [{
  display: 'Home', path: 'home', id: "home-tab", displayOrder: 0
}, {
  display: 'Search', path: 'search', id: 'search-tab', displayOrder: 1
}, {
  display: 'Advanced', path: 'advanced', id: 'advanced-tab', displayOrder: 2
}];

const checkPath = (path: string) => {
  if (path === '/' || path === '') {
    return 0;
  } else {
    return menuItems.findIndex(item => item.path === path.split("/")?.pop());
  }
}

const Header: FC<HeaderProps> = () => {
  const { pathname } = useLocation();
  const [navTabsValue, setNavTabsValue] = useState(checkPath(pathname));
  const maxWidthToShowMenuIcon: number = 800;
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setNavTabsValue(newValue)
  };

  const createNavTabs = () => {
    let elements = [];
    for (let i = 0; i < menuItems.length; i++) {
      let eachMenuItem = menuItems[i];
      elements.push(<NavTab key={eachMenuItem.id} id={eachMenuItem.id} display={eachMenuItem.display} path={eachMenuItem.path}
        selected={i === checkPath(eachMenuItem.path)} onChange={handleTabChange} displayorder={eachMenuItem.displayOrder} />)
    }
    return elements;
  }
  return (
    <>
      <div id="header-wrapper">
        <div className="Header">
          <div id="titles-container">
            <h1>CNSC</h1>
          </div>
          <div id="nav-tab-container" hidden={useScreenWidth() < maxWidthToShowMenuIcon}>
            <ThemeProvider theme={appTheme}>
              <Tabs value={navTabsValue > -1 ? navTabsValue : false} onChange={handleTabChange} textColor="primary" indicatorColor='primary' >
                {createNavTabs()}
              </Tabs>
            </ThemeProvider>
          </div>
          <div hidden={useScreenWidth() >= maxWidthToShowMenuIcon}>
            <MenuIcon id="menu-button" />
          </div>
          <a id="github-icon" target="_blank" href="https://github.com/samnishita/ShotChartWeb"><img src={githubLogo} alt="link to github repository" width="64px" height="64px"></img></a>
        </div>
        <div id='bottom-border'></div>
      </div>
    </>
  )
};

export default Header;
