import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signUp } from "../service/apiService";
import { toast } from "react-toastify";

const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        'name': '',
        'email': '',
        'password': ''
    });
    const [error, setError] = useState(null);
    const [errorList, setErrorList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const dataHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setErrorList([]);
        try {
            await signUp(formData);
            toast.success('Signed up successfully! Please login.');
            navigate('/login');
        } catch (err) {
            if (err && typeof err === 'object' && 'details' in err && err.details) {
                const details = err.details;
                setError(details.primaryMessage || (err instanceof Error ? err.message : 'Sign up failed'));
                if (Array.isArray(details.messages) && details.messages.length > 0) {
                    setErrorList(details.messages);
                }
            } else {
                setError(err instanceof Error ? err.message : 'Sign up failed');
            }
        } finally {
            setLoading(false);
        }
    }

    const dedupedErrors = errorList.filter((m) => m && m !== error);

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="auth-card">
                        <Card.Body>
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary">Create Account</h2>
                                <p className="text-muted">Join us to track your job applications</p>
                            </div>
                            <Form onSubmit={submitHandler}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={dataHandler}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={dataHandler}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={visible ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={dataHandler}
                                            placeholder="Enter your password"
                                            minLength={5}
                                            required
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setVisible(!visible)}
                                            aria-label={visible ? "Hide password" : "Show password"}
                                        >
                                            {visible ? <FaEyeSlash /> : <FaEye />}
                                        </Button>
                                    </InputGroup>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing up...' : 'Sign Up'}
                                </Button>

                                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                                {dedupedErrors.length > 0 && (
                                    <Alert variant="danger" className="mt-3">
                                        <ul className="mb-0">
                                            {dedupedErrors.map((msg, idx) => (
                                                <li key={idx}>{msg}</li>
                                            ))}
                                        </ul>
                                    </Alert>
                                )}

                                <div className="text-center mt-4">
                                    <span className="text-muted">Already have an account? </span>
                                    <Link to="/login" className="text-decoration-none fw-bold">Login here</Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default SignUp;