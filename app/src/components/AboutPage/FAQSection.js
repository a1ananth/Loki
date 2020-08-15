import React from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row,
} from 'reactstrap';
import FAQCard from '../Common/FAQCard';
import { appName, githubProjectLink } from '../../constants/appConfig';
import { connect } from 'react-redux';

class FAQSection extends React.Component {
  render() {
    const { appConfig } = this.props;

    const whyLoki = (
      <div>
        <p className="mt-0 mb-0">The name {appName} was chosen because of two reasons.</p>

        <p className="mt-3 mb-0">
          1. It is a simple 2 syllable word that has historical significance as well as familiarity in the modern world.
        </p>

        <p className="mt-3 mb-0">
          2. The founding team felt there is a considerable overlap
          between the features of this software and features of the character {appName}
          from the mythology.
        </p>
      </div>
    );

    const whoDevelopedLoki = (
      <div>
        <p className="mt-0 mb-0">
          {appName} is open-source software,
          initially developed at <a href="http://ananthinnovations.com/" target="_blank" rel="noopener noreferrer">
          Ananth Innovations, Hyderabad, India
        </a>.
        </p>
      </div>
    );

    const isItCustomizable = (
      <div>
        <p className="mt-0 mb-0">
          Yes, you are free to fully customize {appName}, in terms of appearance and features, as per your liking.
          We are working towards bringing the customization abilities into Settings page, but in the meanwhile
          you can directly make changes in the front-end source and re-build it.
        </p>

        <p className="mt-3 mb-0">
          If you plan to use the source code, you
          agree to the terms mentioned in LICENSE file of the repository.
        </p>

        <p className="mt-3 mb-0">
          Incidentally, the character {appName} from the mythology
          is a shape-shifter as well, so we are committed to provide you full customization
          abilities in the future.
        </p>
      </div>
    );

    const isItPrivate = (
      <div>
        <p className="mt-0 mb-0">
          {appName} is designed to protect your privacy, which is why the system
          does not have any kind of user accounts functionality.

          {appName} does not store any kind of personally identifiable information (PII)
          from your searches, in terms of who is searching for what.

          Certain {appName} instances (by modifying the source code) may however
          store your IP address and User Agent information along with your search query.
        </p>

        <p className="mt-3 mb-0">
          If you have deployed your own instance of {appName} with a secured database instance,
          then you have significantly greater privacy than other search engines on the internet.
        </p>

        <p className="mt-3 mb-0">
          <b>NOTE:</b> But if you are using someone else&apos;s {appName} instance for your search,
          you can never be sure about privacy whatever they write on their page or tell you personally.
          We look forward to indicate the
          privacy risk status near the search form itself in every {appName} instance.
        </p>

        <p className="mt-3 mb-0">
          To know more regarding about privacy of the
          data you provide to the system, check out the <a href="/privacy">privacy
          policy</a>.
        </p>
      </div>
    );

    const sensitiveData = (
      <div>
        <p className="mt-0 mb-0">
          Short answer: <b>NOT RECOMMENDED</b>.
        </p>

        <p className="mt-3 mb-0">
          If you have not enabled authentication for accessing search results,
          your search results are accessible publicly to everybody on
          your network (i.e. the internet if your instance is on the cloud).

          So if you upload sensitive information in such instances,
          it can be accessed publicly.
        </p>

        <p className="mt-3 mb-0">
          With authentication setup in the right way, data
          uploaded in {appName} is secure and is only available to
          authenticated users.
        </p>

        <p className="mt-3 mb-0">
          That said, {appName} is still alpha software, which means
          it has not undergone rigorous security tests, and things might break
          when you update this software to latest versions.
        </p>

        <p className="mt-3 mb-0">
          But for the time being, we highly recommend you NOT to upload any kind
          of sensitive data to any {appName} instance. We hope this won&apos;t be
          an issue by the time of a stable release.
        </p>
      </div>
    );

    const isItLegal = (
      <div>
        <p className="mt-0 mb-0">
          The <a href="https://en.wikipedia.org/wiki/Web_scraping#Legal_issues" target="_blank"
                 rel="noopener noreferrer">
          Legality of Web scraping</a> varies across the world.

          However, many companies in the world have freely practiced web scraping
          over the public internet since it&apos;s inception.
        </p>

        <p className="mt-3 mb-0">
          {appName}&apos;s web scraping happens on the client&apos;s end through a browser extension,
          so if you continue to use {appName}
          extension to scrape information from the websites you visit,
          you will need to make sure you are following the laws that apply in your
          region regarding web scraping, data ownership and copyrights, and
          also that you are following the contractual agreements you have with
          your service providers (i.e. companies that operate these websites).
        </p>
      </div>
    );

    let contactSiteAdmin = null;
    if (appConfig.loaded && appConfig.data.search && appConfig.data.search.siteAdminEmail) {
      contactSiteAdmin = (
        <p className="mt-0 mb-0">
          If you have any doubts regarding this {appName} instance,
          you can contact the site administrator
          at <a href={`mailto:${appConfig.data.search.siteAdminEmail}`}>{appConfig.data.search.siteAdminEmail}</a>
        </p>
      );
    }

    const moreQueriesContact = (
      <div>
        {contactSiteAdmin}

        <p className="mt-3 mb-0">
          If you have any doubts regarding {appName} software in general,
          you can create a new issue in the <a href={githubProjectLink} target="_blank" rel="noopener noreferrer">
          Github page</a> of this project and label it as
          a &quot;[query]&quot;.
        </p>
      </div>
    );

    const isPremiumAvailable = (
      <div>
        <p className="mt-0 mb-0">
          The community version of {appName} is completely free to use personally and commercially.
        </p>

        <p className="mt-3 mb-0">
          We do not have an enterprise version at the moment.
          If you need additional support, for the time being,
          you can send your queries from the Contact Us
          section of our authorized service
          partner <a href="http://ananthinnovations.com/" target="_blank" rel="noopener noreferrer">
          Ananth Innovations, Hyderabad, India
        </a>.
        </p>
      </div>
    );

    return (
      <Row className="">
        <Col xs={12} md={6}>
          <FAQCard
            content={whyLoki}
            title={`Why is this software named after ${appName} (mythology)?`}
          />

          <FAQCard
            content={isItCustomizable}
            title={`Can I customize ${appName}?`}
          />

          <FAQCard
            content={isItLegal}
            title="Is it legal to scrape information from the websites we visit?"
          />

          <FAQCard
            content={moreQueriesContact}
            title="I have more queries. Whom should I contact?"
          />
        </Col>

        <Col xs={12} md={6}>
          <FAQCard
            content={whoDevelopedLoki}
            title={`Who developed ${appName}?`}
          />

          <FAQCard
            content={isPremiumAvailable}
            title="Is there an enterprise version with additional support?"
          />

          <FAQCard
            content={isItPrivate}
            title="Is my search data private?"
          />

          <FAQCard
            content={sensitiveData}
            title={`Can I upload sensitive data to my ${appName} instance?`}
          />
        </Col>
      </Row>
    );
  }
}

FAQSection.defaultProps = {
  appConfig: {},
};

FAQSection.propTypes = {
  appConfig: PropTypes.object,
};

const mapStateToProps = (state => ({
  appConfig: state.appConfig,
}));

export default connect(mapStateToProps)(FAQSection);
