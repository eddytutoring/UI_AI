import React, {Component, Fragment} from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';

interface Props {
  data: any;
  type: 'des' | 'desImg' | 'vocaAndQuiz';
}
interface State {
  color: string;
  accentColor: string;
  fontSize: number;
  justifyContent:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | undefined;
}

let animation: Animated.Value | any;
let words: Array<string>;

class FadeToTop extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.animationTiming(this.props.data);
  }

  state: State = {
    color:
      this.props.type === 'desImg'
        ? 'white'
        : this.props.type === 'des'
        ? '#888'
        : '#444',
    accentColor: this.props.type === 'desImg' ? 'white' : '#888',
    fontSize: this.props.type === 'desImg' ? 16 : 20,
    justifyContent: this.props.type === 'desImg' ? 'center' : 'flex-start',
  };

  shouldComponentUpdate(nextProps: any, nextState: any) {
    this.animationTiming(nextProps.data);
    return this.props.data !== nextProps.data;
  }

  animationTiming(sentence: string, toValue = 1) {
    animation = new Animated.Value(0);
    words = sentence.split('"');
    Animated.timing(animation, {
      toValue,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }

  render() {
    const opacityStyle = {
      opacity: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    };

    const styles = StyleSheet.create({
      view: {
        transform: [
          {
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
      },
      text: {
        fontSize: this.state.fontSize,
        lineHeight: this.state.fontSize,
        fontWeight: '300',
        paddingVertical: 2,
      },
      textWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: this.state.justifyContent,
      },
    });

    return (
      <Animated.View style={[styles.view, styles.textWrapper, opacityStyle]}>
        {words.map((word, i) => {
          return (
            <Fragment key={`view-${i}`}>
              <Animated.Text
                key={`word-${i}`}
                style={{
                  ...styles.text,
                  color: this.state.color,
                }}>
                {i % 2 === 1 && word !== '' ? '"' : ''}
              </Animated.Text>
              {word.split('').map((letter, a) => {
                return (
                  <Animated.Text
                    key={`letter=${a}`}
                    style={{
                      ...styles.text,
                      color: i % 2 ? this.state.color : this.state.accentColor,
                    }}>
                    {letter}
                  </Animated.Text>
                );
              })}
              <Animated.Text
                key={`blank-${i}`}
                style={{
                  ...styles.text,
                  color: this.state.color,
                }}>
                {i % 2 === 1 && word !== '' ? '"' : ''}
              </Animated.Text>
            </Fragment>
          );
        })}
      </Animated.View>
    );
  }
}

export default FadeToTop;
