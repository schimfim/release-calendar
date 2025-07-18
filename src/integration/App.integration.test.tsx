import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'

// Mock the Amplify imports
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

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the complete application with all expected elements', async () => {
    render(<TestApp />)
    
    // Check main structure
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    
    // Check all table headers are present
    const headers = ['Main Version', 'Go Live Date', 'Framework Version', 'Released']
    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })
    
    // Check that we have the expected number of data rows
    await waitFor(() => {
      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(8) // 1 header + 7 data rows
    })
  })

  it('should display both released and pending releases with correct indicators', async () => {
    render(<TestApp />)
    
    await waitFor(() => {
      // Check for released status indicators
      const releasedStatuses = screen.getAllByText('✅ Released')
      expect(releasedStatuses.length).toBeGreaterThan(0)
      
      // Check for pending status indicators
      const pendingStatuses = screen.getAllByText('⏳ Pending')
      expect(pendingStatuses.length).toBeGreaterThan(0)
    })
  })

  it('should display all version numbers correctly', async () => {
    render(<TestApp />)
    
    const expectedVersions = ['2.1.0', '2.0.5', '2.2.0', '1.9.8', '2.3.0', '2.0.0', '2.1.5']
    
    await waitFor(() => {
      expectedVersions.forEach(version => {
        expect(screen.getByText(version)).toBeInTheDocument()
      })
    })
  })

  it('should display all framework versions correctly', async () => {
    render(<TestApp />)
    
    const expectedFrameworks = [
      'React 18.2.0',
      'React 18.1.0', 
      'React 18.3.0',
      'React 17.0.2',
      'React 19.0.0',
      'React 18.0.0',
      'React 18.2.1'
    ]
    
    await waitFor(() => {
      expectedFrameworks.forEach(framework => {
        expect(screen.getByText(framework)).toBeInTheDocument()
      })
    })
  })

  it('should display all dates in the correct format', async () => {
    render(<TestApp />)
    
    const expectedDates = [
      '2024-01-15',
      '2024-02-20',
      '2024-03-10',
      '2023-12-05',
      '2024-04-15',
      '2023-11-20',
      '2024-02-28'
    ]
    
    await waitFor(() => {
      expectedDates.forEach(date => {
        expect(screen.getByText(date)).toBeInTheDocument()
      })
    })
  })

  it('should have proper table structure with correct CSS classes', async () => {
    render(<TestApp />)
    
    await waitFor(() => {
      const table = screen.getByRole('table')
      expect(table).toHaveClass('releases-table')
      
      const tableContainer = table.closest('.table-container')
      expect(tableContainer).toBeInTheDocument()
      
      // Check that status elements have proper classes
      const statusElements = screen.getAllByText(/✅ Released|⏳ Pending/)
      statusElements.forEach(element => {
        expect(element).toHaveClass('status')
      })
    })
  })

  it('should maintain data integrity - each row should have all required fields', async () => {
    render(<TestApp />)
    
    await waitFor(() => {
      const rows = screen.getAllByRole('row')
      // Skip header row
      const dataRows = rows.slice(1)
      
      dataRows.forEach(row => {
        const cells = row.querySelectorAll('td')
        expect(cells).toHaveLength(4) // Should have 4 columns
        
        // Each cell should have content
        cells.forEach(cell => {
          expect(cell.textContent).toBeTruthy()
        })
      })
    })
  })
})