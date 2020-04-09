import React, {Component} from 'react';
import ScriptLabel from './components/ScriptLable';
import InstructionLabelEng from './components/InstructionLabelEng';
import InstructionLabelKor from './components/InstructionLabelKor';
import MICButton from './components/MICButton';

import {StyleSheet, View, Platform} from 'react-native';

interface Props {}
interface State {
  fontSize: number;
  alignment: 'center' | 'flex-start';
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
    alignment: 'flex-start',
    fontWeight: '300',
  };
  render() {
    const styles = StyleSheet.create({
      view: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 50,
        backgroundColor: '#fafafa',
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
          label='"I am eating"을 이용해 "샐러드를 먹고 있습니다."라고 말해볼까요?'
          fontSize={17}
          fontWeight={'bold'}
          accentFontColor={'#444'}
          alignment={this.state.alignment}
          fontColor={'#888'}
        />
        <MICButton />
      </View>
    );
  }
}
export default App;
