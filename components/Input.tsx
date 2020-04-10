import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TextInput,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

import InputButton from './InputButton';

interface Props {
  label: string;
  activeLabelFontSize: number;
  labelFontSize: number;
  padding: number;
  secure: boolean;
}
interface State {
  text: string;
  isFocused: boolean;
  placeholder: string;
  lineColor: string;
  borderBottomColor: string;
  fontColor: string;
  width: number;
  secure: boolean;
}

class App extends Component<Props, State> {
  state: State = {
    text: '',
    isFocused: false,
    placeholder: '',
    lineColor: '#aaa',
    borderBottomColor: 'transparent',
    fontColor: '#aaa',
    width: Dimensions.get('window').width,
    secure: this.props.secure,
  };

  constructor(props: Props) {
    super(props);
    this._animatedIsFocused = new Animated.Value(
      this.state.text === '' ? 0 : 1,
    );
  }

  _animatedIsFocused: Animated.Value;

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.state.text !== '' ? 1 : 0,
      duration: 350,
    }).start();
  }

  handleFocus = () =>
    this.setState({
      isFocused: true,
      placeholder: this.props.label,
      lineColor: 'transparent',
      borderBottomColor: '#34bcff',
      fontColor: '#34bcff',
    });

  handleBlur = () =>
    this.setState({
      isFocused: false,
      placeholder: '',
      lineColor: '#aaa',
      borderBottomColor: 'transparent',
      fontColor: '#aaa',
    });

  clearText = () => {
    this.setState({
      text: '',
    });
  };

  render() {
    const {
      label,
      activeLabelFontSize,
      labelFontSize,
      padding,
      ...props
    } = this.props;

    const styles = StyleSheet.create({
      container: {
        position: 'relative',
        paddingBottom: padding,
      },
      clearButton: {
        position: 'absolute',
        right: 0,
        width: this.props.labelFontSize,
        height: this.props.labelFontSize,
        top: Platform.OS === 'android' ? this.props.labelFontSize : 0,
      },
    });

    const containerStyle = {
      position: 'absolute',
      includeFontPadding: false,
      left: Platform.OS !== 'ios' && 4,
      transform: [
        {
          translateY: this._animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange:
              Platform.OS === 'ios'
                ? [
                    2,
                    -labelFontSize * (1 + activeLabelFontSize / labelFontSize),
                  ]
                : [
                    (labelFontSize - activeLabelFontSize) * 4 + 1,
                    -labelFontSize * (2 - activeLabelFontSize / labelFontSize),
                  ],
          }),
        },
      ],
    };

    const textStyle = {
      lineHeight: labelFontSize + 2,
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [labelFontSize, activeLabelFontSize],
      }),
      color: this.state.fontColor,
    };

    const TextInputStyle = {
      borderBottomColor: this.state.lineColor,
      borderBottomWidth: 1,
      paddingBottom: (labelFontSize - activeLabelFontSize) * 2,
      lineHeight: labelFontSize + 4,
      fontSize: labelFontSize,
    };

    const lineStyle = {
      borderBottomColor: this.state.borderBottomColor,
      borderBottomWidth: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2],
      }),
      width: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.state.width - padding * 2],
      }),
    };

    return (
      <>
        <View style={styles.container}>
          <Animated.View style={containerStyle}>
            <Animated.Text style={textStyle}>{label}</Animated.Text>
          </Animated.View>
          <Animated.View>
            <TextInput
              {...props}
              multiline={false}
              style={TextInputStyle}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              blurOnSubmit
              placeholder={this.state.placeholder}
              // clearButtonMode="always"
              value={this.state.text}
              onChangeText={(text) => this.setState({text})}
              secureTextEntry={this.state.secure}
            />
            {this.state.isFocused === true && (
              <TouchableWithoutFeedback onPress={this.clearText}>
                <Image
                  source={require('../resource/clearButton.png')}
                  style={styles.clearButton}
                />
              </TouchableWithoutFeedback>
            )}
          </Animated.View>
          <Animated.View style={lineStyle} />
        </View>
      </>
    );
  }
}

export default App;
