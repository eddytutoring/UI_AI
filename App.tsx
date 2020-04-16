import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import UI from './components/AiScreen';
import InstructionLabelKor from './components/InstructionLabelKor';

interface Props {}
interface State {
  clicked: boolean;
}

class App extends Component<Props, State> {
  state: State = {
    clicked: false,
  };

  render() {
    return (
      <SafeAreaView style={styles.view}>
        {this.state.clicked ? (
          <UI />
        ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({
                clicked: true,
              });
            }}>
            <View style={styles.button}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 16}}>
                click to open ai tutor
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#be79df',
    padding: 15,
    borderRadius: 16,
  },
});

export default App;
