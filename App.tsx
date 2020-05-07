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
import AiScreen from './components/AiScreen';
import AiTutor from './components/AiTutor';

// const JSONString = require('./components/list.json');
// const jsonArray = JSONString.map((_: any, k: number) => {
//   return JSONString[k];
// });

interface Props {}
interface State {
  clicked: boolean;
  permission: boolean;
  page: number;
}

class App extends Component<Props, State> {
  state: State = {
    clicked: false,
    permission: true,
    page: 0,
  };

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
          // <AiScreen obj={jsonArray} onPressHandler={this.openAi.bind(this)} />
          <AiTutor
            onPressHandler={this.openAi.bind(this)}
            page={21}
            fileName={'review'}
          />
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
