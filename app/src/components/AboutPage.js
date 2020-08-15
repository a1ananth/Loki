import React from 'react';
import { Card, CardBody, CardHeader, Container } from 'reactstrap';
import Footer from './Common/Footer';
import Header from './CustomPage/Header';
import { appName } from '../constants/appConfig';
import { Link } from 'react-router-dom';
import FAQSection from './AboutPage/FAQSection';
import { setDocumentTitle } from "../utils/general";

class AboutPage extends React.Component {
  componentDidMount() {
    setDocumentTitle('About ');
  }

  render() {
    return (
      <div className="custom-page about-page">
        <Container>
          <Header pageTitle={`About ${appName}`} />

          <Card>
            <CardHeader>Introduction</CardHeader>
            <CardBody>
              <blockquote>
                <p className="mb-0">
                  <b>Memory</b> is the <b>faculty of the brain</b> by which data
                  or information is encoded, stored, and retrieved when
                  needed.

                  It is the retention of information over time for the purpose
                  of influencing future action. If past events could not be remembered,
                  it would be impossible for language, relationships,
                  or personal identity to develop.
                </p>
              </blockquote>

              <p className="mt-0 mb-0">
                We gain knowledge by searching the internet on the subject we want to know about.
                Internet search has improved a lot since the 2000s, so much so that today it even
                gives us structured information.
                But since we rely on our personal memory, this knowledge is then stored in an unstructured
                manner in our brains.

                To retrieve this same information, we are compelled to search again, since it is easier to search
                the internet again rather than to traverse our brains.
              </p>

              <p className="mt-3 mb-0">
                If the information that we have once retrieved from internet search,
                can be stored in the same structured manner in our computer itself,
                can we build a knowledge repository of our own so that we may not need to
                search the internet again for that information?
              </p>

              <p className="mt-3 mb-0">
                <b>{appName}</b> is an open-source browsing companion,
                that starts from scratch, with zero knowledge of it&apos;s
                own.
                It is designed to collect important information from the pages we visit
                on the internet and store it in a structured manner.

                It is a combo of a
                Browser Extension + Search Engine, made to enable
                building our own knowledge repositories.
              </p>

              <p className="mt-3 mb-0">
                To use {appName} effectively, set it as your
                default search engine in all your devices and install the browser extension.
              </p>

              <p className="mt-3 mb-0">
                Aren&#39;t you curious to know <Link to="/how-it-works">how it works?</Link>
              </p>

              <p className="mt-3 mb-0">
                This software is still in alpha stage, so this page may be improved from time to time.
                Please come back later to know more!
              </p>
            </CardBody>
          </Card>

          <Card className="mt-3">
            <CardHeader>FAQ</CardHeader>
            <CardBody>
              <FAQSection />
            </CardBody>
          </Card>

        </Container>

        <Footer />
      </div>
    );
  }
}

export default AboutPage;
