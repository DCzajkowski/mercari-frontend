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

class HomeScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.makePopUp = this.makePopUp.bind(this);
    this.getCodeFromPopUp = this.getCodeFromPopUp.bind(this);
    this.getOAuthCode = this.getOAuthCode.bind(this);
  }

  public handleClick(providerInfo: { url: string; name: string }) {
    const { url, name } = providerInfo;
    const popup = this.makePopUp(url);
    if (popup) {
      this.getOAuthCode(popup).then(async (code: string) => {
        const response = await fetch(
          `https://sharatin.gq/api/login/${name}?code=${code}`,
          {
            headers: {
              Accept: 'application/json'
            }
          }
        );
        // tslint:disable-next-line:no-console
        console.log(response);
      });
    }
  }

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

  public render() {
    const { match } = this.props;
    const allegroURL = process.env.REACT_APP_ALLEGRO_URL;

    return (
      <div className="HomeScreenContainer">
        <h1>Welcome to Sharating!!</h1>
        <h2>Share your reviews with {match.url.substring(1)} from: </h2>
        <div className="providers">
          <div
            onClick={this.handleClick.bind(this, {
              name: 'allegro',
              url: allegroURL
            })}
            className="Provider-container"
          >
            <Provider image={allegroLogo} title="Allegro" />
          </div>
        </div>
      </div>
    );
  }
}

export default HomeScreen;
