import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ListItem from './Listitem';
import LoadingGif from './loading.gif';
import axios from 'axios';

class App extends Component {
    constructor() {
        super();
        this.state = {
            newTodo: '',
            editing: false,
            editingIndex: null,
            notification: null,
            loading: true,
            todos: []
        };

        this.apiUrl = 'https://5b1fd50e17cc7000142ed51f.mockapi.io/todos';

        this.alert = this.alert.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addTodo = this.addTodo.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
        this.updateTodo = this.updateTodo.bind(this);
        this.editTodo = this.editTodo.bind(this);
        //this.generateTodoId = this.generateTodoId.bind(this);
    }

    // componentWillMount() {
    //     console.log('Will');
    // }

    async componentDidMount() {
        const response = await axios.get(`${this.apiUrl}`);
        //console.log(response);

        setTimeout(() => {
            this.setState({
                todos: response.data,
                loading: false
            })
        },1000);



    }

    // generateTodoId() {
    //     const lastTodo = this.state.todos[this.state.todos.length-1];
    //     if(lastTodo) {
    //         return lastTodo.id + 1;
    //     }
    //     return 1;
    //
    // }

    alert(notification) {
        this.setState(
            {
                notification
            }
        );

        setTimeout(() => {
            this.setState({
                notification: null
            })
        },2000)
    }

    async addTodo() {

        // const newTodo = {
        //     name: this.state.newTodo,
        //     id: this.generateTodoId()
        // };



        const response = await axios.post(`${this.apiUrl}`, {name: this.state.newTodo});

        //console.log(response);

        const oldTodos = this.state.todos;

        oldTodos.push(response.data);

        //console.log(oldTodos);
        this.setState({
            todos: oldTodos,
            newTodo: '',
            editing: false
        });

        this.alert('Добавлено успешно.');
    }

    async deleteTodo(index) {
        const todos = this.state.todos;
        const todo = todos[index];

        await axios.delete(`${this.apiUrl}/${todo.id}`);
        delete todos[index];
        this.setState({todos});

        this.alert('Удалено успешно.')
    }

    editTodo(index) {
        const todo = this.state.todos[index];

        this.setState({
            editing:true,
            editingIndex:index,
            newTodo:todo.name
        });

    }

    async updateTodo() {

        const todo = this.state.todos[this.state.editingIndex];

        const response = await axios.put(`${this.apiUrl}/${todo.id}`, {name: this.state.newTodo});

        //console.log(response);

        //todo.name = this.state.newTodo;
        const todos = this.state.todos;
        todos[this.state.editingIndex] = response.data;
        this.setState({todos, editing: false, editingIndex: null, newTodo: ''});
        this.alert('Обновлено успешно.')

    }


    handleChange(event) {
        this.setState({
            newTodo: event.target.value
        });
        //console.log(event.target.value);
    }


  render() {

    return (
      <div className="App">


        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
          <div className="container">
              {
                  this.state.notification &&
                  <p>{this.state.notification}</p>
              }
              <input name="todo" type="text" onChange={this.handleChange} value={this.state.newTodo}/>
              {/*this.state.editing ? this.updateTodo : this.addTodo()*/}
              <button onClick={this.state.editing ? this.updateTodo : this.addTodo}
              disabled={this.state.newTodo.length < 5}
              >
                {this.state.editing ? "Обновить" : "Добавить"}
              </button>

              {
                  this.state.loading &&
                      <p><img src={LoadingGif} style={{width: '150px'}}/></p>
              }

              {
                  (!this.state.editing || this.state.loading) &&
                  <ul>
                      {this.state.todos.map((item, index) => {
                          return <ListItem
                              key = {item.id}
                              item={item}
                              editTodo={() => {this.editTodo(index);}}
                              deleteTodo={() => {this.deleteTodo(index);}}
                          />
                      })}
                  </ul>
              }
          </div>
      </div>
    );
  }
}

export default App;
