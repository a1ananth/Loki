import React from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import Footer from './Common/Footer';
import Header from './CustomPage/Header';
import FAQCard from './Common/FAQCard';
import { setDocumentTitle } from "../utils/general";
import { appName } from '../constants/appConfig';

class HowItWorksPage extends React.Component {
  componentDidMount() {
    setDocumentTitle('How it Works ');
  }
  render() {
    const howToDeploy = (
      <div>
        <p className="mt-0 mb-0">
          To be written.
        </p>
      </div>
    );

    const howToDownload = (
      <div>
        <p className="mt-0 mb-0">
          To be written.
        </p>
      </div>
    );

    return (
      <div className="custom-page">
        <Container>
          <Header pageTitle={`How it works`} />

          <Card>
            <CardBody>
              <p className="mt-0 mb-0">
                {appName} is a combo of Browser Extension + Search Engine.
              </p>

              <p className="mt-3 mb-0">
                For using {appName}, you will either need to
                deploy your own {appName} instance or
                find a trusted {appName} instance to use.
              </p>

              <p className="mt-3 mb-0">
                You set {appName} as the default search engine in the browsers of
                all your devices and install the browser extension
                in your desktop browsers.
              </p>

              <p className="mt-3 mb-0">
                When you make a search query, for example say &quot;hello&quot;, it is searched in the
                database whether there is a search result already configured
                for this search query. If search result has been configured, {appName} displays
                the configured search result.
              </p>

              <p className="mt-3 mb-0">
                If there is no search result configured for your query, {appName} automatically redirects
                you to a default internet search engine (configured by site administrator).
              </p>

              <p className="mt-3 mb-0">
                When results are loaded in your desktop browser with extension installed,
                the extension scrapes these search results and sends them to the server.

                The server stores these search results and automatically configures it as
                the meta search result that is to be shown for this search query.
              </p>

              <p className="mt-3 mb-0">
                From the next time, when you search for this same query, {appName} directly displays
                the configured search result, which is the same list of results that were previously
                displayed in an default internet search engine.
              </p>

              <p className="mt-3 mb-0">
                This search result can be customized through the Edit page and
                you can put your own concise knowledge for a search query so that
                it is directly displayed when you search for it.
              </p>

              <p className="mt-3 mb-0">
                This means, the {appName} instance gathers search results in the background
                and increases its knowledge with time.
              </p>

              <p className="mt-3 mb-0">
                We are working towards a federated contribution system,
                by which your {appName} instance can import customized
                search results from contributors all over the world
                to show us important information directly.
              </p>
            </CardBody>
          </Card>

          <Card className="mt-3">
            <CardHeader>FAQ</CardHeader>
            <CardBody>
              <Row className="">
                <Col xs={12} md={6}>
                  <FAQCard
                    content={howToDeploy}
                    title={`How do I deploy a ${appName} instance?`}
                  />
                </Col>

                <Col xs={12} md={6}>
                  <FAQCard
                    content={howToDownload}
                    title={`How do I install the browser extension?`}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>

        <Footer />
      </div>
    );
  }
}

export default HowItWorksPage;
