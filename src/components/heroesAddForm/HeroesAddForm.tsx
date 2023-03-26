// interface, state type, error type, filters type, onChange all.

import React, { useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addHeroes } from '../heroesList/heroesSlice';
import { selectAll } from '../heroesFilters/filtersSlice';
import store from '../../store';

interface Hero {
    id: string;
    name: string;
    description: string;
    element: string;
}
const HeroesAddForm: React.FC = () => {
    const { filtersLoadingStatus } = useSelector((state: any) => state.filters);
    const filters = selectAll(store.getState());
    const dispatch = useDispatch();
    const { request } = useHttp();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [elementt, setElement] = useState<string>('');

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.target.value);
    }
    function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setDescription(e.target.value);
    }
    function handleElementChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setElement(e.target.value);
    }
    const addNewHero = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newItem: Hero = {
            id: uuidv4(),
            name: name,
            description: description,
            element: elementt
        }

        request("http://localhost:3001/heroes/", 'POST', JSON.stringify(newItem))
            .then(dispatch(addHeroes(newItem)))
            .catch((error: unknown) => console.log(error))
        setName('')
        setDescription('')
        setElement('')
    }


    const elements = (filters: any[], status: string) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }
        if (filters && filters.length > 0) {
            return filters.map(({ name, el, id }) => {
                if (el === 'all') return;

                return <option key={id} value={el}>{name}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={addNewHero}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input
                    required
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                    className="form-control"
                    id="name"
                    placeholder="Как меня зовут?" />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="form-control"
                    id="text"
                    placeholder="Что я умею?"
                    style={{ "height": '130px' }} />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select
                    required
                    className="form-select"
                    id="element"
                    name="element"
                    value={elementt}
                    onChange={handleElementChange}>
                    <option >Я владею элементом...</option>
                    {elements(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;