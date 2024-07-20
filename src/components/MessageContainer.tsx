import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';

type Chat = {
  chat_uuid: string;
  user_from_uuid: string;
  user_to_uuid: string;
  message: string;
  datetime: Date;
  read: boolean;
};

type ChatType = {
  chat_uuid?: string;
  user_from_uuid?: string;
  user_to_uuid?: string;
  message?: string;
  datetime?: Date;
  read?: boolean;
  type: string;
  date: string;
  time?: string;
};

type Props = {
  data: Chat[];
  uuid: string;
};

const MessageContainer: React.FC<Props> = ({data, uuid}) => {
  const [messages, setMessages] = useState<ChatType[]>([]);
  const [UUID, setUUID] = useState<string>('');

  useEffect(() => {
    if (data) {
      let results: ChatType[] = [];
      let seenDates = new Set<string>();

      data.forEach(item => {
        let datetime = new Date(item.datetime);

        if (isNaN(datetime.getTime())) {
          console.error('Invalid datetime value:', item.datetime);
          return;
        }

        const optionsDate: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        const optionsTime: Intl.DateTimeFormatOptions = {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };

        let date = new Intl.DateTimeFormat('id-ID', optionsDate).format(
          datetime,
        );
        let time = new Intl.DateTimeFormat('id-ID', optionsTime).format(
          datetime,
        );

        if (!seenDates.has(date)) {
          let newDate: ChatType = {date: date, type: 'date'};
          results.push(newDate);
          seenDates.add(date);
        }

        let chat: ChatType = {
          ...item,
          type: 'chat',
          date: date,
          time: time,
        };

        if (chat.user_to_uuid === uuid) {
          chat.read = true;
        }

        results.push(chat);
      });

      setMessages(results);
    } else {
      setMessages([]);
    }
    setUUID(uuid);
  }, [data, uuid]);

  return (
    <ScrollView style={styles.messageList}>
      {messages.map((item, index) =>
        item.type === 'date' ? (
          <View key={`date-${index}`} style={styles.dateContainer}>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        ) : (
          <View
            key={`chat-${index}`}
            style={
              item?.user_from_uuid === UUID
                ? styles.rightContainer
                : styles.leftContainer
            }>
            <Text
              style={
                item?.user_from_uuid === UUID
                  ? styles.rightText
                  : styles.leftText
              }>
              {item?.message}
            </Text>
            <Text
              style={
                item?.user_from_uuid === UUID
                  ? styles.rightTime
                  : styles.leftTime
              }>
              {item?.time}
            </Text>
          </View>
        ),
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  messageList: {
    flexDirection: 'column',
    padding: 15,
    marginBottom: 15,
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  date: {
    backgroundColor: '#4f617a',
    padding: 5,
    borderRadius: 5,
    color: '#afbbca',
  },
  leftContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#8397ad',
    borderRadius: 5,
    borderBottomLeftRadius: 0,
    maxWidth: '75%',
    marginBottom: 15,
  },
  leftText: {
    color: '#22272f',
    fontSize: 15,
  },
  leftTime: {
    alignSelf: 'flex-end',
    marginTop: 3,
    color: '#22272f',
    fontSize: 12,
  },
  rightContainer: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#353e4b',
    borderRadius: 5,
    borderBottomRightRadius: 0,
    maxWidth: '75%',
    marginBottom: 15,
  },
  rightText: {
    color: '#8397ad',
    fontSize: 15,
  },
  rightTime: {
    alignSelf: 'flex-end',
    marginTop: 3,
    color: '#8397ad',
    fontSize: 12,
  },
});

export default MessageContainer;
