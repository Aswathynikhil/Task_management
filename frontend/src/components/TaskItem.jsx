import { useDispatch } from 'react-redux'
import { deleteTask ,editTask} from '../features/tasks/taskSlice'
import { BiEditAlt } from 'react-icons/bi'
import { useNavigate, useParams } from "react-router-dom";

function TaskItem({ task }) {
  const { id } = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const TaskUpdate = (id) => {
// console.log(id,"hgdsjfhjk")
    navigate(`/edittask/${id}`)
    //  dispatch(editTask())
  }


  return (
    <div className='goal'>
      <div>{new Date(task.createdAt).toLocaleString('en-US')}</div>
      <h2>{task.text}</h2>
      <button onClick={() => dispatch(deleteTask(task._id))} className='close'>
        X
      </button>
      {/* <Button onClick={() => { UserUpdate(userData._id) }} variant="contained" >Edit</Button> */}
      <button onClick={() => {TaskUpdate(task._id) }} className='update'>
        <BiEditAlt/>
      </button>
    </div>
  )
}

export default TaskItem