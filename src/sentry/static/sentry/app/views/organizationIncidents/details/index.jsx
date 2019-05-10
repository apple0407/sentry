import React from 'react';
import PropTypes from 'prop-types';

import {addErrorMessage} from 'app/actionCreators/indicator';
import LoadingIndicator from 'app/components/loadingIndicator';
import LoadingError from 'app/components/loadingError';
import {PageContent} from 'app/styles/organization';
import withApi from 'app/utils/withApi';
import {t} from 'app/locale';

import IncidentHeader from './header';
import Incidents from './incidents';
import {
  INCIDENT_STATUS,
  fetchIncident,
  updateSubscription,
  updateStatus,
  isOpen,
} from '../utils';

class OrganizationIncidentDetails extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {isLoading: false, hasError: false};
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({isLoading: true, hasError: false});
    const {
      api,
      params: {orgId, incidentId},
    } = this.props;

    fetchIncident(api, orgId, incidentId)
      .then(incident => {
        this.setState({incident, isLoading: false, hasError: false});
      })
      .catch(() => {
        this.setState({isLoading: false, hasError: true});
      });
  };

  handleSubscriptionChange = () => {
    const {
      api,
      params: {orgId, incidentId},
    } = this.props;

    const isSubscribed = this.state.incident.isSubscribed;

    const newIsSubscribed = !isSubscribed;

    this.setState(state => ({
      incident: {...state.incident, isSubscribed: newIsSubscribed},
    }));

    updateSubscription(api, orgId, incidentId, isSubscribed).catch(() => {
      this.setState(state => ({
        incident: {...state.incident, isSubscribed},
      }));
      addErrorMessage(t('An error occurred, your subscription status was not changed.'));
    });
  };

  handleStatusChange = () => {
    const {
      api,
      params: {orgId, incidentId},
    } = this.props;

    const {status} = this.state.incident;

    const newStatus = isOpen(this.state.incident)
      ? INCIDENT_STATUS.CLOSED
      : INCIDENT_STATUS.CREATED;

    this.setState(state => ({
      incident: {...state.incident, newStatus},
    }));

    updateStatus(api, orgId, incidentId, status).catch(() => {
      this.setState(state => ({
        incident: {...state.incident, status},
      }));

      addErrorMessage(t('An error occurred, your incident status was not changed.'));
    });
  };

  render() {
    const {incident, isLoading, hasError} = this.state;

    return (
      <React.Fragment>
        <IncidentHeader
          params={this.props.params}
          incident={incident}
          onSubscriptionChange={this.handleSubscriptionChange}
          onStatusChange={this.handleStatusChange}
        />
        {incident && <Incidents incident={incident} />}
        {isLoading && (
          <PageContent>
            <LoadingIndicator />
          </PageContent>
        )}
        {hasError && (
          <PageContent>
            <LoadingError />
          </PageContent>
        )}
      </React.Fragment>
    );
  }
}

export {OrganizationIncidentDetails};
export default withApi(OrganizationIncidentDetails);
