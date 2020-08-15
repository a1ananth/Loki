import React from 'react';
import PropTypes from 'prop-types';
import {
  TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, Button,
  Row, Col, Container, Form, FormGroup, Label, Input
} from 'reactstrap';
import { cloneDeep, isNil } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SketchPicker } from 'react-color';
import classnames from 'classnames';
import Noty from 'noty';
import Footer from './Common/Footer';
import Header from './CustomPage/Header';
import ManageAuthTokens from "./SettingsPage/ManageAuthTokens";
import {
  appName,
  defaultBackgroundColor,
  defaultSearchEngineUrl,
  defaultTagline,
  siteName
} from '../constants/appConfig';
import AppUpdate from './SettingsPage/AppUpdate';
import * as  appConfigActions from '../actions/appConfigActions';
import { setDocumentTitle } from "../utils/general";
import LogoUpload from './SettingsPage/LogoUpload';
import { Link } from 'react-router-dom';

class SettingsPage extends React.Component {
  static getConfigVars(props) {
    const { appConfig } = props;
    const configVars = {
      appearance: {
        siteName: appName,
        tagline: defaultTagline,
        logo: '',
        backgroundColor: defaultBackgroundColor,
      },

      search: {
        baseUrl: '',
        defaultSearchEngineUrl,
        siteAdminEmail: '',
      },

      authentication: {
        requireAuthentication: false,
        editHistory: false,
      },

      privacy: {
        saveUserInfo: false,
        searchSuggestionsEnabled: false,
        trackSearchCount: false,
        trackMetaSearchClicks: false,
      },
    };

    if (!appConfig.loaded) {
      return configVars;
    }

    for (const k in appConfig.data) {
      if (Object.prototype.hasOwnProperty.call(appConfig.data, k)) {
        if (!isNil(appConfig.data[k]) && !isNil(configVars[k])) {
          for (const k2 in configVars[k]) {
            if (Object.prototype.hasOwnProperty.call(configVars[k], k2)) {
              if (!isNil(appConfig.data[k][k2])) {
                configVars[k][k2] = appConfig.data[k][k2];
              }
            }
          }
        }
      }
    }

    return configVars;
  }

  constructor(props) {
    super(props);

    const configVars = SettingsPage.getConfigVars(this.props);

    this.state = {
      activeTab: 'systemconfiguration',

      ...configVars
    };

    this.setActiveTab = this.setActiveTab.bind(this);
    this.onSiteNameChanged = this.onSiteNameChanged.bind(this);
    this.onBaseUrlChanged = this.onBaseUrlChanged.bind(this);
    this.onTaglineChanged = this.onTaglineChanged.bind(this);
    this.onLogoChanged = this.onLogoChanged.bind(this);
    this.onBackgroundColorChanged = this.onBackgroundColorChanged.bind(this);

    this.onSearchEngineUrlChanged = this.onSearchEngineUrlChanged.bind(this);
    this.onSiteAdminEmailChanged = this.onSiteAdminEmailChanged.bind(this);

    this.onRequireAuthenticationChanged = this.onRequireAuthenticationChanged.bind(this);
    this.onEditHistoryChanged = this.onEditHistoryChanged.bind(this);

    this.onSaveUserInfoChanged = this.onSaveUserInfoChanged.bind(this);
    this.onSearchSuggestionsEnabledChanged = this.onSearchSuggestionsEnabledChanged.bind(this);
    this.onTrackSearchCountChanged = this.onTrackSearchCountChanged.bind(this);
    this.onTrackMetaSearchClicksChanged = this.onTrackMetaSearchClicksChanged.bind(this);

    this.onSaveClicked = this.onSaveClicked.bind(this);

    this.saveStarted = false;
  }

  componentDidMount() {
    setDocumentTitle('Settings');
  }

  /* eslint-disable-next-line react/no-deprecated */
  componentWillReceiveProps(nextProps) {
    if (this.props.appConfig !== nextProps.appConfig && (
        this.props.appConfig.loading !== nextProps.appConfig.loading &&
        nextProps.appConfig.loaded
      )) {
      const configVars = SettingsPage.getConfigVars(nextProps);
      this.setState(configVars);
    }

    if (
      this.saveStarted &&
      this.props.saveAppConfig !== nextProps.saveAppConfig
    ) {
      this.handleStatusChange(nextProps);
    }
  }

  handleStatusChange(props) {
    if (
      !props.saveAppConfig.saving && props.saveAppConfig.saved
    ) {
      new Noty({
        type: 'success',
        layout: 'bottomLeft',
        text: 'App configuration has been updated. It may take up to 5 minutes to take effect for all users.',
      }).show();

      this.saveStarted = false;
    } else if (
      !props.saveAppConfig.saving && !props.saveAppConfig.saved
    ) {
      let errorMessage = props.saveAppConfig.error;
      if (!errorMessage) {
        errorMessage = 'Failed to save app configuration due to server error.';
      }

      new Noty({
        type: 'error',
        layout: 'bottomLeft',
        text: errorMessage,
      }).show();

      this.saveStarted = false;
    }
  }

  onSiteNameChanged(event) {
    const appearance = cloneDeep(this.state.appearance);
    appearance.siteName = event.target.value;
    this.setState({
      appearance,
    });
  }

  onBaseUrlChanged(event) {
    const search = cloneDeep(this.state.search);
    search.baseUrl = event.target.value;
    this.setState({
      search,
    });
  }

  onTaglineChanged(event) {
    const appearance = cloneDeep(this.state.appearance);
    appearance.tagline = event.target.value;
    this.setState({
      appearance,
    });
  }

  onLogoChanged(file) {
    const appearance = cloneDeep(this.state.appearance);
    appearance.logo = file._id;
    this.setState({
      appearance,
    });
  }

  onBackgroundColorChanged(color) {
    const appearance = cloneDeep(this.state.appearance);
    appearance.backgroundColor = color.hex;
    this.setState({
      appearance,
    });
  }

  onSearchEngineUrlChanged(event) {
    const search = cloneDeep(this.state.search);
    search.defaultSearchEngineUrl = event.target.value;
    this.setState({
      search,
    });
  }


  onSiteAdminEmailChanged(event) {
    const search = cloneDeep(this.state.search);
    search.siteAdminEmail = event.target.value;
    this.setState({
      search,
    });
  }


  onRequireAuthenticationChanged(event) {
    const authentication = cloneDeep(this.state.authentication);
    authentication.requireAuthentication = event.target.checked;
    this.setState({
      authentication,
    });
    // console.log('New result types is', resultTypes);
  }

  onEditHistoryChanged(event) {
    const authentication = cloneDeep(this.state.authentication);
    authentication.editHistory = event.target.checked;
    this.setState({
      authentication,
    });
  }

  onSaveUserInfoChanged(event) {
    const privacy = cloneDeep(this.state.privacy);
    privacy.saveUserInfo = event.target.checked;
    this.setState({
      privacy,
    });

  }

  onSearchSuggestionsEnabledChanged(event) {
    const privacy = cloneDeep(this.state.privacy);
    privacy.searchSuggestionsEnabled = event.target.checked;
    this.setState({
      privacy,
    });
  }

  onTrackSearchCountChanged(event) {
    const privacy = cloneDeep(this.state.privacy);
    privacy.trackSearchCount = event.target.checked;
    this.setState({
      privacy,
    });
  }

  onTrackMetaSearchClicksChanged(event) {
    const privacy = cloneDeep(this.state.privacy);
    privacy.trackMetaSearchClicks = event.target.checked;
    this.setState({
      privacy,
    });
  }

  onSaveClicked() {
    this.props.actions.saveAppConfigStarting();
    this.props.actions.saveAppConfig(this.state);
    this.saveStarted = true;
  }

  setActiveTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const { activeTab, appearance, search, authentication, privacy } = this.state;
    const { saveAppConfig, appConfig } = this.props;

    let preContent = null;
    if (!appConfig.loaded) {
      preContent = 'Please wait...';
    } else if (appConfig.loaded && !appConfig.canEdit) {
      preContent = (
        <div>
          <p className="mt-5 mb-0">
            You do not have permission to access this page.
            If you have an authentication token,
            you can set it in the <Link to="/auth">Authentication page</Link>.
          </p>

          <p className="mt-3 mb-0">
            <Link to="/">Go to Home page</Link>
          </p>
        </div>
      );
    }

    if (!isNil(preContent)) {
      return (
        <div className="custom-page settings-page">
          <Container>
            {preContent}
          </Container>
        </div>
      )
    }

    let btnSave;

    if (saveAppConfig.saving) {
      btnSave = (
        <Button color="success" disabled>
          <i className="fa fa-spinner fa-spin" />
          &nbsp;
          Saving
        </Button>
      );
    } else {
      btnSave = (
        <Button color="success" onClick={this.onSaveClicked}>
          <i className="fa fa-save" />
          &nbsp;
          Save
        </Button>
      );
    }

    const bottomCard = (
      <div className="mt-0 bottom-card">
        <Card>
          <CardBody>
            {btnSave}
          </CardBody>
        </Card>
      </div>
    );

    return (
      <div className="custom-page settings-page" style={{ backgroundColor: appearance.backgroundColor }}>
        <Container>
          <Header pageTitle={`${siteName} Settings`} />

          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'systemconfiguration', 'pointer link': true })}
                onClick={() => {
                  this.setActiveTab('systemconfiguration');
                }}
                tag="div"
              >
                System Configuration
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'appearance', 'pointer link': true })}
                onClick={() => {
                  this.setActiveTab('appearance');
                }}
                tag="div"
              >
                Appearance
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'authentication', 'pointer link': true })}
                onClick={() => {
                  this.setActiveTab('authentication');
                }}
                tag="div"
              >
                Authentication
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'privacy', 'pointer link': true })}
                onClick={() => {
                  this.setActiveTab('privacy');
                }}
                tag="div"
              >
                Privacy
              </NavLink>
            </NavItem>

            {/*<NavItem>*/}
            {/*<NavLink*/}
            {/*className={classnames({ active: activeTab === 'update', 'pointer link': true })}*/}
            {/*onClick={() => {*/}
            {/*this.setActiveTab('update');*/}
            {/*}}*/}
            {/*tag="div"*/}
            {/*>*/}
            {/*Update*/}
            {/*</NavLink>*/}
            {/*</NavItem>*/}
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="appearance">

              <Card>
                <CardBody>

                  <Form>
                    <Row>
                      <Col sm="6">
                        <FormGroup className=''>
                          <Label for="siteName">Site Name</Label>
                          <Input
                            type="text"
                            name="siteName"
                            id="siteName"
                            placeholder=""
                            value={appearance.siteName}
                            onChange={this.onSiteNameChanged}
                          />

                          <p className="helper-text">
                            This will be the name of your Loki instance.
                          </p>
                        </FormGroup>

                        <FormGroup className=''>
                          <Label for="siteName">Tagline</Label>
                          <Input
                            type="text"
                            name="tagline"
                            id="tagline"
                            placeholder=""
                            value={appearance.tagline}
                            onChange={this.onTaglineChanged}
                          />

                          <p className="helper-text">
                            This is shown on the home page below search input.
                          </p>
                        </FormGroup>

                        <FormGroup className="">
                          <Label for="color">Background Color</Label>
                          <SketchPicker
                            color={appearance.backgroundColor}
                            onChangeComplete={this.onBackgroundColorChanged}
                          />

                          <p className="helper-text mt-3">
                            This will be used as the background color for all pages in this {appName} instance.
                            Only light colors are supported now.
                          </p>
                        </FormGroup>
                      </Col>

                      <Col sm="6">
                        <FormGroup className="">
                          <Label for="exampleFile">Logo</Label>
                          <LogoUpload
                            logo={appearance.logo}
                            onLogoChanged={this.onLogoChanged}
                          />

                          <p className="helper-text mt-2 mb-0">
                            You must preferably upload a round image in PNG format with 1024x1024 resolution.
                          </p>
                          <p className="helper-text mt-2 mb-0">
                            The server will automatically resize the original image into
                            different resolutions required.

                            After changing the logo, wait for 1 minute for thumbnail
                            generation to complete and then
                            reload your browser cache.
                          </p>
                          <p className="helper-text mt-2 mb-0">
                            You will need to manually update the browser extension
                            and any local browser configuration for the
                            new logo to take effect in those places.
                          </p>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </TabPane>

            <TabPane tabId="systemconfiguration">
              <Card>
                <CardBody>
                  <Form>
                    <Row>
                      <Col sm="6">
                        <FormGroup className=''>
                          <Label for="baseUrl">Base URL</Label>
                          <Input
                            type="text"
                            name="baseUrl"
                            id="baseUrl"
                            placeholder=""
                            value={search.baseUrl}
                            onChange={this.onBaseUrlChanged}
                          />

                          <p className="helper-text">
                            This field is required for the {appName} browser
                            extension to work properly.
                            When you change this, you will need to remove
                            the current extension, download the new
                            version and install it.
                          </p>
                        </FormGroup>

                        <FormGroup className=''>
                          <Label for="siteAdminEmail">Site Administrator Email Address</Label>
                          <Input
                            type="text"
                            name="siteAdminEmail"
                            id="siteAdminEmail"
                            placeholder=""
                            value={search.siteAdminEmail}
                            onChange={this.onSiteAdminEmailChanged}
                          />

                          <p className="helper-text">
                            This is displayed in About & Privacy pages so
                            that users can get in touch with the site administrator.
                          </p>
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup className="">
                          <Label for="searchEngine">Default Search Engine URL</Label>
                          <Input
                            type="text"
                            name="searchEngine"
                            id="searchEngine"
                            placeholder=""
                            value={search.defaultSearchEngineUrl}
                            onChange={this.onSearchEngineUrlChanged}
                          />
                          <p className="helper-text">
                            Enter your default search engine URL here, using %s in place of the actual query.
                            <br />
                            Example: https://duckduckgo.com/?q=%s
                          </p>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>

            </TabPane>


            <TabPane tabId="authentication">
              <Card>
                <CardBody>
                  <Form>
                    <Row>
                      <Col xs={12}>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              checked={authentication.requireAuthentication}
                              onChange={this.onRequireAuthenticationChanged}

                            />&nbsp;
                            Require authentication to access Search Results
                          </Label>

                          <p className="helper-text">
                            If this setting is turned on,
                            authentication Token is required to
                            access the search results.
                          </p>
                        </FormGroup>
                      </Col>

                      <Col xs={12} className="mt-3">
                        <FormGroup check>
                          <Label check>
                            <Input type="checkbox"
                                   checked={authentication.editHistory}
                                   onChange={this.onEditHistoryChanged}
                            />&nbsp;
                            Save Edit History
                          </Label>

                          <p className="helper-text">
                            This setting is not active yet.
                            Later on, if this setting is turned on,
                            every edited version of search results
                            is stored in a separate collection.
                            This might increase your database size.
                          </p>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>

                  <ManageAuthTokens />

                </CardBody>
              </Card>
            </TabPane>

            <TabPane tabId="privacy">
              <Card>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Form>
                        <FormGroup check>
                          <Label check>
                            <Input type="checkbox"
                                   checked={privacy.saveUserInfo}
                                   onChange={this.onSaveUserInfoChanged}

                            />&nbsp;
                            Save Search hits & User Information
                          </Label>

                          <p className="helper-text">
                            If this setting is turned on, each search hit is
                            logged separately, along with the User Agent & IP Address of user.
                          </p>
                        </FormGroup>

                        <FormGroup check className='mt-3'>
                          <Label check>
                            <Input type="checkbox"
                                   checked={privacy.trackSearchCount}
                                   onChange={this.onTrackSearchCountChanged}

                            />&nbsp;
                            Track Search Count
                          </Label>

                          <p className="helper-text">
                            If this setting is turned on, number of searches (searchCount) is
                            tracked for each query. This field helps in making
                            most searched queries come on top of the search suggestions.
                          </p>
                        </FormGroup>
                        <FormGroup check className='mt-3'>
                          <Label check>
                            <Input type="checkbox"
                                   checked={privacy.trackMetaSearchClicks}
                                   onChange={this.onTrackMetaSearchClicksChanged}

                            />&nbsp;
                            Track Web Page Clicks in Meta Search view
                          </Label>

                          <p className="helper-text">
                            This setting is not active yet.
                            Later on, if this setting is turned on, number of clicks (searchCount) is
                            tracked for each web page link. This field helps in ordering the
                            search results in Meta Search view.
                          </p>
                        </FormGroup>
                      </Form>
                    </Col>
                  </Row>

                </CardBody>
              </Card>
            </TabPane>
            <TabPane tabId="update">
              <AppUpdate />
            </TabPane>
          </TabContent>

          {bottomCard}
        </Container>

        <Footer />
      </div>
    );
  }
}

SettingsPage.defaultProps = {
  actions: {},
  appConfig: {},
  saveAppConfig: {},
};

SettingsPage.propTypes = {
  actions: PropTypes.object,
  appConfig: PropTypes.object,
  saveAppConfig: PropTypes.object,
};

const mapStateToProps = (state => ({
  appConfig: state.appConfig,
  saveAppConfig: state.saveAppConfig,
}));

const mapDispatchToProps = (dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, appConfigActions),
    dispatch,
  ),
}));

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
