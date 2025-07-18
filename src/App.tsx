import { useState } from "react";
import "./App.css";

interface SoftwareRelease {
  id: string;
  mainVersion: string;
  goLiveDate: string;
  frameworkVersion: string;
  released: boolean;
}

function App() {
  const [releases] = useState<SoftwareRelease[]>([
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
  ]);

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
  );
}

export default App;
