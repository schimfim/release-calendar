export interface SoftwareRelease {
  id: string;
  mainVersion: string;
  goLiveDate: string;
  frameworkVersion: string;
  released: boolean;
}

export const filterReleasedReleases = (releases: SoftwareRelease[]): SoftwareRelease[] => {
  return releases.filter(release => release.released);
}

export const filterPendingReleases = (releases: SoftwareRelease[]): SoftwareRelease[] => {
  return releases.filter(release => !release.released);
}

export const sortReleasesByDate = (releases: SoftwareRelease[]): SoftwareRelease[] => {
  return [...releases].sort((a, b) => new Date(a.goLiveDate).getTime() - new Date(b.goLiveDate).getTime());
}

export const sortReleasesByVersion = (releases: SoftwareRelease[]): SoftwareRelease[] => {
  return [...releases].sort((a, b) => {
    const versionA = a.mainVersion.split('.').map(Number);
    const versionB = b.mainVersion.split('.').map(Number);
    
    for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
      const numA = versionA[i] || 0;
      const numB = versionB[i] || 0;
      if (numA !== numB) {
        return numB - numA; // Descending order (newest first)
      }
    }
    return 0;
  });
}

export const getReleasesByFramework = (releases: SoftwareRelease[], framework: string): SoftwareRelease[] => {
  return releases.filter(release => 
    release.frameworkVersion.toLowerCase().includes(framework.toLowerCase())
  );
}

export const getUpcomingReleases = (releases: SoftwareRelease[]): SoftwareRelease[] => {
  const today = new Date();
  return releases.filter(release => {
    const releaseDate = new Date(release.goLiveDate);
    return releaseDate > today && !release.released;
  });
}