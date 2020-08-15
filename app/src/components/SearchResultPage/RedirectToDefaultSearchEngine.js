import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Redirect from '../Common/Redirect';
import { getSearchUrl } from '../../utils/general';

class RedirectToDefaultSearchEngine extends React.Component {
  render() {
    const { appConfig, query } = this.props;

    if (!query) {
      return null;
    }

    const searchUrl = getSearchUrl(appConfig, query);

    // return (
    //   <div>
    //     <p className="mb-0">Redirects are now disabled. Click the link below to go to search engine</p>
    //     <p className="mt-2">
    //       <a href={searchUrl}>
    //         {searchUrl}
    //       </a>
    //     </p>
    //
    //
    //   </div>
    // );

    return (
      <Redirect to={searchUrl} />
    );
  }
}

RedirectToDefaultSearchEngine.defaultProps = {
  appConfig: {},
};

RedirectToDefaultSearchEngine.propTypes = {
  appConfig: PropTypes.object,
  query: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  appConfig: state.appConfig,
});

export default connect(mapStateToProps)(RedirectToDefaultSearchEngine);
