// =============================================================================
// VERSIONS TAB COMPONENT
// =============================================================================
// Displays version history for the current spec and provides release functionality.
// Shows version history, release button, and links to Vercel/Confluence.
// =============================================================================

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Alert,
  Link,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material';
import {
  NewReleases,
  History,
  OpenInNew,
  ContentCopy,
  CheckCircle,
  CloudUpload,
  Code,
} from '@mui/icons-material';
import type { SpecVersionEntry, SpecVersionRelease } from '../../specs/versions/types';
import { VERSION_LEVEL_MEANINGS } from '../../specs/versions/types';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface VersionsTabProps {
  specPath: string;
  elementName: string;
}

interface VersionHistoryItemProps {
  release: SpecVersionRelease & { levelLabel: string };
  isLatest: boolean;
}

// -----------------------------------------------------------------------------
// VERSION HISTORY ITEM
// -----------------------------------------------------------------------------

function VersionHistoryItem({ release, isLatest }: VersionHistoryItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCheckout = () => {
    const command = `git checkout ${release.gitTag}`;
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const levelColors: Record<string, 'success' | 'info' | 'default'> = {
    Major: 'success',
    Minor: 'info',
    Patch: 'default',
    Initial: 'success',
  };

  return (
    <ListItem
      sx={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        bgcolor: isLatest ? 'action.hover' : 'transparent',
        borderRadius: 1,
        mb: 1,
        border: 1,
        borderColor: isLatest ? 'primary.light' : 'divider',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          v{release.version}
        </Typography>
        <Chip
          label={release.levelLabel}
          size="small"
          color={levelColors[release.levelLabel] || 'default'}
          sx={{ height: 20, fontSize: 11 }}
        />
        {isLatest && (
          <Chip
            label="Latest"
            size="small"
            color="primary"
            sx={{ height: 20, fontSize: 11 }}
          />
        )}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
        {new Date(release.releasedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Typography>

      {release.releaseNotes && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {release.releaseNotes}
        </Typography>
      )}

      {/* Links */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
        {release.vercelDeployUrl && (
          <Link
            href={release.vercelDeployUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 12 }}
          >
            <CloudUpload sx={{ fontSize: 14 }} />
            Preview
            <OpenInNew sx={{ fontSize: 12 }} />
          </Link>
        )}

        {release.confluenceDocUrl && (
          <Link
            href={release.confluenceDocUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 12 }}
          >
            <OpenInNew sx={{ fontSize: 14 }} />
            Confluence
          </Link>
        )}

        <Tooltip title={copied ? 'Copied!' : `Copy: git checkout ${release.gitTag}`}>
          <IconButton size="small" onClick={handleCopyCheckout} sx={{ p: 0.5 }}>
            {copied ? (
              <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
            ) : (
              <ContentCopy sx={{ fontSize: 14 }} />
            )}
          </IconButton>
        </Tooltip>

        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
          {release.gitTag}
        </Typography>
      </Box>
    </ListItem>
  );
}

// -----------------------------------------------------------------------------
// RELEASE BUTTON SECTION
// -----------------------------------------------------------------------------

interface ReleaseButtonSectionProps {
  specId: string;
  currentVersion: string;
  displayName: string;
}

function ReleaseButtonSection({ specId, currentVersion, displayName }: ReleaseButtonSectionProps) {
  const isUnreleased = currentVersion === '0.0.0';

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <NewReleases color="primary" />
        <Typography variant="subtitle1" fontWeight="medium">
          Release New Version
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        To release a new version, run the following command in Claude Code:
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Version level buttons/commands */}
        {(['major', 'minor', 'patch'] as const).map((level) => (
          <Paper
            key={level}
            variant="outlined"
            sx={{
              p: 1.5,
              bgcolor: 'grey.50',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Code sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" fontFamily="monospace" fontSize={12}>
                  /release-spec {specId} {level}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {VERSION_LEVEL_MEANINGS[level].description}
              </Typography>
            </Box>
            <Tooltip title="Copy command">
              <IconButton
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(`/release-spec ${specId} ${level}`);
                }}
              >
                <ContentCopy sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          </Paper>
        ))}
      </Box>

      {isUnreleased && (
        <Alert severity="info" sx={{ mt: 2 }} icon={<NewReleases />}>
          This spec has never been released. Use <strong>major</strong> to create the first release
          for engineering review.
        </Alert>
      )}
    </Paper>
  );
}

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

export function VersionsTab({ specPath, elementName }: VersionsTabProps) {
  const [specEntry, setSpecEntry] = useState<SpecVersionEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVersionData() {
      setLoading(true);
      setError(null);
      try {
        // Dynamically import to get latest data
        const versionsModule = await import('../../specs/versions/spec-versions.json');
        const registry = versionsModule.default;

        // Find the spec by path
        const spec = registry.specs.find(
          (s: SpecVersionEntry) => s.specPath === specPath
        );

        if (spec) {
          setSpecEntry(spec);
        } else {
          setError(`No version tracking found for spec: ${specPath}`);
        }
      } catch {
        setError('Could not load version data');
      }
      setLoading(false);
    }

    loadVersionData();
  }, [specPath]);

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={80} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={80} sx={{ mb: 1 }} />
      </Box>
    );
  }

  if (error || !specEntry) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        <Typography variant="body2">{error || 'Spec not found in version registry'}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          To enable versioning for this spec, add it to{' '}
          <code>src/specs/versions/spec-versions.json</code>
        </Typography>
      </Alert>
    );
  }

  const hasReleases = specEntry.releases.length > 0;

  // Add level labels to releases
  const releasesWithLabels = specEntry.releases.map((release, index) => {
    const prevVersion = specEntry.releases[index + 1]?.version;
    let levelLabel = 'Initial';

    if (prevVersion) {
      const [oldMajor, oldMinor] = prevVersion.split('.').map(Number);
      const [newMajor, newMinor] = release.version.split('.').map(Number);

      if (newMajor > oldMajor) levelLabel = 'Major';
      else if (newMinor > oldMinor) levelLabel = 'Minor';
      else levelLabel = 'Patch';
    } else {
      // First release - determine by version number
      const [major, minor] = release.version.split('.').map(Number);
      if (major >= 1) levelLabel = 'Major';
      else if (minor >= 1) levelLabel = 'Minor';
      else levelLabel = 'Patch';
    }

    return { ...release, levelLabel };
  });

  return (
    <Box>
      {/* Current Version Badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Current Version:
        </Typography>
        <Chip
          label={specEntry.currentVersion === '0.0.0' ? 'Unreleased' : `v${specEntry.currentVersion}`}
          color={specEntry.currentVersion === '0.0.0' ? 'default' : 'primary'}
          icon={specEntry.currentVersion === '0.0.0' ? undefined : <CheckCircle />}
        />
      </Box>

      {/* Release Section */}
      <ReleaseButtonSection
        specId={specEntry.specId}
        currentVersion={specEntry.currentVersion}
        displayName={specEntry.displayName}
      />

      <Divider sx={{ my: 2 }} />

      {/* Version History */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <History color="action" />
        <Typography variant="subtitle1" fontWeight="medium">
          Version History
        </Typography>
        {hasReleases && (
          <Chip label={specEntry.releases.length} size="small" sx={{ height: 20 }} />
        )}
      </Box>

      {hasReleases ? (
        <List dense disablePadding>
          {releasesWithLabels.map((release, index) => (
            <VersionHistoryItem
              key={release.version}
              release={release}
              isLatest={index === 0}
            />
          ))}
        </List>
      ) : (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <History sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No versions released yet
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Use the release commands above to create your first release
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default VersionsTab;
