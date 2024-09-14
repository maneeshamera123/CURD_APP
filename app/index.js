import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput, Button } from 'react-native';
import { supabase } from './supabaseClient';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserFullName, setSelectedUserFullName] = useState('');
  const [selectedUserGender, setSelectedUserGender] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      let { data: users, error } = await supabase
        .from('curd')
        .select('*');
      if (error) throw error;
      setUsers(users);
    } catch (error) {
      console.log('Error fetching users:', error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const { error } = await supabase
        .from('curd')
        .delete()
        .eq('id', userId);
      if (error) throw error;
      // Removing the deleted user from the local state
      setUsers(users.filter(user => user.id !== userId));
      Alert.alert('Success', 'User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error.message);
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  const createUser = async () => {
    try {
      const { data, error } = await supabase
        .from('curd')
        .insert([{fullname: name,gender: gender }]);

      if (error) {
        console.error('Error creating user:', error.message);
      } else {
        console.log('User created successfully:', data);
      }
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  }


  const handleUpdateUser = async () => {
    if (!selectedUserId || !selectedUserFullName || !selectedUserGender) {
      Alert.alert('Error', 'Please select a user to update');
      return;
    }

    try {
      const updatedUserData = { fullname: selectedUserFullName, gender: selectedUserGender };
      await supabase
        .from('curd')
        .update(updatedUserData)
        .eq('id', selectedUserId);

      const updatedUsers = users.map(user => {
        if (user.id === selectedUserId) {
          return { ...user, ...updatedUserData };
        }
        return user;
      });
      setUsers(updatedUsers);
      Alert.alert('Success', 'User updated successfully');

      setSelectedUserId(null);
      setSelectedUserFullName('');
      setSelectedUserGender('');

    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };



  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item.id}</Text>
      <Text style={styles.listItemText}>{item.fullname}</Text>
      <Text style={styles.listItemText}>{item.gender}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => handleDeleteUser(item.id)}>
        <Text style={styles.addButtonText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={() => {
        setSelectedUserId(item.id);
        setSelectedUserFullName(item.fullname);
        setSelectedUserGender(item.gender);
      }}>
        <Text style={styles.addButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.addButtonContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          onChangeText={text => setGender(text)}
        />
        <Button title="Add User" onPress={createUser} />
      </View>

      <View style={styles.addButtonContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={selectedUserFullName}
          onChangeText={text => setSelectedUserFullName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={selectedUserGender}
          onChangeText={text => setSelectedUserGender(text)}
        />
        <Button title="Update User" onPress={handleUpdateUser} />
      </View>



      <View style={styles.listItem}>
        <Text style={styles.listItemText}>id</Text>
      </View>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    flex: 1,
    textAlign: 'left',
  },
  addButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    marginBottom: 10,
  },
});

export default UserListScreen;
