import { useState, useEffect } from "react";
import "./App.css";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

// Amplify is configured in main.tsx

const client = generateClient<Schema>();

interface SoftwareRelease {
  id: string;
  mainVersion: string;
  goLiveDate: string;
  frameworkVersion: string;
  released: boolean;
}

function App() {
  const [releases, setReleases] = useState<SoftwareRelease[]>([
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

  // Optional: Load data from Amplify if available
  useEffect(() => {
    const loadAmplifyData = async () => {
      try {
        const { data: amplifyReleases } = await client.models.SoftwareRelease.list();
        if (amplifyReleases && amplifyReleases.length > 0) {
          setReleases(amplifyReleases.map(release => ({
            id: release.id,
            mainVersion: release.mainVersion ?? '',
            goLiveDate: release.goLiveDate ?? '',
            frameworkVersion: release.frameworkVersion ?? '',
            released: release.released ?? false,
          })));
        }
      } catch (error) {
        console.log("Using static demo data - Amplify data not available");
      }
    };

    loadAmplifyData();
  }, []);

  // Sort releases by goLiveDate in descending order (newest first)
  const sortedReleases = [...releases].sort((a, b) => 
    new Date(b.goLiveDate).getTime() - new Date(a.goLiveDate).getTime()
  );

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
            {sortedReleases.map((release) => (
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
