import { render, screen } from '@testing-library/react';
import Home from '../../pages/Home.jsx';

test('renders hero', () => {
  render(<Home />);
  expect(screen.getByText(/Welcome to My Portfolio/)).toBeInTheDocument();
});