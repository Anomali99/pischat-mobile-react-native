import React, {useEffect, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {logo, logout} from '../assets';
import {deleteUser, getUser} from '../database';
import {getUsers} from '../api';
import {
  Image,
  Pressable,
  View,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Content: {uuid: string; user: User};
};

type MainPageNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Main'
>;

type Props = {
  navigation: MainPageNavigationProp;
};

type User = {
  user_uuid: string;
  username: string;
  name: string;
};

type UsersResponse = {
  status: number;
  message: string;
  data: User[];
};

const MainPage: React.FC<Props> = ({navigation}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>({
    name: '',
    user_uuid: '',
    username: '',
  });

  useEffect(() => {
    async function getData() {
      const data = (await getUser()) as User;
      setUser(data);

      const results = await getUsers(data.user_uuid);
      const result = results as UsersResponse;
      setUsers(result.data);
    }

    getData();
  }, []);

  const clickHandle = (toUser: User) => {
    navigation.navigate('Content', {uuid: user.user_uuid, user: toUser});
  };

  const logoutHandle = async () => {
    await deleteUser();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.textLogo}>Pischat</Text>
        </View>
        <Pressable onPress={logoutHandle}>
          <Image source={logout} style={styles.logo} />
        </Pressable>
      </View>

      <ScrollView>
        {users.map((item, index) => (
          <Pressable
            key={index}
            style={styles.userContainer}
            onPress={() => clickHandle(item)}>
            <View style={styles.userAtribut}>
              <Text style={styles.nameUser}>{item.name}</Text>
              <Text style={styles.userName}>@{item.username}</Text>
            </View>
            <Text style={styles.notification}>10</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#22272f',
  },
  header: {
    backgroundColor: '#1f1f1f',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 35,
    height: 35,
  },
  textLogo: {
    marginLeft: 10,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#d4dbe3',
  },
  userContainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
    backgroundColor: '#353e4b',
    alignItems: 'center',
  },
  userAtribut: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameUser: {
    color: '#afbbca',
    fontWeight: 'bold',
    fontSize: 17,
  },
  userName: {
    marginLeft: 5,
    color: '#647993',
    fontWeight: 'bold',
    fontSize: 15,
  },
  notification: {
    backgroundColor: '#22272f',
    padding: 5,
    borderRadius: 100,
    color: '#647993',
  },
});

export default MainPage;
