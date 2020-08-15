import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Col,
  Form, FormGroup, Input, Label,
  Modal, ModalBody, ModalFooter, ModalHeader,
  Row,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Noty from 'noty';
import * as authTokensActions from '../../actions/authTokensActions';


class EditTokenModal extends React.Component {
  constructor(props) {
    super(props);

    const { selectedToken } = this.props;

    this.state = {
      userName: selectedToken.userName,
      canEdit: selectedToken.canEdit,
      token: selectedToken.token,
    };

    this.onUserNameChanged = this.onUserNameChanged.bind(this);
    this.onCanEditChanged = this.onCanEditChanged.bind(this);
    this.onTokenChanged = this.onTokenChanged.bind(this);
    this.onSaveClicked = this.onSaveClicked.bind(this);

    this.saveStarted = false;
  }

  /* eslint-disable-next-line react/no-deprecated */
  componentWillReceiveProps(nextProps) {
    const tokenId = this.props.selectedToken._id;

    if (
      this.saveStarted &&
      this.props.updateAuthToken !== nextProps.updateAuthToken &&
      nextProps.updateAuthToken[tokenId]
    ) {
      this.handleStatusChange(nextProps);
    }
  }

  handleStatusChange(props) {
    const tokenId = props.selectedToken._id;

    if (
      props.updateAuthToken[tokenId] && !props.updateAuthToken[tokenId].saving && props.updateAuthToken[tokenId].saved
    ) {
      new Noty({
        type: 'success',
        layout: 'bottomLeft',
        text: 'Token data has been updated successfully.',
      }).show();

      this.props.toggleModal();

      this.saveStarted = false;
    } else if (
      props.updateAuthToken[tokenId] && !props.updateAuthToken[tokenId].saving && !props.updateAuthToken[tokenId].saved
    ) {
      let errorMessage = props.updateAuthToken[tokenId].error;
      if (!errorMessage) {
        errorMessage = 'Failed to update token data due to server error.';
      }

      new Noty({
        type: 'error',
        layout: 'bottomLeft',
        text: errorMessage,
      }).show();

      this.saveStarted = false;
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


  onTokenChanged(event) {
    this.setState({
      token: event.target.value,
    });
  }

  onSaveClicked() {
    const { selectedToken } = this.props;
    this.props.actions.updateAuthTokenStarting();
    this.props.actions.updateAuthToken(selectedToken._id, this.state);
    this.saveStarted = true;
  }

  render() {
    const { userName, token, canEdit } = this.state;
    const { toggleModal, selectedToken, updateAuthToken } = this.props;

    let btnSave;

    const updateData = updateAuthToken[selectedToken._id];
    if (updateData && updateData.saving) {
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
      <Modal isOpen={true} toggle={toggleModal} className="edit-token-modal">
        <ModalHeader toggle={toggleModal}>Edit Token </ModalHeader>
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

                <Col sm="12">
                  <FormGroup className="">
                    <Label for="token">Token </Label>
                    <Input
                      type="text"
                      name="token"
                      id="token"
                      placeholder=""
                      value={token}
                      onChange={this.onTokenChanged}
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

EditTokenModal.defaultProps = {
  actions: {},
  updateAuthToken: {},
};

EditTokenModal.propTypes = {
  actions: PropTypes.object,
  selectedToken: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  updateAuthToken: PropTypes.object,
};

const mapStateToProps = state => ({
  updateAuthToken: state.updateAuthToken,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({}, authTokensActions), dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTokenModal);
