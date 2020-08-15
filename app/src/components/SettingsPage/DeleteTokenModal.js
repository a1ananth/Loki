import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Noty from 'noty';
import * as authTokensActions from '../../actions/authTokensActions';

class DeleteTokenModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onConfirmClicked = this.onConfirmClicked.bind(this);
  }

  /* eslint-disable-next-line react/no-deprecated */
  componentWillReceiveProps(nextProps) {
    const tokenId = this.props.selectedToken._id;

    if (
      this.deleteStarted &&
      this.props.deleteAuthToken !== nextProps.deleteAuthToken &&
      nextProps.deleteAuthToken[tokenId]
    ) {
      this.handleStatusChange(nextProps);
    }
  }

  handleStatusChange(props) {
    const tokenId = props.selectedToken._id;

    if (
      props.deleteAuthToken[tokenId] && !props.deleteAuthToken[tokenId].saving && props.deleteAuthToken[tokenId].saved
    ) {
      new Noty({
        type: 'success',
        layout: 'bottomLeft',
        text: 'Token deleted successfully.',
      }).show();

      this.props.toggleModal();

      this.deleteStarted = false;
    } else if (
      props.deleteAuthToken[tokenId] && !props.deleteAuthToken[tokenId].saving && !props.deleteAuthToken[tokenId].saved
    ) {
      let errorMessage = props.deleteAuthToken[tokenId].error;
      if (!errorMessage) {
        errorMessage = 'Failed to delete token due to server error.';
      }

      new Noty({
        type: 'error',
        layout: 'bottomLeft',
        text: errorMessage,
      }).show();

      this.deleteStarted = false;
    }
  }

  onConfirmClicked() {
    const { selectedToken } = this.props;
    this.props.actions.deleteAuthTokenStarting();
    this.props.actions.deleteAuthToken(selectedToken._id);
    this.deleteStarted = true;
  }

  render() {
    const { toggleModal, selectedToken, deleteAuthToken } = this.props;

    let btnConfirm;

    const deleteData = deleteAuthToken[selectedToken._id];
    if (deleteData && deleteData.saving) {
      btnConfirm = (
        <Button color="danger" disabled>
          <i className="fa fa-spinner fa-spin" />
          &nbsp;
          Please wait...
        </Button>
      );
    } else {
      btnConfirm = (
        <Button color="danger" onClick={this.onConfirmClicked}>
          <i className="fa fa-save" />
          &nbsp;
          Confirm
        </Button>
      );
    }

    return (
      <Modal isOpen={true} toggle={toggleModal} className="delete-token-modal">
        <ModalHeader toggle={toggleModal}> Delete Token </ModalHeader>
        <ModalBody>
          <div>
            <p>
              Are you sure you want to delete the token
              for user <b>{selectedToken.userName}</b>?
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          {btnConfirm}
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

DeleteTokenModal.defaultProps = {
  actions: {},
  deleteAuthToken: {},
};

DeleteTokenModal.propTypes = {
  actions: PropTypes.object,
  selectedToken: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  deleteAuthToken: PropTypes.object,
};

const mapStateToProps = state => ({
  deleteAuthToken: state.deleteAuthToken,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({}, authTokensActions), dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteTokenModal);
