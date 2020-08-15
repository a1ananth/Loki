import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Row,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Noty from 'noty';
import MDEditor from '@uiw/react-md-editor'
import ReactQuill from 'react-quill';
import { history } from '../../store/configureStore';
import ResultTypeHelperText from './ResultTypeHelperText';
import * as searchActions from '../../actions/searchActions';
import { setStateFromEvent, setStateFromValue } from '../../utils/general';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [
      { 'font': [] }, { 'size': [] }, { 'color': [] }, { 'background': [] }, { 'align': [] },
    ],
    [
      'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'clean',
    ],
    [
      { 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }, { 'direction': 'rtl' },
    ],
    ['link', 'script'],
  ],
};

const formats = [
  'header', 'font', 'size', 'color', 'background',
  'bold', 'italic', 'underline', 'strike', 'align', 'blockquote', 'clean',
  'list', 'bullet', 'indent', 'code-block',
  'link', 'script'
];

class EditResultForm extends React.Component {
  static getStateFromProps(props) {
    const { resultData } = props;
    let {
      fixedText, fixedTextType,
      resultType, targetUrl,
      searchCount,
      notes,
    } = resultData.result;

    if (!resultType) {
      resultType = 'none';
    }

    if (!fixedTextType) {
      fixedTextType = '';
    }

    if (!fixedText) {
      fixedText = '';
    }

    if (!targetUrl) {
      targetUrl = '';
    }

    if (!searchCount) {
      searchCount = 0;
    }

    if (!notes) {
      notes = '';
    }

    return {
      fixedText,
      fixedTextType,
      resultType,
      targetUrl,

      searchCount,
      notes,
    };
  }

  constructor(props) {
    super(props);

    this.state = EditResultForm.getStateFromProps(props);

    this.onFixedTextChanged = setStateFromValue.bind(this, this, 'fixedText');
    this.onFixedTextTypeChanged = setStateFromEvent.bind(this, this, 'fixedTextType');
    this.onResultTypeChanged = setStateFromEvent.bind(this, this, 'resultType');
    this.onTargetUrlChanged = setStateFromEvent.bind(this, this, 'targetUrl');

    this.onNotesChanged = setStateFromEvent.bind(this, this, 'notes');
    this.onSearchCountChanged = setStateFromEvent.bind(this, this, 'searchCount');

    this.openSearchPage = this.openSearchPage.bind(this);
    this.saveSearchResult = this.saveSearchResult.bind(this);

    this.saveStarted = false;
  }

  /* eslint-disable-next-line react/no-deprecated */
  componentWillReceiveProps(nextProps) {
    const { query } = this.props;

    if (this.props.resultData !== nextProps.resultData) {
      this.setState(EditResultForm.getStateFromProps(nextProps));
    }

    if (
      this.saveStarted &&
      this.props.saveSearchResult !== nextProps.saveSearchResult &&
      nextProps.saveSearchResult[query]
    ) {
      this.handleStatusChange(nextProps);
    }
  }

  handleStatusChange(props) {
    const { query } = props;

    if (
      props.saveSearchResult[query] && !props.saveSearchResult[query].saving && props.saveSearchResult[query].saved
    ) {
      new Noty({
        type: 'success',
        layout: 'bottomLeft',
        text: 'Changes have been saved.',
      }).show();

      this.saveStarted = false;
    } else if (
      props.saveSearchResult[query] && !props.saveSearchResult[query].saving && !props.saveSearchResult[query].saved
    ) {
      let errorMessage = props.saveSearchResult[query].error;
      if (!errorMessage) {
        errorMessage = 'Failed to save result data due to server error.';
      }

      new Noty({
        type: 'error',
        layout: 'bottomLeft',
        text: errorMessage,
      }).show();

      this.saveStarted = false;
    }
  }

  openSearchPage() {
    const { query } = this.props;
    history.push(`/search?q=${query}`);
  }

  saveSearchResult() {
    // TODO Validate data
    const { query } = this.props;
    this.props.actions.saveSearchResultStarting(query);
    this.props.actions.saveSearchResult(query, this.state);
    this.saveStarted = true;
  }

  render() {
    const {
      resultType, targetUrl,
      fixedText, fixedTextType,
      notes, searchCount,
    } = this.state;
    const { query } = this.props;

    const { saveSearchResult } = this.props;
    const saveSearchResultStatus = saveSearchResult[query];

    let dynamicFields = null;
    let dynamicFields2 = null;

    if (resultType === 'redirect') {
      dynamicFields = (
        <div className="mt-4">
          <FormGroup>
            <Label for="targetURL">Redirect to URL</Label>
            <Input
              type="text"
              name="targetURL"
              id="targetURL"
              placeholder="Enter the URL here"
              value={targetUrl}
              onChange={this.onTargetUrlChanged}
            />
          </FormGroup>
        </div>
      );
    } else if (resultType === 'fixed_text') {
      if (fixedTextType === 'markdown') {
        dynamicFields2 = (
          <FormGroup>
            <Label for="fixedText">Enter Text below</Label>
            <MDEditor
              name="fixedText"
              value={fixedText}
              onChange={this.onFixedTextChanged}
              height={400}
            />
          </FormGroup>
        );
      } else {
        dynamicFields2 = (
          <FormGroup>
            <Label for="fixedText">Enter Text below</Label>
            <ReactQuill
              className="fixed-text-editor"
              theme="snow"
              value={fixedText}
              onChange={this.onFixedTextChanged}
              modules={modules}
              formats={formats}
            />
          </FormGroup>
        );
      }

      dynamicFields = (
        <div className="mt-4">
          <Row>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="fixedTextType">Text Type</Label>
                <Input
                  type="select"
                  name="fixedTextType"
                  id="fixedTextType"
                  value={fixedTextType}
                  onChange={this.onFixedTextTypeChanged}
                >
                  <option value="wysiwig">WYSIWYG</option>
                  <option value="markdown">Markdown</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>

          {dynamicFields2}
        </div>
      )
    }

    let btnSave;
    if (saveSearchResultStatus && saveSearchResultStatus.saving) {
      btnSave = (
        <Button color="success" disabled>
          <i className="fa fa-spinner fa-spin" />
          &nbsp;
          Saving
        </Button>
      );
    } else {
      btnSave = (
        <Button color="success" onClick={this.saveSearchResult}>
          <i className="fa fa-save" />
          &nbsp;
          Save
        </Button>
      );
    }

    return (
      <div>
        <Card>
          <CardHeader>
            <b>{query}</b> - Edit Search Result
          </CardHeader>
          <CardBody>
            <Form>
              <Row>
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label for="resultType">Result Type</Label>
                    <Input
                      type="select"
                      name="resultType"
                      id="resultType"
                      className=""
                      value={resultType}
                      onChange={this.onResultTypeChanged}
                    >
                      <option value="none">None</option>
                      <option value="meta_search">Meta Search</option>
                      <option value="redirect">Redirect</option>
                      <option value="fixed_text">Fixed Text</option>
                    </Input>
                  </FormGroup>

                  <ResultTypeHelperText resultType={resultType} />
                </Col>
              </Row>

              {dynamicFields}

              <Row className="mt-4">
                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label for="searchCount">Search Count</Label>
                    <Input
                      type="number"
                      name="searchCount"
                      id="searchCount"
                      min="-9999999999"
                      max="9999999999"
                      placeholder="Edit Search Count"
                      value={searchCount}
                      onChange={this.onSearchCountChanged}
                    />
                  </FormGroup>

                  <p className="helper-text m-0">
                    This acts as a score by which search results and suggestions are ordered.
                  </p>
                </Col>

                <Col xs={12} md={6}>
                  <FormGroup>
                    <Label for="notes">Notes</Label>
                    <Input
                      type="textarea"
                      name="notes"
                      id="notes"
                      placeholder=""
                      value={notes}
                      onChange={this.onNotesChanged}
                    />
                  </FormGroup>

                  <p className="helper-text m-0">
                    Notes are just for you in edit section. They won&quot;t show up on result page.
                  </p>
                </Col>
              </Row>
            </Form>
          </CardBody>

          <CardFooter>
            <Row>
              <Col xs={6}>
                {btnSave}
              </Col>
              <Col xs={6} className="d-flex justify-content-end">
                <Button color="secondary" onClick={this.openSearchPage}>
                  <i className="fa fa-backward" />&nbsp;
                  Back to Search
                </Button>
              </Col>
            </Row>

          </CardFooter>
        </Card>
      </div>
    );
  }
}

EditResultForm.defaultProps = {
  actions: {},
  query: '',
  saveSearchResult: {},
};

EditResultForm.propTypes = {
  actions: PropTypes.object,
  query: PropTypes.string,
  resultData: PropTypes.object.isRequired,
  saveSearchResult: PropTypes.object,
};

const mapStateToProps = state => ({
  saveSearchResult: state.saveSearchResult,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({}, searchActions), dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditResultForm);
