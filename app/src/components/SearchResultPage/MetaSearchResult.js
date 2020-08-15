import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardFooter, CardHeader,
  Col,
  Nav, NavItem, NavLink,
  Row, TabContent, TabPane,
} from 'reactstrap';
import classnames from 'classnames';
import WebPageRows from './WebPageRows';
import { Link } from 'react-router-dom';
import RedirectToDefaultSearchEngine from './RedirectToDefaultSearchEngine';

class MetaSearchResult extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'd',
    };

    this.setActiveTab = this.setActiveTab.bind(this);
  }

  componentDidMount() {
    const { resultData } = this.props;

    if (
      !resultData.result.ddgResults ||
      !resultData.result.ddgResults.length
    ) {
      if (resultData.result.googleResults && resultData.result.googleResults.length) {
        this.setState({
          activeTab: 'g',
        });
      }
    }
  }

  setActiveTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const { activeTab } = this.state;
    const { query, resultData } = this.props;

    if (
      (
        !resultData.result.ddgResults ||
        !resultData.result.ddgResults.length
      )
      &&
      (
        !resultData.result.googleResults ||
        !resultData.result.googleResults.length
      )
    ) {
      // No results exist for meta search
      return (
        <RedirectToDefaultSearchEngine
          query={query}
        />
      )
    }

    return (
      <div className="meta-search-result">
        <Row>
          <Col className="d-none d-lg-block" xs={12} lg={3} xl={3}>
            <Card>
              <CardHeader>
                {query}
              </CardHeader>

              <CardBody>
                <p className="mb-0">Result Type: <b>Meta Search</b></p>

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
          <Col xs={12} md={12} lg={9} xl={9}>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 'd', 'pointer link': true })}
                  onClick={() => {
                    this.setActiveTab('d');
                  }}
                  tag="div"
                >
                  <a href={`https://duckduckgo.com/?q=${query}`}>
                    <i className="fa fa-external-link" />
                  </a>&nbsp;

                  DuckDuckGo&trade;
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 'g', 'pointer link': true })}
                  onClick={() => {
                    this.setActiveTab('g');
                  }}
                  tag="div"
                >
                  <a href={`https://www.google.com/search?q=${query}`}>
                    <i className="fa fa-external-link" />
                  </a>&nbsp;

                  Google&trade;
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="d">
                <WebPageRows
                  query={query}
                  resultData={resultData}
                  source="d"
                />
              </TabPane>
              <TabPane tabId="g">
                <WebPageRows
                  query={query}
                  resultData={resultData}
                  source="g"
                />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </div>
    );
  }
}

MetaSearchResult.defaultProps = {
  query: '',
};

MetaSearchResult.propTypes = {
  query: PropTypes.string,
  resultData: PropTypes.object.isRequired,
};

export default MetaSearchResult;
