import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Tooltip } from 'reactstrap';
import { connect } from 'react-redux';

class PrivacyStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: false,
    };

    this.toggleTooltip = this.toggleTooltip.bind(this);
  }

  toggleTooltip() {
    const { tooltipOpen } = this.state;
    this.setState({
      tooltipOpen: !tooltipOpen,
    });
  }

  render() {
    const { tooltipOpen } = this.state;
    const { appConfig } = this.props;

    if (!appConfig.loaded) {
      return (<div className="privacy-status-container">Privacy Status: Loading</div>);
    }

    let privacySettings = null;
    let badgeColor, description, statusStr;

    if (appConfig.data.privacy) {
      privacySettings = appConfig.data.privacy;

      if (privacySettings.saveUserInfo || privacySettings.trackMetaSearchClicks) {
        badgeColor = 'danger';
        description = 'This site stores your IP address and User Agent information along with your search query.';
        statusStr = 'AT RISK';
      } else if (privacySettings.searchSuggestionsEnabled || privacySettings.trackSearchCount) {
        badgeColor = 'warning';
        description = 'This site does not store your IP address and User Agent information, but it tracks count of search queries.';
        statusStr = 'MEDIUM';
      } else {
        badgeColor = 'success';
        description = 'This site does not store your IP address and User Agent information.';
        statusStr = 'PRIVATE';
      }
    } else {
      badgeColor = 'danger';
      description = 'The site administrator has not set any privacy settings.';
      statusStr = 'NOT SET';
    }

    return (
      <div className="privacy-status-container">
        <div className=" dflex justify-content-center ">
          <span className="">Privacy<span className="d-none d-md-inline"> Status</span> &nbsp;</span>

          <span>
            <Badge color={badgeColor} id="PrivacyBadge" className="pointer link">
              {statusStr}
            </Badge>

            <Tooltip
              placement="top"
              isOpen={tooltipOpen}
              target="PrivacyBadge"
              toggle={this.toggleTooltip}
            >
              {description}
            </Tooltip>
          </span>
        </div>
      </div>
    );
  }
}

PrivacyStatus.defaultProps = {
  appConfig: {},
};

PrivacyStatus.propTypes = {
  appConfig: PropTypes.object,
};

const mapStateToProps = state => ({
  appConfig: state.appConfig,
});

export default connect(mapStateToProps)(PrivacyStatus);
