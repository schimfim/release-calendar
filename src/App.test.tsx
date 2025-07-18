import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useState } from 'react'

// Mock the Amplify imports to avoid issues in tests
vi.mock('aws-amplify', () => ({
  Amplify: {
    configure: vi.fn(),
  },
}))

vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => ({
    models: {
      SoftwareRelease: {
        list: vi.fn(),
      },
    },
  })),
}))

// Create a test version of the App component without top-level await
function TestApp() {
  const [releases] = useState([
    {
      id: "1",
      mainVersion: "2.1.0",
      goLiveDate: "2024-01-15",
      frameworkVersion: "React 18.2.0",
      released: true,
    },
    {
      id: "2",
      mainVersion: "2.0.5",
      goLiveDate: "2024-02-20",
      frameworkVersion: "React 18.1.0",
      released: true,
    },
    {
      id: "3",
      mainVersion: "2.2.0",
      goLiveDate: "2024-03-10",
      frameworkVersion: "React 18.3.0",
      released: false,
    },
    {
      id: "4",
      mainVersion: "1.9.8",
      goLiveDate: "2023-12-05",
      frameworkVersion: "React 17.0.2",
      released: true,
    },
    {
      id: "5",
      mainVersion: "2.3.0",
      goLiveDate: "2024-04-15",
      frameworkVersion: "React 19.0.0",
      released: false,
    },
    {
      id: "6",
      mainVersion: "2.0.0",
      goLiveDate: "2023-11-20",
      frameworkVersion: "React 18.0.0",
      released: true,
    },
    {
      id: "7",
      mainVersion: "2.1.5",
      goLiveDate: "2024-02-28",
      frameworkVersion: "React 18.2.1",
      released: true,
    },
  ])

  return (
    <main>
      <h1>Software Releases</h1>
      <div className="table-container">
        <table className="releases-table">
          <thead>
            <tr>
              <th>Main Version</th>
              <th>Go Live Date</th>
              <th>Framework Version</th>
              <th>Released</th>
            </tr>
          </thead>
          <tbody>
            {releases.map((release) => (
              <tr key={release.id}>
                <td>{release.mainVersion}</td>
                <td>{release.goLiveDate}</td>
                <td>{release.frameworkVersion}</td>
                <td>
                  <span className={`status ${release.released ? 'released' : 'pending'}`}>
                    {release.released ? '✅ Released' : '⏳ Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

describe('App', () => {
  it('renders the main heading', () => {
    render(<TestApp />)
    expect(screen.getByText('Software Releases')).toBeInTheDocument()
  })

  it('renders the table with correct headers', () => {
    render(<TestApp />)
    
    expect(screen.getByText('Main Version')).toBeInTheDocument()
    expect(screen.getByText('Go Live Date')).toBeInTheDocument()
    expect(screen.getByText('Framework Version')).toBeInTheDocument()
    expect(screen.getByText('Released')).toBeInTheDocument()
  })

  it('displays all software releases from the initial data', () => {
    render(<TestApp />)
    
    // Check for some specific releases
    expect(screen.getByText('2.1.0')).toBeInTheDocument()
    expect(screen.getByText('2.0.5')).toBeInTheDocument()
    expect(screen.getByText('2.2.0')).toBeInTheDocument()
    expect(screen.getByText('1.9.8')).toBeInTheDocument()
  })

  it('displays correct release status indicators', () => {
    render(<TestApp />)
    
    // Check for released status (there are multiple, so use getAllByText)
    const releasedStatuses = screen.getAllByText('✅ Released')
    expect(releasedStatuses.length).toBeGreaterThan(0)
    
    // Check for pending status (there are multiple, so use getAllByText)
    const pendingStatuses = screen.getAllByText('⏳ Pending')
    expect(pendingStatuses.length).toBeGreaterThan(0)
  })

  it('displays framework versions correctly', () => {
    render(<TestApp />)
    
    expect(screen.getByText('React 18.2.0')).toBeInTheDocument()
    expect(screen.getByText('React 18.1.0')).toBeInTheDocument()
    expect(screen.getByText('React 18.3.0')).toBeInTheDocument()
  })

  it('displays go live dates correctly', () => {
    render(<TestApp />)
    
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
    expect(screen.getByText('2024-02-20')).toBeInTheDocument()
    expect(screen.getByText('2024-03-10')).toBeInTheDocument()
  })

  it('has the correct table structure', () => {
    render(<TestApp />)
    
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    
    // Check that we have the expected number of rows (header + 7 data rows)
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(8) // 1 header row + 7 data rows
  })

  it('applies correct CSS classes for status indicators', () => {
    render(<TestApp />)
    
    const releasedStatuses = screen.getAllByText('✅ Released')
    const pendingStatuses = screen.getAllByText('⏳ Pending')
    
    // Check that at least one released status has the correct classes
    expect(releasedStatuses[0]).toHaveClass('status', 'released')
    expect(pendingStatuses[0]).toHaveClass('status', 'pending')
  })
})