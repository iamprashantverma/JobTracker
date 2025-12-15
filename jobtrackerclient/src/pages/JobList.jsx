import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Container, Row, Col, Card, Button, Form, Alert, Modal, Badge, 
    Pagination, Spinner, InputGroup, Offcanvas 
} from 'react-bootstrap';
import { 
    FaEdit, FaTrash, FaPlus, FaFilter, FaEye, FaSearch, 
    FaBuilding, FaCalendarAlt, FaFileAlt, FaTimes 
} from 'react-icons/fa';
import { getAllJobs, deleteJob, getJobById } from '../service/apiService';
import { toast } from 'react-toastify';
import { useDebounce } from '../hooks/useDebounce';

const JobList = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    
    // Filter states
    const [filters, setFilters] = useState({
        status: '',
        company: '',
        dateFrom: '',
        dateTo: ''
    });

    // Separate state for form inputs before search
    const [searchForm, setSearchForm] = useState({
        status: '',
        company: '',
        dateFrom: '',
        dateTo: ''
    });

    // Fetch jobs when page or filters change
    useEffect(() => {
        fetchJobs();
    }, [currentPage, filters]);

    const fetchJobs = useCallback(async () => {
        try {
            // Show main loading for initial load, search loading for filtered searches
            const hasFilters = Object.values(filters).some(v => v);
            if (currentPage === 0 && !hasFilters) {
                setLoading(true);
            } else if (hasFilters) {
                setSearchLoading(true);
            }
            
            const response = await getAllJobs(currentPage, filters);
            
            // Handle both paginated and non-paginated responses
            if (response && typeof response === 'object' && 'content' in response) {
                // Paginated response
                setJobs(response.content || []);
                setTotalPages(response.totalPages || 0);
                setTotalElements(response.totalElements || 0);
            } else {
                // Non-paginated response (fallback)
                setJobs(Array.isArray(response) ? response : []);
                setTotalPages(1);
                setTotalElements(Array.isArray(response) ? response.length : 0);
            }
            setError(null); // Clear any previous errors
        } catch (err) {
            setError('Failed to fetch jobs');
            console.error('Error fetching jobs:', err);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    }, [currentPage, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setSearchForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = () => {
        // Clear existing jobs immediately when applying filters
        setJobs([]);
        setSearchLoading(true);
        setFilters(searchForm);
        setCurrentPage(0); // Reset to first page when searching
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const clearFilters = () => {
        // Clear existing jobs immediately when clearing filters
        setJobs([]);
        setSearchLoading(true);
        const emptyFilters = {
            status: '',
            company: '',
            dateFrom: '',
            dateTo: ''
        };
        setFilters(emptyFilters);
        setSearchForm(emptyFilters);
        setCurrentPage(0);
    };

    const handleDeleteClick = (job) => {
        setJobToDelete(job);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!jobToDelete) return;

        try {
            await deleteJob(jobToDelete.id);
            toast.success('Job deleted successfully');
            fetchJobs(); // Refresh the list
            setShowDeleteModal(false);
            setJobToDelete(null);
        } catch (err) {
            toast.error('Failed to delete job');
            console.error('Error deleting job:', err);
        }
    };

    const handleJobClick = async (jobId) => {
        try {
            setDetailLoading(true);
            setShowDetailModal(true);
            const jobDetails = await getJobById(jobId);
            setSelectedJob(jobDetails);
        } catch (err) {
            toast.error('Failed to fetch job details');
            console.error('Error fetching job details:', err);
            setShowDetailModal(false);
        } finally {
            setDetailLoading(false);
        }
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPLIED': return '📝';
            case 'INTERVIEWING': return '💬';
            case 'OFFERED': return '🎉';
            case 'ACCEPTED': return '✅';
            case 'REJECTED': return '❌';
            case 'ON_HOLD': return '⏸️';
            default: return '📋';
        }
    };

    const JobCard = ({ job, className = '', style = {} }) => (
        <Card 
            className={`job-card mb-3 shadow-sm border-0 ${className}`} 
            style={{ cursor: 'pointer', ...style }}
        >
            <Card.Body onClick={() => handleJobClick(job.id)}>
                <Row className="align-items-center">
                    <Col xs={12} md={8}>
                        <div className="d-flex align-items-start mb-2">
                            <div className="flex-grow-1">
                                <h5 className="mb-1 text-primary">{job.jobRole}</h5>
                                <div className="d-flex align-items-center text-muted mb-2">
                                    <FaBuilding className="me-2" />
                                    <span className="me-3">{job.companyName}</span>
                                    {job.jobId && (
                                        <>
                                            <span className="me-3">•</span>
                                            <small className="text-muted">ID: {job.jobId}</small>
                                        </>
                                    )}
                                </div>
                                {job.comment && (
                                    <p className="text-muted small mb-2 job-comment">
                                        {job.comment.length > 100 ? 
                                            `${job.comment.substring(0, 100)}...` : 
                                            job.comment
                                        }
                                    </p>
                                )}
                                <div className="d-flex align-items-center text-muted small">
                                    <FaCalendarAlt className="me-1" />
                                    <span>Applied: {new Date(job.appliedDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={4} className="text-md-end">
                        <div className="d-flex flex-column align-items-md-end align-items-start">
                            <Badge 
                                bg={getStatusColor(job.status)} 
                                className="mb-2 status-badge"
                            >
                                {getStatusIcon(job.status)} {job.status}
                            </Badge>
                            <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleJobClick(job.id)}
                                    title="View Details"
                                >
                                    <FaEye />
                                </Button>
                                <Button
                                    as={Link}
                                    to={`/jobs/edit/${job.id}`}
                                    variant="outline-secondary"
                                    size="sm"
                                    title="Edit Job"
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDeleteClick(job)}
                                    title="Delete Job"
                                >
                                    <FaTrash />
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );

    if (loading && currentPage === 0) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3">Loading jobs...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="px-3 px-md-4">
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                        <div className="mb-3 mb-md-0">
                            <h1 className="h3 mb-1">Job Applications</h1>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <p className="text-muted mb-0">
                                    {totalElements} total applications
                                </p>
                                {Object.values(filters).some(v => v) && (
                                    <div className="d-flex gap-1 flex-wrap">
                                        {filters.status && (
                                            <Badge bg="primary" className="d-flex align-items-center">
                                                Status: {filters.status}
                                                <Button 
                                                    variant="link" 
                                                    size="sm" 
                                                    className="p-0 ms-1 text-white"
                                                    onClick={() => {
                                                        setJobs([]);
                                                        setSearchLoading(true);
                                                        setFilters(prev => ({ ...prev, status: '' }));
                                                        setSearchForm(prev => ({ ...prev, status: '' }));
                                                    }}
                                                >
                                                    <FaTimes size={10} />
                                                </Button>
                                            </Badge>
                                        )}
                                        {filters.company && (
                                            <Badge bg="info" className="d-flex align-items-center">
                                                Company: {filters.company}
                                                <Button 
                                                    variant="link" 
                                                    size="sm" 
                                                    className="p-0 ms-1 text-white"
                                                    onClick={() => {
                                                        setJobs([]);
                                                        setSearchLoading(true);
                                                        setFilters(prev => ({ ...prev, company: '' }));
                                                        setSearchForm(prev => ({ ...prev, company: '' }));
                                                    }}
                                                >
                                                    <FaTimes size={10} />
                                                </Button>
                                            </Badge>
                                        )}
                                        {(filters.dateFrom || filters.dateTo) && (
                                            <Badge bg="success" className="d-flex align-items-center">
                                                Date Range
                                                <Button 
                                                    variant="link" 
                                                    size="sm" 
                                                    className="p-0 ms-1 text-white"
                                                    onClick={() => {
                                                        setJobs([]);
                                                        setSearchLoading(true);
                                                        setFilters(prev => ({ ...prev, dateFrom: '', dateTo: '' }));
                                                        setSearchForm(prev => ({ ...prev, dateFrom: '', dateTo: '' }));
                                                    }}
                                                >
                                                    <FaTimes size={10} />
                                                </Button>
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <Button 
                                variant="outline-primary" 
                                onClick={() => setShowFilters(true)}
                                className="d-md-none"
                            >
                                <FaFilter className="me-2" />
                                Filters
                            </Button>
                            <Button as={Link} to="/jobs/add" variant="primary">
                                <FaPlus className="me-2" />
                                Add Job
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                {/* Desktop Filters */}
                <Col md={3} className="d-none d-md-block">
                    <Card className="sticky-filters">
                        <Card.Header>
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">
                                    <FaFilter className="me-2" />
                                    Filters
                                </h6>
                                {Object.values(filters).some(v => v) && (
                                    <Button variant="link" size="sm" onClick={clearFilters}>
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={searchForm.status}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="APPLIED">Applied</option>
                                        <option value="INTERVIEWING">Interviewing</option>
                                        <option value="OFFERED">Offered</option>
                                        <option value="ACCEPTED">Accepted</option>
                                        <option value="REJECTED">Rejected</option>
                                        <option value="ON_HOLD">On Hold</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Company</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="company"
                                        value={searchForm.company}
                                        onChange={handleFilterChange}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Search company..."
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="dateFrom"
                                        value={searchForm.dateFrom}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="dateTo"
                                        value={searchForm.dateTo}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button 
                                        type="submit"
                                        variant="primary" 
                                        onClick={handleSearch}
                                        disabled={searchLoading}
                                    >
                                        {searchLoading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <FaSearch className="me-2" />
                                                Search Jobs
                                            </>
                                        )}
                                    </Button>
                                    {(Object.values(searchForm).some(v => v) || Object.values(filters).some(v => v)) && (
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={clearFilters}
                                            size="sm"
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Job List */}
                <Col md={9}>
                    {error && <Alert variant="danger">{error}</Alert>}

                    {jobs.length === 0 && !loading && !searchLoading ? (
                        <Card className="text-center py-5">
                            <Card.Body>
                                <div className="mb-3">
                                    <FaFileAlt size={48} className="text-muted" />
                                </div>
                                <h5>No job applications found</h5>
                                <p className="text-muted">
                                    {Object.values(filters).some(v => v) 
                                        ? 'No jobs match your current filters. Try adjusting your search criteria.'
                                        : 'Get started by adding your first job application!'
                                    }
                                </p>
                                <div className="d-flex gap-2 justify-content-center">
                                    {Object.values(filters).some(v => v) && (
                                        <Button variant="outline-primary" onClick={clearFilters}>
                                            Clear Filters
                                        </Button>
                                    )}
                                    <Button as={Link} to="/jobs/add" variant="primary">
                                        <FaPlus className="me-2" />
                                        Add New Job
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ) : jobs.length === 0 && (loading || searchLoading) ? (
                        <Card className="text-center py-5">
                            <Card.Body>
                                <Spinner animation="border" className="mb-3" />
                                <h5>{searchLoading ? 'Searching jobs...' : 'Loading jobs...'}</h5>
                                <p className="text-muted mb-0">Please wait while we fetch your job applications</p>
                            </Card.Body>
                        </Card>
                    ) : (
                        <>
                            {/* Job Cards */}
                            <div className="job-list position-relative">
                                {searchLoading && jobs.length > 0 && (
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-90 search-overlay" style={{ zIndex: 10 }}>
                                        <div className="text-center">
                                            <Spinner animation="border" className="mb-2" />
                                            <p className="text-muted mb-0">Updating results...</p>
                                        </div>
                                    </div>
                                )}
                                {jobs.map((job, index) => (
                                    <JobCard 
                                        key={job.id} 
                                        job={job} 
                                        className="fade-in"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>
                                        <Pagination.First 
                                            onClick={() => setCurrentPage(0)}
                                            disabled={currentPage === 0}
                                        />
                                        <Pagination.Prev 
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 0}
                                        />
                                        
                                        {[...Array(Math.min(5, totalPages))].map((_, index) => {
                                            const pageNumber = Math.max(0, Math.min(
                                                currentPage - 2 + index, 
                                                totalPages - 5 + index
                                            ));
                                            
                                            if (pageNumber >= totalPages) return null;
                                            
                                            return (
                                                <Pagination.Item
                                                    key={pageNumber}
                                                    active={pageNumber === currentPage}
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                >
                                                    {pageNumber + 1}
                                                </Pagination.Item>
                                            );
                                        })}
                                        
                                        <Pagination.Next 
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage >= totalPages - 1}
                                        />
                                        <Pagination.Last 
                                            onClick={() => setCurrentPage(totalPages - 1)}
                                            disabled={currentPage >= totalPages - 1}
                                        />
                                    </Pagination>
                                </div>
                            )}

                            {loading && currentPage > 0 && (
                                <div className="text-center py-3">
                                    <Spinner animation="border" size="sm" />
                                </div>
                            )}
                        </>
                    )}
                </Col>
            </Row>

            {/* Mobile Filters Offcanvas */}
            <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        <FaFilter className="me-2" />
                        Filters
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={(e) => { e.preventDefault(); handleSearch(); setShowFilters(false); }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={searchForm.status}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Statuses</option>
                                <option value="APPLIED">Applied</option>
                                <option value="INTERVIEWING">Interviewing</option>
                                <option value="OFFERED">Offered</option>
                                <option value="ACCEPTED">Accepted</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="ON_HOLD">On Hold</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Company</Form.Label>
                            <Form.Control
                                type="text"
                                name="company"
                                value={searchForm.company}
                                onChange={handleFilterChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Search company..."
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>From Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateFrom"
                                value={searchForm.dateFrom}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>To Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateTo"
                                value={searchForm.dateTo}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button 
                                type="submit"
                                variant="primary" 
                                onClick={() => { handleSearch(); setShowFilters(false); }}
                                disabled={searchLoading}
                            >
                                {searchLoading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <FaSearch className="me-2" />
                                        Search Jobs
                                    </>
                                )}
                            </Button>
                            {(Object.values(searchForm).some(v => v) || Object.values(filters).some(v => v)) && (
                                <Button variant="outline-secondary" onClick={clearFilters}>
                                    Clear All Filters
                                </Button>
                            )}
                            <Button variant="outline-primary" onClick={() => setShowFilters(false)}>
                                Close
                            </Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Job Detail Modal */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Job Application Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {detailLoading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" />
                            <p className="mt-3">Loading job details...</p>
                        </div>
                    ) : selectedJob ? (
                        <div>
                            <Row className="mb-3">
                                <Col md={8}>
                                    <h4 className="text-primary mb-1">{selectedJob.jobRole}</h4>
                                    <div className="d-flex align-items-center text-muted mb-3">
                                        <FaBuilding className="me-2" />
                                        <span className="me-3">{selectedJob.companyName}</span>
                                        {selectedJob.jobId && (
                                            <>
                                                <span className="me-3">•</span>
                                                <span>ID: {selectedJob.jobId}</span>
                                            </>
                                        )}
                                    </div>
                                </Col>
                                <Col md={4} className="text-md-end">
                                    <Badge bg={getStatusColor(selectedJob.status)} className="fs-6">
                                        {getStatusIcon(selectedJob.status)} {selectedJob.status}
                                    </Badge>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <strong>Applied Date:</strong>
                                    <p className="mb-0">{new Date(selectedJob.appliedDate).toLocaleDateString()}</p>
                                </Col>
                                {selectedJob.resumeUsed && (
                                    <Col md={6}>
                                        <strong>Resume Used:</strong>
                                        <p className="mb-0">{selectedJob.resumeUsed}</p>
                                    </Col>
                                )}
                            </Row>

                            {selectedJob.comment && (
                                <div className="mb-3">
                                    <strong>Comments:</strong>
                                    <p className="mt-2 p-3 bg-light rounded">{selectedJob.comment}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Alert variant="danger">Failed to load job details</Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Close
                    </Button>
                    {selectedJob && (
                        <div className="d-flex gap-2">
                            <Button
                                as={Link}
                                to={`/jobs/edit/${selectedJob.id}`}
                                variant="primary"
                                onClick={() => setShowDetailModal(false)}
                            >
                                <FaEdit className="me-2" />
                                Edit Job
                            </Button>
                        </div>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <FaTrash size={48} className="text-danger mb-3" />
                        <p>Are you sure you want to delete this job application?</p>
                        {jobToDelete && (
                            <div className="bg-light p-3 rounded">
                                <strong>{jobToDelete.jobRole}</strong> at <strong>{jobToDelete.companyName}</strong>
                            </div>
                        )}
                        <p className="text-muted mt-3 mb-0">This action cannot be undone.</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        <FaTrash className="me-2" />
                        Delete Job
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default JobList;