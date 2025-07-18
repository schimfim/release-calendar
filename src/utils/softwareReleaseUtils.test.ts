import { describe, it, expect } from 'vitest'
import {
  SoftwareRelease,
  filterReleasedReleases,
  filterPendingReleases,
  sortReleasesByDate,
  sortReleasesByVersion,
  getReleasesByFramework,
  getUpcomingReleases,
} from './softwareReleaseUtils'

const mockReleases: SoftwareRelease[] = [
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
    goLiveDate: "2026-04-15",
    frameworkVersion: "React 19.0.0",
    released: false,
  },
]

describe('Software Release Utils', () => {
  describe('filterReleasedReleases', () => {
    it('should filter only released releases', () => {
      const result = filterReleasedReleases(mockReleases)
      expect(result).toHaveLength(3)
      expect(result.every(release => release.released)).toBe(true)
    })

    it('should return empty array when no releases are released', () => {
      const unreleasedReleases = mockReleases.map(r => ({ ...r, released: false }))
      const result = filterReleasedReleases(unreleasedReleases)
      expect(result).toHaveLength(0)
    })
  })

  describe('filterPendingReleases', () => {
    it('should filter only pending releases', () => {
      const result = filterPendingReleases(mockReleases)
      expect(result).toHaveLength(2)
      expect(result.every(release => !release.released)).toBe(true)
    })

    it('should return empty array when all releases are released', () => {
      const allReleased = mockReleases.map(r => ({ ...r, released: true }))
      const result = filterPendingReleases(allReleased)
      expect(result).toHaveLength(0)
    })
  })

  describe('sortReleasesByDate', () => {
    it('should sort releases by date in ascending order', () => {
      const result = sortReleasesByDate(mockReleases)
      expect(result[0].goLiveDate).toBe('2023-12-05')
      expect(result[1].goLiveDate).toBe('2024-01-15')
      expect(result[2].goLiveDate).toBe('2024-02-20')
      expect(result[3].goLiveDate).toBe('2024-03-10')
      expect(result[4].goLiveDate).toBe('2026-04-15')
    })

    it('should not mutate the original array', () => {
      const original = [...mockReleases]
      sortReleasesByDate(mockReleases)
      expect(mockReleases).toEqual(original)
    })
  })

  describe('sortReleasesByVersion', () => {
    it('should sort releases by version in descending order', () => {
      const result = sortReleasesByVersion(mockReleases)
      expect(result[0].mainVersion).toBe('2.3.0')
      expect(result[1].mainVersion).toBe('2.2.0')
      expect(result[2].mainVersion).toBe('2.1.0')
      expect(result[3].mainVersion).toBe('2.0.5')
      expect(result[4].mainVersion).toBe('1.9.8')
    })

    it('should handle version numbers with different segment counts', () => {
      const releasesWithDifferentVersions = [
        { ...mockReleases[0], mainVersion: '2.1.0' },
        { ...mockReleases[1], mainVersion: '2.1.0.1' },
        { ...mockReleases[2], mainVersion: '2.1' },
      ]
      const result = sortReleasesByVersion(releasesWithDifferentVersions)
      expect(result[0].mainVersion).toBe('2.1.0.1')
      expect(result[1].mainVersion).toBe('2.1.0')
      expect(result[2].mainVersion).toBe('2.1')
    })

    it('should not mutate the original array', () => {
      const original = [...mockReleases]
      sortReleasesByVersion(mockReleases)
      expect(mockReleases).toEqual(original)
    })
  })

  describe('getReleasesByFramework', () => {
    it('should filter releases by framework name (case insensitive)', () => {
      const result = getReleasesByFramework(mockReleases, 'react')
      expect(result).toHaveLength(5)
      expect(result.every(release => 
        release.frameworkVersion.toLowerCase().includes('react')
      )).toBe(true)
    })

    it('should filter releases by specific framework version', () => {
      const result = getReleasesByFramework(mockReleases, 'React 18')
      expect(result).toHaveLength(3)
      expect(result.every(release => 
        release.frameworkVersion.includes('React 18')
      )).toBe(true)
    })

    it('should return empty array when no matches found', () => {
      const result = getReleasesByFramework(mockReleases, 'Vue')
      expect(result).toHaveLength(0)
    })
  })

  describe('getUpcomingReleases', () => {
    it('should filter releases that are in the future and not released', () => {
      const result = getUpcomingReleases(mockReleases)
      expect(result).toHaveLength(1)
      expect(result[0].mainVersion).toBe('2.3.0')
      expect(result[0].released).toBe(false)
    })

    it('should not include past releases even if not released', () => {
      const pastUnreleased = [
        { ...mockReleases[0], goLiveDate: '2020-01-01', released: false }
      ]
      const result = getUpcomingReleases(pastUnreleased)
      expect(result).toHaveLength(0)
    })

    it('should not include released releases even if in the future', () => {
      const futureReleased = [
        { ...mockReleases[0], goLiveDate: '2025-01-01', released: true }
      ]
      const result = getUpcomingReleases(futureReleased)
      expect(result).toHaveLength(0)
    })
  })
})