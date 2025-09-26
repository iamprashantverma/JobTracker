import { useState } from "react";
import { FaEye, FaEyeSlash} from "react-icons/fa";
import { signUp } from "../service/apiService";

const SignUp = ()=>{

    const [formData, setFormData] = useState({
        'name':'',
        'email':'',
        'password':''
    }) 
    const [error, setError] = useState(null);
    const [errorList, setErrorList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible]  = useState(false); 

    const dataHandler = (e)=>{
        setFormData({...formData,
            [e.target.name]: e.target.value,
        })
    }
    const submitHandler = async (e)=>{
        e.preventDefault();
        setError(null);
        setLoading(true);
        setErrorList([]);
        try {
            await signUp(formData);
        } catch(err){
            if (err && typeof err === 'object' && 'details' in err && err.details) {
                const details = err.details;
                setError(details.primaryMessage || (err instanceof Error ? err.message : 'Sign up failed'));
                if (Array.isArray(details.messages) && details.messages.length > 0) {
                    setErrorList(details.messages);
                }
            } else {
                setError(err instanceof Error ? err.message : 'Sign up failed');
            }
        } finally{
            setLoading(false);
        }

    }

    const dedupedErrors = errorList.filter((m) => m && m !== error);

    return (
        <form onSubmit={submitHandler } >
            <label>Enter your name</label>
            <input
                value={formData.name}
                name="name"
                onChange={dataHandler}
                placeholder="Name"
                type="text"
                required
            />

            <label>Enter your email</label>
            <input
                value={formData.email}
                name="email"
                onChange={dataHandler}
                placeholder="Email"
                type="email"
                required
            />
            <label>Enter your Password</label>
            <div>
                <input
                value={formData.password}
                name="password"
                onChange={dataHandler}
                placeholder="Password"
                type={visible?"text":"password"}
                minLength={5}
                required
            />
            <button
                type="button"
                onClick={(e) => { e.preventDefault(); setVisible(!visible); }}
                aria-label={visible ? "Hide password" : "Show password"}
                >
                {visible ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            
            <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Sign Up'}</button>
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
export default SignUp;