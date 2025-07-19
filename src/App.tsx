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

interface EditingRelease {
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

  // State for editing functionality
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRelease, setEditingRelease] = useState<EditingRelease | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRelease, setNewRelease] = useState<Omit<SoftwareRelease, 'id'>>({
    mainVersion: "",
    goLiveDate: "",
    frameworkVersion: "",
    released: false,
  });

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

  // CRUD Operations
  const handleCreate = () => {
    if (newRelease.mainVersion && newRelease.goLiveDate && newRelease.frameworkVersion) {
      const id = Date.now().toString();
      const release: SoftwareRelease = { ...newRelease, id };
      setReleases(prev => [release, ...prev]);
      setNewRelease({
        mainVersion: "",
        goLiveDate: "",
        frameworkVersion: "",
        released: false,
      });
      setShowCreateForm(false);
    }
  };

  const handleDelete = (id: string) => {
    setReleases(prev => prev.filter(release => release.id !== id));
  };

  const handleEdit = (release: SoftwareRelease) => {
    setEditingId(release.id);
    setEditingRelease({ ...release });
  };

  const handleSaveEdit = () => {
    if (editingRelease && editingRelease.mainVersion && editingRelease.goLiveDate && editingRelease.frameworkVersion) {
      setReleases(prev => prev.map(release => 
        release.id === editingId ? editingRelease : release
      ));
      setEditingId(null);
      setEditingRelease(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingRelease(null);
  };

  const handleInputChange = (field: keyof EditingRelease, value: string | boolean) => {
    if (editingRelease) {
      setEditingRelease(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleNewReleaseChange = (field: keyof Omit<SoftwareRelease, 'id'>, value: string | boolean) => {
    setNewRelease(prev => ({ ...prev, [field]: value }));
  };

  // Sort releases by goLiveDate in descending order (newest first)
  const sortedReleases = [...releases].sort((a, b) => 
    new Date(b.goLiveDate).getTime() - new Date(a.goLiveDate).getTime()
  );

  return (
    <main>
      <h1>Software Releases</h1>
      
      {/* Create New Release Form */}
      <div className="create-section">
        <button 
          className="create-button"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Add New Release'}
        </button>
        
        {showCreateForm && (
          <div className="create-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="Main Version (e.g., 2.1.0)"
                value={newRelease.mainVersion}
                onChange={(e) => handleNewReleaseChange('mainVersion', e.target.value)}
                className="form-input"
              />
              <input
                type="date"
                value={newRelease.goLiveDate}
                onChange={(e) => handleNewReleaseChange('goLiveDate', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Framework Version (e.g., React 18.2.0)"
                value={newRelease.frameworkVersion}
                onChange={(e) => handleNewReleaseChange('frameworkVersion', e.target.value)}
                className="form-input"
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newRelease.released}
                  onChange={(e) => handleNewReleaseChange('released', e.target.checked)}
                />
                Released
              </label>
              <button onClick={handleCreate} className="save-button">
                Create Release
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="table-container">
        <table className="releases-table">
          <thead>
            <tr>
              <th>Main Version</th>
              <th>Go Live Date</th>
              <th>Framework Version</th>
              <th>Released</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedReleases.map((release) => (
              <tr key={release.id}>
                {editingId === release.id ? (
                  // Edit mode
                  <>
                    <td>
                      <input
                        type="text"
                        value={editingRelease?.mainVersion || ''}
                        onChange={(e) => handleInputChange('mainVersion', e.target.value)}
                        className="edit-input"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={editingRelease?.goLiveDate || ''}
                        onChange={(e) => handleInputChange('goLiveDate', e.target.value)}
                        className="edit-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editingRelease?.frameworkVersion || ''}
                        onChange={(e) => handleInputChange('frameworkVersion', e.target.value)}
                        className="edit-input"
                      />
                    </td>
                    <td>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={editingRelease?.released || false}
                          onChange={(e) => handleInputChange('released', e.target.checked)}
                        />
                        Released
                      </label>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={handleSaveEdit} className="save-button">
                          Save
                        </button>
                        <button onClick={handleCancelEdit} className="cancel-button">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  // View mode
                  <>
                    <td>{release.mainVersion}</td>
                    <td>{release.goLiveDate}</td>
                    <td>{release.frameworkVersion}</td>
                    <td>
                      <span className={`status ${release.released ? 'released' : 'pending'}`}>
                        {release.released ? '✅ Released' : '⏳ Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(release)} className="edit-button">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(release.id)} className="delete-button">
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default App;
