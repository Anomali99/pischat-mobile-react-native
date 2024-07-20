import React, {useState} from 'react';
import {View, Image, Text, TextInput, StyleSheet, Alert} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {logo} from '../assets';
import {register} from '../api';
import {addUser} from '../database';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Register: undefined;
};

type AuthResponse = {
  status: number;
  message: string;
  data: {
    user_uuid: string;
    username: string;
    name: string;
  };
};

type RegisterPageNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

type Props = {
  navigation: RegisterPageNavigationProp;
};

const RegisterPage: React.FC<Props> = ({navigation}) => {
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeat, setRepeat] = useState<string>('');

  const checkInput = (): boolean => {
    if (password != repeat) {
      AsyncAlert('Warning!', 'passwords are not the same');
      return false;
    }
    if (name.trim() == '') {
      AsyncAlert('Warning!', 'Name is Null');
      return false;
    }
    if (username.trim() == '') {
      AsyncAlert('Warning!', 'Username is Null');
      return false;
    }
    if (password.trim() == '') {
      AsyncAlert('Warning!', 'password is Null');
      return false;
    }
    return true;
  };

  const AsyncAlert = async (title: string, message: string) =>
    new Promise(resolve => {
      Alert.alert(
        title,
        message,
        [
          {
            text: 'ok',
            onPress: () => {
              resolve('YES');
            },
          },
        ],
        {cancelable: false},
      );
    });

  const loginHandler = async () => {
    if (checkInput()) {
      const data = await register({username, password, name});
      await AsyncAlert('Message', data.message);
      if (data.message === 'register success') {
        const result = data as AuthResponse;
        await addUser(result.data);
        navigation.navigate('Main');
      }
    }
    setUsername('');
    setPassword('');
    setRepeat('');
    setName('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.registerContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.registerText}>Register</Text>
        <TextInput
          style={styles.input}
          keyboardType="default"
          placeholder="Name"
          placeholderTextColor="#647993"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          keyboardType="default"
          placeholder="Username"
          placeholderTextColor="#647993"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          keyboardType="default"
          placeholder="Password"
          placeholderTextColor="#647993"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          keyboardType="default"
          placeholder="Repeat Password"
          placeholderTextColor="#647993"
          secureTextEntry={true}
          value={repeat}
          onChangeText={setRepeat}
        />
        <Text style={styles.signUpButton} onPress={loginHandler}>
          SIGN UP
        </Text>
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <Text
          style={styles.loginText}
          onPress={() => navigation.navigate('Login')}>
          SIGN IN
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#22272f',
  },
  registerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '75%',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  registerText: {
    fontWeight: 'bold',
    fontSize: 40,
    marginBottom: 20,
    color: '#d4dbe3',
  },
  input: {
    backgroundColor: '#afbbca',
    color: '#353e4b',
    width: '80%',
    borderRadius: 100,
    padding: 10,
    marginBottom: 10,
  },
  signUpButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#afbbca',
    color: '#000000',
    borderRadius: 5,
    width: '25%',
    textAlign: 'center',
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '25%',
  },
  loginText: {
    color: '#afbbca',
  },
});

export default RegisterPage;
