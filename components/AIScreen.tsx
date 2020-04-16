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
let count = 0;

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
  count: number;
}

class AiScreen extends Component<Props, State> {
  state: State = {
    fontSize: 25,
    fontWeight: '300',
    count: 0,
  };
  render() {
    {
      console.log(array);
    }
    let count = this.state.count;
    return (
      <SafeAreaView style={styles.view}>
        {array.map((obj: any, i: number) => {
          {
            setTimeout(() => {
              this.setState({count: count + 1});
            }, 5000); //TODO:tts 또는 stt 완료 이벤트일때마다 넘기도록 하기
          }
          return (
            <View key={`${i}`} style={{flex: 1, justifyContent: 'center'}}>
              {i === count && obj.ScriptLabel && (
                <ScriptLabel
                  label={obj.ScriptLabel}
                  fontSize={this.state.fontSize}
                  fontWeight={this.state.fontWeight}
                />
              )}
              {i === count && obj.InstructionLabelEng && (
                <InstructionLabelEng
                  label={`${obj.InstructionLabelEng}`}
                  fontSize={this.state.fontSize}
                  fontWeight={this.state.fontWeight}
                />
              )}

              {i === count && obj.InstructionLabelKor && (
                <InstructionLabelKor
                  label={`${obj.InstructionLabelKor}`}
                  fontSize={17}
                  fontWeight={'bold'}
                  accentFontColor={'#444'}
                  alignment="flex-start"
                  fontColor={'#888'}
                />
              )}
            </View>
          );
          {
          }
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

export default AiScreen;
