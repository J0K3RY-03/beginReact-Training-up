"use client";

import { Plus, Trash } from "lucide-react";
import {useState} from "react";
import {cn} from "@/src/utils/cn";

const useTodos = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    if (!todo) return;
    /*Création d'un nouvel objet newTodo :*/
    const newTodo = {
      id: Date.now(),
      text: todo,
      completed: false
    }
    /*Ici, un nouvel objet newTodo est créé. Il possède trois propriétés :
    id: Un identifiant unique généré à partir de la fonction Date.now().
    text: La valeur de l'argument todo qui est passé à la fonction addTodo.
    completed: Une valeur booléenne définie sur false pour indiquer que la tâche n'est
     pas encore complétée.*/

    /*Ajout du nouvel objet newTodo à la liste des todos :*/
    const newTodos = [...todos, newTodo];
    /*Dans cette ligne, un nouvel array newTodos est créé en utilisant le spread
     operator ... Cela permet de créer une nouvelle copie de l'array todos (supposons
      qu'il existe déjà quelque part dans ton code) et d'y ajouter le nouvel objet
       newTodo.*/

    /*Mise à jour de la liste des todos :*/
    setTodos(newTodos);
  }

  const updateTodo = (id, newTodo) => {
    /*Création d'un nouvel array newTodos en utilisant la méthode map :*/
    /*La méthode map est utilisée sur l'array todos. Elle itère sur chaque élément de
     l'array et retourne un nouvel array avec les éléments transformés selon une fonction donnée.
     */
    const newTodos = todos.map((todo) => {
      /*Condition pour la mise à jour du todo :*/
      /*Pour chaque élément todo de l'array todos, cette condition vérifie si
       l'identifiant id fourni ne correspond pas à l'identifiant de la tâche actuelle.
        Si c'est le cas, elle retourne simplement la tâche actuelle sans la modifier:*/
      if (todo.id !== id) return todo;
      /*Si l'identifiant de la tâche actuelle correspond à l'identifiant fourni, la
       fonction map retourne la nouvelle tâche newTodo à la place de la tâche actuelle:
       */
      return newTodo;
    })
    setTodos(newTodos);
  }

  const removeTodo = (id) => {
    /*Création d'un nouvel array newTodos en utilisant la méthode filter :*/
    /*La méthode filter est utilisée sur l'array todos. Elle itère sur chaque élément' +
    ' de l'array et retourne un nouvel array contenant uniquement les éléments pour lesquels la fonction de filtrage retourne true.*/
    /*Filtrage des todos pour exclure celui avec l'identifiant fourni :*/
    const newTodos = todos.filter((todo) => todo.id !== id);
    /*Cette condition vérifie si l'identifiant de la tâche actuelle todo est différent
     de l'identifiant fourni id. Si c'est le cas, la tâche est incluse dans le nouvel array newTodos.
     */
    setTodos(newTodos);
  }

  return {
    todos,
    addTodo,
    updateTodo,
    removeTodo
  };
}

export const Todos = () => {
  const [todo, setTodo] = useState("");
  const {todos, addTodo, updateTodo, removeTodo} = useTodos();
  const [editingID, setEditingID] = useState(null);

  const handleAddTodo = () => {
    addTodo(todo);
    setTodo("");
  }

  return (
    <div className="card w-full max-w-md border border-base-300 bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Todos</h2>
        <div className="flex w-full items-center gap-2">
          <div className="input input-bordered flex flex-1 items-center gap-2">
            <input
              type="checkbox"
              checked={false}
              className="checkbox checkbox-sm"
            />
            {/* 🦁 Ajoute un état "Todo" et contrôle l'input */}
            <input type="text" className="grow" placeholder="Some task"
            value={todo} onChange={(e) => setTodo(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === "Enter") {
                       handleAddTodo();
                     }
                   }}/>
          </div>
          <button className="btn btn-primary" onClick={() => handleAddTodo()}>
            <Plus size={22} />
          </button>
        </div>
        <div className="divider">List</div>
        <ul className="space-y-2">
          {todos.map((todo) =>
              <li className="flex w-full items-center gap-2"
                  key={todo.id}>
                <div className={cn("input flex flex-1 items-center gap-2", {
                  "input-bordered": editingID === todo.id,
                })}>
                  <input type="checkbox" className="checkbox checkbox-sm"
                  onChange={() => {
                    /*Lorsque l'événement onChange est déclenché, cette ligne inverse
                     l'état de complétude de la tâche actuelle. Si todo.completed est true, newCompleted deviendra false, et vice versa.
                     */
                    const newCompleted = !todo.completed;
                    /*Mise à jour de la tâche :*/
                    /*Ensuite, cette ligne appelle la fonction updateTodo, passant
                     l'identifiant de la tâche actuelle todo.id et un nouvel objet de todo. Cet objet est construit en copiant toutes les propriétés de la tâche actuelle (...todo) et en remplaçant la propriété completed par la nouvelle valeur newCompleted.
                     */
                    updateTodo(todo.id, {
                      ...todo,
                      completed: newCompleted
                    })
                  }}
                  checked={todo.completed}/>
                  {editingID === todo.id ? (
                      <input
                          ref={(r) => r?.focus()}
                          onBlur={(e) => {
                            const newValue = e.target.value;
                            updateTodo(todo.id, {
                              ...todo,
                              text: newValue,
                            });
                            setEditingID(null);
                          }}
                          defaultValue={todo.text}
                      />
                  ) : (
                      <p
                          onClick={() => {
                            setEditingID(todo.id);
                          }}
                          className={cn({
                            "line-through text-neutral-content": todo.completed,
                          })}
                      >
                        {todo.text}
                      </p>
                  )}
                </div>
                <button className="btn btn-ghost" onClick={() => removeTodo(todo.id)}>
                  <Trash size={16} />
                </button>
              </li>
          )}
          {todos.length === 0 ? (
              <p className="text-neutral-content">Empty</p>
          ) : null}
        </ul>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="flex w-full justify-center">
      <Todos />
    </div>
  );
}
