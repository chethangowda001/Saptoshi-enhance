import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/PaymentStatus.css';
import { useParams } from 'react-router-dom';

const PaymentStatus = () => {
    const { bidId } = useParams(); // Get bidId from URL parameters
    const [paymentData, setPaymentData] = useState([]);

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/bids/${bidId}/payment-status`);
                if (response.data.success) {
                    setPaymentData(response.data.data); // Set the payment data from response
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching payment status:", error);
                alert("Failed to fetch payment status.");
            }
        };

        fetchPaymentStatus();
    }, [bidId]);

    return (
        <div className="payment-status-container">
            <h2 className='text-light'>Payment Status for Bid {bidId}</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Bid No</th>
                        <th>Bid Winner</th>
                        <th>Winner Phone</th>
                        <th>Payment Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentData.length > 0 ? (
                        paymentData.map((bid, bidIndex) => (
                            bid.PaymentStatus.length > 0 ? (
                                bid.PaymentStatus.map((status, index) => (
                                    <tr key={`${bidIndex}-${index}`}>
                                        {/* Use rowSpan only for the first row of each bid */}
                                        {index === 0 && (
                                            <>
                                                <td rowSpan={bid.PaymentStatus.length}>{bid.BidNo}</td>
                                                <td rowSpan={bid.PaymentStatus.length}>{bid.BidWinner || "Unknown"}</td>
                                                <td rowSpan={bid.PaymentStatus.length}>{bid.BidWinnerPhone || "Unknown"}</td>
                                            </>
                                        )}
                                        <td>{status.payment}</td>
                                        <td>
                                            <span
                                                className={status.payed === 'Paid' ? "status-paid" : "status-unpaid"}
                                            >
                                                {status.payed}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr key={bidIndex}>
                                    <td>{bid.BidNo}</td>
                                    <td>{bid.BidWinner || "Unknown"}</td>
                                    <td>{bid.BidWinnerPhone || "Unknown"}</td>
                                    <td colSpan="2" className="text-center">No payment data available</td>
                                </tr>
                            )
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No payment data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentStatus;
