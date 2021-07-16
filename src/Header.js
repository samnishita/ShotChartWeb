import './Header.css'

function Header() {
    return (
        <header className='Header'>
            <div class="header-grid-item" id="title">Custom NBA Shot Charts <span id='versionText'>Version 0.0</span></div>
            <div class="header-grid-item" id="date-accuracy">
                <div id='accuracy-title'><u>Accurate As Of</u></div>
                <div id='accuracy-date'>July 3, 2021</div>
            </div>
        </header>
    );
}

export default Header;