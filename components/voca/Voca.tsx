import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import FadeToLeft from '../animations/FadeToLeft';
import FadeToTop from '../animations/FadeToTop';
import Tts from '../sounds/Tts';
import Stt from '../sounds/Stt';

type StateKeys = keyof State;
interface Props {
  data: any;
  micStatus(stat: string): void;
  micColor(color: string): void;
  goNextPage(stat: boolean): void;
  micVolume(vol1: boolean, vol2: boolean): void;
}
interface State {
  count: number;
}

class Voca extends Component<Props, State> {
  state: State = {
    count: 0,
  };

  tts: any;
  stt: any;

  componentDidMount() {
    this.tts.ttsSpeaking(this.props.data.v_en.replace('~', ''));
  }

  vocaSetState = (key: StateKeys, value: number, func?: any) => {
    this.setState(
      {
        [key]: value,
      } as Pick<State, keyof State>,
      func,
    );
  };

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

    const {micColor, micStatus, micVolume, goNextPage} = this.props;
    const {count} = this.state;
    return (
      <View style={styles.view}>
        <Tts
          ref={(ref) => (this.tts = ref)}
          type={'V'}
          count={count}
          sttRef={this.stt}
          micColor={micColor}
          micStatus={micStatus}
          goNextPage={goNextPage}
        />
        <Stt
          ref={(ref) => (this.stt = ref)}
          type={'V'}
          data={data}
          vocaSetState={this.vocaSetState}
          ttsRef={this.tts}
          micColor={micColor}
          micStatus={micStatus}
          micVolume={micVolume}
          goNext={goNextPage}
        />
        <FadeToLeft data={data.v_en} />
        <FadeToTop data={data.v_ko} type={'vocaAndQuiz'} />
      </View>
    );
  }
}

export default Voca;
