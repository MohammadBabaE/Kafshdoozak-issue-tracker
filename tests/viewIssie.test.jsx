import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ViewIssue from '../src/views/ViewIssue/ViewIssue';
import { ThemeContext } from '../src/context/ThemeContext/ThemeContext';

beforeAll(() => {
  window.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  Element.prototype.scrollIntoView = vi.fn();

  const portalContainer = document.createElement('div');
  portalContainer.setAttribute('id', 'modal-root');
  document.body.appendChild(portalContainer);
});

const mockStore = configureStore([]);
const store = mockStore({
    issuesSlice: {
      isNewModalOpen: false,
      isViewModalOpen: false,
      isLogoutModalOpen: false,
      isEditModalOpen: false,
      issues: [],
    },
    userSlice: {
      userId: '1',
      avatar: { fileId: 'avatarId' },
      profilePictureUpload: { progress: 50, state: 'uploading' },
    },
    labelsSlice: {
      labels: [],
    },
    currentIssueSlice: {
      issueLoading: false,
      filesLoading: false,
      commentsLoading: false,
      currentIssue: {
        userId: '1', 
        comments: [], 
        date: '2023-09-14T16:48:29+03:30',
      },
    },
  });

const themeContextValue = {
  theme: 'light',
  toggleTheme: vi.fn(),
};

describe('ViewIssue Component', () => {

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Provider store={store}>
        <Router>
          <ThemeContext.Provider value={themeContextValue}>
            <ViewIssue isOpen={true} onClose={onClose} onEdit={vi.fn()} />
          </ThemeContext.Provider>
        </Router>
      </Provider>
    );

    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should not display issue details when isOpen is false', () => {
    render(
      <Provider store={store}>
        <Router>
          <ThemeContext.Provider value={themeContextValue}>
            <ViewIssue isOpen={false} onClose={vi.fn()} onEdit={vi.fn()} />
          </ThemeContext.Provider>
        </Router>
      </Provider>
    );

    expect(screen.queryByText('Issue Details')).not.toBeInTheDocument();
  });
});