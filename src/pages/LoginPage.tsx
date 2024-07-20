import React, {useState, useEffect} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {View, Image, Text, TextInput, StyleSheet, Alert} from 'react-native';
import {logo} from '../assets';
import {login} from '../api';
import {addUser, getUser} from '../database';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Register: undefined;
};

type LoginPageNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginPageNavigationProp;
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

const LoginPage: React.FC<Props> = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function getData() {
      const user = await getUser();
      if (user) {
        navigation.navigate('Main');
      }
    }
    getData();
  }, []);

  const checkInput = (): boolean => {
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
      const data = await login({username, password});
      await AsyncAlert('Message', data.message);
      if (data.message === 'login success') {
        const result = data as AuthResponse;
        await addUser(result.data);
        navigation.navigate('Main');
      }
    }
    setUsername('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.loginText}>Login</Text>
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
        <Text style={styles.signInButton} onPress={loginHandler}>
          SIGN IN
        </Text>
      </View>
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have account?</Text>
        <Text
          style={styles.registerText}
          onPress={() => navigation.navigate('Register')}>
          SIGN UP NOW
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
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '75%',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  loginText: {
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
  signInButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#afbbca',
    color: '#000000',
    borderRadius: 5,
    width: '25%',
    textAlign: 'center',
  },
  registerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '25%',
  },
  registerText: {
    color: '#afbbca',
  },
});

export default LoginPage;
