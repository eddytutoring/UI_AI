import React, {Component} from 'react';
import {Animated, Text, StyleSheet, View} from 'react-native';

interface Props {
  label: string;
  fontSize: number;
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;
}
interface State {}

class instructionLabelKor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.opacity = new Animated.Value(0);
    this.textArr = this.props.label.trim().split('"');
  }

  opacity: Animated.Value | any;
  textArr: Array<string>;

  componentDidMount() {
    Animated.timing(this.opacity, {
      toValue: 1,
      duration: 800,
    }).start();
  }

  render() {
    const styles = StyleSheet.create({
      view: {
        flex: 1,
        transform: [
          {
            translateY: this.opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
      },
      text: {
        fontSize: this.props.fontSize,
        fontWeight: this.props.fontWeight,
      },
      textWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
      },
    });

    return (
      <Animated.View style={[styles.view, styles.textWrapper]}>
        {this.textArr.map((word, i) => {
          return (
            <Animated.Text
              style={{...styles.text, color: i % 2 === 1 ? '#444' : '#888'}}>
              {i % 2 === 1 && word !== '' ? '"' + word + '"' : word}
              {`${i < this.textArr.length ? ' ' : ''}`}
            </Animated.Text>
          );
        })}
      </Animated.View>
    );
  }
}

export default instructionLabelKor;
