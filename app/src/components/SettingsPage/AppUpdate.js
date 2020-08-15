import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class AppUpdate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="">
        <Card>
          <CardBody>
            <Row>
              <Col sm="6">
                <p> To check if an update is available, tap Check Update
                </p>
              </Col>
              <Col sm="6">
                <Button color="primary">
                  Check Update
                </Button>
              </Col>
            </Row>

            <Row>
              <Col sm="6">
                <p> This application is up-to-date.
                </p>
              </Col>
              <Col sm="6">

              </Col>
            </Row>

            <Row>
              <Col sm="6">
                <Card>
                  <CardBody>
                    <p> There is a new version v.0.14 is available, tap on Update Now for the new features </p>

                    <p> Follow the on-screen instructions to perform the update. </p>
                    <p>Confirm that the update was successful.</p>

                    <p> After the update has been completed, go to (Settings) - (System Settings) -
                      [System Software]    </p>
                    <p> If the [System Software] field displays the version number of the update, the update was
                      successful. </p>
                    <Button color="primary">
                      Update Now
                    </Button>
                  </CardBody>

                </Card>

              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

AppUpdate.defaultProps = {
  actions: {},
};

AppUpdate.propTypes = {
  actions: PropTypes.object,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({}), dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppUpdate);
