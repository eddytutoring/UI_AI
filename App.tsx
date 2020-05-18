import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AiTutor from './components/AiTutor';

interface Props {}
interface State {
  clicked: boolean;
  permission: boolean;
  page: number;
  goNext: boolean;
}

getJSON = () => {
  try {
    return require('./components/data/review.json').data.items;
  } catch (err) {
    console.warn(err);
  }
};

data = getJSON();

quizIndex = data.findIndex((obj) => obj.type === 'Q' || obj.type === 'VQ');

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.page = this.page();
    this.page.next();
  }

  state: State = {
    clicked: false,
    permission: true,
    page: 0,
    goNext: false,
  };

  componentDidUpdate() {
    this.mission();
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      this.state.goNext !== nextState.goNext ||
      this.state.clicked !== nextState.clicked ||
      this.state.permission !== nextState.permission
    );
  }

  *page() {
    yield* data;
  }

  mission() {
    if (this.state.goNext) {
      let next = this.page.next();
      if (!next.done) {
        console.log(next);
        this.setState({
          page: next.value.no - 1,
          goNext: false,
        });
      }
    }
  }

  goNextPage = (status: boolean) => {
    this.setState({
      goNext: status,
    });
  };

  async requestPermission() {
    this.setState({permission: false});
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (!granted) {
        const request = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '마이크 접근 권한 필요',
            message: 'ai 튜터를 실행하기 위해 마이크 접근 권한이 필요합니다.',
            buttonNegative: '접근 거부',
            buttonPositive: '접근 허용',
          },
        );
        if (request === 'granted') {
          this.setState({
            permission: true,
          });
        }
      } else {
        this.setState({
          permission: true,
        });
      }
    } catch (err) {
      console.warn(err);
    }
  }

  openAi() {
    this.setState({
      clicked: this.state.clicked === false ? true : false,
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.view}>
        {this.state.permission && this.state.clicked ? (
          this.state.goNext && this.state.page !== data.length - 1 ? null : (
            <AiTutor
              onPressHandler={this.openAi.bind(this)}
              reaction={parseInt(this.state.page) + 1 - quizIndex}
              data={data[this.state.page]}
              goNextPage={this.goNextPage}
            />
          )
        ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({clicked: true});
              if (Platform.OS === 'android') this.requestPermission();
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
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#be79df',
    padding: 15,
    borderRadius: 16,
  },
});

export default App;
