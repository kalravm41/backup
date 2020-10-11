import React from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import db from './config';

export default class Searchscreen extends React.Component {
  constructor(){
    super();
    this.state = {
      search : '',
      allTransactions : [],
      lastVisibleTransaction : null
    }
  }
  searchTransactions=async(text)=>{
    var enterText = text.split('');
    var text = text.toUpperCase();
    if(enterText[0].toUpperCase() === 'B'){
      const transaction = await db.collection('transaction').where('bookId','==',text).get();
      transaction.docs.map((doc)=>{
        this.setState({
          allTransactions : [...this.state.allTransactions,doc.data()],
          lastVisibleTransaction : doc
        });
      })
    }
    else if(enterText[0].toUpperCase() === 'S'){
      const transaction = await db.collection('transaction').where('studentId','==',text).get();
      transaction.docs.map((doc)=>{
        this.setState({
          allTransactions : [...this.state.allTransactions,doc.data()],
          lastVisibleTransaction : doc
        });
      })
    }
  }

  fetchMoreTransactions=async(text)=>{
    var enterText = text.split('');
    var text = text.toUpperCase();
    if(enterText[0].toUpperCase() === 'B'){
      const transaction = await db.collection('transaction').where('bookId','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
      transaction.docs.map((doc)=>{
        this.setState({
          allTransactions : [...this.state.allTransactions,doc.data()],
          lastVisibleTransaction : doc
        });
      })
    }
    else if(enterText[0].toUpperCase() === 'S'){
      const transaction = await db.collection('transaction').where('studentId','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
      transaction.docs.map((doc)=>{
        this.setState({
          allTransactions : [...this.state.allTransactions,doc.data()],
          lastVisibleTransaction : doc
        });
      })
    }
  }

  componentDidMount=async()=>{
    const query = await db.collection('transaction').limit(10).get();
    query.docs.map((doc)=>{
      this.setState({
        allTransactions : [...this.state.allTransactions,doc.data()],
        lastVisibleTransaction : doc
      });
    });
  }
    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TextInput
          style = {styles.inputBox}
          placeholder = 'Enter Book Id Or Student Id'
          onChangeText = {(text)=>{this.setState({search : text})}}
          />
          <TouchableOpacity style = {styles.scanButton}
          onPress = {()=>{this.searchTransactions(this.state.search)}}>
            <Text style = {styles.submitButtonText}> Search </Text>
          </TouchableOpacity>
        <FlatList data = {this.state.allTransactions}
        renderItem = {(item)=>{
          <View style = {{borderBottomWidth : 3}}>
            <Text>{'Book Id :' + item.bookId}</Text>
            <Text>{'student Id :' + item.studentId}</Text>
            <Text>{'transactionType :' + item.transactionType}</Text>
            <Text>{'Date :' + item.date.toDate()}</Text>
          </View>
        }}
        keyExtractor = {(item,index)=>{index.toString()}}
        onEndReached = {this.fetchMoreTransactions}
        onEndReachedThreshold = {0.7}
        />
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    inputBox: {
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20
    },
    scanButton: {
      backgroundColor: "#66BB6A",
      width: 50,
      borderWidth: 1.5,
      borderLeftWidth: 0
    },
    submitButtonText: {
      padding: 10,
      textAlign: "center",
      fontSize: 20,
      fontWeight: "bold",
      color: "white"
    },
  });