import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { getJobById, updateJob } from '../service/apiService';
import { toast } from 'react-toastify';

const EditJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorList, setErrorList] = useState([]);

    const [formData, setFormData] = useState({
        jobId: '',
        jobRole: '',
        companyName: '',
        comment: '',
        appliedDate: '',
        status: 'APPLIED'
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setFetchLoading(true);
                const job = await getJobById(id);
                
                // Format the date for the input field
                const formattedDate = job.appliedDate ? 
                    new Date(job.appliedDate).toISOString().split('T')[0] : '';

                setFormData({
                    jobId: job.jobId || '',
                    jobRole: job.jobRole || '',
                    companyName: job.companyName || '',
                    comment: job.comment || '',
                    appliedDate: formattedDate,
                    status: job.status || 'APPLIED'
                });
            } catch (err) {
                setError('Failed to fetch job details');
                console.error('Error fetching job:', err);
            } finally {
                setFetchLoading(false);
            }
        };

        if (id) {
            fetchJob();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setErrorList([]);

        try {
            await updateJob(id, formData);
            toast.success('Job application updated successfully!');
            navigate('/jobs');
        } catch (err) {
            if (err && typeof err === 'object' && 'details' in err && err.details) {
                const details = err.details;
                setError(details.primaryMessage || (err instanceof Error ? err.message : 'Failed to update job'));
                if (Array.isArray(details.messages) && details.messages.length > 0) {
                    setErrorList(details.messages);
                }
            } else {
                setError(err instanceof Error ? err.message : 'Failed to update job');
            }
        } finally {
            setLoading(false);
        }
    };

    const dedupedErrors = errorList.filter((m) => m && m !== error);

    if (fetchLoading) return <div>Loading job details...</div>;

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow-lg border-0">
                        <Card.Header className="bg-transparent border-0 pb-0">
                            <div className="text-center mb-3">
                                <h2 className="fw-bold text-primary mb-2">Edit Job Application</h2>
                                <p className="text-muted">Update your job application details</p>
                            </div>
                        </Card.Header>
                        <Card.Body className="px-4 pb-4">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Job ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="jobId"
                                        value={formData.jobId}
                                        onChange={handleChange}
                                        placeholder="e.g. JOB-2024-001 or internal job reference"
                                    />
                                    <Form.Text className="text-muted">
                                        Optional: Job reference number or internal ID
                                    </Form.Text>
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Job Role *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="jobRole"
                                                value={formData.jobRole}
                                                onChange={handleChange}
                                                placeholder="e.g. Software Engineer"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Company Name *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                placeholder="e.g. Google"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="comment"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        placeholder="Any comments about this job application..."
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Applied Date *</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="appliedDate"
                                                value={formData.appliedDate}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Status *</Form.Label>
                                            <Form.Select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="APPLIED">Applied</option>
                                                <option value="INTERVIEWING">Interviewing</option>
                                                <option value="OFFERED">Offered</option>
                                                <option value="ACCEPTED">Accepted</option>
                                                <option value="REJECTED">Rejected</option>
                                                <option value="ON_HOLD">On Hold</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>



                                {error && <Alert variant="danger">{error}</Alert>}
                                {dedupedErrors.length > 0 && (
                                    <Alert variant="danger">
                                        <ul className="mb-0">
                                            {dedupedErrors.map((msg, idx) => (
                                                <li key={idx}>{msg}</li>
                                            ))}
                                        </ul>
                                    </Alert>
                                )}

                                <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mt-4">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate('/jobs')}
                                        className="order-2 order-sm-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={loading}
                                        className="order-1 order-sm-2"
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Job Application'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EditJob;