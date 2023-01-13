import {useHttp} from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { heroesFetching, heroesFetched, heroesFetchingError, heroesDelet } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import {
    CSSTransition,
    TransitionGroup,
  } from 'react-transition-group';
import './heroList.scss'
import { createSelector } from 'reselect';


const HeroesList = () => {
    const filteredHeroesSelector = createSelector(
        (state) => state.filters.activeFilter,
        (state) => state.heroes.heroes,
        (filters, heroes) => {
            if(filters === 'all') {
                return heroes
            } else {
                return heroes.filter(item => item.element === filters)
            }
        }
    )

    // const filteredHeroes = useSelector(state => {
    //     if(state.filters.activeFilter === 'all') {
    //         return state.heroes.heroes
    //     } else {
    //         return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter)
    //     }
    // });
    const filteredHeroes = useSelector(filteredHeroesSelector)
    const heroesLoadingStatus = useSelector(state => state.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch('HEROES_FETCHING');
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))

        // eslint-disable-next-line
    }, []);
  
    const onDelet = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE', )
            .then(dispatch(heroesDelet(id)))
            .catch(() => dispatch(heroesFetchingError()))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [request])
    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрзки</h5>
    }
  
    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition
                    timeout={0}
                    classNames="hero">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition
              key={id}
              timeout={500}
              classNames="hero"
            >
                <HeroesListItem  {...props} onDelete={() => onDelet(id)}/>
            </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component="ul">
                    {elements}
        </TransitionGroup>
        
    )
}

export default HeroesList;