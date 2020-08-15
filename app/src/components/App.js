/* eslint-disable import/no-named-as-default */
import { Route, Switch } from 'react-router-dom';
import HomePage from './HomePage';
import NotFoundPage from './NotFoundPage';
import PropTypes from 'prop-types';
import React from 'react';
import { hot } from 'react-hot-loader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isNil } from 'lodash';
import AboutPage from './AboutPage';
import EditPage from './EditPage';
import SearchResultPage from './SearchResultPage';
import '../utils/noty';
import SettingsPage from './SettingsPage';
import AuthenticationPage from './AuthenticationPage';
import BlankPage from './BlankPage';
import { setSiteName } from '../constants/appConfig';
import PrivacyPage from './PrivacyPage';
import HowItWorksPage from './HowItWorksPage';
import * as  appConfigActions from '../actions/appConfigActions';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {
  componentDidMount() {
    // TODO Get app config from localStorage with cache of 5 minutes

    const { appConfig } = this.props;
    if (appConfig.loaded) {
      this.setAppConfig(this.props);
    } else if (!appConfig.loading) {
      this.props.actions.getAppConfigStarting();
      this.props.actions.getAppConfig();
    }
  }

  /* eslint-disable-next-line react/no-deprecated */
  componentWillReceiveProps(nextProps) {
    if (this.props.appConfig !== nextProps.appConfig && (
        this.props.appConfig.loading !== nextProps.appConfig.loading
      ) && nextProps.appConfig.loaded) {
      // TODO Save app config to localStorage with cache time of 5 minutes
      this.setAppConfig(nextProps);
    }
  }

  setAppConfig(props) {
    const config = props.appConfig.data;
    if (!isNil(config.appearance)) {
      const { appearance } = config;

      if (appearance.siteName) {
        setSiteName(appearance.siteName);
      }

      if (appearance.backgroundColor) {
        document.body.style.backgroundColor = appearance.backgroundColor;
      }
    }
  }

  render() {
    const config = this.props.appConfig.data;
    const appStyles = {};
    if (config && !isNil(config.appearance) && !isNil(config.appearance.textColor)) {
      appStyles.color = config.appearance.textColor;
    }

    return (
      <div style={appStyles}>
        <Switch>
          <Route exact path="/" component={HomePage} />

          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/privacy" component={PrivacyPage} />
          <Route exact path="/how-it-works" component={HowItWorksPage} />
          <Route exact path="/blank" component={BlankPage} />

          <Route exact path="/settings" component={SettingsPage} />
          <Route exact path="/auth" component={AuthenticationPage} />

          <Route path="/search" component={SearchResultPage} />
          <Route path="/edit" component={EditPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

App.defaultProps = {
  actions: {},
  appConfig: {},
  children: null,
};

App.propTypes = {
  actions: PropTypes.object,
  appConfig: PropTypes.object,
  children: PropTypes.element,
};

const mapStateToProps = (state => ({
  appConfig: state.appConfig,
}));

const mapDispatchToProps = (dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, appConfigActions),
    dispatch,
  ),
}));

const AppComponent = connect(mapStateToProps, mapDispatchToProps)(App);
export default hot(module)(AppComponent);
