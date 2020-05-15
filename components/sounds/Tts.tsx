import React from 'react';
import {Platform} from 'react-native';
import tts from 'react-native-tts';

interface Props {
  type: 'D' | 'V' | 'Q' | 'VQ' | 'Compare';
  compareCount?: number;
  sttRef?: any;
  quizState?: {
    next: boolean;
    reaction: boolean;
    reaction2: boolean;
    passed: boolean;
  };
  quizSetState?(key: string, value: boolean): void;
  micStatus?(stat: string): void;
  micColor?(stat: string): void;
  goNextPage?(stat: boolean): void;
}
interface State {}

class Tts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    tts.removeEventListener('tts-finish', this.finishListener);
    tts.stop();
    this.finishListener = this.ttsCallback.bind(this);
    tts.setDefaultRate(0.5);
    tts.setDefaultLanguage('en-US');
    tts.addEventListener('tts-finish', this.finishListener);
    tts.addEventListener('tts-cancel', this.cancelListener);
    if (Platform.OS === 'ios') tts.setIgnoreSilentSwitch(false);
  }

  finishListener: any;
  cancelListener: any;

  componentDidMount() {
    const {micColor, micStatus, type} = this.props;
    if (micColor && micStatus && type !== 'Q') {
      micColor('colored');
      micStatus('testing');
    }

    if (micStatus && type === 'Q') micStatus('hide');
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return this.props.sttRef !== nextProps.sttRef;
  }

  componentWillUnmount() {
    tts.removeEventListener('tts-finish', this.finishListener);
    tts.stop();
  }

  ttsSpeaking(str: string) {
    tts.speak(
      str,
      Platform.OS === 'ios'
        ? {
            iosVoiceId: 'com.apple.ttsbundle.siri_female_en-US_compact',
            rate: 0.5,
          }
        : {
            androidParams: {
              KEY_PARAM_PAN: -1,
              KEY_PARAM_VOLUME: 1,
              KEY_PARAM_STREAM: 'STREAM_MUSIC',
            },
          },
    );
  }

  ttsCallback() {
    const {goNextPage, micColor, micStatus, compareCount, sttRef} = this.props;
    tts.stop();
    const {type, quizState, quizSetState} = this.props;
    if (type === 'D') {
      setTimeout(() => {
        if (goNextPage) goNextPage(true);
      }, 2000);
    } else if (type === 'V') {
      setTimeout(() => {
        sttRef.start();
        if (micColor && micStatus) {
          setTimeout(() => {
            micColor('white');
            micStatus('testing');
          }, 1000);
        }
      }, 1000);
    } else if (type === 'Q' || type === 'VQ') {
      tts.stop();
      if (quizState?.reaction && !quizState?.next && type !== 'VQ') {
        if (quizSetState) quizSetState('next', true);
      }
      if (!quizState?.reaction) {
        setTimeout(() => {
          if (quizSetState) {
            quizSetState('reaction', true);
          }
        }, 2000);
      }

      if (quizState?.passed) {
        if (!quizState?.reaction2) {
          setTimeout(() => {
            if (quizSetState) {
              quizSetState('reaction2', true);
            }
          }, 1000);
        } else {
          setTimeout(() => {
            if (goNextPage) goNextPage(true);
          }, 2000);
        }
      }
    } else {
      if (
        micColor &&
        micStatus &&
        typeof compareCount === 'number' &&
        compareCount < 3
      ) {
        setTimeout(() => {
          micStatus('white');
          micColor('testing');
          if (sttRef !== undefined) sttRef.start();
        }, 1000);
      }
    }
  }

  stop() {
    tts.stop();
  }

  removeEventListener() {
    tts.removeEventListener('tts-finish', this.finishListener);
  }

  render() {
    return null;
  }
}

export default Tts;
