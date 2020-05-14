/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import HTTP from 'js/http';
import Screen from 'js/screen';
import ScreenshotFactory from 'js/screenshot_factory';
import Tree from 'js/tree';
import TreeNode from 'js/tree_node';
import TreeContext from 'js/tree_context';
import Inspector from 'js/inspector';

require('css/app.css');

const SCREENSHOT_ENDPOINT = '1.0/screenshot';
const TREE_ENDPOINT = '1.0/tree';
const ORIENTATION_ENDPOINT = '1.0/orientations';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    const urlParams = new URLSearchParams(window.location.search);
    this.screenshot = urlParams.get('screenshot');
    this.tree = urlParams.get('tree');

    if (this.screenshot && this.tree) {
      const path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))
      window._da_address = window.location.origin + path;
    }
  }

  refreshApp() {
    this.fetchScreenshot();
    this.fetchTree();
  }

  componentDidMount() {
    this.refreshApp();
  }

  fetchOrientation(callback) {
    HTTP.get(ORIENTATION_ENDPOINT, (orientation) => {
      callback(orientation.value);
    })
  }

  fetchStaticOrientation(callback) {
    callback(
      {
        "UIApplication_activeInterfaceOrientation":[1,"portrait"],
        "UIDevice":[0,"unknown"],
        "XCUIDevice":[0,"unknown"],
        "SpringBoard_XCUIApplication":[1,"portrait"],
        "AUT":[1,"portrait"],
      }
    )
  }

  fetchDaScreenshot(callback) {
    HTTP.get(SCREENSHOT_ENDPOINT, (base64EncodedImage) => {
      callback(base64EncodedImage.value);
    });
  }

  toDataUrl(src, callback, outputFormat) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);

      callback(dataURL.slice('data:image/png;base64,'.length));
    };
    img.src = src;
  }

  fetchStaticScreenshot(url, callback) {
    this.toDataUrl(
      url,
      callback,
    )
  }

  defineScreenshot(callback) {
    if (this.screenshot == null) {
      return this.fetchDaScreenshot(callback)
    } else {
      return this.fetchStaticScreenshot(this.screenshot, callback)
    }
  }

  defineOrientation(callback) {
    if (this.screenshot == null) {
      return this.fetchOrientation(callback)
    } else {
      return this.fetchStaticOrientation(callback)
    }
  }

  fetchScreenshot() {
    this.defineOrientation((orientation) => {
      this.defineScreenshot((base64EncodedImage) => {
        ScreenshotFactory.createScreenshot(orientation, base64EncodedImage, (screenshot) => {
          this.setState({
            screenshot: screenshot,
          });
        });
      });
    });
  }

  defineTree(callback) {
    if (this.tree == null) {
      return this.fetchDaTree(callback)
    } else {
      return this.fetchStaticTree(this.tree, callback)
    }
  }

  fetchStaticTree(url, callback) {
    HTTP.get(url, (treeInfo) => {
      callback(treeInfo);
    });
  }

  fetchDaTree(callback) {
    HTTP.get(TREE_ENDPOINT, (treeInfo) => {
      callback(treeInfo);
    });
  }

  fetchTree() {
    this.defineTree((treeInfo) => {
      this.setState({
        rootNode: TreeNode.buildNode(treeInfo, new TreeContext()),
      });
    }
  );
}

  render() {
    return (
      <div id="app">
        <Screen
          highlightedNode={this.state.highlightedNode}
          screenshot={this.state.screenshot}
          rootNode={this.state.rootNode}
          refreshApp={() => { this.refreshApp(); }} />
        <Tree
          onHighlightedNodeChange={(node) => {
            this.setState({
              highlightedNode: node,
            });
          }}
          onSelectedNodeChange={(node) => {
            this.setState({
              selectedNode: node,
            });
          }}
          rootNode={this.state.rootNode}
          selectedNode={this.state.selectedNode} />
        <Inspector
          selectedNode={this.state.selectedNode}
          refreshApp={() => { this.refreshApp(); }} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.body);
