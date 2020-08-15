import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import * as filesActions from '../../actions/filesActions';
import logoImg from '../../assets/logo1.png';
import { apiBaseUrl } from '../../constants/appConfig';

class LogoUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onDropFile = this.onDropFile.bind(this);
    this.uploadStarted = false;
  }

  /* eslint-disable-next-line react/no-deprecated */
  componentWillReceiveProps(nextProps) {
    if (
      this.props.fileUploadStatus !== nextProps.fileUploadStatus &&
      this.props.fileUploadStatus.uploading && !nextProps.fileUploadStatus.uploading &&
      this.uploadStarted
    ) {
      this.handleStatusChange(nextProps);
    }
  }

  handleStatusChange(nextProps) {
    if (!nextProps.fileUploadStatus.uploaded) {
      // Failed to upload
      alert(nextProps.fileUploadStatus.error);
      this.uploadStarted = false;
    } else {
      // file upload success
      console.log('File upload success!');
      const { file } = nextProps.fileUploadStatus;
      this.props.onLogoChanged(file);
      this.uploadStarted = false;
    }
  }

  onDropFile(acceptedFiles) {
    if (!(acceptedFiles.length > 0)) {
      return;
    }

    const { fileUploadStatus } = this.props;
    if (fileUploadStatus.uploading) {
      alert('Please wait for previous file to finish uploading');
      return;
    }

    const file = acceptedFiles[0];
    this.props.actions.uploadFile(file);
    this.uploadStarted = true;
  }

  render() {
    const { logo } = this.props;

    let currentLogo;
    if (logo) {
      const logoPath = `${apiBaseUrl}/files/f/${logo}`;
      currentLogo = (
        <img src={logoPath} alt="New Logo" />
      );
    } else {
      currentLogo = (
        <img src={logoImg} alt="Current Logo" />
      );
    }

    return (
      <div className="logo-upload-container dropzone-container">
        <Dropzone
          accepts="image/*,"
          multiple={false}
          noKeyboard={true}
          onDrop={this.onDropFile}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="dropzone-view text-center pointer link">
                  {currentLogo}

                  <p className="m-0 text-small mt-2">
                    Click to Upload
                  </p>
                </div>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    );
  }
}

LogoUpload.defaultProps = {
  actions: {},
  fileUploadStatus: {},
  logo: '',
};

LogoUpload.propTypes = {
  actions: PropTypes.object,
  fileUploadStatus: PropTypes.object,
  logo: PropTypes.string,
  onLogoChanged: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fileUploadStatus: state.fileUploadStatus,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({}, filesActions), dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LogoUpload);
