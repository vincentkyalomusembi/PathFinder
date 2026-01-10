import { render, screen } from '@testing-library/react';
import JobCard from '../../components/cards/JobCard.jsx';

test('renders job title', () => {
  render(<JobCard job={{ title: 'Test Job' }} />);
  expect(screen.getByText('Test Job')).toBeInTheDocument();
});