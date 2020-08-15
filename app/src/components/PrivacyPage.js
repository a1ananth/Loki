import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Container } from 'reactstrap';
import Footer from './Common/Footer';
import Header from './CustomPage/Header';
import { appName } from '../constants/appConfig';
import FAQCard from './Common/FAQCard';
import { setDocumentTitle } from "../utils/general";
import { connect } from 'react-redux';

class PrivacyPage extends React.Component {
  componentDidMount() {
    setDocumentTitle('Privacy');
  }

  render() {
    const { appConfig } = this.props;

    const unintendedDataLeakage = (
      <div>
        <p className="mt-0 mb-0">
          When you connect your device to the internet, you leak certain
          data about you to different service providers by default.

          This may happen with your action, like for example opening an app or a website,
          or may happen automatically in the background.

          The leaked data also depends on whether
          you have used these apps and websites before, whether you are logged in etc.,
        </p>

        <p className="mt-3 mb-0">
          The first is your ISP. Your ISP receives your entire web request
          history and may or may not track it depending upon their Terms of Service.
          Both PII & DI can be tracked by your ISP
          since most ISPs require your PII to provide the service.
        </p>

        <p className="mt-3 mb-0">
          The second is the service provider that operates the
          website you are requesting. So for example, when you open
          https://en.wikipedia.org , Wikimedia Foundation
          receives your DI and can potentially link it with all resources
          that you view on their website.
        </p>

        <p className="mt-3 mb-0">
          Based on your operating system, the device you use, the browser you use,
          the Javascript code embedded in the website you requested,
          you might be leaking your data to more service providers.

          From this leaked data, what data is used temporarily and
          what data is retained forever,
          depends on those service providers.
        </p>
      </div>
    );

    const roleOfAuthentication = (
      <div>
        <p className="mt-0 mb-0">
          When you use websites or apps that require you to be authenticated (i.e. Logged In),
          it happens through a Unique Identifier stored in your device (Cookies / Preferences).

          So all websites that you have &quot;Logged In&quot; to, can track your activity
          throughout their applications and directly
          correlate it with your DI. In case you have provided your PII to these service providers,
          they can correlate your activity with your PII as well.
        </p>

        <p className="mt-3 mb-0">
          What data from this is used temporarily and what data is retained forever,
          again depends on those service providers.
        </p>
      </div>
    );

    const privacyInLoki = (
      <div>
        <p className="mt-0 mb-0">
          Before understanding privacy in {appName} instances, please keep in mind that,
          we are in no way capable of preventing unintended data leakage
          explained in first two sections (you can expand to read them).
        </p>

        <p className="mt-3 mb-0">
          When you search for something in {appName}, that search
          query is stored in the database forever. When
          you submit meta search results or any kind of
          structured data through
          the {appName} browser extension, those search results are
          stored in the database forever. {appName} also
          keeps track of search count forever,
          which indicates how many times each
          query has been searched. However, by default,
          none of this data is associated with your PII or DI.
        </p>

        <p className="mt-3 mb-0">
          <b>The extent of privacy in a {appName} instance is not fixed by developers</b>.
          It is designed to be configurable by the site administrator.
        </p>

        <p className="mt-3 mb-0">
          The default settings enable maximum privacy to users,
          however, site administrators may choose to enable some tracking features
          that erode the privacy of users in favor of improving the system.
        </p>

        <p className="mt-3 mb-0">
          Site administrators have the option to save your DI (IP address,
          Device Model name, Browser name),
          and this will associate all your search history with your DI.
        </p>

        <p className="mt-3 mb-0">
          When you use {appName} instances that require authentication,
          please keep in mind that the site administrators
          may have associated your authentication token with your PII.
          In that case, your search history can be associated
          with your PII, which means
          the site administrator can track all your search history.
        </p>

        <p className="mt-3 mb-0">
          {appName} is designed for personal use or inside close trusted networks.
          The responsibility of securing the deployment and
          keeping privacy policy transparent to
          end users lies on the site administrator. At the same time,
          the responsibility
          to be aware of an instance&apos;s privacy policy
          and to protect their privacy lies with users of the software.
        </p>

        <p className="mt-3 mb-0">
          The community version of {appName} web app displays a
          &quot;Privacy Status&quot; indicator near the search box.
          However, it cannot be fully trusted when you are
          using someone else&apos;s {appName} instance. Since {appName} is open-source,
          the backend and frontend source code can be edited by anybody
          and a malicious hacker can make the indicator
          show up as &quot;Private&quot; while in the backend they maybe saving
          your DI.
        </p>

        <p className="mt-3 mb-0">
          <b>Key note 1</b>: To safeguard your privacy while browsing a {appName} instance,
          we highly recommend you use <b>trusted {appName} instances</b> only, or even better, <b>your
          own instance</b> only.
        </p>

        <p className="mt-3 mb-0">
          <b>Key note 2</b>:
          If you are the site administrator, to protect your privacy,
          you can turn off all tracking
          from Settings page and enable authentication to prevent others
          from viewing your search queries and results.
        </p>

        <p className="mt-3 mb-0">
          The developers of {appName} software and the community does
          not take any responsibility for any kind of exposure of
          private information through any {appName} instance.
        </p>
      </div>
    );

    let contactSiteAdmin = null;
    if (appConfig.loaded && appConfig.data.search && appConfig.data.search.siteAdminEmail) {
      contactSiteAdmin = (
        <span>
          For any requests or clarifications, you can contact the site administrator
          at <a href={`mailto:${appConfig.data.search.siteAdminEmail}`}>{appConfig.data.search.siteAdminEmail}</a>
        </span>
      );
    }

    const privacyInThisInstance = (
      <div>
        <p className="mt-0 mb-0">
          This instance stores every search query along with
          DI (IP Address, Device model name, Browser name).

          This is a public instance without authentication
          for accessing the search results,
          and we do not receive your PII at all when you make search queries.
        </p>

        <p className="mt-3 mb-0">
          To edit the search results on this website,
          you can get in touch with us and share your PII,
          and we will send you an authentication token.

          When you edit search results,
          your DI & PII is stored along with all
          the edits you have submitted to this instance.
        </p>

        <p className="mt-3 mb-0">
          This data is stored forever. {contactSiteAdmin}
        </p>
      </div>
    );

    return (
      <div className="custom-page privacy-page">
        <Container>
          <Header pageTitle="Privacy Policy" />

          <Card className="privacy-details-container">
            <CardBody>
              <p className="mt-0 mb-0">
                If you are concerned about privacy, please read all sections in this page carefully.
              </p>

              <p className="mt-3 mb-0">
                Glossary
              </p>

              <ul className="mt-2 mb-0">
                <li><b>ISP</b>: Internet Service Provider</li>
                <li><b>PII</b>: Personally Identifiable Information (like Name, Email, Phone, etc)</li>
                <li><b>DI</b>: Demographic Information (like IP Address, Device Name, Browser Name, etc)</li>
                <li><b>Site Administrator</b>: Individual / Organisation that deploys and manages a {appName} instance
                </li>
                <li><b>Forever</b>: Until deleted by site administrator</li>
              </ul>

              <blockquote className="mt-3 mb-3">
                <p className="mb-0">
                  Privacy in the modern internet era is a myth, unless you take special care to protect yours.
                </p>
              </blockquote>

              <FAQCard
                title="Unintended Data Leakage"
                content={unintendedDataLeakage}
              />

              <FAQCard
                title="The role of Authentication"
                content={roleOfAuthentication}
              />

              <FAQCard
                openByDefault={true}
                title={`Privacy in this ${appName} Instance`}
                content={privacyInThisInstance}
              />

              <FAQCard
                openByDefault={true}
                title={`Privacy in ${appName}`}
                content={privacyInLoki}
              />

              <p className="mt-3 mb-0">
                <small>The contents of this page were last updated on 12 Aug, 2020.</small>
              </p>
            </CardBody>
          </Card>

        </Container>

        <Footer />
      </div>
    );
  }
}

PrivacyPage.defaultProps = {
  appConfig: {},
};

PrivacyPage.propTypes = {
  appConfig: PropTypes.object,
};

const mapStateToProps = (state => ({
  appConfig: state.appConfig,
}));

export default connect(mapStateToProps)(PrivacyPage);
