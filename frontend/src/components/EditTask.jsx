import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
// import GoalForm from '../components/GoalForm'
// import GoalItem from '../components/GoalItem'
import Spinner from './Spinner' 
import { getTasks, reset, editTask} from '../features/tasks/taskSlice'
import { useState } from 'react'
import axios from 'axios'


function EditTask() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { tasks, isLoading, isError, message } = useSelector(
        (state) => state.tasks
    )
    const [formData, setFormData] = useState({
        text:''

    });


    // const [text, setText] = useState('')

    const { id } = useParams();
    console.log(id + '---------------');
    useEffect(() => {
        dispatch(getTasks())
        // axios({
        //     method: 'get',
        //     url: `/${id}`
        // }).then((res) => setFormData(res.data))
    }, [ dispatch])

    const { text } = formData
console.log(text,"text")

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
           
        }))
      
    }  
 

    const onSubmit = (e) => {
        e.preventDefault()

        dispatch(editTask({ text }))
        setFormData('')
        navigate('/')
    }

   

    useEffect(() => {
        if (isError) {
            console.log(message)
        }

        if (!user) {
            navigate('/login')
        }

        dispatch(getTasks())

        return () => {
            dispatch(reset())
        }
    }, [user, navigate, isError, message, dispatch])

    if (isLoading) {
        return <Spinner />
    }

    return (
        <>
            <section className='heading'>
                
                <p>Update Task</p>
            </section>

            {/* <GoalForm /> */}
            <section className='form'>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <label htmlFor='text'>Task</label>
                        <input
                            type='text'
                            name='text'
                            id='text'
                            value={text}
                        //   onChange={(e) => setText(e.target.value)}
                             onChange={onChange}
                        />
                    </div>
                    <div className='form-group'>
                        <button className='btn btn-block' type='submit'>
                            Update Task
                        </button>
                    </div>
                </form>
            </section>
           
        </>
    )
}

export default EditTask