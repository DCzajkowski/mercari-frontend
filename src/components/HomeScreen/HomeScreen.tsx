import * as _ from 'lodash';
import * as React from 'react';
import Provider from '../Provider/Provider';
import allegroLogo from './Allegro.png';
import './HomeScreen.css';

interface Props {
  match: {
    url: string;
  };
}

interface State {
  allegro: {
    checked: boolean;
    logo: string;
    name: string;
    url: string;
  };
  userID: number;
}

class HomeScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      allegro: {
        checked: false,
        logo: allegroLogo,
        name: 'allegro',
        url: process.env.REACT_APP_ALLEGRO_URL || ''
      },
      userID: -1
    };

    this.handleClick = this.handleClick.bind(this);
    this.makePopUp = this.makePopUp.bind(this);
    this.getCodeFromPopUp = this.getCodeFromPopUp.bind(this);
    this.getOAuthCode = this.getOAuthCode.bind(this);
    this.renderProvider = this.renderProvider.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  public handleClick(providerInfo: { url: string; name: string }) {
    const { url, name } = providerInfo;
    const popup = this.makePopUp(url);
    if (popup) {
      this.getOAuthCode(popup).then(async (code: string) => {
        fetch(
          `https://sharatin.gq/api/login/${name}?code=${code}&userid=${
            this.state.userID
          }`,
          {
            headers: {
              Accept: 'application/json'
            }
          }
        )
          .then(res => res.json())
          .then(resJSON => {
            this.handleResponse(resJSON);
          });
      });
    }
  }

  public handleResponse = (res: {
    user_id: number;
    authorized_providers: string[];
  }) => {
    this.setState({
      ...this.state,
      userID: res.user_id
    });

    res.authorized_providers.forEach((provider: string) => {
      this.setState({
        ...this.state,
        [provider]: { ...this.state[provider], checked: true }
      });
    });
  };

  public getOAuthCode = (popup: Window) =>
    new Promise((resolve, reject) => {
      const tryInterval = window.setInterval(() => {
        const code = this.getCodeFromPopUp(popup);

        if (code) {
          resolve(code);
          this.closePopUp(tryInterval, popup);
        }

        if (_.get(popup, 'closed', false)) {
          reject(null);
          this.closePopUp(tryInterval, popup);
        }
      }, 100);
    });

  public makePopUp = (url: string) => {
    return window.open(url, 'slackLogin', 'width=800, height=600');
  };

  public closePopUp = (interval: number, popup: Window) => {
    window.clearInterval(interval);
    popup.close();
  };

  public getCodeFromPopUp = (popup: Window) => {
    let code = null;

    try {
      const url = _.get(popup, 'document.URL', null);

      if (url) {
        code = new URL(url).searchParams.get('code');
      }
    } catch (e) {
      //
    }

    return code;
  };

  public handleCheck = (name: string) => {
    this.setState({
      ...this.state,
      [name]: {
        ...this.state[name],
        checked: !this.state[name].checked
      }
    });
  };

  public renderProvider = (name: string) => {
    const provider = this.state[name];

    if (this.state.userID === -1) {
      return (
        <div
          onClick={this.handleClick.bind(this, {
            name: provider.name,
            url: process.env.REACT_APP_ALLEGRO_URL
          })}
          className="Provider-container"
        >
          <Provider image={provider.logo} title={provider.name} />
        </div>
      );
    }
    return (
      <div>
        <label htmlFor={`input-${provider.name}`}>
          <Provider image={provider.logo} title={provider.name} />
        </label>
        <input
          id={`input-${provider.name}`}
          type="checkbox"
          value={provider.name}
          name={provider.name}
          checked={provider.checked}
          onChange={this.handleCheck.bind(this, provider.name)}
        />
      </div>
    );
  };

  public render() {
    const { match } = this.props;
    const service = match.url.substring(1);
    return (
      <div className="HomeScreenContainer">
        <h1>Welcome to Sharating!!</h1>
        <h2>Share your reviews with {service} from: </h2>
        <div className="providers">
          <form method="POST" action={`/api/provider/connect/${service}`}>
            {this.renderProvider('allegro')}
            <input type="hidden" name="user_id" value={this.state.userID} />
            {this.state.userID !== -1 && <button>Submit</button>}
          </form>
        </div>
      </div>
    );
  }
}

export default HomeScreen;
