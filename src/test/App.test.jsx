import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { store, persistor } from '../redux/store';
import App from '../App';

// Mock router to avoid navigation issues in tests
vi.mock('react-router-dom', () => ({
  RouterProvider: ({ router }) => <div data-testid="router-provider">Router Content</div>,
}));

const AppWrapper = ({ children }) => (
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <DndProvider backend={HTML5Backend}>
        {children}
      </DndProvider>
    </PersistGate>
  </Provider>
);

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    );
    
    expect(screen.getByTestId('router-provider')).toBeInTheDocument();
  });

  it('provides necessary context providers', () => {
    const { container } = render(
      <AppWrapper>
        <App />
      </AppWrapper>
    );
    
    // App should render within the provider context
    expect(container.firstChild).toBeTruthy();
  });
});

