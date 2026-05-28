import React, { Component } from "react";
import SmallArrow from "./small_arrow";

export default class Status extends Component {
  constructor() {
    super();
    this.state = {
      wifi_active: true
    };
  }

  componentDidMount() {
    this.updateWifiStatus();
    window.addEventListener('wifi-status-changed', this.updateWifiStatus);
    // Also sync when changed from Settings page
    this._onSettingsChanged = (e) => {
      if (e.detail.key === 'wifi-active') {
        this.setState({ wifi_active: e.detail.value });
      }
    };
    window.addEventListener('portfolio-settings-changed', this._onSettingsChanged);
  }

  componentWillUnmount() {
    window.removeEventListener('wifi-status-changed', this.updateWifiStatus);
    window.removeEventListener('portfolio-settings-changed', this._onSettingsChanged);
  }

  updateWifiStatus = () => {
    const savedWifi = localStorage.getItem('wifi-active');
    this.setState({
      wifi_active: savedWifi !== null ? savedWifi === 'true' : true
    });
  };

  render() {
    const { wifi_active } = this.state;
    return (
      <div className="flex justify-center items-center">
        {wifi_active && (
          <span className="mx-1.5">
            <img
              width="16px" height="16px"
              src="./themes/Yaru/status/network-wireless-signal-good-symbolic.svg"
              alt="wifi"
              className="inline status-symbol w-4 h-4"
            />
          </span>
        )}
        <span className="mx-1.5">
          <img
            width="16px" height="16px"
            src="./themes/Yaru/status/audio-volume-medium-symbolic.svg"
            alt="sound"
            className="inline status-symbol w-4 h-4"
          />
        </span>
        <span className="mx-1.5">
          <img
            width="16px" height="16px"
            src="./themes/Yaru/status/battery-good-symbolic.svg"
            alt="battery"
            className="inline status-symbol w-4 h-4"
          />
        </span>
        <span className="mx-1">
          <SmallArrow angle="down" className=" status-symbol" />
        </span>
      </div>
    );
  }
}
