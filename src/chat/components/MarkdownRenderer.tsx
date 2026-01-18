// =============================================================================
// MARKDOWN RENDERER COMPONENT
// =============================================================================
// Renders markdown content with proper styling for chat messages.
// Supports GitHub Flavored Markdown including tables, links, and code blocks.
// =============================================================================

import { Box, Link, styled } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface MarkdownRendererProps {
  content: string;
  isUserMessage?: boolean;
}

// -----------------------------------------------------------------------------
// STYLED COMPONENTS
// -----------------------------------------------------------------------------

const MarkdownContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isUserMessage',
})<{ isUserMessage?: boolean }>(({ theme, isUserMessage }) => ({
  // Base typography
  fontSize: theme.typography.body1.fontSize,
  lineHeight: 1.6,
  wordBreak: 'break-word',

  // Headings
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    fontWeight: 600,
    lineHeight: 1.3,
    '&:first-of-type': {
      marginTop: 0,
    },
  },
  '& h1': { fontSize: '1.4em' },
  '& h2': { fontSize: '1.25em' },
  '& h3': { fontSize: '1.1em' },
  '& h4, & h5, & h6': { fontSize: '1em' },

  // Paragraphs
  '& p': {
    margin: 0,
    marginBottom: theme.spacing(1.5),
    '&:last-child': {
      marginBottom: 0,
    },
  },

  // Lists
  '& ul, & ol': {
    margin: 0,
    marginBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(2.5),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  '& li': {
    marginBottom: theme.spacing(0.5),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  '& li > ul, & li > ol': {
    marginTop: theme.spacing(0.5),
    marginBottom: 0,
  },

  // Inline code
  '& code:not(pre code)': {
    backgroundColor: isUserMessage
      ? 'rgba(255, 255, 255, 0.15)'
      : theme.palette.grey[200],
    padding: '2px 6px',
    borderRadius: 4,
    fontFamily: '"Fira Code", "Consolas", monospace',
    fontSize: '0.875em',
    fontWeight: 500,
  },

  // Code blocks
  '& pre': {
    backgroundColor: isUserMessage
      ? 'rgba(0, 0, 0, 0.2)'
      : theme.palette.grey[900],
    color: isUserMessage ? 'inherit' : theme.palette.grey[100],
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    overflow: 'auto',
    marginBottom: theme.spacing(1.5),
    '&:last-child': {
      marginBottom: 0,
    },
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
      fontFamily: '"Fira Code", "Consolas", monospace',
      fontSize: '0.85em',
      lineHeight: 1.5,
    },
  },

  // Links
  '& a': {
    color: isUserMessage
      ? theme.palette.common.white
      : theme.palette.primary.main,
    textDecoration: 'underline',
    textDecorationColor: isUserMessage
      ? 'rgba(255, 255, 255, 0.5)'
      : 'rgba(25, 118, 210, 0.4)',
    '&:hover': {
      textDecorationColor: isUserMessage
        ? 'rgba(255, 255, 255, 0.8)'
        : theme.palette.primary.main,
    },
  },

  // Tables
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: theme.spacing(1.5),
    fontSize: '0.9em',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  '& th, & td': {
    padding: theme.spacing(0.75, 1),
    textAlign: 'left',
    borderBottom: `1px solid ${
      isUserMessage ? 'rgba(255, 255, 255, 0.2)' : theme.palette.divider
    }`,
  },
  '& th': {
    fontWeight: 600,
    backgroundColor: isUserMessage
      ? 'rgba(255, 255, 255, 0.1)'
      : theme.palette.grey[100],
  },
  '& tr:last-child td': {
    borderBottom: 'none',
  },

  // Blockquotes
  '& blockquote': {
    margin: 0,
    marginBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(2),
    borderLeft: `3px solid ${
      isUserMessage ? 'rgba(255, 255, 255, 0.5)' : theme.palette.grey[400]
    }`,
    fontStyle: 'italic',
    opacity: 0.9,
    '&:last-child': {
      marginBottom: 0,
    },
  },

  // Horizontal rule
  '& hr': {
    border: 'none',
    borderTop: `1px solid ${
      isUserMessage ? 'rgba(255, 255, 255, 0.3)' : theme.palette.divider
    }`,
    margin: theme.spacing(2, 0),
  },

  // Strong and emphasis
  '& strong': {
    fontWeight: 600,
  },
  '& em': {
    fontStyle: 'italic',
  },
}));

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function MarkdownRenderer({ content, isUserMessage = false }: MarkdownRendererProps) {
  // Custom components for react-markdown
  const components: Components = {
    // Render links with proper attributes
    a: ({ href, children }) => (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: isUserMessage ? 'inherit' : 'primary.main',
          textDecoration: 'underline',
        }}
      >
        {children}
      </Link>
    ),
  };

  return (
    <MarkdownContainer isUserMessage={isUserMessage}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </MarkdownContainer>
  );
}

export default MarkdownRenderer;
