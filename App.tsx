import React, {Component} from 'react';
import ScriptLabel from './ScriptLable';
import InstructionLabelEng from './InstructionLabelEng';
import InstructionLabelKor from './InstructionLabelKor';
import MICButton from './MICButton';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Platform,
  TouchableHighlight,
} from 'react-native';

interface Props {}
interface State {
  fontSize: number;
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;
}

class App extends Component<Props, State> {
  state: State = {
    fontSize: 25,
    fontWeight: '300',
  };
  render() {
    const styles = StyleSheet.create({
      view: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 50,
      },
      scripts: {
        flex: 1,
        justifyContent: 'center',
      },
      button: {
        backgroundColor: '#bbc4f1',
        color: Platform.OS === 'ios' ? '#841584' : '#000',
      },
    });

    return (
      <View style={styles.view}>
        <View style={styles.scripts}>
          <InstructionLabelEng
            label="Let's start!"
            fontSize={this.state.fontSize}
            fontWeight={this.state.fontWeight}
          />
          <ScriptLabel
            label="Let's name some words of food."
            fontSize={this.state.fontSize}
            fontWeight={this.state.fontWeight}
          />
        </View>
        <InstructionLabelKor
          label='"Let&apos;s start!"를 외치며 시작해봐요!'
          fontSize={18}
          fontWeight={'600'}
        />
        <MICButton />
      </View>
    );
  }
}
export default App;
