/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import PropTypes from 'prop-types';
import React from 'react';

import HTTP from 'js/http';
var Button = require('react-button');

require('css/inspector.css');

function boolToString(boolValue) {
  return boolValue === '1' ? 'Yes' : 'No';
}

class Inspector extends React.Component {
  render() {
    return (
      <div id="inspector" className="section third">
        <div className="section-caption">
          Inspector
        </div>
        <div className="section-content-container">
          <div className="section-content">
            {this.renderInspector()}
          </div>
        </div>
      </div>
    );
  }

  renderInspector() {
    if (this.props.selectedNode == null) {
      return null;
    }

    const attributes = this.props.selectedNode.attributes;
    const tapButton =
      <Button onClick={(event) => this.tap(this.props.selectedNode)}>
        tap
      </Button>;

    var frame = `{{${attributes.rect.x},${attributes.rect.y}},{${attributes.rect.width}, ${attributes.rect.height}}}`;
    var hit_point = `{{${attributes.hit_point.x},${attributes.hit_point.y}}}`;
    return (
      <div>
        {this.renderField('class/type', attributes.type)}
        {this.renderField('ID', attributes.id)}
        {this.renderField('name', attributes.name)}
        {this.renderField('value', attributes.value)}
        {this.renderField('label', attributes.label)}
        {this.renderField('title', attributes.title)}
        {this.renderField('rect', frame)}
        {this.renderField('enabled', attributes.enabled)}
        {this.renderField('hitable', attributes.hitable)}
        {this.renderField('hit_point', hit_point)}
        {this.renderField('focused', typeof attributes.isFocused === 'undefined' ? null : boolToString(attributes.has_focus))}
        {this.renderField('has_keyboard_focus', boolToString(attributes.has_keyboard_focus))}
        {this.renderField('selected', attributes.selected)}
        {this.renderField('placeholder', attributes.placeholder)}
        {this.renderField('Tap', tapButton, false)}
      </div>
    );
  }

  renderField(fieldName, fieldValue, castToString = true) {
    if (fieldValue == null) {
      return null;
    }
    var value;
    if (castToString) {
      value = String(fieldValue);
    } else {
      value = fieldValue;
    }
    return (
      <div className="inspector-field">
        <div className="inspector-field-caption">
          {fieldName}:
        </div>
        <div className="inspector-field-value">
          {value}
        </div>
      </div>
    );
  }

  tap(node) {
    HTTP.get(
      'status', (status_result) => {
        var session_id = status_result.sessionId;
        HTTP.post(
          'session/' + session_id + '/elements',
          JSON.stringify({
            'using': 'link text',
            'value': 'label=' + node.attributes.label,
          }),
          (elements_result) => {
            var elements = elements_result.value;
            var element_id = elements[0].ELEMENT;

            HTTP.post(
              'session/' + session_id + '/element/' + element_id + '/click',
              JSON.stringify({}),
              (result) => {
                this.props.refreshApp();
              },
            );
          },
        );
      },
    );
  }
}

Inspector.propTypes = {
  selectedNode: PropTypes.object,
};

module.exports = Inspector;
