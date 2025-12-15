import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ 'email': "", "password": "" });
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState(null);
    const [errorList, setErrorList] = useState([]);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setErrorList([]);
        try {
            await login(formData);
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (err) {
            if (err && typeof err === 'object' && 'details' in err && err.details) {
                const details = err.details;
                setError(details.primaryMessage || (err instanceof Error ? err.message : 'Login failed'));
                if (Array.isArray(details.messages) && details.messages.length > 0) {
                    setErrorList(details.messages);
                }
            } else {
                setError(err instanceof Error ? err.message : 'Login failed');
            }
        } finally {
            setLoading(false);
        }
    }

    const dataHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const dedupedErrors = errorList.filter((m) => m && m !== error);

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="auth-card">
                        <Card.Body>
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary">Welcome Back</h2>
                                <p className="text-muted">Sign in to your account</p>
                            </div>
                            <Form onSubmit={submitHandler}>
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
                                    {loading ? 'Logging in...' : 'Login'}
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
                                    <span className="text-muted">Don't have an account? </span>
                                    <Link to="/signup" className="text-decoration-none fw-bold">Sign up here</Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
