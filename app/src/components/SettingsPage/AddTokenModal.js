import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, Col, FormGroup, Label, Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Noty from 'noty';
import * as authTokensActions from '../../actions/authTokensActions';


class AddTokenModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      canEdit: false,
    };

    this.onUserNameChanged = this.onUserNameChanged.bind(this);
    this.onCanEditChanged = this.onCanEditChanged.bind(this);
    this.onSaveClicked = this.onSaveClicked.bind(this);

    this.createStarted = false;
  }

  /* eslint-disable-next-line react/no-deprecated */
  componentWillReceiveProps(nextProps) {
    if (
      this.createStarted &&
      this.props.createAuthToken !== nextProps.createAuthToken
    ) {
      this.handleStatusChange(nextProps);
    }
  }

  handleStatusChange(props) {
    if (
      !props.createAuthToken.saving && props.createAuthToken.saved
    ) {
      new Noty({
        type: 'success',
        layout: 'bottomLeft',
        text: 'New auth token created successfully.',
      }).show();

      this.props.toggleModal();
      this.createStarted = false;
    } else if (
      !props.createAuthToken.saving && !props.createAuthToken.saved
    ) {
      let errorMessage = props.createAuthToken.error;
      if (!errorMessage) {
        errorMessage = 'Failed to create auth token due to server error.';
      }

      new Noty({
        type: 'error',
        layout: 'bottomLeft',
        text: errorMessage,
      }).show();

      this.createStarted = false;
    }
  }

  onUserNameChanged(event) {
    this.setState({
      userName: event.target.value,
    });
  }

  onCanEditChanged(event) {
    this.setState({
      canEdit: event.target.checked,
    });
  }

  onSaveClicked() {
    this.props.actions.createAuthTokenStarting();
    this.props.actions.createAuthToken(this.state);
    this.createStarted = true;
  }

  render() {
    const { userName, canEdit } = this.state;
    const { toggleModal, createAuthToken } = this.props;

    let btnSave;

    if (createAuthToken.saving) {
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

    return (
      <Modal isOpen={true} toggle={toggleModal} className="add-token-modal">
        <ModalHeader toggle={toggleModal}>Add New Token </ModalHeader>
        <ModalBody>
          <div>
            <Form>
              <Row>
                <Col sm="12">
                  <FormGroup className="">
                    <Label for="userName">User Name</Label>
                    <Input
                      type="text"
                      name="userName"
                      id="userName"
                      placeholder=""
                      value={userName}
                      onChange={this.onUserNameChanged}
                    />
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup check>
                    <Label check>
                      <Input type="checkbox"
                             checked={canEdit}
                             onChange={this.onCanEditChanged}
                      />&nbsp;
                      Can Edit
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </div>
        </ModalBody>
        <ModalFooter>
          {btnSave}

          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

AddTokenModal.defaultProps = {
  actions: {},
  createAuthToken: {},
};

AddTokenModal.propTypes = {
  actions: PropTypes.object,
  createAuthToken: PropTypes.object,
  toggleModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  createAuthToken: state.createAuthToken,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({}, authTokensActions), dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddTokenModal);
