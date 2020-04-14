import React, {Component} from 'react';
import {Text, View, SafeAreaView, StyleSheet} from 'react-native';
import InstructionLabelEng from './InstructionLabelEng';
import InstructionLabelKor from './InstructionLabelKor';
import ScriptLabel from './ScriptLable';
import MICButton from './MICButton';

const JSONString = require('./list.json');
const array = JSONString.map((_: any, k: number) => {
  return JSONString[k];
});

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

class AIScreen extends Component<Props, State> {
  state: State = {
    fontSize: 25,
    fontWeight: '300',
  };
  render() {
    {
      console.log(array);
    }
    return (
      <SafeAreaView style={styles.view}>
        {array.map((obj: any, i: number) => {
          return (
            <View key={`${i}`} style={{flex: 1, justifyContent: 'center'}}>
              <InstructionLabelEng
                label={`${obj.InstructionLabelEng}`}
                fontSize={this.state.fontSize}
                fontWeight={this.state.fontWeight}
              />
              <InstructionLabelKor
                label="hey"
                fontSize={17}
                fontWeight={'bold'}
                accentFontColor={'#aaa'}
                alignment="center"
                fontColor={'#aaa'}
              />
              {/* <Text>hey</Text> */}
            </View>
          );
        })}
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
});

export default AIScreen;
