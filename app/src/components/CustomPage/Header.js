import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Col,
  Row,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { apiBaseUrl, siteName } from '../../constants/appConfig';
import logoImg from '../../assets/logo1.png';
import { history } from '../../store/configureStore';
import { connect } from 'react-redux';
// import * as actionsActions from '../actions/actions';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    history.goBack();
  }

  render() {
    const { showBackButton, pageTitle } = this.props;

    let backButton = null;
    if (showBackButton) {
      backButton = (
        <Col xs="auto" className="ml-auto d-none d-md-flex flex-column justify-content-center">
          <Button color="secondary" onClick={this.goBack}>
            <i className="fa fa-backward" />
            &nbsp;
            Back
          </Button>
        </Col>
      );
    }

    const { appearance } = this.props.appConfig.data;

    let appLogo;
    if (appearance && appearance.logo) {
      appLogo = `${apiBaseUrl}/static/logo.png`;
    } else {
      appLogo = logoImg;
    }

    return (
      <Row className="mt-3 mb-3">
        <Col xs="auto" className="pr-0">
          <Link to="/" title={`Go to Home Page`}>
            <img src={appLogo} className="img-responsive logo" alt={`${siteName} Logo`} />
          </Link>
        </Col>

        <Col xs={9} md={6} className="d-flex flex-column justify-content-center">
          <h4 className="m-0">
            {pageTitle}
          </h4>
        </Col>

        {backButton}
      </Row>
    );
  }
}

Header.defaultProps = {
  appConfig: {},
  showBackButton: true,
};

Header.propTypes = {
  appConfig: PropTypes.object,
  pageTitle: PropTypes.string.isRequired,
  showBackButton: PropTypes.bool,
};

const mapStateToProps = (state => ({
  appConfig: state.appConfig,
}));

export default connect(mapStateToProps)(Header);
