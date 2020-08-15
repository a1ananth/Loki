import React from 'react';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import { Row, Col, Container, Dropdown, DropdownToggle, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { appVersion, appName, githubProjectLink } from '../../constants/appConfig';
import DropdownMenu from 'reactstrap/es/DropdownMenu';
import { connect } from 'react-redux';
import { colorLuminance } from '../../utils/general';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    let setToken = cookie.load('authToken');
    if (!setToken) {
      setToken = '';
    }

    this.state = {
      isLeftDropdownOpen: false,
      authToken: setToken,
    };

    this.toggleLeftDropdown = this.toggleLeftDropdown.bind(this);
  }

  toggleLeftDropdown() {
    const { isLeftDropdownOpen } = this.state;
    this.setState({
      isLeftDropdownOpen: !isLeftDropdownOpen,
    });
  }

  getFooterStyle() {
    const footerStyle = {};

    if (!this.props.appConfig.loaded) {
      return footerStyle;
    }

    const { data } = this.props.appConfig;

    if (data.appearance && data.appearance.backgroundColor) {
      const { backgroundColor } = data.appearance;
      footerStyle.backgroundColor = colorLuminance(backgroundColor, -0.05);
    }

    return footerStyle;
  }

  render() {
    const { appConfig } = this.props;
    const { isLeftDropdownOpen, authToken } = this.state;
    const footerStyle = this.getFooterStyle();

    let authItem = null;
    if (
      (authToken && authToken.length > 0) ||
      (
        appConfig.loaded &&
        appConfig.data &&
        appConfig.data.authentication &&
        appConfig.data.authentication.requireAuthentication
      )
    ) {
      authItem = (
        <DropdownItem tag={Link} to="/auth">
          Auth
        </DropdownItem>
      );
    }

    let settingsItem = null;
    if (appConfig.loaded && appConfig.canEdit) {
      settingsItem = (
        <Link to="/settings" className="ml-3">
          <i className="fa fa-cogs" />&nbsp;Settings
        </Link>
      );
    }

    return (
      <footer className="footer" style={footerStyle}>
        <Container>
          <Row>
            <Col xs="auto" className="left-menu">
              <Dropdown tag="span" isOpen={isLeftDropdownOpen} toggle={this.toggleLeftDropdown}>
                <DropdownToggle
                  tag="a"
                  data-toggle="dropdown"
                  aria-expanded={isLeftDropdownOpen}
                  className="pl-2 pr-2 pt-1 pb-1"
                >
                  <i className="fa fa-bars" />
                </DropdownToggle>
                <DropdownMenu className="p-0">
                  <DropdownItem tag={Link} to="/">
                    Home
                  </DropdownItem>

                  {authItem}

                  <DropdownItem tag={Link} to="/about">
                    About
                  </DropdownItem>

                  <DropdownItem tag={Link} to="/how-it-works">
                    How it works?
                  </DropdownItem>

                  <DropdownItem tag={Link} to="/privacy">
                    Privacy
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {settingsItem}
            </Col>

            <Col xs="auto" className="ml-auto text-right">
              <a href={githubProjectLink} target="_blank" rel="noopener noreferrer" className="ml-4">
                <i className="fa fa-github" />&nbsp;
                {appName} {appVersion}
              </a>
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }
}

Footer.defaultProps = {
  appConfig: {},
};

Footer.propTypes = {
  appConfig: PropTypes.object,
};

const mapStateToProps = (state => ({
  appConfig: state.appConfig,
}));

export default connect(mapStateToProps)(Footer);
