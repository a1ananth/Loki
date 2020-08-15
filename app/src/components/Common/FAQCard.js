import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody, CardHeader, Col,
  Collapse,
  Row,
} from 'reactstrap';

class FAQCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.openByDefault,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { isOpen } = this.state;

    this.setState({
      isOpen: !isOpen,
    });
  }

  render() {
    const { isOpen } = this.state;
    const { title, content } = this.props;

    let icon;
    if (isOpen) {
      icon = 'fa fa-chevron-circle-up';
    } else {
      icon = 'fa fa-chevron-circle-down';
    }

    return (
      <div className="mb-3 faq-question-container">
        <Card>
          <CardHeader onClick={this.toggle} className="pointer link">
            <Row>
              <Col xs="auto">
                {title}
              </Col>
              <Col xs="auto" className="ml-auto">
                <i className={icon} />
              </Col>
            </Row>
          </CardHeader>

          <Collapse isOpen={isOpen}>
            <CardBody>
              {content}
            </CardBody>
          </Collapse>
        </Card>
      </div>
    );
  }
}

FAQCard.defaultProps = {
  content: null,
  openByDefault: false,
};

FAQCard.propTypes = {
  content: PropTypes.any,
  openByDefault: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

export default FAQCard;
