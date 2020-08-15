/* eslint-disable no-param-reassign */

import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios;
