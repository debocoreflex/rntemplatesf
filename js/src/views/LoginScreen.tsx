import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';


import type { StackNavigationProp } from '@react-navigation/stack';
import AuthViewModel from '../viewmodels/AuthViewModel';

type Props = {
  navigation: StackNavigationProp<any, any>;
};

const LoginScreen = observer(({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // useEffect(() => {
  //    Alert.alert('Login Page', '.');
  // }, []);
  const onLogin = async () => {
    const success = await AuthViewModel.login(username, password);
    if (success) {
    //   navigation.replace('Sync');
    Alert.alert('Login Successful', 'You are now logged in.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      {AuthViewModel.error && <Text style={{ color: 'red' }}>{AuthViewModel.error}</Text>}
      <Button title="Login" onPress={onLogin} />
    </View>
  );
});

export default LoginScreen;
