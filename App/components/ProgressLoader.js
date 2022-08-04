import React, { Component } from 'react';

import {
  View,
  ActivityIndicator,
  Modal,
  StyleSheet
} from 'react-native';
import { CommanStyles, Colors} from "../resources"

export default class ModalProgressLoader extends Component {
  render() {
    return (
      <Modal
        transparent={true}
        animationType={'fade'}
        visible={this.props.loading}
        onRequestClose={() => {/*this.props.dismissLoader()*/}}>
          <View style={CommanStyles.modalBackground}>
            <View style={CommanStyles.activityIndicator}>
              <ActivityIndicator
                  animating={this.props.loading}
                  color={Colors.primary_color}
                  size="large" />
            </View>
          </View>
      </Modal>
      )
  }
}
