import React, {useEffect, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {back, send} from '../assets';
import {MessageContainer} from '../components';
import {io, Socket} from 'socket.io-client';
import {SERVER_IP} from '../api';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';

type RootStackParamList = {
  Content: undefined;
  Main: undefined;
};

type LoginPageNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Content'
>;

type User = {
  user_uuid: string;
  username: string;
  name: string;
};

type Chat = {
  chat_uuid: string;
  user_from_uuid: string;
  user_to_uuid: string;
  message: string;
  datetime: Date;
  read: boolean;
};

type Route = {
  params: {
    uuid: string;
    user: User;
  };
};

type Props = {
  navigation: LoginPageNavigationProp;
  route: Route;
};

const getSocket = (from_uuid: string, to_uuid: string): Socket => {
  return io(`ws://${SERVER_IP}`, {
    query: {user_uuid: from_uuid, to_uuid},
    autoConnect: false,
  });
};

const ContentPage: React.FC<Props> = ({navigation, route}) => {
  const [user, setUser] = useState<User>();
  const [uuid, setUUID] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const {uuid, user: thisUser} = route.params;
    setUser(thisUser);
    setUUID(uuid);
    const conn = getSocket(uuid, thisUser.user_uuid);
    setSocket(conn);

    conn.connect();

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onChats = (value: Chat[]) => {
      setChats(value);
    };

    conn.on('connect', onConnect);
    conn.on('disconnect', onDisconnect);
    conn.on('chats', onChats);

    return () => {
      conn.off('connect', onConnect);
      conn.off('disconnect', onDisconnect);
      conn.off('chats', onChats);
      conn.disconnect();
    };
  }, [route.params]);

  const submitHandler = () => {
    if (socket) {
      socket.emit('send-chat', message);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerStart}>
          <Pressable onPress={() => navigation.navigate('Main')}>
            <Image source={back} style={styles.backIcon} />
          </Pressable>
          <Text style={styles.nameUser}>{user?.name}</Text>
          <Text style={styles.username}>@{user?.username}</Text>
        </View>
        <Text style={styles.headerEnd}>
          {isConnected ? 'online' : 'offline'}
        </Text>
      </View>
      <MessageContainer data={chats} uuid={uuid} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputMessage}
          placeholder="Message.."
          placeholderTextColor="#647993"
          value={message}
          onChangeText={setMessage}
        />
        <Pressable style={styles.sendButton} onPress={submitHandler}>
          <Text style={styles.buttontext}>SEND</Text>
          <Image source={send} style={styles.sendIcon} />
        </Pressable>
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
  header: {
    backgroundColor: '#1f1f1f',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerStart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  nameUser: {
    color: '#afbbca',
    fontWeight: 'bold',
    fontSize: 17,
  },
  username: {
    color: '#647993',
    fontWeight: 'bold',
    fontSize: 15,
  },
  headerEnd: {color: '#22aa22'},
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#353e4b',
    justifyContent: 'space-between',
  },
  inputMessage: {
    padding: 8,
    fontSize: 15,
    flex: 1,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttontext: {
    color: '#D4DBE3',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sendIcon: {
    width: 35,
    height: 35,
  },
});

export default ContentPage;
