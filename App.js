

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = { primary: '#1f145c', white: '#fff' }


const App = () => {
  const [todos, setTodos] = useState([])

  const [textInput, setTextInput] = useState('')

  const ListItem = ({ todo }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo?.completed ? 'line-through' : 'none'
            }}>
            {todo?.task}
          </Text>
        </View>
        {
          !todo?.completed && (
            <TouchableOpacity style={[styles.actionIcon]} onPress={() => markTodoComplete(todo?.id)}>
              <Icon name='done' size={25} color={COLORS.white} />
            </TouchableOpacity>
          )
        }

        <TouchableOpacity style={[styles.actionIcon, { backgroundColor: "red" }]} onPress={() => deleteTodo(todo?.id)}>
          <Icon name='delete' size={25} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    )
  }

  const addTodo = () => {
    if (textInput === '') {
      Alert.alert('Error', "Please input a todo")
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo])
      setTextInput('')
    }
  }

  const markTodoComplete = (todoId) => {
    const newTodos = todos.map((item) => {
      if (item.id === todoId) {
        return { ...item, completed: true }
      }
      return item;
    })
    setTodos(newTodos)
  }

  const deleteTodo = (todoId) => {
    const newTodos = todos.filter((item) => item.id != todoId)
    setTodos(newTodos)
  }

  const clearTodos = () => {
    Alert.alert("Confirm", "Clear todos?", [
      {
        text: "Yes",
        onPress: () => setTodos([])
      },
      {
        text: 'No'
      }

    ])

  }

  const saveTodosToUsersDevice = async (todos) => {
    try {
      const stringifyTodos = JSON.stringify(todos)
      await AsyncStorage.setItem('todos', stringifyTodos)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getTodosFromUserDevice();
  }, [])

  useEffect(() => {
    saveTodosToUsersDevice(todos)
  }, [todos])


  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos')
      if (todos != null) {
        setTodos(JSON.parse(todos))
      }
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#D9F0FF' }} >
      <View style={styles.header}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: COLORS.primary }}>TODO APP</Text>
        <Icon name='delete' size={25} color='red' onPress={clearTodos} />
      </View>
      <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }} data={todos} renderItem={({ item }) => <ListItem todo={item} />} />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add Todo"
            placeholderTextColor="grey"
            value={textInput}
            onChangeText={(text) => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name='add' color={COLORS.white} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    color: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: '#F7FFF7',
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center'

  },
  listItem: {
    padding: 20,
    backgroundColor: '#F7FFF7',
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: "green",
    justifyContent: "center",
    alignContent: 'center',
    marginLeft: 5,
    borderRadius: 3
  }
});

export default App;
