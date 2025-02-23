// Componente para mostrar rutinas
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../slices/store';
import { addRoutine, assignRoutineToUser } from '../slices/routine/routineSlice';
import { setUserName } from '../slices/user/userSlice';

export const RoutineComponent = () => {
  const dispatch = useDispatch();
  const routines = useSelector((state: RootState) => state.routine);

  const handleAssignRoutine = (routineId: string) => {
    const userId = '123'; // ID del usuario
    dispatch(assignRoutineToUser({ userId, routineId }));
  };

  return (
    <div>
      <h2>Available Routines</h2>
      <ul>
        {routines.map(routine => (
          <li key={routine.id}>
            {routine.name}
            <button onClick={() => handleAssignRoutine(routine.id)}>Assign to me</button>
          </li>
        ))}
      </ul>
    </div>
  );
};