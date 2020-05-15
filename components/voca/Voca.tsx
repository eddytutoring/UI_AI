import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import FadeToLeft from '../animations/FadeToLeft';
import FadeToTop from '../animations/FadeToTop';
import Tts from '../sounds/Tts';
import Stt from '../sounds/Stt';

interface Props {
  data: any;
  micStatus(stat: string): void;
  micColor(color: string): void;
  goNextPage(stat: boolean): void;
}
interface State {}

class Voca extends Component<Props, State> {
  tts: any;
  stt: any;

  componentDidMount() {
    this.tts.ttsSpeaking(this.props.data.v_en.replace('~', ''));
  }

  render() {
    const {data} = this.props;

    const styles = StyleSheet.create({
      view: {
        flex: 1,
        justifyContent: 'space-around',
        padding: 30,
        alignItems: 'flex-start',
      },
    });

    return (
      <View style={styles.view}>
        <Tts
          ref={(ref) => (this.tts = ref)}
          type={'V'}
          sttRef={this.stt}
          micColor={this.props.micColor}
          micStatus={this.props.micStatus}
          goNextPage={this.props.goNextPage}
        />
        <Stt
          ref={(ref) => (this.stt = ref)}
          type={'V'}
          data={data}
          ttsRef={this.tts}
          micColor={this.props.micColor}
          micStatus={this.props.micStatus}
          goNext={this.props.goNextPage}
        />
        <FadeToLeft data={data.v_en} />
        <FadeToTop data={data.v_ko} type={'vocaAndQuiz'} />
      </View>
    );
  }
}

export default Voca;
