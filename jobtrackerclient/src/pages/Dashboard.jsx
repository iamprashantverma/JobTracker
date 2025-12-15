import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { getAllJobs } from '../service/apiService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobsData = await getAllJobs(0);
                setJobs(jobsData || []);
            } catch (err) {
                setError('Failed to fetch jobs');
                console.error('Error fetching jobs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const getStatusCounts = () => {
        const counts = {
            APPLIED: 0,
            INTERVIEWING: 0,
            OFFERED: 0,
            ACCEPTED: 0,
            REJECTED: 0,
            ON_HOLD: 0
        };

        jobs.forEach(job => {
            if (counts.hasOwnProperty(job.status)) {
                counts[job.status]++;
            }
        });

        return counts;
    };

    const statusCounts = getStatusCounts();
    const recentJobs = jobs.slice(0, 5);

    if (loading) return <div>Loading...</div>;

    return (
        <Container>
            <Row className="mb-4">
                <Col>
                    <h1>Welcome back, {user?.name}!</h1>
                    <p className="text-muted">Here's your job application overview</p>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-4">
                <Col md={2}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Applied</Card.Title>
                            <h2 className="text-primary">{statusCounts.APPLIED}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Interviewing</Card.Title>
                            <h2 className="text-warning">{statusCounts.INTERVIEWING}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Offered</Card.Title>
                            <h2 className="text-info">{statusCounts.OFFERED}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Accepted</Card.Title>
                            <h2 className="text-success">{statusCounts.ACCEPTED}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Rejected</Card.Title>
                            <h2 className="text-danger">{statusCounts.REJECTED}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>On Hold</Card.Title>
                            <h2 className="text-secondary">{statusCounts.ON_HOLD}</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Card>
                        <Card.Header>
                            <h5>Recent Applications</h5>
                        </Card.Header>
                        <Card.Body>
                            {recentJobs.length === 0 ? (
                                <p>No job applications yet. <Link to="/jobs/add">Add your first job</Link>!</p>
                            ) : (
                                <div>
                                    {recentJobs.map(job => (
                                        <div key={job.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                                            <div>
                                                <strong>{job.jobRole}</strong> at {job.companyName}
                                                {job.jobId && <span className="text-muted"> ({job.jobId})</span>}
                                                <br />
                                                <small className="text-muted">Applied: {new Date(job.appliedDate).toLocaleDateString()}</small>
                                            </div>
                                            <span className={`badge bg-${getStatusColor(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="mt-3">
                                        <Link to="/jobs" className="btn btn-outline-primary">View All Jobs</Link>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Header>
                            <h5>Quick Actions</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-2">
                                <Button as={Link} to="/jobs/add" variant="primary">
                                    Add New Job Application
                                </Button>
                                <Button as={Link} to="/jobs" variant="outline-primary">
                                    View All Applications
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'APPLIED': return 'primary';
        case 'INTERVIEWING': return 'warning';
        case 'OFFERED': return 'info';
        case 'ACCEPTED': return 'success';
        case 'REJECTED': return 'danger';
        case 'ON_HOLD': return 'secondary';
        default: return 'secondary';
    }
};

export default Dashboard;