import React, { Component } from 'react';
import { StyleSheet, Text, SafeAreaView, Alert, StatusBar } from 'react-native';
import { Amplify, Auth } from 'aws-amplify';
import { ChatBot } from 'aws-amplify-react-native';

Amplify.configure({
  Auth: {
    identityPoolId: 'us-east-1:e8892a3c-c393-4df6-bc77-53775add5a13',
    region: 'us-east-1'
  },
  Interactions: {
    bots: {
      testOne: {
        name: 'testOne',
        alias: 'testonealias',
        region: 'us-east-1'
      }
    }
  }
});

Amplify.Logger.LOG_LEVEL = 'DEBUG';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight
  }
});

export default class SupportScreen extends Component {
  state = {
    botName: 'testOne',
    welcomeMessage: 'Welcome, what would you like to do today?'
  };

  constructor(props) {
    super(props);
    this.handleComplete = this.handleComplete.bind(this);
  }

  handleComplete(err, confirmation) {
    if (err) {
      Alert.alert('Error', 'Bot conversation failed', [{ text: 'OK' }]);
      return;
    }

    Alert.alert('Done', JSON.stringify(confirmation, null, 2), [
      { text: 'OK' }
    ]);

    this.setState({
      botName: 'testOne'
    });

    return 'Trip booked. Thank you! what would you like to do next?';
  }

  render() {
    const { botName, showChatBot, welcomeMessage } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <ChatBot
          botName={botName}
          welcomeMessage={welcomeMessage}
          onComplete={this.handleComplete}
          clearOnComplete={false}
          styles={StyleSheet.create({
            itemMe: {
              color: 'red'
            }
          })}
        />
      </SafeAreaView>
    );
  }
}
