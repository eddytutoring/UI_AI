import React from 'react';
import {TouchableHighlightBase} from 'react-native';
import Voice from '@react-native-community/voice';
import similarity, {compareTwoStrings} from 'string-similarity';
import Tokenizer from 'wink-tokenizer';

const tokenizer = new Tokenizer();
interface Props {
  type: 'V' | 'VQ' | 'Q' | 'Compare';
  data: any;
  count?: number;
  colors?: Array<string>;
  ttsRef: any;
  answer?: any;
  vocaSetState?(key: string, value: number): void;
  quizSetState?(key: string, value: any): void;
  compareSetState?(key: string, value: any): void;
  micColor(stat: string): void;
  micStatus(stat: string): void;
  micVolume(vol1: boolean, vol2: boolean): void;
  goNext?(stat: boolean): void;
  finishCompare?(): void;
}
interface State {
  count: number;
  answer: string;
  answerSet: Array<string>;
  answerArray: Array<string>;
}
let colors: Array<string> = [];
class Stt extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    Voice.destroy().then(Voice.removeAllListeners);
    Voice.onSpeechResults = this._debounce(
      this.onSpeechResultsHandler.bind(this),
      500,
    );
    Voice.onSpeechError = this.onSpeechErrorHandler.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChangedHandler.bind(this);
    if (this.props.type === 'Compare')
      Voice.onSpeechPartialResults = this.onSpeechPartialResultsHandler.bind(
        this,
      );
  }

  state: State = {
    count:
      this.props.type === 'Compare'
        ? this.props.count
          ? this.props.count
          : 0
        : 0,
    answer: this.props.type === 'VQ' ? this.props.answer : '',
    answerSet: this.props.type === 'Q' ? this.props.answer : [],
    answerArray:
      this.props.type === 'Compare'
        ? this.props.data.replace('.', '').split(' ')
        : [],
  };

  componentDidMount() {
    if (this.props.colors) colors = this.props.colors;
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  processNLU(answerSentence: string, candidateList: string[]) {
    const answerWord = tokenizer
      .tokenize(answerSentence.toLowerCase().replace('~', ''))
      .filter((token: any) => token.tag === 'word' || token.tag === 'number')
      .map((token: any) => token.value)
      .join('');

    return similarity.findBestMatch(answerWord, [
      ...candidateList.map((sentence) =>
        sentence.toLowerCase().replace('~', ''),
      ),
    ]);
  }

  onSpeechVolumeChangedHandler(e: Object | any) {
    const {micVolume} = this.props;
    if (e.value < 5) {
      micVolume(false, false);
    } else if (e.value >= 5 && e.value < 10) {
      micVolume(true, false);
    } else {
      micVolume(false, true);
    }
  }

  onSpeechResultsHandler(e: Object | any) {
    const {
      type,
      data,
      ttsRef,
      vocaSetState,
      quizSetState,
      compareSetState,
      micColor,
      micStatus,
      micVolume,
      goNext,
      finishCompare,
    } = this.props;

    const {count} = this.state;

    if (type === 'V') {
      // console.log(e.value);
      const accuracy = this.processNLU(data.v_en, e.value);
      const {
        bestMatch: {target, rating},
      } = accuracy;

      if (rating >= 0.7) {
        Voice.destroy().then(Voice.removeAllListeners);
        micColor('colored');
        micStatus('correct');
        micVolume(false, false);
        setTimeout(() => {
          if (goNext) goNext(true);
        }, 2000);
      } else {
        if (this.state.count < 1) {
          ttsRef.ttsSpeaking('speak it up again');
        } else {
          Voice.destroy().then(Voice.removeAllListeners);
          ttsRef.ttsSpeaking(data.v_en);
        }
        this.setState({
          count: this.state.count + 1,
        });
        if (vocaSetState) vocaSetState('count', this.state.count);
        micColor('red');
        micStatus('wrong');
        micVolume(false, false);
      }
    } else if (type === 'VQ' || type === 'Q') {
      let rating = 0;
      if (type === 'Q') {
        let accuracy = this.state.answerSet.map((sentence) => {
          return this.processNLU(sentence, e.value).bestMatch.rating;
        });

        let indexOfMaxValue = accuracy.reduce(
          (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
          0,
        );
        if (quizSetState)
          quizSetState('answer', this.state.answerSet[indexOfMaxValue]);

        rating = accuracy[indexOfMaxValue];
      } else {
        rating = this.processNLU(this.props.data.v_en.replace('~', ''), e.value)
          .bestMatch.rating;
      }

      if (rating >= 0.7) {
        //통과한 경우
        Voice.destroy().then(Voice.removeAllListeners);
        // console.log('passed');
        if (quizSetState) {
          quizSetState('passed', true);
          quizSetState('compare', false);
        }
      } else {
        //말했는데 실패한 경우
        // console.log('fail');
        micColor('red');
        micStatus('wrong');
        micVolume(false, false);
        setTimeout(() => {
          Voice.destroy()
            .then(Voice.removeAllListeners)
            .then(() => {
              if (quizSetState) quizSetState('compare', true);
            });
        }, 1000);
      }
    } else {
      const {
        bestMatch: {target, rating},
      } = this.processNLU(data, e.value);

      if (compareSetState) compareSetState('speech', target.toLowerCase());

      // console.log('TARGET RESULT: ', target);

      colors = colors.map((color: string, index: number) => {
        if (
          color === '#6807f9' ||
          target
            .toLowerCase()
            .split(' ')
            .indexOf(this.state.answerArray[index].toLowerCase()) > -1
        )
          return '#444';
        else {
          return color;
        }
      });

      if (compareSetState) compareSetState('words', colors);

      if (rating >= 0.7) {
        //통과한 경우
        Voice.destroy().then(Voice.removeAllListeners);
        if (finishCompare) finishCompare();
      } else {
        //말했는데 실패한 경우
        micColor('red');
        micStatus('wrong');
        micVolume(false, false);
        Voice.destroy().then(Voice.removeAllListeners);
        setTimeout(() => {
          if (compareSetState && typeof count === 'number') {
            this.setState(
              {
                count: this.state.count + 1,
              },
              () => {
                if (compareSetState) compareSetState('count', this.state.count);
                if (this.state.count < 3) ttsRef.ttsSpeaking(data);
                else {
                  ttsRef.removeEventListener();
                  ttsRef.stop();
                  if (finishCompare) finishCompare();
                }
              },
            );
          }
        }, 1000);
      }
    }
  }

  onSpeechErrorHandler(e: any) {
    console.warn(e.error);
    if (
      e.error.message === '6/No speech input' ||
      e.error.message === '7/No match'
    ) {
      setTimeout(() => {
        Voice.start('en-US');
      }, 1000);
    }
  }

  _debounce = (fn: any, delay: number) => {
    let timer: any = null;
    return function (this: Stt, ...args: any) {
      const context = this;
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    };
  };

  onSpeechPartialResultsHandler(e: Object | any) {
    const {compareSetState} = this.props;
    if (this.props.type === 'Compare') {
      colors = colors.map((color: string, index: number) => {
        if (
          e.value[0]
            .toLowerCase()
            .split(' ')
            .indexOf(this.state.answerArray[index].toLowerCase()) > -1
        ) {
          return '#6807f9';
        } else {
          return color;
        }
      });
      if (compareSetState) compareSetState('words', colors);
    }
  }

  start() {
    this.props.micColor('white');
    this.props.micStatus('testing');
    this.props.micVolume(false, false);
    Voice.start('en-US');
  }

  destroy() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  stop() {
    Voice.stop();
  }

  render() {
    return null;
  }
}

export default Stt;
