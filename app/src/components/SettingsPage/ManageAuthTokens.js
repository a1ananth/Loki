import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Card, CardBody, Table, Col, Button
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AddTokenModal from "./AddTokenModal";
import EditTokenModal from "./EditTokenModal";
import DeleteTokenModal from "./DeleteTokenModal";
import * as authTokensActions from '../../actions/authTokensActions';

class ManageAuthTokens extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddTokenModal: false,
      showEditTokenModal: false,
      showDeleteTokenModal: false,
      selectedToken: null,
    };

    this.toggleAddTokenModal = this.toggleAddTokenModal.bind(this);
    this.toggleEditTokenModal = this.toggleEditTokenModal.bind(this);
    this.toggleDeleteTokenModal = this.toggleDeleteTokenModal.bind(this);
  }

  componentDidMount() {
    const { authTokens } = this.props;
    if (!authTokens.loaded && !authTokens.loading) {
      this.props.actions.getAuthTokensStarting();
      this.props.actions.getAuthTokens();
    }
  }

  toggleAddTokenModal() {
    const { showAddTokenModal } = this.state;
    this.setState({
      showAddTokenModal: !showAddTokenModal,
    });
  }

  toggleEditTokenModal(selectedToken) {
    console.log(selectedToken);
    const { showEditTokenModal } = this.state;
    this.setState({
      selectedToken,
      showEditTokenModal: !showEditTokenModal,
    });
  }

  toggleDeleteTokenModal(selectedToken) {
    const { showDeleteTokenModal } = this.state;
    this.setState({
      selectedToken,
      showDeleteTokenModal: !showDeleteTokenModal,
    });
  }

  getAuthTokenRows() {
    const { authTokens } = this.props;

    const rows = [];
    authTokens.ids.forEach((tokenId, index) => {
      const tokenData = authTokens.map[tokenId];
      rows.push((
        <tr key={tokenId}>
          <th scope="row">{index + 1}</th>
          <td>{tokenData.userName}</td>
          <td>{tokenData.token}</td>
          <td>{tokenData.canEdit ? 'Yes' : 'No'}</td>
          <td className="text-center">
            <Button
              color="info"
              onClick={() => {
                this.toggleEditTokenModal(tokenData);
              }}
            >
              <i className="fa fa-edit" />
            </Button>
            <Button
              color="danger"
              className="ml-3"
              onClick={() => {
                this.toggleDeleteTokenModal(tokenData);
              }}
            >
              <i className="fa fa-times" />
            </Button>
          </td>
        </tr>
      ));
    });

    return rows;
  }

  render() {
    const { authTokens } = this.props;

    let content;
    if (authTokens.loading) {
      content = (
        <p className="m-0">Please wait...</p>
      );
    } else if (!authTokens.loaded) {
      content = (
        <p className="m-0">Please wait...</p>
      );
    } else if (!authTokens.ids.length) {
      content = (
        <p className="m-0">No tokens created yet.</p>
      );
    } else {
      const rows = this.getAuthTokenRows();

      content = (
        <Table className="mt-3">
          <thead>
          <tr className="">
            <th>#</th>
            <th>User Name</th>
            <th className="text-left">Token</th>
            <th>Edit Privilege</th>
            <th>&nbsp;</th>
          </tr>
          </thead>
          <tbody>
          {rows}
          </tbody>
        </Table>
      );
    }

    const { showAddTokenModal, showEditTokenModal, showDeleteTokenModal, selectedToken } = this.state;

    let addTokenModal = null;
    let editTokenModal = null;
    let deleteTokenModal = null;

    if (showAddTokenModal) {
      addTokenModal = (
        <AddTokenModal toggleModal={this.toggleAddTokenModal} />
      );
    }

    if (showEditTokenModal) {
      editTokenModal = (
        <EditTokenModal
          selectedToken={selectedToken}
          toggleModal={this.toggleEditTokenModal}
        />
      );
    }

    if (showDeleteTokenModal) {
      deleteTokenModal = (
        <DeleteTokenModal
          selectedToken={selectedToken}
          toggleModal={this.toggleDeleteTokenModal}
        />
      );
    }

    return (
      <div className="mt-2 manage-auth-tokens d-flex flex-column justify-content-center  ">
        <Card>
          <CardBody>
            <Row className="">
              <Col>
                <h5>Manage Authentication Tokens</h5>
              </Col>
              <Col className="">
                <Button color="primary  float-right" onClick={this.toggleAddTokenModal}>
                  Add New Token
                </Button>
              </Col>
            </Row>

            {content}

          </CardBody>
        </Card>

        {addTokenModal}
        {editTokenModal}
        {deleteTokenModal}
      </div>
    );
  }
}

ManageAuthTokens.defaultProps = {
  actions: {},
  authTokens: {},
};

ManageAuthTokens.propTypes = {
  actions: PropTypes.object,
  authTokens: PropTypes.object,
};

const mapStateToProps = state => ({
  authTokens: state.authTokens,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({}, authTokensActions), dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageAuthTokens);
