import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardFooter, CardHeader, Col, Row,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const htmlParser = require('react-markdown/plugins/html-parser');

const parseHtml = htmlParser({
  isValidNode: node => node.type !== 'script',
  processingInstructions: [/* ... */]
});

class FixedTextResult extends React.Component {
  render() {
    const { query, resultData } = this.props;
    let { fixedText, fixedTextType } = resultData.result;
    let content;

    if (fixedTextType === 'markdown') {
      content = (
        <ReactMarkdown
          source={fixedText}
          escapeHtml={false}
          astPlugins={[parseHtml]}
        />
      );
    } else {
      content = (
        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: fixedText }} />
      );
    }

    return (
      <Row className="fixed-text-result">
        <Col className="d-none d-md-block" xs={12} md={3} xl={3}>
          <Card>
            <CardHeader>
              {query}
            </CardHeader>

            <CardBody>
              <p className="mb-0">Result Type: <b>Fixed Text</b></p>

              {(resultData.result.searchCount > 0) && (
                <p className="mt-2 mb-0">
                  Hits: <b>{resultData.result.searchCount ? resultData.result.searchCount : ''}</b>
                </p>
              )}
            </CardBody>
            <CardFooter>
              <Link to={`/edit?q=${query}`}>
                Edit Result
              </Link>
            </CardFooter>
          </Card>
        </Col>

        <Col xs={12} md={9} xl={9}>
          <Card>
            <CardBody className="fixed-text-container">
              {content}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

FixedTextResult.propTypes = {
  query: PropTypes.string.isRequired,
  resultData: PropTypes.object.isRequired,
};

export default FixedTextResult;
