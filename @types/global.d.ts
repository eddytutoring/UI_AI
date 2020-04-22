declare module 'react-native-radial-gradient' {
  import * as React from 'react';
  import * as ReactNative from 'react-native';

  export interface RadialGradientProps extends ReactNative.ViewProps {
    colors?: (string | number)[];
    stops?: number[];
    center?: number[];
    radius?: number;
  }

  export class RadialGradient extends React.Component<RadialGradientProps> {}

  export default RadialGradient;
}

declare module 'react-native-tts' {
  function setDefaultLanguage(langProps: string): void;
  function speak(str: string, osSettings: Object): void;
  function addEventListener(
    code: 'tts-start' | 'tts-finish' | 'tts-cancel',
    event: Function,
  ): void;
  function stop(): void;
}

declare module 'react-native-voice' {
  function start(langType: string): void;
  function onSpeechStart(event: any): void;
  function onSpeechResults(event: any): void;
  function onSpeechEnd(event: Object): void;
  function destroy(): any;
  function removeAllListeners(): void;
  function onSpeechRecognized(): any;
  function stop(): void;
}

declare module '*.json' {
  const value: any;
  export default value;
}
