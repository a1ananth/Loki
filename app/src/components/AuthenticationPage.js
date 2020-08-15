import React from 'react';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import { Button, Card, CardBody, Col, Container, FormGroup, Input, Label, Row } from 'reactstrap';
import Footer from './Common/Footer';
import Header from './CustomPage/Header';
import { connect } from 'react-redux';
import { setDocumentTitle } from "../utils/general";

class AuthenticationPage extends React.Component {
  constructor(props) {
    super(props);

    let setToken = cookie.load('authToken');
    if (!setToken) {
      setToken = '';
    }

    this.state = {
      authToken: setToken,
      setAuthToken: setToken,
    };

    this.onAuthTokenChanged = this.onAuthTokenChanged.bind(this);
    this.onSaveClicked = this.onSaveClicked.bind(this);
  }

  componentDidMount() {
    setDocumentTitle('Authentication');
  }

  onAuthTokenChanged(event) {
    this.setState({
      authToken: event.target.value,
    });
  }

  onSaveClicked() {
    const { authToken } = this.state;
    cookie.save('authToken', authToken, {
      path: '/',
      sameSite: true,
    });

    this.setState({
      setAuthToken: authToken,
    });

    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

  render() {
    const { authToken, setAuthToken } = this.state;
    const { appConfig } = this.props;

    // TODO Handle app config not loaded

    if (!appConfig.loaded) {
      return (<div>Please wait</div>);
    }

    const { authentication } = appConfig.data;

    let requireAuth;
    let authSetMsg;

    if (appConfig.isPubliclyEditable) {
      requireAuth = (
        <p className="text-danger">
          This site is publicly editable.
          If you are the site administrator, add some authentication tokens in
          the Settings page to secure this instance.
        </p>
      );
    } else if (authentication && authentication.requireAuthentication) {
      requireAuth = (
        <p>This site requires authentication to access search results.</p>
      );
    } else {
      requireAuth = (
        <p>
          This site does not need authentication to access search results, but
          you need an authentication token to edit search results and modify settings.
        </p>
      );
    }

    if (setAuthToken) {
      authSetMsg = (
        <p>You have set an authentication token. You can update it below.</p>
      );
    } else {
      authSetMsg = (
        <p>You have not set an authentication token. You can set it below.</p>
      );
    }

    return (
      <div className="custom-page authentication-page">
        <Container>
          <Header pageTitle="Authentication" />

          <Card>
            <CardBody>
              {requireAuth}

              {authSetMsg}

              <Row>
                <Col sm="12">
                  <FormGroup className="">
                    <Label for="authentication">Auth Token</Label>
                    <Input
                      type="text"
                      name="authToken"
                      id="authToken"
                      placeholder=""
                      value={authToken}
                      onChange={this.onAuthTokenChanged}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <div className="mt-0">
            <Card>
              <CardBody>
                <Button color="success" onClick={this.onSaveClicked} disabled={authToken === setAuthToken}>
                  <i className="fa fa-save" />
                  &nbsp;
                  Save
                </Button>
              </CardBody>
            </Card>
          </div>
        </Container>

        <Footer />
      </div>
    );
  }
}


AuthenticationPage.defaultProps = {
  appConfig: {},
};

AuthenticationPage.propTypes = {
  appConfig: PropTypes.object,
};

const mapStateToProps = (state => ({
  appConfig: state.appConfig,
}));

export default connect(mapStateToProps)(AuthenticationPage);
