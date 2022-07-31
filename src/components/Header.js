import logo from "../assets/images/spacex_logo.svg";

function Header(props) {
    return (
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p className="title">
                StarLink Tracker
            </p>
        </header>
    );
}

export default Header;
