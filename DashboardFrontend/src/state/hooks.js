import {useSelector, useDispatch, useStore} from 'react-redux';
import {store} from './store';

export const useAppDispatch = useDispatch;
export const useAppSelector=useSelector;
export const useAppStore = useStore;