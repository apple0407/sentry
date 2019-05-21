import SentryTypes from 'app/sentryTypes';
import AsyncComponent from 'app/components/asyncComponent';
import {getQuery} from './utils';

export default class Events extends AsyncComponent {
  static propTypes = {
    organization: SentryTypes.Organization.isRequired,
    view: SentryTypes.EventView.isRequired,
  };

  getEndpoints() {
    const {organization, view} = this.props;
    return [
      [
        'events',
        `/organizations/${organization.slug}/events/`,
        {
          query: getQuery(view),
        },
      ],
    ];
  }

  renderBody() {
    return this.props.view.name;
  }
}
