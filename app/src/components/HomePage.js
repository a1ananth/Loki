import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import Footer from "./Common/Footer";
import { isLokiExtensionActive, isMobile } from '../utils/general';
import HomePageSearchForm from './HomePage/HomePageSearchForm';
import { apiBaseUrl, appName, siteName } from '../constants/appConfig';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobileBrowser: isMobile.any(),
      isExtensionActive: true,
    };
  }

  componentDidMount() {
    document.title = siteName;

    setTimeout(() => {
      this.setState({
        isExtensionActive: isLokiExtensionActive(),
      });
    }, 2 * 1000);
  }

  render() {
    let topWarning = null;
    const { appConfig } = this.props;

    if (appConfig.loaded && (!appConfig.data.search || !appConfig.data.search.baseUrl)) {
      topWarning = (
        <div className="unsecure-warning">
          You have not set the Base URL for this instance.
          If you are the site administrator, use the <Link to="/settings">
          Settings page
        </Link> to configure Base URL and install the browser extension.
        </div>
      );
    } else if (appConfig.loaded && appConfig.isPubliclyEditable) {
      topWarning = (
        <div className="unsecure-warning">
          This {appName} instance is publicly editable.
          If you are the site administrator, use the <Link to="/settings">
          Settings page
        </Link> to create some authentication tokens immediately.
        </div>
      );
    }

    let extensionAlert = null;
    if (appConfig.loaded && appConfig.data.search && appConfig.data.search.baseUrl) {
      const { isExtensionActive, isMobileBrowser } = this.state;
      if (!isMobileBrowser && !isExtensionActive) {
        const extensionLink = `${apiBaseUrl}/extension/download`;
        extensionAlert = (
          <div className="download-extension-alert">
            Download the {siteName} browser extension&nbsp;
            <a href={extensionLink} target="_blank" rel="noopener noreferrer">here</a>.
          </div>
        );
      }
    }

    return (
      <div className="home-page">
        <Container>
          <div className="search-form-container d-flex flex-column justify-content-center">
            <HomePageSearchForm
              autoFocus={true}
            />
          </div>

          {/*<ol>*/}
          {/*<li>Review the <Link to="/fuel-savings">demo app</Link></li>*/}
          {/*<li>Remove the demo and start coding: npm run remove-demo</li>*/}
          {/*</ol>*/}
        </Container>

        {extensionAlert}
        {topWarning}

        <Footer />
      </div>
    );
  }
}

HomePage.defaultProps = {
  appConfig: {},
};

HomePage.propTypes = {
  appConfig: PropTypes.object,
};

const mapStateToProps = (state => ({
  appConfig: state.appConfig,
}));

export default connect(mapStateToProps)(HomePage);
