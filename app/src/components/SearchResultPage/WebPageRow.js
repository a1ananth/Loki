import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, Col, Collapse,
  Row,
} from 'reactstrap';
import classnames from 'classnames';
// import * as actionsActions from '../actions/actions';

class WebPageRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDescriptionOpen: false,
    };

    this.toggleDescription = this.toggleDescription.bind(this);
  }

  toggleDescription() {
    const { isDescriptionOpen } = this.state;
    this.setState({
      isDescriptionOpen: !isDescriptionOpen,
    });
  }

  getSpecialIcon(url) {
    let icon = 'fa fa-externa-link';

    if (!url) {
      return icon;
    }

    if (url.indexOf('wikipedia.org') !== -1) {
      icon = 'fa fa-wikipedia-w';
    } else if (url.indexOf('facebook.com') !== -1) {
      icon = 'fa fa-facebook';
    } else {
      icon = 'fa fa-globe';
    }

    return icon;
  }

  render() {
    const { isDescriptionOpen } = this.state;
    const { webPageId, webPageData } = this.props;
    const icon = this.getSpecialIcon(webPageData.url);

    return (
      <Card className="web-page-link" key={webPageId}>
        <CardBody>
          <Row>
            <Col xs={12} md={11}>
              <a href={webPageData.url}>
                <h5 className="result-title">{webPageData.title}</h5>
              </a>

              <a href={webPageData.url}>
                <p className="result-url">
                  <i className={icon} />&nbsp;
                  {webPageData.url}
                </p>
              </a>

              <Collapse isOpen={isDescriptionOpen}>
                <a href={webPageData.url}>
                  <p className="result-desc">{webPageData.description}</p>
                </a>
              </Collapse>
            </Col>

            <Col md={1} className="d-none d-md-flex text-right justify-content-end">
              <a href={null} className="btn-toggle-desc pointer link" onClick={this.toggleDescription}>
                <i className={classnames({
                  "fa": true,
                  "fa-chevron-down": !isDescriptionOpen,
                  "fa-chevron-up": isDescriptionOpen,
                })} />
              </a>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

WebPageRow.propTypes = {
  webPageId: PropTypes.string.isRequired,
  webPageData: PropTypes.object.isRequired,
};

export default WebPageRow;
