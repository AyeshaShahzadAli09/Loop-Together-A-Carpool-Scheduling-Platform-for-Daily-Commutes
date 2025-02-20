import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaCheckCircle, FaTimesCircle, FaFilter } from 'react-icons/fa';

const ListContainer = styled.div`
  background: rgba(240, 240, 240, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background: ${props => props.active ? props.activeColor : 'rgba(240, 240, 240, 0.1)'};
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};

  &:hover {
    background: ${props => props.hoverColor};
    color: #fff;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(20, 20, 30, 0.4);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  border: 1px solid rgba(240, 240, 240, 0.1);

  h3 {
    color: ${props => props.color};
    margin: 0;
    font-size: 1.8rem;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    margin: 0.5rem 0 0 0;
  }
`;

const RequestCard = styled(motion.div)`
  background: rgba(20, 20, 30, 0.4);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  border: 1px solid rgba(240, 240, 240, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: rgba(20, 20, 30, 0.6);
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Name = styled.h3`
  color: #2ecc71;
  margin: 0;
`;

const Email = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ status }) => {
    switch (status) {
      case 'Pending': return 'linear-gradient(45deg, #f1c40f, #e67e22)';
      case 'Approved': return 'linear-gradient(45deg, #2ecc71, #27ae60)';
      case 'Rejected': return 'linear-gradient(45deg, #e74c3c, #c0392b)';
      default: return 'linear-gradient(45deg, #ffffff, #cccccc)';
    }
  }};
`;

const NoRequests = styled.div`
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.7);
`;

const VerificationList = ({ onSelect, selectedId }) => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const fetchVerifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/verifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch verifications');

      const data = await response.json();
      setVerifications(data.verifications);
      
      // Calculate stats
      const newStats = data.verifications.reduce((acc, ver) => {
        acc.total++;
        acc[ver.status.toLowerCase()]++;
        return acc;
      }, { total: 0, pending: 0, approved: 0, rejected: 0 });
      
      setStats(newStats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [selectedId]);

  const filteredVerifications = verifications.filter(ver => {
    if (filter === 'all') return true;
    return ver.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FaClock />;
      case 'Approved': return <FaCheckCircle />;
      case 'Rejected': return <FaTimesCircle />;
      default: return null;
    }
  };

  if (loading) return <ListContainer>Loading...</ListContainer>;
  if (error) return <ListContainer>Error: {error}</ListContainer>;

  return (
    <ListContainer>
      <StatsContainer>
        <StatCard color="#2ecc71">
          <h3>{stats.total}</h3>
          <p>Total Requests</p>
        </StatCard>
        <StatCard color="#ffd700">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </StatCard>
        <StatCard color="#4ade80">
          <h3>{stats.approved}</h3>
          <p>Approved</p>
        </StatCard>
        <StatCard color="#e74c3c">
          <h3>{stats.rejected}</h3>
          <p>Rejected</p>
        </StatCard>
      </StatsContainer>

      <FilterSection>
        <FilterButton
          active={filter === 'all'}
          activeColor="rgba(230, 230, 230, 0.3)"
          hoverColor="rgba(220, 220, 220, 0.4)"
          onClick={() => setFilter('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFilter /> All
        </FilterButton>
        <FilterButton
          active={filter === 'pending'}
          activeColor="#ffd700"
          hoverColor="#ffc700"
          onClick={() => setFilter('pending')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaClock /> Pending
        </FilterButton>
        <FilterButton
          active={filter === 'approved'}
          activeColor="#4ade80"
          hoverColor="#3ac070"
          onClick={() => setFilter('approved')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCheckCircle /> Approved
        </FilterButton>
        <FilterButton
          active={filter === 'rejected'}
          activeColor="#ff4444"
          hoverColor="#ff3333"
          onClick={() => setFilter('rejected')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTimesCircle /> Rejected
        </FilterButton>
      </FilterSection>

      <AnimatePresence>
        {filteredVerifications.length > 0 ? (
          filteredVerifications.map((verification) => (
            <RequestCard
              key={verification._id}
              onClick={() => onSelect(verification)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserInfo>
                <Name>{verification.user.name}</Name>
                <Email>{verification.user.email}</Email>
              </UserInfo>
              <StatusBadge status={verification.status}>
                {getStatusIcon(verification.status)}
                {verification.status}
              </StatusBadge>
            </RequestCard>
          ))
        ) : (
          <NoRequests>No verification requests found</NoRequests>
        )}
      </AnimatePresence>
    </ListContainer>
  );
};

export default VerificationList; 