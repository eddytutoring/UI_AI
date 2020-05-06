import React, {Component, Fragment} from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';

interface Props {
  data: any;
  color: string;
  accentColor: string;
  fontSize: number;
  textAlign:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | undefined;
}
interface State {}

let animation: Animated.Value | any;
let words: Array<string>;

class FadeToTop extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.animationTiming(this.props.data);
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    this.animationTiming(nextProps.data);
    return this.props.data !== nextProps.data;
  }

  animationTiming(sentence: string, toValue = 1) {
    animation = new Animated.Value(0);
    words = sentence.split('"');
    Animated.timing(animation, {
      toValue,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }

  render() {
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
        fontSize: this.props.fontSize,
        lineHeight: this.props.fontSize,
        fontWeight: '300',
        paddingVertical: 4,
      },
      textWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: this.props.textAlign,
      },
    });

    return (
      <Animated.View style={[styles.view, styles.textWrapper]}>
        {words.map((word, i) => {
          return (
            <Fragment key={`view-${i}`}>
              <Animated.Text
                key={`word-${i}`}
                style={{
                  ...styles.text,
                  color: this.props.color,
                }}>
                {i % 2 === 1 && word !== '' ? '"' : ''}
              </Animated.Text>
              {word.split('').map((letter, a) => {
                return (
                  <Animated.Text
                    key={`letter=${a}`}
                    style={{
                      ...styles.text,
                      color: i % 2 ? this.props.color : this.props.accentColor,
                    }}>
                    {letter}
                  </Animated.Text>
                );
              })}
              <Animated.Text
                key={`blank-${i}`}
                style={{
                  ...styles.text,
                  color: this.props.color,
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
