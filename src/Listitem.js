import React from 'react';

const ListItem = (props) => {
    return <li>{props.item.name}
        <button onClick={
            props.editTodo
        }>Обновить
        </button>
        <button onClick={
            props.deleteTodo
        }>Удалить
        </button>
    </li>
};

export default ListItem;