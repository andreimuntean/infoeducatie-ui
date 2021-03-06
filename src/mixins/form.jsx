"use strict";

import _ from "lodash"
import $ from "jquery";
import React from "react";


export default {
  getInitialState() {
    return {
      hasErrored: false,
      waitingForServerResponse: false,
      errors: []
    };
  },

  onRequestError(data) {
    this.setState({
      hasErrored: true,
      waitingForServerResponse: false
    });

    let errors = [];

    if (("responseJSON" in data) && _.isArray(data.responseJSON)) {
      _.forIn(data.responseJSON, (value, key) => {
        value.map((error) => {
          errors.push(key + " " + error);
        });
      });

      this.setState({
        errors: errors
      });
    }
  },

  onFormSubmit(event) {
    event.preventDefault();
    if (this.state.waitingForServerResponse) {
      return false;
    }

    this.setState({
      waitingForServerResponse: true
    });

    let data = this.getFormData();

    $.ajax({
      method: "POST",
      url: window.config.API_URL + this.props.formEndpoint,
      headers: {
        Authorization: this.props.current.user.access_token
      },
      data: data,
      success: this.props.hasSubmited,
      error: this.onRequestError
    });
  },

  renderErrors() {
    if (this.state.hasErrored) {
      let errors = _.clone(this.state.errors);

      if (!errors.length) {
        errors.push("Formularul nu a putut fi trimis.");
      }

      return <ul className="errors list-group">
        {errors.map((error) => {
          return <li className="list-group-item list-group-item-danger"
                     key={error}>
            {error}
          </li>;
        })}
      </ul>;
    }
  }
};
