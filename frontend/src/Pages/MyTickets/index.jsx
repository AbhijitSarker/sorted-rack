import React from 'react';
import { Table } from 'react-bootstrap';

const MyTickets = () => {
    // Sample ticket data
    const tickets = [
        { id: 1, title: 'Login Issue', status: 'Open', createdDate: '2023-10-01' },
        { id: 2, title: 'Page not loading', status: 'In Progress', createdDate: '2023-09-28' },
        { id: 3, title: 'Feature Request', status: 'Closed', createdDate: '2023-09-20' }
        // Add more tickets as needed
    ];

    return (
        <div className="my-tickets">
            <h2>My Tickets</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Created Date</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                            <td>{ticket.id}</td>
                            <td>{ticket.title}</td>
                            <td>{ticket.status}</td>
                            <td>{ticket.createdDate}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Additional content or components related to tickets can be added here */}

        </div>
    );
};

export default MyTickets;