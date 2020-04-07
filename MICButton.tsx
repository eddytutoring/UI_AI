import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';

interface Props {}
interface State {
  diameter: number;
}

class MICButton extends Component<Props, State> {
  state: State = {
    diameter: 80,
  };
  render() {
    const styles = StyleSheet.create({
      view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: this.state.diameter,
        width: this.state.diameter,
        borderRadius: 64,
        backgroundColor: '#342ead',
        shadowColor: '#1c0fff',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
    });
    return (
      <View style={styles.view}>
        <TouchableHighlight style={styles.button}>
          <Text style={{color: 'white'}}>hey</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default MICButton;
