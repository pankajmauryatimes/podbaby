import _ from 'lodash';
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';
import DocumentTitle from 'react-document-title';

import { Input, Button } from 'react-bootstrap';

import * as actions from '../actions';
import { channelsSelector } from '../selectors';
import PageHeader from '../components/header';
import Pager from '../components/pager';
import Icon from '../components/icon';
import Loading from '../components/loading';
import ChannelItem from '../components/channel_item';
import { getTitle } from './utils';

export class Subscriptions extends React.Component {

  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    this.actions = bindActionCreators(actions.channels, dispatch);
    this.handleFilterChannels = this.handleFilterChannels.bind(this);
    this.handleClearFilter = this.handleClearFilter.bind(this);
    this.handleSelectPage = this.handleSelectPage.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleClearFilter() {
    this.refs.filter.getInputDOMNode().value = '';
    this.actions.filterChannels('');
  }

  handleFilterChannels() {
    const value = _.trim(this.refs.filter.getValue());
    this.actions.filterChannels(value);
  }

  handleSelectPage(page) {
    window.scrollTo(0, 0);
    this.actions.selectPage(page);
  }

  handleSelect() {
    this.refs.filter.getInputDOMNode().select();
  }

  render() {
    const { page, unfilteredChannels, isLoading, filter } = this.props;

    if (isLoading) {
      return <Loading />;
    }

    if (_.isEmpty(unfilteredChannels) && !isLoading) {
      return (
        <div className="lead">You haven't subscribed to any channels yet.
          Discover new channels and podcasts <Link to="/search/">here</Link>.</div>);
    }

    const pager = <Pager page={page} onSelectPage={this.handleSelectPage} />;

    return (
      <DocumentTitle title={getTitle('My subscriptions')}>
      <div>
        <PageHeader header="My subscriptions" />
        <form onSubmit={this.handleFilterChannels}>
        <Input
          className="form-control"
          type="search"
          ref="filter"
          onClick={this.handleSelect}
          placeholder="Find a subscription"
        />
         <Input>
            <Button
              type="submit"
              bsStyle="primary"
              className="form-control"
            >
              <Icon icon="search" /> Search
            </Button>
          </Input>
          {filter ?
          <Input>
            <Button
              onClick={this.handleClearFilter}
              className="form-control"
            >
              <Icon icon="refresh" /> Show all
            </Button>
          </Input> : ''}

        </form>
        {pager}
        {this.props.channels.map(channel => {
          const toggleSubscribe = () => {
            this.props.dispatch(actions.subscribe.toggleSubscribe(channel));
          };
          return (
            <ChannelItem
              key={channel.id}
              channel={channel}
              showImage={false}
              isLoggedIn
              subscribe={toggleSubscribe}
            />
          );
        })}
        {pager}
        <Input>
          <a
            className="btn btn-primary form-control"
            href={`/api/member/subscriptions/podbaby-${moment().format('YYYY-MM-DD')}.opml`}
            download
          ><Icon icon="download" /> Download OPML</a>
        </Input>
      </div>
    </DocumentTitle>
    );
  }
}

Subscriptions.propTypes = {
  channels: PropTypes.array.isRequired,
  filter: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  page: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  unfilteredChannels: PropTypes.array.isRequired,
};

const mapStateToProps = state => {
  return Object.assign({}, channelsSelector(state), { isLoading: state.channels.isLoading });
};

export default connect(mapStateToProps)(Subscriptions);
