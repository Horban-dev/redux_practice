import {useHttp} from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, } from 'react';
import { filtersFetching, filtersFetched, filtersFetchingError, activeFilterChanged,  } from '../../actions';
import Spinner from '../spinner/Spinner';
import classNames from 'classnames';
const HeroesFilters = () => {
    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state.filters)
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))

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