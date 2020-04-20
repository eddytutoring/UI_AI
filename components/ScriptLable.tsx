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

class ScriptLable extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.opacity = new Animated.Value(0);
  }

  opacity: Animated.Value | any;

  componentDidMount() {
    Animated.timing(this.opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }

  replaceAll(str: string, search: string | any, replace: string | any) {
    return str.split(search).join(replace);
  }

  render() {
    let color = this.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', '#444'],
    });

    const styles = StyleSheet.create({
      view: {
        // flex: 1,
      },
      text: {
        fontSize: this.props.fontSize,
        fontWeight: this.props.fontWeight,
      },
    });

    return (
      <Animated.View style={[styles.view]}>
        <Animated.Text style={{...styles.text, color: color}}>
          {this.replaceAll(this.props.label, '/', '"')}
        </Animated.Text>
      </Animated.View>
    );
  }
}

export default ScriptLable;
