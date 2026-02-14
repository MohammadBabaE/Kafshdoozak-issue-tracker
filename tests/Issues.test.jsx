import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeAll } from 'vitest'; // Import vi from vitest
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Issues from '../src/views/Issues/Issues';
import { ThemeContext } from '../src/context/ThemeContext/ThemeContext';

beforeAll(() => {
  window.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  Element.prototype.scrollIntoView = vi.fn();
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
  },
});

const themeContextValue = {
  theme: 'light',
  toggleTheme: vi.fn(),
};

describe('Issues Component', () => {
  it('should render Issues component', () => {
    render(
      <Provider store={store}>
        <Router>
          <ThemeContext.Provider value={themeContextValue}>
            <Issues />
          </ThemeContext.Provider>
        </Router>
      </Provider>
    );

    expect(screen.getByText('ارسال بازخورد...')).toBeInTheDocument();
  });

  it('should open new issue modal when "ارسال بازخورد..." button is clicked', () => {
    render(
      <Provider store={store}>
        <Router>
          <ThemeContext.Provider value={themeContextValue}>
            <Issues />
          </ThemeContext.Provider>
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByText('ارسال بازخورد...'));

    expect(store.getActions()).toContainEqual({ type: 'issues/handleNewIssueModal', payload: true });
  });
});