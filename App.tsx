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
import value from '*.json';

interface Props {}
interface State {
  clicked: boolean;
  permission: boolean;
  page: number;
  goNext: boolean;
}

getJSON = () => {
  try {
    return require('./components/data/preview.json').data.items;
  } catch (err) {
    console.warn(err);
  }
};

data = getJSON();

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    console.log(data);
    this.page = this.page();
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

  shouldComponentUpdate(nextProps, nextState) {
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
    // const it = fn();
    // (function iterate({value, done}) {
    //   console.log({value, done});
    //   if (done) {
    //     return value;
    //   }

    //   // if () { 실행이 끝나면
    //   // this.setState({
    //   //   page: value.no - 1,
    //   // });
    //   console.log(value.no - 1), iterate(it.next(value));
    //   // }
    // })(it.next());
    // let next;
    if (this.state.goNext) {
      let next = this.page.next();
      this.setState({
        page: next.value.no,
        goNext: false,
      });
      console.log('next: ' + next.value.no);
    }
  }

  reaction = () => {
    //TODO:MAKE LATER
  };

  goNextPage(status: boolean) {
    this.setState({
      goNext: status,
    });
  }

  async requestPermission() {
    console.log('request start');
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
          console.log('after request: ' + request);
        }
        console.log('need request');
        console.log('current status: ' + granted);
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
          this.state.goNext ? null : (
            <AiTutor
              onPressHandler={this.openAi.bind(this)}
              fileName={'review'}
              reaction={'one'} //TODO:CHANGE LATER
              data={data[this.state.page]} //TODO:
              goNextPage={this.goNextPage.bind(this)}
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
