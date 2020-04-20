import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import AiScreen from './components/AiScreen';
import Voice from 'react-native-voice';
import similarity from 'string-similarity';
import Tokenizer from 'wink-tokenizer';

const JSONString = require('./components/list.json');
const jsonArray = JSONString.map((_: any, k: number) => {
  return JSONString[k];
});

const tokenizer = new Tokenizer();

interface Props {}
interface State {
  clicked: boolean;
  current: number;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  state: State = {
    clicked: false,
    current: 0,
  };

  userSpeaking() {
    setTimeout(() => {
      // this.setState({
      //   isReady: true,
      // });
      Voice.start('en-US');
      Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
      Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    }, 800);
  }

  processNLU(answerSentence: string, candidateList: string[]) {
    const answerWord = tokenizer
      .tokenize(answerSentence.toLowerCase().replace('!', ''))
      .filter((token: any) => token.tag === 'word' || token.tag === 'number')
      .map((token: any) => token.value)
      .join('');

    return similarity.findBestMatch(answerWord, [
      ...candidateList.map((sentence) =>
        sentence.toLowerCase().replace('!', ''),
      ),
    ]);
  }

  onSpeechResultsHandler(result: Object | any) {
    console.log(result.value);
    const accuracy = this.processNLU(this.state.tts, result.value);
    const {
      bestMatch: {target, rating},
    } = accuracy;

    console.log(rating);

    if (rating >= 0.6) {
      Voice.destroy().then(Voice.removeAllListeners);
      this.setState({
        // isReady: false,
        // isTtsFinished: true,
      });
    }
  }

  openAi() {
    this.setState({
      clicked: this.state.clicked === false ? true : false,
    });
  }

  onSpeechEndHandler = (event: Object) => {
    Voice.destroy().then(Voice.removeAllListeners);
    Voice.start('en-US');
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
  };

  render() {
    return (
      <SafeAreaView style={styles.view}>
        {this.state.clicked ? (
          <AiScreen obj={jsonArray} onPressHandler={this.openAi.bind(this)} />
        ) : (
          <TouchableWithoutFeedback
            onPress={() => this.setState({clicked: true})}>
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
