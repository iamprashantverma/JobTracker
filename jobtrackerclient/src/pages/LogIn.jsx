import React, { useState } from 'react'

import { FaEye, FaEyeSlash} from "react-icons/fa";
import { useAuth } from '../context/AuthContext';

const Login = ()=>{
    const { login } = useAuth();

    const [formData, setFormData] = useState({'email':"", "password":""});
    const [visible, setVisible]  = useState(false); 
    const [error, setError] = useState(null);
    const [errorList, setErrorList] = useState([]);
    const [loading, setLoading] = useState(false);

    const submitHandler = async(e)=>{
        e.preventDefault();
        setLoading(true)
        setError(null); 
        setErrorList([]);
        try {
            await login(formData);
        } catch(err){
            if (err && typeof err === 'object' && 'details' in err && err.details) {
                const details = err.details;
                setError(details.primaryMessage || (err instanceof Error ? err.message : 'Login failed'));
                if (Array.isArray(details.messages) && details.messages.length > 0) {
                    setErrorList(details.messages);
                }
            } else {
                setError(err instanceof Error ? err.message : 'Login failed');
            }
        } finally{
            setLoading(false);
        }
    }

    const dataHandler = (e)=>{
        setFormData({...formData,
            [e.target.name]:e.target.value
        })
    }

    const dedupedErrors = errorList.filter((m) => m && m !== error);

    return (
        <form onSubmit={submitHandler}>

            <label > Enter your email </label>
            <input 
                value={formData.email}
                placeholder='email'
                onChange={dataHandler}
                name='email'
                type='email'
                required
            />
            <label>Enter your Password</label>
            <div>
                <input
                value={formData.password}
                placeholder='password'
                onChange={dataHandler}
                name='password'
                minLength={5}
                type={visible?"text":"password"}
            />
            <button
                type="button"
                onClick={(e) => { e.preventDefault(); setVisible(!visible); }}
                aria-label={visible ? "Hide password" : "Show password"}
                >
                {visible ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            
            <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
            {error && <div role="alert">{error}</div>}
            {dedupedErrors.length > 0 && (
                <ul>
                    {dedupedErrors.map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                    ))}
                </ul>
            )}
        </form>
    )
}
export default Login;
