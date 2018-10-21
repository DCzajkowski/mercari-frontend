import * as _ from 'lodash';
import * as React from 'react';
import Provider from '../Provider/Provider';
import allegroLogo from './Allegro.png';
import amazonLogo from './Amazon.png';
import ebayLogo from './Ebay.png';
import './HomeScreen.css';
import lyftLogo from './Lyft.png';
import mercariLogo from './Mercari.png';
import uberLogo from './Uber.png';

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
  lyft: {
    checked: boolean;
    logo: string;
    name: string;
    url: string;
  };
  mercari: {
    checked: boolean;
    logo: string;
    name: string;
    url: string;
  };
  ebay: {
    checked: boolean;
    logo: string;
    name: string;
    url: string;
  };
  amazon: {
    checked: boolean;
    logo: string;
    name: string;
    url: string;
  };
  uber: {
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
      amazon: {
        checked: false,
        logo: amazonLogo,
        name: 'amazon',
        url: process.env.REACT_APP_AMAZON_URL || ''
      },
      ebay: {
        checked: false,
        logo: ebayLogo,
        name: 'ebay',
        url: process.env.REACT_APP_EBAY_URL || ''
      },
      lyft: {
        checked: false,
        logo: lyftLogo,
        name: 'lyft',
        url: process.env.REACT_APP_LYFT_URL || ''
      },
      mercari: {
        checked: false,
        logo: mercariLogo,
        name: 'mercari',
        url: process.env.REACT_APP_MERCARI_URL || ''
      },
      uber: {
        checked: false,
        logo: uberLogo,
        name: 'uber',
        url: process.env.REACT_APP_UBER_URL || ''
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
    return window.open(url, 'sharating oauth', 'width=800, height=600');
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
            url: provider.url
          })}
          className="Provider-container"
        >
          <Provider image={provider.logo} title={provider.name} />
        </div>
      );
    }
    return (
      <div className="Provider-container">
        <input
          id={`input-${provider.name}`}
          type="checkbox"
          value={provider.name}
          name={provider.name}
          checked={provider.checked}
          onChange={this.handleCheck.bind(this, provider.name)}
        />
        <label htmlFor={`input-${provider.name}`}>
          <Provider image={provider.logo} title={provider.name} />

          <div className="checkmark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </label>
      </div>
    );
  };

  public render() {
    const { match } = this.props;
    const service = match.url.substring(1);
    return (
      <div className="HomeScreenContainer">
        <div>
          <svg
            className="logo"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2779.1 1226.7"
          >
            <path d="M173.6 771.8c12-7.9 18-18.3 18-31.4 0-8.9-1.5-16.2-4.6-21.9-3.1-5.7-9.3-10.8-18.5-15.4-9.3-4.6-23.3-9.3-42.2-14.1-31.5-7.9-54.8-17.4-69.9-28.5-15.1-11.1-22.6-27.7-22.6-49.6 0-22.6 9.4-40.6 28.3-54 18.8-13.4 43.7-20.1 74.5-20.1 37.7 0 70.6 9.9 98.7 29.8l-19.5 29.8c-11.3-7.9-23.1-14-35.5-18.3-12.3-4.3-26.6-6.4-42.7-6.4-39.1 0-58.6 11.8-58.6 35.5 0 8.2 2.1 14.9 6.4 20.1 4.3 5.1 11.3 9.7 21.1 13.6 9.8 3.9 24.4 8.7 44 14.1 29.5 7.9 51.5 17.9 66.1 30.1 14.6 12.2 21.9 29.9 21.9 53.2 0 27.1-11 47.3-32.9 60.7-21.9 13.4-48.8 20.1-80.7 20.1-42.5 0-77.8-12.2-105.9-36.5l24-28.2c11 8.9 23.5 16 37.5 21.3 14.1 5.3 28.8 8 44.2 8 20.6 0 36.9-4 48.9-11.9zM383.9 580.1c10.6-13.7 23.6-24.3 39.1-31.9 15.4-7.5 31.4-11.3 47.8-11.3 50.7 0 76.1 26.7 76.1 80.2v196.4h-43.2V617.6c0-16.1-3.8-27.8-11.3-35.2-7.5-7.4-19.5-11.1-36-11.1-14.1 0-27.6 4.5-40.6 13.4s-23.6 19.4-31.9 31.4v197.4h-43.2V434.1l43.2-4.6v150.6zM848.6 777.8c3.4 5 9.1 8.7 17 11.1l-10.8 30.8c-26.4-3.4-42.8-16.3-49.4-38.6-9.6 12.3-21.7 21.8-36.2 28.3-14.6 6.5-30.8 9.8-48.6 9.8-27.1 0-48.4-7.5-64-22.6-15.6-15.1-23.4-35.3-23.4-60.7 0-27.8 10.9-49.2 32.6-64.3 21.8-15.1 53-22.6 93.8-22.6h40.1v-22.1c0-19.2-5.5-33-16.5-41.4-11-8.4-26.9-12.6-47.8-12.6-20.6 0-44 4.6-70.4 13.9l-11.8-32.9c31.9-11.3 61.5-17 88.9-17 32.9 0 58 7.7 75.3 23.1 17.3 15.4 26 36.8 26 64.3v130.1c.1 10.6 1.8 18.4 5.2 23.4zm-78.9-1.3c12.2-6.9 22.2-16.3 30.1-28.3v-69.4h-39.1c-28.8 0-49.5 4.8-62.2 14.4-12.7 9.6-19 23.6-19 42.2 0 34.3 17.3 51.4 51.9 51.4 13.4 0 26.1-3.5 38.3-10.3zM1027.5 724.8c7.9 25.9 19.6 49.4 35.2 70.4 15.6 21.1 36.4 43.3 62.5 66.6l-22.1 23.6c-30.2-24.3-54.8-48.3-73.8-72-19-23.6-33.6-50-43.7-79.2-10.1-29.1-15.2-62.7-15.2-100.8s5.1-71.6 15.2-100.8c10.1-29.1 24.7-55.5 43.7-79.2 19-23.6 43.6-47.6 73.8-72l22.1 23.6c-26.4 23.3-47.4 45.4-63 66.3-15.6 20.9-27.2 44.3-35 70.2-7.7 25.9-11.6 56.5-11.6 91.8.1 35.2 4 65.6 11.9 91.5zM1995.1 794h55v19.5h-137.4V794h60V643.2h-58.2v-19.5h80.6z" />
            <path d="M1972.7 643.2h-58.2v-19.5h80.6v104.5c-7.3-.6-14.9-.9-22.4-.8v-84.2zM2050.1 794v19.5h-137.4V794h60v-54.4c6.5.2 13.9.7 22.4 1.3V794h55zM2121.7 623.7h18.8l2.2 27.8c7.2-9.6 16.9-17.3 28.9-23 12-5.7 23.6-8.5 34.7-8.5 18.8 0 32.5 4.8 41 14.3 8.6 9.5 12.8 23.4 12.8 41.8v137.4h-22.4V700.3c0-15.9-.8-28.1-2.3-36.5-1.6-8.4-5-14.7-10.3-18.8-5.3-4.1-13.4-6.1-24.2-6.1-11.6 0-22.5 3.6-32.7 10.7-10.2 7.1-18.3 15.1-24 24v139.9h-22.4V623.7zM2496.9 631.3c-7.7 2.2-15.6 3.5-23.7 4s-18.7.7-32 .7c21.2 9.9 31.8 25.8 31.8 47.7 0 19.3-6.1 34.9-18.3 46.8-12.2 11.9-29 17.9-50.4 17.9-7 0-12.7-.3-17.2-.9-4.5-.6-8.9-1.7-13.2-3.4-3.1 2.7-5.7 5.8-7.8 9.6-2 3.7-3.1 7.5-3.1 11.4 0 11.6 8.9 17.4 26.7 17.4h35.1c12 0 23.1 2.2 33.1 6.7s17.9 10.5 23.9 18.1c5.9 7.6 8.9 16.1 8.9 25.5 0 18.3-7.7 32.3-23 41.9-15.3 9.6-36.8 14.5-64.5 14.5-28 0-47.7-4.4-59.3-13.2-11.6-8.8-17.4-23.1-17.4-42.8h20.6c0 8.4 1.6 15.2 4.7 20.2 3.1 5.1 8.7 8.9 16.8 11.4 8.1 2.5 19.3 3.8 33.8 3.8 43.4 0 65.1-11.4 65.1-34.3 0-9.6-4.5-17-13.4-22.1-8.9-5.1-20.2-7.6-34-7.6H2385c-14.5 0-25.5-3.4-33.1-10.1-7.6-6.7-11.4-15.2-11.4-25.3 0-5.8 1.7-11.5 5.2-17.2 3.5-5.7 8.6-10.7 15.4-15-10.6-5.5-18.4-12.5-23.5-21-5.1-8.4-7.6-18.7-7.6-30.7 0-12.3 3.1-23.4 9.2-33.3 6.1-9.9 14.8-17.7 25.8-23.3 11.1-5.7 23.7-8.5 38-8.5 22.7-.2 39.4-1.3 50.2-3.3 10.8-1.9 22.6-5.3 35.4-10.1l8.3 24.5zm-131.2 19.5c-8.2 8.7-12.3 20.1-12.3 34.3 0 14.5 4.2 26 12.5 34.7 8.3 8.7 20.9 13 37.8 13 14.5 0 25.5-4.2 33.3-12.7 7.7-8.4 11.6-20.1 11.6-35.1 0-15.4-3.9-27.2-11.6-35.2-7.7-8.1-19.2-12.1-34.3-12.1-16.6.1-28.9 4.4-37 13.1zM2703.4 541.8c-7.7-25.9-19.4-49.3-35-70.2-15.6-20.9-36.6-43-63-66.3l22.1-23.6c30.2 24.3 54.8 48.3 73.8 72 19 23.7 33.6 50 43.7 79.2 10.1 29.1 15.2 62.7 15.2 100.8s-5.1 71.6-15.2 100.8c-10.1 29.1-24.7 55.5-43.7 79.2-19 23.6-43.6 47.6-73.8 72l-22.1-23.6c26-23.3 46.9-45.5 62.5-66.6 15.6-21.1 27.3-44.6 35.2-70.4 7.9-25.9 11.8-56.3 11.8-91.3.1-35.6-3.8-66.1-11.5-92z" />
            <path
              fill="#fb0"
              d="M1977.8 480.4l11.4 23.2c.4.9 1.3 1.5 2.3 1.7l25.6 3.7c2.5.4 3.5 3.5 1.7 5.2l-18.5 18c-.7.7-1.1 1.7-.9 2.7l4.4 25.5c.4 2.5-2.2 4.4-4.4 3.2l-22.9-12c-.9-.5-2-.5-2.8 0l-22.9 12c-2.2 1.2-4.9-.7-4.4-3.2l4.4-25.5c.2-1-.2-2-.9-2.7l-18.5-18c-1.8-1.8-.8-4.9 1.7-5.2l25.6-3.7c1-.1 1.9-.8 2.3-1.7l11.4-23.2c1-2.3 4.3-2.3 5.4 0z"
            />
            <path
              d="M2000 565.1l-23.4-12.3c-1-.5-2.2-.5-3.2 0l-23.4 12.3c-2.5 1.3-5.4-.8-5-3.6l4.5-26.1c.2-1.1-.2-2.2-1-3l-18.9-18.5c-2-2-.9-5.4 1.9-5.8l26.2-3.8c1.1-.2 2.1-.9 2.6-1.9l11.7-23.7c1.3-2.5 4.9-2.5 6.1 0l11.7 23.7c.5 1 1.5 1.7 2.6 1.9l26.2 3.8c2.8.4 3.9 3.8 1.9 5.8l-18.9 18.5c-.8.8-1.2 1.9-1 3l4.5 26.1c.4 2.8-2.6 4.9-5.1 3.6zm-23.4-14.6l20.7 10.9c2.5 1.3 5.4-.8 5-3.6l-4-23.1c-.2-1.1.2-2.2 1-3l16.8-16.4c2-2 .9-5.4-1.9-5.8l-23.2-3.4c-1.1-.2-2.1-.9-2.6-1.9l-10.4-21c-1.3-2.5-4.9-2.5-6.1 0l-10.4 21c-.5 1-1.5 1.7-2.6 1.9l-23.2 3.4c-2.8.4-3.9 3.8-1.9 5.8l16.8 16.4c.8.8 1.2 1.9 1 3l-4 23.1c-.5 2.8 2.4 4.9 5 3.6l20.7-10.9c1.1-.5 2.3-.5 3.3 0z"
              fill="none"
            />
            <path
              fill="#fb0"
              d="M1572.4 833l-34.2 8c-7.2 1.7-13 6.7-15.4 13.4l-4.2 11.8c-1.4 3.9 1.7 7.9 6.1 7.9h78.4c5.5 0 10.1-3.9 10.7-9l3.3-31.8-44.7-.3zM2023.9 794c-5.9 6.3-13 12.9-21.6 19.5-19.4 14.9-46.1 30.3-81.5 44.2-112.5 44.2-249-50.2-249-50.2l18.1-20.1c114.5 66.3 164.7 64.3 214.9 54.2 10-2 50-21.5 60.2-26.1 11-5 22.6-13.9 34.6-21.5 33.6-21.3 58-48-.4-52.8-1.4-.1-2.7-.2-4-.3v-12.7c21.7 1.7 40.9 5.7 46.2 11 8.7 8.7 5.5 30-17.5 54.8z"
            />
            <path
              fill="#9c969e"
              d="M1613.5 559.5c-113.2-42.9-229.8 25.1-286.3 10.6-47.1-12.1-128.9-43.5-219.9 90.8-3.5 5.1-1.9 12.2 2.7 16.4 7.8 7.1 22 17.2 43.5 21.9 30.9 35 73.4 37.8 104.9 26.8 80.9 110.3 221 104.1 270.1 84.6 0 0 17.4 28.9 78.1 28.9 70.5 0 111.5-43.7 111.5-114.8.1-66.4-17.7-132.3-104.6-165.2z"
            />
            <path
              fill="#867e88"
              d="M1326.6 539.8c-14.9-23.3-61.6-19.3-81 27.2-3.9 9.4-1.2 20.1 7.4 26.7 7.9 6.2 19.2 7.9 29 4.2 22.3-8.5 61.8-31.2 44.6-58.1z"
            />
            <circle cx="1224.3" cy="636.6" r="17.4" fill="#4b3f4e" />
            <path
              fill="#fb0"
              d="M1252.5 596.8c7.2 5.6 17.6 7.2 26.5 3.8 9.7-3.7 23-10.3 32.6-18.9 5.4-4.8 8.1-11.7 6.5-18.2-.3-1.5-.8-2.8-1.6-4-12.4-19.4-53.4-17.5-68.4 25.3-1.7 4.7 2 10 4.4 12z"
            />
            <g>
              <path
                fill="#867e88"
                d="M1199.6 696.2c-16.9 4.2-32.8 5-47.4 2.6.5.1.9.3 1.3.4 9.2 10.5 19.5 18 30.2 23.2 7-.8 14.2-1.9 21.5-3.7 18.8-7.6 26.3-23.5 24.8-29.7-1.6-6.2-24.3 5.6-30.4 7.2zM1528.6 810.5c-14.9-15.8-16.9-35.4-16.9-55.2 0-9.5 1.8-19 4.4-27.5 5.5-18.1-22.8-29.8-32.8-13.7-2.6 4.2-4.9 9.3-6.9 15.7-5.9 19-70.1 105.9-166.1 7.9-11.6-11.8-28.5-16.7-44.7-13.2l-7.2 1.5c79 108.9 219.4 104.8 270.2 84.5z"
              />
            </g>
            <path
              fill="#9c969e"
              d="M1358.1 746.7c0 31.5 15.6 65.1 25.6 83.3 3.8 6.9-.3 15.4-8 16.9l-2.7.5c-10.9 2.1-18.8 11.6-18.8 22.8 0 2.2 1.8 4 4 4h48.9c5.3 0 9.8-3.5 11.2-8.6 5.9-21.7 15-65.4 19.4-102.3l-79.6-16.6z"
            />
            <g>
              <path
                fill="#fb0"
                d="M1358.2 874.2h48.9c5.3 0 9.8-3.5 11.2-8.6 1.7-6.2 3.6-14.3 5.7-23.4l-39-6.2c-.2 5.1-3.8 9.8-9.4 10.9l-2.7.5c-10.9 2.1-18.8 11.6-18.8 22.8.1 2.1 1.9 4 4.1 4zM1110 677.3c2.9 2.7 6.8 5.8 11.6 8.8 6.5-3.2 11.1-9.8 11.1-17.5 0-10-7.5-18.1-17.2-19.3-2.7 3.7-5.4 7.6-8.2 11.6-3.4 5.1-1.9 12.2 2.7 16.4z"
              />
            </g>
            <path
              fill="#fb0"
              d="M1972.7 727.4v12.2c-64.5-2.4-33.8 13.7-33.8 13.7s28.1 38.2-14.1 2c-23.5-20.2 10.5-27.9 47.9-27.9z"
            />
          </svg>
        </div>
        <h2>Share your reviews with {service} from: </h2>
        <div className="providers">
          <form method="POST" action={`/api/provider/connect/${service}`}>
            <div className="providers-wrapper">
              {this.renderProvider('allegro')}
              {this.renderProvider('ebay')}
              {this.renderProvider('amazon')}
              {this.renderProvider('mercari')}
              {this.renderProvider('uber')}
              {this.renderProvider('lyft')}
            </div>
            <input type="hidden" name="user_id" value={this.state.userID} />
            {this.state.userID !== -1 && (
              <input
                className="button"
                type="submit"
                value="Submit"
                disabled={
                  Object.keys(this.state).filter(k => this.state[k].checked)
                    .length === 0
                }
              />
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default HomeScreen;
