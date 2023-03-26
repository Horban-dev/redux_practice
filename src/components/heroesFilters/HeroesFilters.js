import React from 'react'
import {useHttp} from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, } from 'react';
import Spinner from '../spinner/Spinner';
import classNames from 'classnames';
import store from '../../store';
import { activeFilterChanged, fetchFilters, selectAll } from './filtersSlice';

const HeroesFilters = () => {
    const {filtersLoadingStatus, activeFilter} = useSelector(state => state.filters)
    const filters = selectAll(store.getState())
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchFilters(request));

        // eslint-disable-next-line
    }, []);
    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрyзки</h5>
    }

    const rend = (arr) => {
        if(arr.length === 0) {
            return (
                <h5 className="text-center mt-5">Filters not found</h5>
            )
        }
        return arr.map(({el, name, clas }) => {
            const btns = classNames('btn', clas, {
                'active': el === activeFilter
            })
            return <button key={el} className={btns}  onClick={() => dispatch(activeFilterChanged(el))}>{name}</button>
        })
    }
    const elements = rend(filters)
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;