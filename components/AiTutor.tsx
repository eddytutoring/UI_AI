import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Description from './description/Description';
import Voca from './voca/Voca';
import Quiz from './quiz/Quiz';

interface Props {
  onPressHandler: any;
  page: number;
  fileName: string;
}

interface State {
  index: number;
}

class AiTutor extends Component<Props, State> {
  state: State = {
    index: 0,
  };

  getJSON = () => {
    try {
      return require('./data/review.json').data.items[this.props.page];
    } catch (err) {
      console.warn(err);
    }
  };

  data = this.getJSON();

  getContents(type: string) {
    if (type === 'D') {
      return <Description data={this.data} />;
    } else if (type === 'Q' || type === 'VQ') {
      //VQ+Q
      return <Quiz data={this.data} type={type === 'Q' ? 'q' : 'v'} />;
    } else if (type === 'V') {
      //V
      return <Voca data={this.data} />;
    } else {
      return null;
    }
  }

  render() {
    const type = this.data.type;
    return (
      <View style={styles.view}>
        {/* {console.log(this.data)} */}
        {this.getContents(type)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
});

export default AiTutor;
